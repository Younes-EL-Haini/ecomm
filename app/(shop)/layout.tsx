import { ChatWidget } from "@/components/chat/chat-widget";
import Footer from "@/components/layout/Footer";
import NavBar from "@/components/NavBar/NavBar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavBar />
      <main className="grow pb-2">{children}</main>
      <ChatWidget currentModelId="llama-3.3" />
      <Footer />
    </div>
  );
}
