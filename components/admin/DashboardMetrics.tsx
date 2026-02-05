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
      trend: "+8% from last week",
    },
    {
      label: "Total Revenue",
      value: `$${data.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "from-emerald-50",
      trend: "+12% from last week",
    },
    {
      label: "Active Products",
      value: data.totalProducts,
      icon: Box,
      color: "text-amber-500",
      bg: "from-amber-50",
      trend: "Stable",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((m) => {
        const Content = (
          <Card
            className={`rounded-4xl p-2 bg-linear-to-br ${m.bg} to-white shadow-sm border-none hover:shadow-md transition-shadow cursor-default`}
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
              <p className="text-[11px] font-medium text-slate-400 mt-1">
                {m.trend}
              </p>
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
