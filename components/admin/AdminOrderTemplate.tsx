import {
  Package,
  Truck,
  CreditCard,
  User,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminOrderTemplate({ order }: { order: any }) {
  return (
    <div className="space-y-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Calendar size={14} /> Ordered on Jan 21, 2026
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
              {order.items.map((item: any) => (
                <div key={item.id} className="p-6 flex items-center gap-4">
                  <div className="h-16 w-16 bg-slate-100 rounded-lg overflow-hidden border">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm text-slate-500">
                      SKU: {item.sku} | Color: {item.color}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${item.price}</p>
                    <p className="text-xs text-slate-400 font-medium">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 p-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span>$198.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span>$12.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                <span>Total</span>
                <span>$210.00</span>
              </div>
            </div>
          </section>

          {/* TIMELINE / LOGS */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold mb-4">Activity Log</h3>
            <div className="space-y-4">
              {[
                { msg: "Order placed by customer", time: "10:30 AM" },
                { msg: "Payment confirmed via Stripe", time: "10:31 AM" },
              ].map((log, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="w-1 bg-slate-200 rounded-full" />
                  <p className="text-slate-600">
                    <span className="font-bold text-slate-900">{log.time}</span>{" "}
                    — {log.msg}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Management Sidebar */}
        <aside className="lg:sticky lg:top-8 space-y-6">
          {/* FULFILLMENT STATUS */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Truck size={18} /> Order Status
            </div>
            <select className="w-full h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm focus:ring-1 focus:ring-black">
              <option>Pending Fulfillment</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Update Status
            </Button>
          </section>

          {/* CUSTOMER INFO */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-800 border-b pb-2">
              <User size={18} /> Customer Info
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center font-bold">
                  JD
                </div>
                <div>
                  <p className="font-bold">John Doe</p>
                  <p className="text-xs text-slate-500">12 Previous Orders</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail size={14} /> john@example.com
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone size={14} /> +1 234 567 890
              </div>
            </div>
          </section>

          {/* PAYMENT DETAILS */}
          <section className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold">
                <CreditCard size={18} className="text-emerald-400" /> Payment
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-none">
                Paid
              </Badge>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <p>
                Transaction ID:{" "}
                <span className="text-slate-200">ch_3N8x...94k</span>
              </p>
              <p>
                Method:{" "}
                <span className="text-slate-200">Visa ending in 4242</span>
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
