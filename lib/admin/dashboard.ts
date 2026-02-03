import prisma from "@/lib/prisma";

export async function getDashboardData() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Fetch everything in parallel for maximum speed
  const [orders, totalProducts, stats] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.findMany({
      where: {
        status: "PAID",
        createdAt: { gte: sevenDaysAgo },
      },
      select: {
        totalPrice: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' }
    }),
  ]);

  const totalRevenue = stats.reduce((acc, order) => acc + Number(order.totalPrice), 0);

  // Grouping logic for the chart
  const salesMap = stats.reduce((acc, order) => {
    const date = order.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + Number(order.totalPrice);
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(salesMap).map(([date, revenue]) => ({
    date,
    revenue,
  }));

  return {
    totalOrders: orders,
    totalProducts,
    totalRevenue,
    chartData
  };
}