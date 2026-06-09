import { groq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages } from "ai";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";  // Make sure this path matches your AuthJS/NextAuth config
import authOptions from "@/app/auth/authOptions";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json();
    // 🌟 Capture 'id' which is the stable native session identifier sent by useChat
    const { messages, id, modelId } = body;

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array is required." }), { status: 400 });
    }

    // Extract user prompt text
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

    // 🌟 DYNAMIC UPSERT: Create the chat entry if it's the first message, otherwise skip.
    if (id && userText) {
      const title = userText.length > 30 ? `${userText.substring(0, 30)}...` : userText;

      await prisma.chat.upsert({
        where: { id: id },
        update: {}, // If it already exists, do nothing here
        create: {
          id: id, // Bind the chat record directly to the SDK session ID
          userId: userId,
          title: title,
        },
      });

      // Log the User's query message into PostgreSQL
      await prisma.message.create({
        data: {
          content: userText,
          role: "user",
          chatId: id,
        },
      });
    }

    // Initialize text streaming
    const result = streamText({
      model: groq(selectedGroqModel),
      messages: await convertToModelMessages(messages),
      
      // Save the complete model reply down to the thread when finished
      async onFinish(event) {
        if (id && event.text) {
          await prisma.message.create({
            data: {
              content: event.text,
              role: "assistant",
              chatId: id,
            },
          });
        }
      },
    });

    // 🌟 Changed to use your working UI Message format stream wrapper
    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}