import prisma from "@/lib/prisma";

// Add parameters for the date range
export async function getDashboardData(from: Date, to: Date) {
  // Fetch everything in parallel
  const [ordersCount, totalProducts, stats, recentOrders, topSoldData] = await Promise.all([
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
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: { order: { createdAt: { gte: from, lte: to } } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    })
  ]);
  const topProductsResults = await Promise.all(
  topSoldData.map(async (item) => {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: {
        id: true,
        title: true,
        price: true,
        images: true, 
      }
    });
    
    // If the product was deleted but stays in order history, handle the null
    if (!product) return null;

    return {
      id: product.id,
      title: product.title,
      price: product.price,
      images: product.images,
      quantitySold: item._sum.quantity || 0,
    };
  })
);

// Filter out any nulls to ensure the array only contains valid objects
const topProducts = topProductsResults.filter((p): p is NonNullable<typeof p> => p !== null);

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