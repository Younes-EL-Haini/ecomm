import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { OrderStatus } from "@/lib/generated/prisma";
import { getStatusClasses } from "@/lib/orders";

import OrderQuickActions from "@/components/admin/OrderQuickActions";

/* ----------------------------------------
   Types
---------------------------------------- */

interface Order {
  id: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string | Date;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface Props {
  orders: Order[];
}

/* ----------------------------------------
   Component
---------------------------------------- */

export function RecentOrders({ orders }: Props) {
  return (
    <Card className="rounded-4xl border-zinc-100 shadow-sm bg-white overflow-hidden">
      {/* ---------- Header ---------- */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-zinc-900">
          Recent Orders
        </CardTitle>

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-indigo-600 hover:text-indigo-700"
        >
          <Link href="/admin/orders">View All</Link>
        </Button>
      </CardHeader>

      <CardContent>
        {/* ====================================
            Desktop Table (md+)
        ==================================== */}
        <div className="hidden md:block relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            {/* Head */}
            <thead>
              <tr className="border-b border-zinc-100 text-zinc-500 font-medium">
                <th className="h-12 px-4 text-left font-semibold">Order</th>

                <th className="h-12 px-4 text-left font-semibold">Customer</th>

                <th className="h-12 px-4 text-left font-semibold">Status</th>

                <th className="h-12 px-4 text-left font-semibold">Date</th>

                <th className="h-12 px-4 text-right font-semibold">Amount</th>

                <th className="h-12 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="[&_tr:last-child]:border-0">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                >
                  {/* Order ID */}
                  <td className="p-4 align-middle">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-bold text-indigo-600 hover:underline"
                    >
                      #{order.id.slice(-6).toUpperCase()}
                    </Link>
                  </td>

                  {/* Customer */}
                  <td className="p-4 align-middle">
                    <div className="font-semibold text-zinc-900">
                      {order.user.name || "Guest User"}
                    </div>

                    <div className="text-xs text-zinc-400">
                      {order.user.email}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-4 align-middle">
                    <span className={getStatusClasses(order.status, "md")}>
                      {order.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="p-4 align-middle text-zinc-500 font-medium">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(order.createdAt))}
                  </td>

                  {/* Amount */}
                  <td className="p-4 align-middle text-right font-bold tabular-nums text-zinc-900">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(Number(order.totalPrice))}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right align-middle">
                    <OrderQuickActions
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ====================================
            Mobile Cards (sm)
        ==================================== */}
        <div className="md:hidden space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-4 bg-white shadow-sm"
            >
              {/* Top Row */}
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-bold text-indigo-600"
                  >
                    #{order.id.slice(-6).toUpperCase()}
                  </Link>

                  <p className="text-sm text-zinc-700 mt-1">
                    {order.user.name || "Guest User"}
                  </p>

                  <p className="text-xs text-zinc-400">{order.user.email}</p>
                </div>

                <OrderQuickActions
                  orderId={order.id}
                  currentStatus={order.status}
                />
              </div>

              {/* Bottom Row */}
              <div className="mt-4 flex items-center justify-between">
                <span className={getStatusClasses(order.status, "sm")}>
                  {order.status}
                </span>

                <span className="font-bold text-zinc-900">
                  ${Number(order.totalPrice).toFixed(2)}
                </span>
              </div>

              {/* Date */}
              <div className="mt-2 text-xs text-zinc-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
