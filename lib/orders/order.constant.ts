import { OrderStatus } from "../generated/prisma";
import { cn } from "@/lib/utils";

// 1. Unified Configuration: Style + Label
export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; styles: string }> = {
  DELIVERED: { 
    label: "Delivered", 
    styles: "bg-emerald-100 text-emerald-700 border-emerald-200" 
  },
  PAID: { 
    label: "Paid", 
    styles: "bg-blue-100 text-blue-700 border-blue-200" 
  },
  SHIPPED: { 
    label: "Shipped", 
    styles: "bg-indigo-100 text-indigo-700 border-indigo-200" 
  },
  PROCESSING: { 
    label: "Processing", 
    styles: "bg-amber-100 text-amber-700 border-amber-200" 
  },
  PENDING: { 
    label: "Pending", 
    styles: "bg-slate-100 text-slate-700 border-slate-200" 
  },
  CANCELLED: { 
    label: "Cancelled", 
    styles: "bg-rose-100 text-rose-700 border-rose-200" 
  },
  REFUNDED: { 
    label: "Refunded", 
    styles: "bg-rose-100 text-rose-700 border-rose-200" 
  },
};

// 2. Export options for your Select components automatically
export const STATUS_OPTIONS = Object.entries(ORDER_STATUS_MAP).map(([value, config]) => ({
  value: value as OrderStatus,
  label: config.label,
}));

// 3. Keep your Luxury UI sizing constants
export const STATUS_BASE = "inline-flex items-center font-semibold uppercase tracking-wide border";

export const STATUS_SIZES = {
  sm: "px-2 py-0.5 text-[8px] rounded-full",
  md: "px-3 py-1 text-[10px] rounded-lg",
  lg: "px-4 py-2 text-sm rounded-xl",
};

// 4. Helper function pulling from the new MAP
export const getStatusClasses = (
  status: OrderStatus,
  size: keyof typeof STATUS_SIZES = "sm"
) => {
  const config = ORDER_STATUS_MAP[status] || ORDER_STATUS_MAP.PENDING;
  return cn(STATUS_BASE, STATUS_SIZES[size], config.styles);
};