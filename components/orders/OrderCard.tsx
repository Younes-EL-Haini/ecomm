import Link from "next/link";
import Image from "next/image";
import { getStatusClasses } from "@/lib/utils/order-styles";
import { Badge } from "../ui/badge";
import { formatMoney, toNumber } from "@/lib/utils/pricing";
import { cn } from "@/lib/utils";

const OrderCard = ({ order }: any) => {
  return (
    <Link href={`/account/orders/${order.id}`} className="group block mb-6">
      <div className="border border-zinc-100 rounded-4xl p-6 bg-white shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-zinc-200">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
          <div className="flex items-center gap-6">
            {/* Image Container */}
            <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50">
              <Image
                src={
                  order.items[0]?.product.images[0]?.url || "/placeholder.png"
                }
                alt="Product"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="space-y-1">
              <p className="text-lg font-bold text-zinc-900 tracking-tight">
                Order #{order.id.slice(-6).toUpperCase()}
              </p>

              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
                {order.items.length}{" "}
                {order.items.length === 1 ? "Item" : "Items"} •{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              {/* Change Blue to Black for a Luxury Feel */}
              <p className="text-xl font-black text-zinc-900 mt-1">
                {formatMoney(toNumber(order.totalPrice))}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            {/* Ensure getStatusClasses returns soft tints, not harsh colors */}
            <Badge
              variant="secondary"
              className={cn(
                "px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase",
                getStatusClasses(order.status),
              )}
            >
              {order.status}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
