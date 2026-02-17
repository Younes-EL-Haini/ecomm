"use client";

import { useState } from "react";
import {
  MoreVertical,
  Check,
  RefreshCcw,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateOrderStatus } from "@/lib/orders";
import { OrderStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { STATUS_OPTIONS } from "@/lib/orders";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export default function OrderQuickActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const executeUpdate = async (status: OrderStatus) => {
    setLoading(true);
    const res = await updateOrderStatus(orderId, status);

    if (res.success) {
      toast.success(`Order successfully marked as ${status}`);
      router.refresh();
    } else {
      toast.error(res.message || "Update failed");
    }
    setLoading(false);
  };

  const handleUpdate = async (status: OrderStatus) => {
    if (status === currentStatus) return;

    // --- Confirmation Step for Critical Statuses ---
    if (status === "CANCELLED" || status === "REFUNDED") {
      toast(`Confirm ${status.toLowerCase()}?`, {
        description: `This will restock the items and cannot be undone easily.`,
        action: {
          label: `Yes, ${status.toLowerCase()}`,
          onClick: () => executeUpdate(status),
        },
        cancel: {
          label: "Dismiss",
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }

    // Normal execution for other statuses (PAID, SHIPPED, etc.)
    await executeUpdate(status);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-zinc-100 transition-colors"
          disabled={loading}
        >
          {loading ? (
            <RefreshCcw className="h-4 w-4 animate-spin text-zinc-500" />
          ) : (
            <MoreVertical className="h-4 w-4 text-zinc-500" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 rounded-xl p-2 shadow-xl border-zinc-100"
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Navigation
        </DropdownMenuLabel>
        <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
          <Link
            href={`/admin/orders/${orderId}`}
            className="flex items-center justify-between w-full"
          >
            View Details
            <ExternalLink className="h-3 w-3 opacity-50" />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-zinc-50" />

        <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Change Status
        </DropdownMenuLabel>

        {STATUS_OPTIONS.map((status) => (
          <DropdownMenuItem
            key={status.value}
            onClick={() => handleUpdate(status.value)}
            disabled={loading}
            className="flex items-center justify-between rounded-lg cursor-pointer py-2"
          >
            <div className="flex flex-col">
              <span
                className={
                  currentStatus === status.value
                    ? "font-bold text-indigo-600"
                    : "text-zinc-700"
                }
              >
                {status.label}
              </span>
            </div>
            {currentStatus === status.value && (
              <Check className="h-3.5 w-3.5 text-indigo-600 stroke-[3px]" />
            )}
            {(status.value === "CANCELLED" || status.value === "REFUNDED") &&
              currentStatus !== status.value && (
                <AlertTriangle className="h-3 w-3 text-rose-400 opacity-50" />
              )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
