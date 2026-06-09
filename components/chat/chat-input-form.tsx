"use client";

import React from "react";
import { Send, X } from "lucide-react";
import { ChatInputFormProps } from "@/lib/chat/chat.types";

export function ChatInputForm({
  input,
  setInput,
  status,
  stop,
  handleSubmit,
}: ChatInputFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 border-t border-zinc-200 bg-white flex gap-2 items-center"
    >
      <input
        value={input}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInput(e.target.value)
        }
        placeholder="Type your message..."
        disabled={status === "streaming"}
        className="flex-1 bg-zinc-100 rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-zinc-300 focus:bg-white transition-all disabled:opacity-60"
      />

      {status === "streaming" ? (
        <button
          type="button"
          onClick={stop}
          className="bg-red-500 text-white p-2.5 rounded-xl hover:bg-red-600 transition-colors shadow-md"
        >
          <X className="h-4 w-4" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-zinc-900 text-white p-2.5 rounded-xl hover:bg-zinc-800 transition-colors shadow-md disabled:opacity-40 disabled:hover:bg-zinc-900"
        >
          <Send className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
