"use client";

import { ChatHeaderProps } from "@/lib/chat/chat.types";
import { X } from "lucide-react";

export function ChatHeader({ modelId, onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-zinc-900 p-4 text-white">
      <div className="flex flex-col">
        <span className="text-sm font-semibold">AI Shopping Assistant</span>
        <span className="text-[11px] text-zinc-400">
          Active model: {modelId}
        </span>
      </div>
      <button
        onClick={onClose}
        className="text-zinc-400 hover:text-white transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
