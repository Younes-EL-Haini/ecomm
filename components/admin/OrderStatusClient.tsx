// components/admin/OrderStatusClient.tsx
"use client";

import { useState } from "react";
import { STATUS_OPTIONS, updateOrderStatus } from "@/lib/orders";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { OrderStatus } from "@prisma/client";

export default function OrderStatusClient({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  const onUpdate = async () => {
    setLoading(true);
    const result = await updateOrderStatus(orderId, status);
    setLoading(false);

    if (result.success) {
      toast.success(`Order marked as ${status}`);
    } else {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-4">
      {/* <select
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderStatus)}
        className="w-full h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium focus:ring-1 focus:ring-black outline-none"
      >
        <option value="PENDING">Pending</option>
        <option value="PAID">Paid</option>
        <option value="PROCESSING">Processing</option>
        <option value="SHIPPED">Shipped</option>
        <option value="DELIVERED">Delivered</option>
        <option value="CANCELLED">Cancelled</option>
        <option value="REFUNDED">Refunded</option>
      </select> */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderStatus)}
        className="w-full h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium focus:ring-1 focus:ring-black outline-none"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <Button
        onClick={onUpdate}
        disabled={loading || status === currentStatus}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-slate-300"
      >
        {loading ? "Saving..." : "Update Status"}
      </Button>
    </div>
  );
}
