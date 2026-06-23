import { groq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages, tool, stepCountIs } from "ai";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { getUserContext, searchProducts, SearchProductsArgs } from "@/lib/chat";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json();
    const { messages, id, modelId } = body;

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array is required." }), { status: 400 });
    }

    // 1. 🌟 FETCH PERSONALIZATION BLEND FROM POSTGRESQL
    const userContext = await getUserContext(userId);

    // Updated rule 2 to enforce calling the more specific discovery tools when appropriate
    const systemPrompt = `
You are a shopping assistant for our store.
Customer Name: ${userContext.customerName}
Current Cart:
${userContext.cartSummary}
Recent Orders:
${userContext.recentOrdersSummary}

Rules:
1. Address the customer by name when natural.
2. For general searches, availability, or pricing queries, use recommendProducts. For deep-dives into a specific item, use getProductDetails. For cross-sells, use getRelatedProducts. To contrast items, use compareProducts.
3. Never invent products, prices, stock levels, or links.
4. Use only information returned by tools.
5. For order status questions, use the Recent Orders data provided above.
6. Link products as [Product Name](/products/slug).
7. Keep answers short, helpful, and friendly.
`.trim();

    // Extract user prompt text for DB logging
    const lastMessage = messages[messages.length - 1];
    const userText = lastMessage.parts
    ?.filter((part: { type: string; text?: string }) => part.type === "text")
    .map((part: { text?: string }) => part.text || "")
    .join("") || lastMessage.content || "";

    const groqModelMapping: Record<string, string> = {
      "llama-3.3": "llama-3.3-70b-versatile",
      "mixtral": "mixtral-8x7b-32768",
      "gemma2": "gemma2-9b-it",
    };
    const selectedGroqModel = groqModelMapping[modelId] || "llama-3.3-70b-versatile";

    // DB Operations (Upsert thread session)
    if (id && userText) {
      const title = userText.length > 30 ? `${userText.substring(0, 30)}...` : userText;
      await prisma.chat.upsert({
        where: { id: id },
        update: {},
        create: { id: id, userId: userId, title: title },
      });
      await prisma.message.create({
        data: { content: userText, role: "user", chatId: id },
      });
    }

    // 3. 🌟 EXECUTE STREAM WITH CUSTOM INJECTED SYSTEM CONTEXT
    const result = streamText({
      model: groq(selectedGroqModel),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      
      stopWhen: stepCountIs(5), // Increased to allow multi-step tool lookups

      tools: {
        // --- 1. Existing Search / Recommendation Tool ---
        recommendProducts: tool({
          description: "Searches our active store inventory product database catalog by keywords, category constraints, or maximum target price thresholds.",
          inputSchema: z.object({
            query: z.string().optional().transform(v => v?.trim() || undefined),
            categorySlug: z.string().optional().transform(v => v?.trim() || undefined),
            maxPrice: z.union([z.string(), z.number()]).optional().transform(v => {
              if (v === "" || v === null || v === undefined) return undefined;
              const n = Number(v);
              return isNaN(n) ? undefined : n;
            }),
          }),
          execute: async ({ query, categorySlug, maxPrice }: SearchProductsArgs) => {
            // This function runs automatically on your server when Llama decides it needs inventory context
            return await searchProducts({ query, categorySlug, maxPrice });
          },
        }),

        // --- 2. Tool: Detailed View ---
        getProductDetails: tool({
          description: "Fetches full information about a specific single product using its unique text slug, including descriptions, sizing, colors, variant stock, and images.",
          inputSchema: z.object({
            slug: z.string().describe("The unique relative URL slug of the product, e.g., 'relaxed-chinos'"),
          }),
          execute: async ({ slug }) => {
            try {
              const product = await prisma.product.findUnique({
                where: { slug, isPublished: true, isArchived: false },
                include: {
                  images: { select: { url: true, color: true, isMain: true } },
                  variants: { select: { size: true, color: true, stock: true, priceDelta: true } }
                }
              });

              if (!product) return { found: false, message: "Product not found." };

              // Filter out sizes and colors cleanly from variants
              const sizes = Array.from(new Set(product.variants.map(v => v.size).filter(Boolean)));
              const colors = Array.from(new Set(product.variants.map(v => v.color).filter(Boolean)));
              const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

              return {
                found: true,
                title: product.title,
                basePrice: `$${product.price}`,
                description: product.description,
                link: `/products/${product.slug}`,
                availableSizes: sizes,
                availableColors: colors,
                totalStock,
                stockStatus: totalStock > 0 ? "In Stock" : "Out of Stock",
                images: product.images,
                variantsBreakdown: product.variants.map(v => ({
                  size: v.size,
                  color: v.color,
                  stock: v.stock,
                  priceAdjustment: v.priceDelta ? `$${v.priceDelta}` : "None"
                }))
              };
            } catch (err) {
              console.error("getProductDetails failed:", err);
              return { error: "Failed to load product details." };
            }
          }
        }),

        // --- 3. Tool: Related Products ---
        getRelatedProducts: tool({
          description: "Suggests alternative or complementary cross-sell products from the same category to go well with the specified product.",
          inputSchema: z.object({
            slug: z.string().describe("The slug of the target product to match relationships against."),
          }),
          execute: async ({ slug }) => {
            try {
              const baseProduct = await prisma.product.findUnique({
                where: { slug },
                select: { id: true, categoryId: true }
              });

              if (!baseProduct) return { error: "Target product context not found." };

              const related = await prisma.product.findMany({
                where: {
                  categoryId: baseProduct.categoryId,
                  isPublished: true,
                  isArchived: false,
                  NOT: { id: baseProduct.id }
                },
                take: 3,
                select: { title: true, price: true, slug: true, description: true }
              });

              return related.map(p => ({
                name: p.title,
                price: `$${p.price}`,
                link: `/products/${p.slug}`,
                description: p.description.substring(0, 60) + "..."
              }));
            } catch (err) {
              console.error("getRelatedProducts failed:", err);
              return { error: "Failed to gather related inventory." };
            }
          }
        }),

        // --- 4. Tool: Compare Products ---
        compareProducts: tool({
          description: "Retrieves technical data points for two different products simultaneously to output a distinct side-by-side comparison matrix.",
          inputSchema: z.object({
            slugA: z.string().describe("Slug of the first product."),
            slugB: z.string().describe("Slug of the second product."),
          }),
          execute: async ({ slugA, slugB }) => {
            try {
              const products = await prisma.product.findMany({
                where: {
                  slug: { in: [slugA, slugB] },
                  isPublished: true,
                  isArchived: false
                },
                include: {
                  variants: { select: { size: true, color: true, stock: true } }
                }
              });

              if (products.length < 2) {
                return { error: "Could not find both requested products to compile comparison." };
              }

              return products.map(p => ({
                title: p.title,
                price: `$${p.price}`,
                link: `/products/${p.slug}`,
                description: p.description.substring(0, 100) + "...",
                sizes: Array.from(new Set(p.variants.map(v => v.size).filter(Boolean))),
                colors: Array.from(new Set(p.variants.map(v => v.color).filter(Boolean))),
                totalStock: p.variants.reduce((sum, v) => sum + v.stock, 0)
              }));
            } catch (err) {
              console.error("compareProducts failed:", err);
              return { error: "Failed side-by-side processing lookup." };
            }
          }
        })
      },
      
      async onFinish(event) {
        if (id && event.text) {
          await prisma.message.create({
            data: { content: event.text, role: "assistant", chatId: id },
          });
        }
      },
    });

    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}