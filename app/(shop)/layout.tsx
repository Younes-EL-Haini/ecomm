import { ChatWidget } from "@/components/chat/chat-widget";
import Footer from "@/components/layout/Footer";
import NavBar from "@/components/NavBar/NavBar";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/lib/prisma";
import { DBHistoricalMessage } from "@/lib/chat";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch the secure session from NextAuth on the server side
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  let savedMessages: DBHistoricalMessage[] = [];

  if (userId) {
    // 2. Look up the user's absolute latest active chat session thread
    const lastChat = await prisma.chat.findFirst({
      where: { userId: userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 20,
        },
      },
    });

    // 3. Map database rows to the clean interface format expected by ChatWidget
    if (lastChat && lastChat.messages.length > 0) {
      savedMessages = lastChat.messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
      }));
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavBar />
      <main className="grow pb-2">{children}</main>

      {/* 🌟 Hydrated Chat Widget */}
      <ChatWidget initialMessages={savedMessages} currentModelId="llama-3.3" />

      <Footer />
    </div>
  );
}
