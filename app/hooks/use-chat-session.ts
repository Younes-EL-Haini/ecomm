"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { toast } from "sonner";
import { 
  UseChatSessionProps, 
  UseChatSessionReturn, 
  UIMessage 
} from "@/lib/chat";
import { useCartStore } from "@/cartStore";
import { useRouter, usePathname } from "next/navigation";

export function useChatSession({
  initialMessages,
  modelId,
}: UseChatSessionProps): UseChatSessionReturn {
  const router = useRouter();
  const pathname = usePathname();
  const [input, setInput] = useState<string>("");
  const setCount = useCartStore((state) => state.setCount);

  // Cast standard hook payload directly to our clean UIMessage signature array
  const { messages, sendMessage, status, stop } = useChat({
    messages: initialMessages.map((message) => ({
      id: message.id,
      role: message.role as "user" | "assistant",
      parts: [{ type: "text", text: message.content }],
    })),

    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        modelId,
      },
    }),
    
    onError: (error: Error) => {
      try {
        const errorData = JSON.parse(error.message);
        if (error.message.includes("429") || errorData.error === "Rate limit exceeded") {
          toast.error("Too many requests! Please wait a minute.");
          return;
        }
        if (errorData.error === "Unauthorized"){
          toast.error("Please log in to chat with our assistant.");
          return
        }
      } catch (e) {
        if (error.message.includes("429")) {
          toast.error("Rate limit reached. Try again soon.");
          return;
        }
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  // Watch for cart mutations in assistant messages
  const processedMessageIds = useRef<Set<string>>(new Set());

  useEffect(() => {
  if (status !== "ready") return; // ← only run when streaming is complete

  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.role !== "assistant") return;
  if (processedMessageIds.current.has(lastMessage.id)) return;

  const text = lastMessage.parts
    ?.filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("")
    .toLowerCase() ?? "";

  const cartUpdated = lastMessage.parts.some((part: any) => {
    return (
      (part.type === "tool-addProductToCart" || 
        part.type === "tool-removeFromCart") &&
        part.state === "output-available" &&
        part.output?.success === true
      )
  });

  if (cartUpdated) {
    processedMessageIds.current.add(lastMessage.id);
    fetch("/api/cart/count")
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => toast.error("Cart badge didn't Updated!"))
    toast.success(
      text.includes("removed") ? "Item removed from cart." : "Cart updated!"
    );
    if (pathname === "/cart") {
      router.refresh();
    }
  }
}, [messages, status]); // ← add status here


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    setInput("");

    try {
      await sendMessage({ text: currentInput });
    } catch (err) {
      toast.error("Could not coordinate shopping conversation.");
    }
  }

  return {
    input,
    setInput,
    messages: messages as UIMessage[], // Strong type matching for UI consumer cycles
    status,
    stop,
    handleSubmit,
  };
}