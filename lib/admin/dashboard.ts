import prisma from "@/lib/prisma";

export async function getDashboardData() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Fetch everything in parallel for maximum speed
  const [orders, totalProducts, stats, recentOrders, topProducts] = await Promise.all([
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
    // New: Recent Orders
  prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } } }
  }),

  // New: Top Products (Simplified logic)
  prisma.orderItem.groupBy({
    by: ['productId'],
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
    totalOrders: orders,
    totalProducts,
    totalRevenue,
    chartData,
    recentOrders, 
    topProducts
  };
}