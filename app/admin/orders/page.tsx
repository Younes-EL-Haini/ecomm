import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatMoney, toNumber } from "@/lib/utils/pricing";
import { getAdminOrders, getStatusClasses } from "@/lib/orders";
import { getDateRange } from "@/lib/admin/date-utils"; // Import your utility
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { SearchFilter } from "@/components/admin/SearchFilter";

export default async function AdminOrdersPage(props: {
  searchParams: Promise<{ range?: string; search?: string }>;
}) {
  // 1. Get the range from the URL (e.g., ?range=last30)
  const searchParams = await props.searchParams;
  const range = searchParams.range || "all-time";
  const search = searchParams.search;

  // 2. Get the actual dates using your utility
  const { from, to } = getDateRange(range);

  // 3. Fetch orders using those dates
  const orders = await getAdminOrders({ from, to, search });

  return (
    <div className="space-y-6 m-3">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Orders
          </h1>
          <p className="text-slate-500 text-sm">
            {range
              ? `Showing results for ${range.replace("-", " ")}`
              : "Manage and track your customer purchases."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <DateRangeFilter /> {/* 👈 Added here */}
          <SearchFilter />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-bold text-indigo-600 hover:underline"
                    >
                      #{order.id.slice(-6).toUpperCase()}
                    </Link>
                    <p className="text-[10px] text-slate-400">
                      {order._count.items} items
                    </p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">
                        {order.user.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {order.user.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getStatusClasses(order.status, "md")}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    {formatMoney(toNumber(order.totalPrice))}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 group-hover:text-slate-900">
                        <ChevronRight size={18} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 && (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <ShoppingBag size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No orders found
            </h3>
            <p className="text-slate-500 max-w-xs">
              Try changing the date range or search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
