"use client";

import { useState } from "react";
import { MoreVertical, Check, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { STATUS_OPTIONS, updateOrderStatus } from "@/lib/orders";
import { OrderStatus } from "@/lib/generated/prisma";
import { Button } from "@/components/ui/button";
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

  const handleUpdate = async (status: OrderStatus) => {
    if (status === currentStatus) return;

    setLoading(true);
    const res = await updateOrderStatus(orderId, status);

    if (res.success) {
      toast.success(`Order status updated to ${status}`);
      router.refresh(); // This makes the table badge change immediately
    } else {
      toast.error("Update failed");
    }
    setLoading(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={loading}
        >
          {loading ? (
            <RefreshCcw className="h-4 w-4 animate-spin" />
          ) : (
            <MoreVertical className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs text-zinc-400">
          Actions
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/admin/orders/${orderId}`}>View Details</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-zinc-400">
          Change Status
        </DropdownMenuLabel>
        {STATUS_OPTIONS.map((status) => (
          <DropdownMenuItem
            key={status.value}
            onClick={() => handleUpdate(status.value)}
            disabled={loading}
            className="flex items-center justify-between rounded-lg cursor-pointer transition-colors"
          >
            <span
              className={
                currentStatus === status.value
                  ? "font-bold text-indigo-600"
                  : "text-zinc-600"
              }
            >
              {status.label}
            </span>
            {currentStatus === status.value && (
              <Check className="h-3.5 w-3.5 text-indigo-600 stroke-[3px]" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
