import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Prisma } from "@/lib/generated/prisma";

interface Order {
  id: string;
  status: string;
  totalPrice: Prisma.Decimal;
  createdAt: Date;
  user: { name: string | null; email: string | null };
}

export function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <Card className="rounded-4xl border-zinc-100 shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-zinc-500 font-medium">
                <th className="h-12 px-4 text-left">Customer</th>
                <th className="h-12 px-4 text-left">Status</th>
                <th className="h-12 px-4 text-left">Date</th>
                <th className="h-12 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-zinc-50 transition-colors hover:bg-zinc-50/50"
                >
                  <td className="p-4 align-middle">
                    <div className="font-medium">
                      {order.user.name || "Guest"}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {order.user.email}
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === "PAID"
                          ? "bg-green-50 text-green-600"
                          : order.status === "PENDING"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 align-middle text-right font-bold tabular-nums">
                    ${Number(order.totalPrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
