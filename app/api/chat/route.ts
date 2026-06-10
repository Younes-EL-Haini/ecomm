import { groq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages } from "ai";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { getUserContext } from "@/lib/chat/get-user-context"; // 🌟 Import engine

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
You are an expert AI Shopping Assistant on our premium e-commerce brand store. 
Your objective is to provide elite, personalized support based on live data retrieved from our database.

CURRENT CUSTOMER PROFILE:
- Name: ${userContext.customerName}
- User ID: ${userId}

LIVE CART ITEMS (What they currently intend to purchase):
${userContext.cartSummary}

RECENT ORDERS HISTORY (To assist with order status checks or tracking inquiries):
${userContext.recentOrdersSummary}

BEHAVIORAL INSTRUCTIONS:
1. Always address the customer by their name (${userContext.customerName}) naturally if appropriate, welcoming them back.
2. If their cart has items, you can subtly suggest related products or offer to help them checkout.
3. If they ask "Where is my package?" or "Check my order", cross-reference the RECENT ORDERS list above and report the order's exact status (e.g. PAID, SHIPPED, DELIVERED) immediately. Do not invent details.
4. Keep answers brief, conversion-focused, polite, and helpful.
`;

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