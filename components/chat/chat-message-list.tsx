"use client";

import { Loader2 } from "lucide-react";
import { ChatMessageListProps, MessagePart } from "@/lib/chat";

export function ChatMessageList({ messages, status }: ChatMessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
        <p className="text-sm">
          👋 Ask me about our latest products, tracking an order, or special
          deals!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50">
      {messages.map((msg, index) => (
        <div
          key={msg.id || index}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] rounded-xl p-3 text-sm whitespace-pre-wrap wrap-break-word ${
              msg.role === "user"
                ? "bg-zinc-900 text-white rounded-br-none shadow-sm"
                : "bg-white border border-zinc-200 text-zinc-800 rounded-bl-none shadow-sm"
            }`}
          >
            {msg.parts && msg.parts.length > 0 ? (
              msg.parts.map(
                (part: MessagePart, i: number) =>
                  part.type === "text" && <span key={i}>{part.text}</span>,
              )
            ) : (
              <span>{msg.content || ""}</span>
            )}

            {status === "streaming" &&
              index === messages.length - 1 &&
              msg.role === "assistant" && (
                <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse bg-zinc-400 align-middle" />
              )}
          </div>
        </div>
      ))}

      {status === "streaming" &&
        messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="bg-white border border-zinc-200 rounded-2xl rounded-bl-none px-4 py-2.5 text-sm shadow-sm flex items-center gap-2 text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin text-zinc-600" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
    </div>
  );
}
