// components/admin/DashboardMetrics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, DollarSign, Box } from "lucide-react";
import Link from "next/link";

export function DashboardMetrics({
  data,
  range,
}: {
  data: any;
  range: string;
}) {
  const metrics = [
    {
      label: "Total Orders",
      value: data.totalOrders,
      trend: data.orderTrend,
      icon: ShoppingCart,
      color: "text-indigo-500",
      bg: "from-indigo-50",
      link: `/admin/orders?range=${range}`, // Existing link
    },
    {
      label: "Total Revenue",
      value: `$${data.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      trend: data.revenueTrend,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "from-emerald-50",
      // Usually, Revenue doesn't link to a specific list, but you could link to 'Payments' if you had it
    },
    {
      label: "Active Products",
      value: data.totalProducts,
      icon: Box,
      color: "text-amber-500",
      bg: "from-amber-50",
      link: `/admin/products`, // 👈 Added link to products management
      subtitle: "View Inventory",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((m) => {
        // We define the Card content first to keep the code DRY (Don't Repeat Yourself)
        const CardWrapper = (
          <Card
            className={`group rounded-[2.5rem] p-2 bg-linear-to-br ${m.bg} to-white shadow-sm border-none hover:shadow-md transition-all duration-300 cursor-pointer`}
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div
                className={`p-3 rounded-2xl bg-white shadow-xs ${m.color} group-hover:scale-110 transition-transform`}
              >
                <m.icon size={20} />
              </div>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {m.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">
                {m.value}
              </div>

              {m.trend !== undefined ? (
                <p
                  className={`text-[11px] font-medium mt-1 ${m.trend >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                >
                  {m.trend >= 0 ? "↑" : "↓"} {Math.abs(m.trend)}%
                  <span className="text-slate-400 font-normal ml-1">
                    vs prev. period
                  </span>
                </p>
              ) : (
                <p className="text-[11px] font-medium text-slate-400 mt-1 group-hover:text-amber-600 transition-colors">
                  {m.subtitle || "In your catalog"}
                </p>
              )}
            </CardContent>
          </Card>
        );

        // If a link exists, wrap it in Next.js Link
        return m.link ? (
          <Link key={m.label} href={m.link}>
            {CardWrapper}
          </Link>
        ) : (
          <div key={m.label}>{CardWrapper}</div>
        );
      })}
    </div>
  );
}
