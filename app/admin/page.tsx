import { RevenueChart } from "@/components/admin/RevenueChart";
import { getDashboardData } from "@/lib/admin/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, DollarSign, Box } from "lucide-react";

export default async function AdminDashboard() {
  const data = await getDashboardData();

  return (
    <div className="p-8 space-y-8 w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Overview
        </h1>
        <p className="text-gray-500">Last 7 days summary</p>
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
      <div className="rounded-3xl bg-white p-6 shadow-lg border border-gray-100">
        <h4 className="text-sm font-medium text-gray-500 mb-4">
          Revenue (Last 7 Days)
        </h4>
        <RevenueChart data={data.chartData} />
      </div>
    </div>
  );
}
