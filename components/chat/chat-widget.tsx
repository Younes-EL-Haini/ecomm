"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useChatSession } from "@/app/hooks/use-chat-session";
import { ChatWidgetProps } from "@/lib/chat/chat.types";
import { ChatHeader } from "./chat-header";
import { ChatMessageList } from "./chat-message-list";
import { ChatInputForm } from "./chat-input-form";

export function ChatWidget({
  initialMessages = [],
  currentModelId = "llama-3.3",
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { input, setInput, messages, status, stop, handleSubmit } =
    useChatSession({
      initialMessages,
      modelId: currentModelId,
    });

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Expanded Small Chat Panel */}
      {isOpen && (
        <div className="mb-4 h-[520px] w-[380px] flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden transition-all duration-200">
          <ChatHeader
            modelId={currentModelId}
            onClose={() => setIsOpen(false)}
          />

          <ChatMessageList messages={messages} status={status} />

          <ChatInputForm
            input={input}
            setInput={setInput}
            status={status}
            stop={stop}
            handleSubmit={handleSubmit}
          />
        </div>
      )}

      {/* Floating Widget Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-zinc-900 hover:bg-zinc-800 text-white p-4 rounded-full shadow-2xl transition-transform active:scale-95 duration-150 flex items-center justify-center"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
