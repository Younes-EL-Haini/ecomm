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
      icon: ShoppingCart,
      color: "text-indigo-500",
      bg: "from-indigo-50",
      link: `/admin/orders?range=${range}`,
      trend: data.orderTrend,
    },
    {
      label: "Total Revenue",
      value: `$${data.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "from-emerald-50",
      trend: data.revenueTrend,
    },
    {
      label: "Active Products",
      value: data.totalProducts,
      icon: Box,
      color: "text-amber-500",
      bg: "from-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((m) => {
        const Content = (
          <Card
            className={`rounded-4xl bg-linear-to-br ${m.bg} to-white shadow-sm border-none hover:shadow-md transition-shadow`}
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className={`p-3 rounded-2xl bg-white shadow-xs ${m.color}`}>
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
              {m.trend !== undefined && (
                <p
                  className={`text-sm mt-1 font-medium ${m.trend >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                >
                  {m.trend >= 0 ? "↑" : "↓"} {Math.abs(m.trend)}%
                  <span className="text-slate-400 font-normal ml-1">
                    vs previous period
                  </span>
                </p>
              )}
            </CardContent>
          </Card>
        );

        return m.link ? (
          <Link key={m.label} href={m.link}>
            {Content}
          </Link>
        ) : (
          <div key={m.label}>{Content}</div>
        );
      })}
    </div>
  );
}
