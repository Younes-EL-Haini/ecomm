"use client";

import { Badge } from "@/components/ui/badge";
import { SerializedOrder } from "@/lib/admin/admin.types";
import { getStatusClasses } from "@/lib/orders";
import { formatMoney } from "@/lib/utils/pricing";
import { ShoppingBag, ArrowUpRight, Calendar } from "lucide-react";
import Link from "next/link";

export default function OrderTable({ orders }: { orders: SerializedOrder[] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b">
          <tr>
            <th className="px-6 py-4">Order Reference</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-right">Amount</th>
            <th className="w-10 px-6"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-slate-50/50 transition-colors group"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <ShoppingBag size={14} />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700">
                    <Link href={`/admin/orders/${order.id}`}>
                      #{order.id.slice(-8).toUpperCase()}
                    </Link>
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <Calendar size={14} />
                  </div>
                  <span className="text-slate-500 font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <Badge className={getStatusClasses(order.status, "md")}>
                  {order.status}
                </Badge>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="font-black text-slate-900">
                  {formatMoney(order.totalPrice, order.currency)}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="inline-flex p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                  <ArrowUpRight size={18} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <div className="py-20 text-center text-slate-400 font-medium italic">
          No purchase history found.
        </div>
      )}
    </div>
  );
}
