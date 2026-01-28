"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, MapPin, Calendar, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMoney, toNumber } from "@/lib/utils/pricing";
import { getStatusClasses } from "@/lib/utils/order-styles";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { SerializedOrder } from "@/lib/actions/order";
import OrderDetails from "./OrderDetails";

interface OrderCardProps {
  order: SerializedOrder; // No more 'any'!
}

const OrderCard = ({ order }: OrderCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        "group bg-white rounded-[2.5rem] border border-zinc-100 transition-all duration-500 overflow-hidden",
        isOpen
          ? "shadow-2xl shadow-zinc-200 ring-1 ring-zinc-200"
          : "hover:border-zinc-300 shadow-sm",
      )}
    >
      {/* CARD HEADER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left cursor-pointer"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* ID & Status Block */}
            <div className="space-y-1">
              <div className="flex items-center gap-6">
                {/* The Image Preview (Replacing the Package Icon) */}
                <div className="relative size-16 shrink-0 group/img">
                  {/* Decorative background "stack" for multiple items */}
                  {order.items.length > 1 && (
                    <div className="absolute inset-0 bg-zinc-200 rounded-2xl translate-x-1.5 translate-y-1.5" />
                  )}

                  <div className="relative size-16 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={
                        order.items[0]?.product.images[0]?.url ||
                        "/placeholder.png"
                      }
                      alt="Order preview"
                      fill
                      sizes="64px"
                      className="object-cover"
                    />

                    {/* Subtle overlay if there are many items */}
                    {order.items.length > 1 && (
                      <div className="absolute bottom-1 right-1 bg-zinc-900/80 backdrop-blur-md text-[8px] font-black text-white px-1.5 py-0.5 rounded-md">
                        +{order.items.length - 1}
                      </div>
                    )}
                  </div>
                </div>

                {/* ID & Status Block */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-black text-zinc-900 tracking-tight">
                      ORD-{order.id.slice(-5).toUpperCase()}
                    </p>
                    <Badge
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border-none",
                        getStatusClasses(order.status),
                      )}
                    >
                      {order.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-tight">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Package size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-tight">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "Item" : "Items"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  <span className="text-[10px] font-bold uppercase">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} />
                  <span className="text-[10px] font-bold uppercase">
                    Shipping Address
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-12 border-t md:border-t-0 border-zinc-50 pt-4 md:pt-0">
            <div className="text-right">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Total Amount
              </p>
              <p className="text-xl font-black text-zinc-900">
                {formatMoney(toNumber(order.totalPrice))}
              </p>
            </div>
            <ChevronDown
              className={cn(
                "text-zinc-300 transition-transform duration-500",
                isOpen && "rotate-180",
              )}
              size={24}
            />
          </div>
        </div>
      </button>

      {/* EXPANSION AREA (Items list) */}
      <OrderDetails order={order} isOpen={isOpen} />
    </div>
  );
};

export default OrderCard;
