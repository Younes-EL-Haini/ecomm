import prisma from "@/lib/prisma";

// Add parameters for the date range
export async function getDashboardData(from: Date, to: Date) {
  // Fetch everything in parallel
  const [ordersCount, totalProducts, stats, recentOrders, topProducts] = await Promise.all([
    // Orders count within the specific range
    prisma.order.count({
      where: { createdAt: { gte: from, lte: to } }
    }),
    
    prisma.product.count(),

    // Revenue stats for the chart within the range
    prisma.order.findMany({
      where: {
        status: "PAID",
        createdAt: { gte: from, lte: to },
      },
      select: {
        totalPrice: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' }
    }),

    // Recent Orders (Usually kept as the last 5 overall, regardless of range)
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    }),

    // Top Products based on items sold in that range
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: { order: { createdAt: { gte: from, lte: to } } }, // Filter by range
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 3,
    })
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
    totalOrders: ordersCount,
    totalProducts,
    totalRevenue,
    chartData,
    recentOrders, 
    topProducts
  };
}