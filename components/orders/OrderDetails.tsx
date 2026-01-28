// components/orders/OrderDetails.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { formatMoney, toNumber } from "@/lib/utils/pricing";
import { cn } from "@/lib/utils";
import { SerializedOrder } from "@/lib/actions/order";

interface OrderDetailsProps {
  order: SerializedOrder;
  isOpen: boolean;
}

const OrderDetails = ({ order, isOpen }: OrderDetailsProps) => {
  return (
    <div
      className={cn(
        "grid transition-all duration-500 ease-in-out bg-zinc-50/30",
        isOpen
          ? "grid-rows-[1fr] opacity-100 border-t border-zinc-100"
          : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div className="overflow-hidden">
        <div className="p-8 space-y-6">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between group/item py-2"
            >
              <div className="flex items-center gap-5">
                <div className="size-20 rounded-2xl border border-zinc-100 bg-white overflow-hidden shadow-sm">
                  <Image
                    src={item.product.images[0]?.url || "/placeholder.png"}
                    alt={item.product.name || "Product"}
                    width={80}
                    height={80}
                    className="object-cover size-full group-hover/item:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-zinc-900">
                    {item.product.name}
                  </p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase">
                    Size: {item.variant?.name || "O/S"} • Qty: {item.quantity}
                  </p>
                  <p className="text-xs font-black text-zinc-900 mt-2">
                    {formatMoney(toNumber(item.price))}
                  </p>
                </div>
              </div>

              <div className="hidden md:block">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-[9px] font-black uppercase tracking-widest"
                >
                  <Link href={`/products/${item.product.slug}`}>
                    View Product
                  </Link>
                </Button>
              </div>
            </div>
          ))}

          <div className="pt-6 border-t border-zinc-200 flex flex-col md:flex-row gap-4 items-center justify-between">
            <p className="text-[10px] font-bold text-zinc-400 uppercase italic">
              Thank you for shopping at STORE.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-[10px] font-black uppercase tracking-widest"
              >
                Get Help
              </Button>

              <Button
                asChild
                size="sm"
                className="text-[10px] font-black uppercase tracking-widest"
              >
                <Link href={`/account/orders/${order.id}`}>Track Order</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
