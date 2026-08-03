"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { formatMoney, toNumber } from "@/lib/utils/pricing";
import { cn } from "@/lib/utils";
import { SerializedOrder } from "@/lib/orders";

interface OrderDetailsProps {
  order: SerializedOrder;
  isOpen: boolean;
}

const OrderDetails = ({ order, isOpen }: OrderDetailsProps) => {
  const items = order.items ?? [];

  return (
    <div
      className={cn(
        "grid transition-all duration-500 ease-in-out bg-zinc-50/50",
        isOpen
          ? "grid-rows-[1fr] opacity-100 border-t border-zinc-100 visible"
          : "grid-rows-[0fr] opacity-0 invisible pointer-events-none",
      )}
    >
      <div className="overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          {items.map((item) => {
            const images = item.product?.images ?? [];
            const image =
              images.find(
                (img) =>
                  img.color?.toLowerCase() ===
                  item.variant?.color?.toLowerCase(),
              ) ||
              images.find((img) => img.isMain) ||
              images[0];

            return (
              <div
                key={item.id}
                className="flex items-center justify-between group/item py-2 gap-4"
              >
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-16 h-20 shrink-0 rounded-xl border border-zinc-100 bg-white overflow-hidden shadow-sm relative">
                    <Image
                      src={image?.url || "/placeholder.png"}
                      alt={item.product?.title || "Product"}
                      fill
                      sizes="64px"
                      className="object-cover group-hover/item:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-zinc-900 line-clamp-1">
                      {item.product?.title || "Product"}
                    </p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                      Size: {item.variant?.name || "O/S"} • Qty: {item.quantity}
                    </p>
                    <p className="text-xs font-black text-zinc-900 mt-1">
                      {formatMoney(toNumber(item.price))}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-900 hover:text-white transition-colors"
                  >
                    <Link href={`/products/${item.product?.slug}`}>
                      View Product
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}

          {/* FOOTER ACTIONS */}
          <div className="pt-6 border-t border-zinc-200/80 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Thank you for shopping with us.
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                className="text-[10px] font-black uppercase tracking-widest rounded-xl"
              >
                Get Help
              </Button>

              <Button
                asChild
                size="sm"
                className="text-[10px] font-black uppercase tracking-widest rounded-xl bg-zinc-900 text-white hover:bg-zinc-800"
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
