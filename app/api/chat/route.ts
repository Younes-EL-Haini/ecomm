import { groq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages, tool, stepCountIs } from "ai";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { getUserContext, searchProducts } from "@/lib/chat";
import { z } from "zod";
import { revalidatePath } from "next/cache";

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
Recent Orders:
${userContext.recentOrdersSummary}

Rules:
1. Address the customer by name when natural.
2. For ANY product question including "do you have X", ALWAYS call recommendProducts first. Never answer product questions from memory or order history.
3. Never invent products, prices, stock levels, or links.
4. Use only information returned by tools.
5. For order status questions, use the Recent Orders data provided above.
6. Link products as [Product Name](/products/slug).
7. Keep answers short, helpful, and friendly.
8. When presenting cart contents, always list each item with its name, quantity, size, color, and price. Never just say "X items in your cart".

Cart Operations Guardrails:
1. To add an item, call addProductToCart with the product name and quantity. That's it — one step.
2. To remove an item, call removeFromCart with the product name.
3. Fetch the data using the getCart tool when the user asks about cart contents or after any cart modification.
`.trim();

    // Extract user prompt text for DB logging
    const lastMessage = messages[messages.length - 1];
    const userText = lastMessage.parts
    ?.filter((part: { type: string; text?: string }) => part.type === "text")
    .map((part: { text?: string }) => part.text || "")
    .join("") || lastMessage.content || "";

    const groqModelMapping: Record<string, string> = {
      "llama-3.3": "openai/gpt-oss-120b",
      "mixtral": "mixtral-8x7b-32768",
      "gemma2": "gemma2-9b-it",
    };
    const selectedGroqModel = groqModelMapping[modelId] || "openai/gpt-oss-120b";

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

    const recentMessages = messages
      .slice(-6)
      .filter((m: any) => m.role === "user" || m.role === "assistant");

    // 3. 🌟 EXECUTE STREAM WITH CUSTOM INJECTED SYSTEM CONTEXT
    const result = streamText({
      model: groq(selectedGroqModel),
      system: systemPrompt,
      messages: await convertToModelMessages(recentMessages),
      
      stopWhen: stepCountIs(5), // Increased to allow multi-step tool lookups

      tools: {
        // --- 1. Existing Search / Recommendation Tool ---
        recommendProducts: tool({
          description: "MUST be called for ANY product availability question. Searches store inventory by keyword. Only pass query — do NOT add categorySlug or maxPrice unless the user explicitly mentioned them.",
          inputSchema: z.object({
            query: z.string().optional().nullable().describe("Search keyword e.g. 'chinos' or 'jacket'"),
            maxPrice: z.number().optional().nullable().describe("Maximum price as a number e.g. 50"),
          }),
          execute: async ({ query, maxPrice }) => {
            try {
            // This function runs automatically on your server when Llama decides it needs inventory context
            return await searchProducts({
              query: query ?? undefined,
              maxPrice: maxPrice ?? undefined,
            });
            } catch (error) {
              return {
                success: false,
                message: "Failed to get this product"
              }
            }
          },
        }),

        // --- 2. Tool: Details Products ---
        getProductDetails: tool({
          description: "Fetches full details about a specific product by name. Use when the user asks for more information about a product — sizes, colors, stock, description, images.",
          inputSchema: z.object({
            productName: z.string().describe("Product name e.g. 'Fisherman Beanie'"),
          }),
          execute: async ({ productName }) => {
            try {
            const product = await prisma.product.findFirst({
              where: {
                isPublished: true,
                isArchived: false,
                title: { contains: productName, mode: "insensitive" }
              },
              include: {
                images: { select: { url: true, color: true, isMain:true } },
                variants: { select: { id: true, size: true, color: true, stock: true, priceDelta: true}}
              }
            })

            if (!product) return { found: false, message: `${productName} was not found.` };

            const sizes = Array.from(new Set(product.variants.map(v => v.size).filter(Boolean)));
            const colors = Array.from(new Set(product.variants.map(v => v.color).filter(Boolean)));
            const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)

            return {
              found: true, 
              title: product.title,
              description: product.description,
              link: `/products/${product.slug}`,
              startingPrice: `$${product.price}`,
              availableSizes: sizes,
              availableColors: colors,
              stockStatus: totalStock > 0 ? "In Stock" : "Out of Stock",
              variants: product.variants.map(v => ({
                size: v.size,
                color: v.color,
                stock: v.stock,
                priceAdjustment: v.priceDelta ? `+$${v.priceDelta}` : "none",
              }))
            }
            } catch (error) {
              return {
                success: false,
                message: "Sorry i couldn't get the informations You wanted"
              }
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
                slug: p.slug,
                link: `/products/${p.slug}`,
                description: p.description.substring(0, 60) + "..."
              }));
            } catch (err) {
              return {
                success: false,
                message: "Sorry i can't get this related product"
              }
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
              return {
                success: false,
                message: "Failed to get campared product"
              }
            }
          }
        }),

        getCart: tool({
          description: "Fetches the customer's current live cart. Call this whenever the user asks about their cart. Always present the full item list from the result, never summarize.",
          inputSchema: z.object({ _: z.string().optional() }),
          execute: async () => {
            try {
            const cartItems = await prisma.cartItem.findMany({
              where: { userId },
              include: {
                product: { select: { title: true, price: true, slug: true } },
                variant: { select: { size: true, color: true } },
              },
            });
        
    if (cartItems.length === 0) {
      return { empty: true, items: [], summary: "Cart is empty." };
    }

    return {
      empty: false,
      items: cartItems.map(item => ({
        title: item.product.title,
        qty: item.quantity,
        price: `$${item.product.price}`,
        size: item.variant?.size || "N/A",
        color: item.variant?.color || "N/A",
      })),
      summary: `${cartItems.length} item(s) in cart.`,
    };
    } catch (error) {
      return {
        success: false,
        message: "Sorry, I couldn't retrieve your cart right now."
      }
    }
  }
}),
addProductToCart: tool({
  description: "Finds a product by name and adds it to the cart. Use this whenever the user wants to add a product.",
  inputSchema: z.object({
    productName: z.string().describe("Product name e.g. 'Merino Crewneck'"),
    quantity: z.number().optional().default(1),
    size: z.string().optional().describe("Size variant e.g. 'M', 'L', '32'"),
    color: z.string().optional().describe("Color variant e.g. 'Indigo', 'Charcoal'"),
  }),
  execute: async ({ productName, quantity, size, color }) => {
    try {
  const product = await prisma.product.findFirst({
    where: {
      isPublished: true,
      isArchived: false,
      title: { contains: productName, mode: "insensitive" },
    },
    include: {
      variants: { select: { id: true, size: true, color: true, stock: true } }
    }
  });

  if (!product) return { success: false, message: `${productName} was not found in our store.` };

  // Ask for variant selection if multiple exist and none specified
  if (product.variants.length > 1 && !size && !color) {
  const options = product.variants
    .map(v => `${v.size} / ${v.color}`)
    .join(", ");
  
  return {
    success: false,
    needsVariantSelection: true,
    message: `${product.title} comes in multiple options: ${options}. Which would you like?`,
  };
}

  const variant = product.variants.find(v => {
    const sizeMatch = size ? v.size?.toLowerCase() === size.toLowerCase() : true;
    const colorMatch = color ? v.color?.toLowerCase() === color.toLowerCase() : true;
    return sizeMatch && colorMatch && v.stock >= quantity;
  }) ?? product.variants.find(v => v.stock >= quantity);

  if (!variant) return { success: false, message: `${productName} is out of stock in the requested variant.` };

  const existingCartItem = await prisma.cartItem.findFirst({
    where: { userId, productId: product.id, variantId: variant.id }
  });

  if (existingCartItem) {
    await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + quantity }
    });
  } else {
    await prisma.cartItem.create({
      data: { userId, productId: product.id, variantId: variant.id, quantity }
    });
  }

  revalidatePath("/cart");
  revalidatePath("/");

  return {
    success: true,
    message: `${product.title} has been added to your cart.`,
    addedItem: {
      title: product.title,
      size: variant.size,
      color: variant.color,
      quantity,
      price: `$${product.price}`,
    }
  };
  } catch (error) {
    return {
      success: false,
      message: "Sorry couldn't add the product"
    }
  }
}
}),

        // 🌟 ADDED: REMOVE FROM CART TOOL
        removeFromCart: tool({
          description: "Removes one product from the authenticated user's cart by product name. Use when the user asks to remove, delete, or take an item out of their cart.",
          inputSchema: z.object({
            productName: z.string().describe("The exact product name to remove e.g. 'Fisherman Beanie'"),
          }),
          execute: async ({ productName }) => {
            try {
            const cartItem = await prisma.cartItem.findFirst({
              where: {
                userId,
                product: {
                  title: { contains: productName, mode: "insensitive" }
                }
              },
              include: { product: true }
            })
            if (!cartItem) {
              return { success: false, message: `${productName} was not found in your cart.` };
            }

            await prisma.cartItem.delete({ where: { id: cartItem.id  } });

            revalidatePath("/cart");
            revalidatePath("/");

            return { success: true, message: `${cartItem.product.title} has been removed from your cart.` };
            } catch (error) {
              return {
                success: false,
                message: "Sorry couldn't remove the cart"
              }
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