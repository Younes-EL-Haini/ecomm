import { RevenueChart } from "@/components/admin/RevenueChart";
import { getDashboardData } from "@/lib/admin/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, DollarSign, Box } from "lucide-react";
import { RecentOrders } from "@/components/admin/RecentOrders";
import { Button } from "@/components/ui/button";
export const dynamic = "force-dynamic";
import { getDateRange } from "@/lib/admin/date-utils"; // Use the helper I gave you earlier
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";

export default async function AdminDashboard(props: any) {
  // Convert the URL string (today, last7, etc) into actual Date objects
  const searchParams = await props.searchParams;
  const range = await searchParams?.range;
  const { from, to } = getDateRange(range);

  // Fetch the dynamic data
  const data = await getDashboardData(from, to);

  console.log("--- DEBUG START ---");
  console.log("URL Range String:", range);
  console.log("Date From:", from.toISOString());
  console.log("Date To:", to.toISOString());
  console.log("Total Revenue:", data.totalRevenue);
  console.log("--- DEBUG END ---");

  return (
    <div className="p-8 space-y-8 w-full bg-gray-50 min-h-screen">
      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Overview
        </h1>
        <p className="text-gray-500">{range || "Last 7 days"} summary</p>
      </div>
      {/* Key Metrics */}

      {/* We will add the DateRangeFilter component here later */}
      <DateRangeFilter />

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
              ${data.totalRevenue.toFixed(2)}
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
      {/* Revenue Chart */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart takes up 2 columns */}

        <div className="lg:col-span-2">
          <RevenueChart
            key={JSON.stringify(data.chartData)}
            data={data.chartData}
          />
        </div>
        {/* Small "Info Card" for extra polish */}

        <div className="bg-zinc-900 rounded-4xl p-8 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold">Loko Shop Admin</h3>

            <p className="text-zinc-400 text-sm mt-2">
              You have 4 orders pending shipment today.
            </p>
          </div>

          <Button className="bg-white text-black rounded-xl py-3 font-bold hover:bg-zinc-200 transition-all">
            Manage Logistics
          </Button>
        </div>
      </div>
      {/* Bottom Row - Full Width Table */}
      <RecentOrders orders={data.recentOrders} />
    </div>
  );
}
