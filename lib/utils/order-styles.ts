// lib/utils/order-styles.ts
import { OrderStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

export const STATUS_COLOR_CLASSES = (status: OrderStatus) => {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "PAID":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "SHIPPED":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "PROCESSING":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "PENDING":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "CANCELLED":
    case "REFUNDED":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export const STATUS_BASE =
  "inline-flex items-center font-semibold uppercase tracking-wide border";

export const STATUS_SIZES = {
  sm: "px-2 py-0.5 text-xs rounded-md",
  md: "px-3 py-1 text-sm rounded-lg",
  lg: "px-4 py-2 text-sm rounded-xl",
};

export const getStatusClasses = (
  status: OrderStatus,
  size: keyof typeof STATUS_SIZES = "sm"
) =>
  cn(STATUS_BASE, STATUS_SIZES[size], STATUS_COLOR_CLASSES(status));

