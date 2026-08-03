import { ChatStatus } from "ai";

export type AIModelId = "llama-3.3" | "mixtral" | "gemma2";

// 🌟 Explicit type contracts modeling Vercel AI SDK structural message formats
export interface MessagePart {
  type: "text";
  text: string;
}

export interface UIMessage {
  id: string;
  role: "user" | "assistant" | "system" | "data";
  content?: string;
  parts?: MessagePart[];
}

// Database baseline incoming shape (Flat Content strings from Prisma)
export interface DBHistoricalMessage {
  id: string;
  role: string;
  content: string;
}

// Hook configuration parameter requirements
export interface UseChatSessionProps {
  initialMessages: DBHistoricalMessage[];
  modelId: AIModelId;
}

// Complete typed boundary exported by your custom state engine hook
export interface UseChatSessionReturn {
  input: string;
  setInput: (value: string) => void;
  messages: UIMessage[];
  status: ChatStatus;
  stop: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

// Component Props constraint typing
export interface ChatWidgetProps {
  initialMessages?: DBHistoricalMessage[];
  currentModelId?: AIModelId;
}

export interface ChatInputFormProps {
  input: string;
  setInput: (value: string) => void;
  status: ChatStatus;
  stop: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface ChatMessageListProps {
  messages: UIMessage[];
  status: ChatStatus;
}

export interface ChatHeaderProps {
  modelId: AIModelId;
  onClose: () => void;
}

export interface DBHistoricalMessage {
  id: string;
  role: string;
  content: string;
}

export interface UserContextSummary {
  customerName: string;
  // cartSummary: string;
  recentOrdersSummary: string;

}

export interface SearchProductsArgs {
  query?: string;
  categorySlug?: string;
  maxPrice?: number | string;
}