import { OrderStatus } from "../generated/prisma";
import { cn } from "@/lib/utils";

export const STATUS_CONFIG: Record<OrderStatus, string> = {
  DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  PAID: "bg-blue-100 text-blue-700 border-blue-200",
  SHIPPED: "bg-indigo-100 text-indigo-700 border-indigo-200",
  PROCESSING: "bg-amber-100 text-amber-700 border-amber-200",
  PENDING: "bg-slate-100 text-slate-700 border-slate-200",
  CANCELLED: "bg-rose-100 text-rose-700 border-rose-200",
  REFUNDED: "bg-rose-100 text-rose-700 border-rose-200",
};

export const STATUS_BASE = "inline-flex items-center font-semibold uppercase tracking-wide border";

export const STATUS_SIZES = {
  sm: "px-2 py-0.5 text-[8px] rounded-full", // Matches your luxury UI
  md: "px-3 py-1 text-[10px] rounded-lg",
  lg: "px-4 py-2 text-sm rounded-xl",
};

export const getStatusClasses = (
  status: OrderStatus,
  size: keyof typeof STATUS_SIZES = "sm"
) => cn(STATUS_BASE, STATUS_SIZES[size], STATUS_CONFIG[status] || STATUS_CONFIG.PENDING);