import {
  Package,
  Truck,
  CreditCard,
  User,
  Mail,
  Phone,
  Calendar,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import OrderStatusClient from "./OrderStatusClient";
import {
  calculateVariantPrice,
  formatMoney,
  toNumber,
} from "@/lib/utils/pricing";
import { AdminOrderDetail, getStatusClasses } from "@/lib/orders";
import Image from "next/image";

export default function AdminOrderTemplate({
  order,
}: {
  order: NonNullable<AdminOrderDetail>;
}) {
  const user = order.user;
  const shippingFee = toNumber((order as any).shippingFee ?? 0);
  const subtotal = toNumber(order.totalPrice);
  const totalAmount = subtotal + shippingFee;

  // Safe initial generator
  const getInitials = (name?: string | null) => {
    if (!name?.trim()) return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="space-y-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Calendar size={14} /> Ordered on{" "}
            {format(new Date(order.createdAt), "MMM dd, yyyy")}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Order #{order.id.slice(-6).toUpperCase()}
          </h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Print Invoice</Button>
          <Button className="bg-black text-white hover:bg-slate-800">
            Refund
          </Button>
        </div>
      </div>

      {/* --- MAIN GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* LEFT COLUMN: Order Details */}
        <div className="space-y-8">
          {/* ITEMS LIST */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center gap-2">
              <Package size={20} className="text-indigo-500" />
              <h2 className="font-bold text-lg">Items Summary</h2>
            </div>
            <div className="divide-y">
              {order.items.map((item) => {
                const imageUrl =
                  item.product.images?.[0]?.url || "/placeholder.svg";
                const unitPrice = calculateVariantPrice(
                  item.totalPrice,
                  item.variant?.priceDelta,
                );

                return (
                  <div key={item.id} className="p-6 flex items-center gap-4">
                    <div className="h-20 w-16 bg-slate-100 rounded-lg overflow-hidden border shrink-0">
                      <Image
                        src={imageUrl}
                        alt={item.name || item.product.title || "Product image"}
                        width={64}
                        height={80}
                        sizes="64px"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">
                        {item.product.title}
                      </h4>
                      <p className="text-sm text-slate-500 truncate">
                        {item.variant?.sku && `SKU: ${item.variant.sku}`}
                        {item.variant?.color &&
                          ` | Color: ${item.variant.color}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatMoney(unitPrice)}</p>
                      <p className="text-xs text-slate-400 font-medium">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-slate-50 p-6 space-y-2 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span>
                  {shippingFee === 0 ? "Free" : formatMoney(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2 text-slate-900">
                <span>Total</span>
                <span>{formatMoney(totalAmount)}</span>
              </div>
            </div>
          </section>

          {/* TIMELINE / LOGS */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold mb-4">Activity Log</h3>
            <div className="space-y-4">
              <div className="flex gap-3 text-sm">
                <div className="w-1 bg-indigo-500 rounded-full" />
                <p className="text-slate-600">
                  <span className="font-bold text-slate-900">
                    {format(new Date(order.createdAt), "hh:mm a")}
                  </span>{" "}
                  — Order placed by customer
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Management Sidebar */}
        <aside className="lg:sticky lg:top-8 space-y-6">
          {/* FULFILLMENT STATUS */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Truck size={18} /> Order Status
              </div>
              <Badge className={getStatusClasses(order.status, "sm")}>
                {order.status}
              </Badge>
            </div>
            <OrderStatusClient
              orderId={order.id}
              currentStatus={order.status}
            />
          </section>

          {/* SHIPPING ADDRESS CARD */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Truck size={18} className="text-slate-500" />
                Shipping Address
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-indigo-600 h-8 text-xs hover:bg-indigo-50"
              >
                Edit
              </Button>
            </div>

            {order.shippingAddress ? (
              <div className="space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-600/80">
                  Ship To
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-extrabold text-slate-900 leading-none mb-2">
                    {order.shippingAddress.fullName || user?.name || "N/A"}
                  </h4>
                  <div className="text-sm text-slate-600 font-medium">
                    <p>{order.shippingAddress.line1}</p>
                    {order.shippingAddress.line2 && (
                      <p className="text-slate-400 text-xs">
                        {order.shippingAddress.line2}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 font-medium">
                    {order.shippingAddress.city}
                    {order.shippingAddress.state &&
                      `, ${order.shippingAddress.state}`}
                    <span className="ml-2 text-slate-400 font-normal">
                      {order.shippingAddress.postalCode}
                    </span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <Globe size={14} className="text-indigo-500" />
                    {order.shippingAddress.country}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <p className="text-sm text-slate-400 italic">
                  No shipping address linked.
                </p>
              </div>
            )}
          </section>

          {/* CUSTOMER INFO */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-800 border-b pb-2">
              <User size={18} /> Customer Info
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-10 w-10 bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center font-bold border border-indigo-100 uppercase shrink-0">
                  {getInitials(user?.name)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">
                    {user?.name || "Guest Customer"}
                  </p>
                </div>
              </div>
              {user?.email && (
                <div className="flex items-center gap-2 text-sm text-slate-600 truncate">
                  <Mail size={14} className="shrink-0" /> {user.email}
                </div>
              )}
              {order.shippingAddress?.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-600 truncate">
                  <Phone size={14} className="shrink-0" />{" "}
                  {order.shippingAddress.phone}
                </div>
              )}
            </div>
          </section>

          {/* PAYMENT DETAILS */}
          <section className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold">
                <CreditCard size={18} className="text-emerald-400" /> Payment
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-none">
                {order.status}
              </Badge>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <p className="truncate">
                Transaction ID:{" "}
                <span className="text-slate-200 font-mono">
                  {order.stripeSessionId || "N/A"}
                </span>
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
