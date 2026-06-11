import { groq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages, tool, stepCountIs } from "ai";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { getUserContext, searchProducts, SearchProductsArgs } from "@/lib/chat"; // 🌟 Import engine
import { z } from "zod"

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

    // 2. 🌟 BUILD COMPREHENSIVE DYNAMIC SYSTEM PROMPT BUILDER
const systemPrompt = `
You are a shopping assistant for our store.
Customer Name: ${userContext.customerName}
Current Cart:
${userContext.cartSummary}
Recent Orders:
${userContext.recentOrdersSummary}

Rules:
1. Address the customer by name when natural.
2. For ANY question about products, recommendations, inventory, availability, stock, or pricing you MUST call recommendProducts.
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
      system: systemPrompt, // 🌟 Hand context straight into Llama's foundational context
      messages: await convertToModelMessages(messages),
      
      stopWhen: stepCountIs(3),

      tools: {
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
            console.log("TOOL CALLED WITH:", { query, categorySlug, maxPrice });
            return await searchProducts({ query, categorySlug, maxPrice });
          },
        }),
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