"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import Link from "next/link";

import { toast } from "sonner";
import { updateOrderStatus } from "@/lib/orders";
import { OrderStatus } from "@/lib/generated/prisma";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
}

/**
 * Define allowed transitions
 * (Business logic layer)
 */
const STATUS_ACTIONS: Record<
  OrderStatus,
  { label: string; value: OrderStatus }[]
> = {
  PENDING: [
    { label: "Mark as Paid", value: "PAID" },
    { label: "Cancel Order", value: "CANCELLED" },
  ],

  PAID: [
    { label: "Start Processing", value: "PROCESSING" },
    { label: "Refund", value: "REFUNDED" },
  ],

  PROCESSING: [{ label: "Mark as Shipped", value: "SHIPPED" }],

  SHIPPED: [{ label: "Mark as Delivered", value: "DELIVERED" }],

  DELIVERED: [],

  CANCELLED: [],

  REFUNDED: [],
};

export default function OrderQuickActions({ orderId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false);

  const actions = STATUS_ACTIONS[currentStatus] || [];

  const handleUpdate = async (status: OrderStatus) => {
    setLoading(true);

    const res = await updateOrderStatus(orderId, status);

    setLoading(false);

    if (res.success) {
      toast.success(`Order marked as ${status}`);
    } else {
      toast.error("Update failed");
    }
  };

  return (
    <DropdownMenu>
      {/* Trigger Button */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={loading}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      {/* Menu */}
      <DropdownMenuContent align="end" className="w-48">
        {/* View */}
        <DropdownMenuItem asChild>
          <Link href={`/admin/orders/${orderId}`}>View Order</Link>
        </DropdownMenuItem>

        {actions.length > 0 && <DropdownMenuSeparator />}

        {/* Dynamic Actions */}
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.value}
            disabled={loading}
            onClick={() => handleUpdate(action.value)}
          >
            {action.label}
          </DropdownMenuItem>
        ))}

        {/* Danger Zone */}
        {currentStatus !== "CANCELLED" && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              disabled={loading}
              onClick={() => handleUpdate("CANCELLED")}
            >
              Cancel Order
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
