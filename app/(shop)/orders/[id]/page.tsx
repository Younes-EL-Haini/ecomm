import { Badge } from "@/components/ui/badge";
import { getStatusClasses } from "@/lib/utils/order-styles";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react"; // Add this for a better back icon
import { formatMoney, getOrderItemTotal, toNumber } from "@/lib/utils/pricing";
import { getOrderById } from "@/lib/actions/order";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

const OrderPage = async ({ params }: Props) => {
  const param = await params;
  const order = await getOrderById(param.id);

  if (!order)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-zinc-500 font-medium">Order not found</p>
        <Link href="/orders" className="mt-4 text-sm font-bold underline">
          Go back
        </Link>
      </div>
    );

  return (
    <main className="bg-gray-100">
      <div className="px-6 py-12 max-w-4xl mx-auto">
        {/* 1. Navigation & Header */}
        <div className="mb-12">
          <Link
            href="/orders"
            className="group flex items-center gap-1 text-zinc-500 hover:text-zinc-900 transition-colors mb-8 w-fit"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Back to Orders
            </span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-zinc-900">
                Order Details
              </h1>
              <p className="text-zinc-500 mt-2 font-medium">
                Receipt for{" "}
                <span className="text-zinc-900">
                  #{order.id.slice(-8).toUpperCase()}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 px-4 py-2 rounded-2xl w-fit">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Status
              </span>
              <Badge
                className={cn(
                  "rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-tighter",
                  getStatusClasses(order.status, "sm"),
                )}
              >
                {order.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 2. Item List (Left Side) */}
          <div className="lg:col-span-2 space-y-6">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-4">
              Items ({order.items.length})
            </p>

            {order.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl group flex gap-6 items-center py-4 px-2"
              >
                <div className="w-24 h-24 relative rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 shrink-0 shadow-sm">
                  <Image
                    src={item.product.images?.[0]?.url || "/placeholder.png"}
                    alt={item.product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-base font-bold text-zinc-900 hover:text-blue-600 transition-colors"
                    >
                      {item.product.title}
                    </Link>
                    <div className="text-xs text-zinc-500 mt-1 font-medium space-x-2">
                      <span>Size: {item.variant?.size}</span>
                      <span className="text-zinc-200">|</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-zinc-900">
                    {formatMoney(getOrderItemTotal(item))}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 3. Summary & Info (Right Side) */}
          <div className="space-y-8">
            {/* Order Summary Box */}
            <div className="bg-zinc-900 text-white p-8 rounded-4xl shadow-xl">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6">
                Summary
              </p>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="font-bold">
                    {formatMoney(toNumber(order.totalPrice))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Shipping</span>
                  <span className="text-green-400 font-bold">FREE</span>
                </div>
                <div className="pt-4 border-t border-zinc-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold">Total</span>
                  <span className="text-3xl font-black tracking-tighter">
                    {formatMoney(toNumber(order.totalPrice))}
                  </span>
                </div>
              </div>
            </div>

            {/* Date Info */}
            <div className="px-6 py-4 border border-zinc-100 rounded-2xl">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Order Placed
              </p>
              <p className="text-sm font-bold text-zinc-900">
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  dateStyle: "long",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderPage;
