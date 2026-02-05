import { RevenueChart } from "@/components/admin/RevenueChart";
import { getDashboardData, getLowStockProducts } from "@/lib/admin/dashboard";
import { RecentOrders } from "@/components/admin/RecentOrders";
import { getDateRange } from "@/lib/admin/date-utils";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { TopProducts } from "@/components/admin/TopProducts";
import { LowStockAlerts } from "@/components/admin/LowStockAlerts";
import { DashboardMetrics } from "@/components/admin/DashboardMetrics";
import { LogisticsCard } from "@/components/admin/LogisticsCard";

export const dynamic = "force-dynamic";

export default async function AdminDashboard(props: {
  searchParams: Promise<{ range?: string }>;
}) {
  const searchParams = await props.searchParams;
  const range = searchParams?.range || "all-time";
  const { from, to } = getDateRange(range);

  // Parallel data fetching for better performance
  const [data, lowStockData] = await Promise.all([
    getDashboardData(from, to),
    getLowStockProducts(),
  ]);

  return (
    <div className="p-4 md:p-8 space-y-8 w-full bg-gray-50/50 min-h-screen">
      {/* 1. Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Overview
          </h1>
          <p className="text-slate-500 mt-1 uppercase text-[10px] font-bold tracking-[0.2em]">
            {range.replace("-", " ")} Performance
          </p>
        </div>
        <DateRangeFilter />
      </header>

      {/* 2. Key Metrics Row */}
      <DashboardMetrics data={data} range={range} />

      {/* 3. Main Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Analytics */}
        <div className="lg:col-span-8 space-y-6">
          <RevenueChart
            key={JSON.stringify(data.chartData)}
            data={data.chartData}
          />
          <RecentOrders orders={data.recentOrders} />
        </div>

        {/* Right Column: Inventory & Logistics */}
        <div className="lg:col-span-4 space-y-6">
          <LowStockAlerts products={lowStockData} />
          <TopProducts products={data.topProducts} />
          <LogisticsCard pendingCount={data.pendingCount} />
        </div>
      </div>
    </div>
  );
}
