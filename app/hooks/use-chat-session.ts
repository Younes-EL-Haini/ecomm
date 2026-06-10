"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { toast } from "sonner";
import { 
  UseChatSessionProps, 
  UseChatSessionReturn, 
  UIMessage 
} from "@/lib/chat";

export function useChatSession({
  initialMessages,
  modelId,
}: UseChatSessionProps): UseChatSessionReturn {
  const [input, setInput] = useState<string>("");

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
      } catch (e) {
        if (error.message.includes("429")) {
          toast.error("Rate limit reached. Try again soon.");
          return;
        }
      }
      toast.error("An unexpected error occurred.");
    },
  });

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