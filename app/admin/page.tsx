import { RevenueChart } from "@/components/admin/RevenueChart";
import { getDashboardData } from "@/lib/admin/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, DollarSign, Box, ArrowUpRight } from "lucide-react";
import { RecentOrders } from "@/components/admin/RecentOrders";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDateRange } from "@/lib/admin/date-utils";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { TopProducts } from "@/components/admin/TopProducts";

export const dynamic = "force-dynamic";

export default async function AdminDashboard(props: any) {
  const searchParams = await props.searchParams;
  const range = await searchParams?.range;
  const { from, to } = getDateRange(range);

  // 1. data now includes 'pendingCount'
  const data = await getDashboardData(from, to);

  return (
    <div className="p-8 space-y-8 w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Overview
          </h1>
          <p className="text-gray-500 mt-1 uppercase text-xs font-semibold tracking-widest">
            {range?.replace("-", " ") || "Last 7 days"} summary
          </p>
        </div>
        <DateRangeFilter />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Orders */}
        <Card className="rounded-3xl p-6 bg-linear-to-r from-indigo-50 to-white shadow-lg border border-gray-100">
          <CardHeader className="flex items-center gap-3 pb-2">
            <ShoppingCart className="w-6 h-6 text-indigo-500" />

            <CardTitle className="text-sm font-medium text-gray-500">
              Total Orders
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900">
              {data.totalOrders}
            </div>
            {/* Optional trend */}
            <p className="text-sm text-gray-400 mt-1">+8% from last week</p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="rounded-3xl p-6 bg-linear-to-r from-green-50 to-white shadow-lg border border-gray-100">
          <CardHeader className="flex items-center gap-3 pb-2">
            <DollarSign className="w-6 h-6 text-green-500" />

            <CardTitle className="text-sm font-medium text-gray-500">
              Total Revenue
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900">
              $
              {data.totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-sm text-gray-400 mt-1">+12% from last week</p>
          </CardContent>
        </Card>

        {/* Active Products */}
        <Card className="rounded-3xl p-6 bg-linear-to-r from-yellow-50 to-white shadow-lg border border-gray-100">
          <CardHeader className="flex items-center gap-3 pb-2">
            <Box className="w-6 h-6 text-yellow-500" />

            <CardTitle className="text-sm font-medium text-gray-500">
              Active Products
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900">
              {data.totalProducts}
            </div>
            <p className="text-sm text-gray-400 mt-1">Stable</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chart takes 2 columns */}
        <div className="lg:col-span-2">
          <RevenueChart
            key={JSON.stringify(data.chartData)}
            data={data.chartData}
          />
        </div>

        {/* Right: Stacked Cards (Top Products + Action Card) */}
        <div className="flex flex-col gap-6">
          <TopProducts products={data.topProducts} />

          {/* Dynamic "Black Card" */}
          <div className="bg-zinc-900 rounded-4xl p-8 text-white flex flex-col justify-between h-full min-h-[200px]">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white">
                  Loko Shop Admin
                </h3>
                <ArrowUpRight className="text-zinc-500 w-5 h-5" />
              </div>

              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                {data.pendingCount > 0
                  ? `There are ${data.pendingCount} orders marked as PAID that need fulfillment.`
                  : "You're all caught up! No orders are currently waiting to be shipped."}
              </p>
            </div>

            <Button
              asChild
              className="bg-white text-black rounded-xl py-6 font-bold hover:bg-zinc-200 transition-all mt-6"
            >
              <Link href="/admin/orders?status=PAID">Manage Logistics</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Table */}
      <RecentOrders orders={data.recentOrders} />
    </div>
  );
}
