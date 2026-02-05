import prisma from "@/lib/prisma";
import { OrderStatus } from "@/lib/generated/prisma";

// Define what statuses actually count as "Money in the Bank"
const REVENUE_STATUSES: OrderStatus[] = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

export async function getDashboardData(from: Date | undefined, to: Date | undefined) {
  // Fetch everything in parallel for maximum speed
  const [
    ordersCount, 
    totalProducts, 
    revenueStats, 
    recentOrders, 
    topSoldData,
    pendingCount // 👈 New addition for your "Tasks" card
  ] = await Promise.all([
    
    // 1. Total Orders in range
    prisma.order.count({
      where: { createdAt: { gte: from, lte: to } }
    }),
    
    // 2. Total Catalog Size
    prisma.product.count(),

    // 3. Revenue stats (FILTERED to exclude cancelled/refunded)
    prisma.order.findMany({
      where: {
        status: { in: REVENUE_STATUSES },
        createdAt: { gte: from, lte: to },
      },
      select: {
        totalPrice: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' }
    }),

    // 4. Recent Orders
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    }),

    // 5. Top Sold grouping
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: { 
        order: { 
          createdAt: { gte: from, lte: to },
          status: { in: REVENUE_STATUSES } // Only count items from successful orders
        } 
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),

    // 6. Pending Shipment Count (PAID but not yet sent)
    prisma.order.count({
      where: { status: "PAID" } 
    })
  ]);

  // Fetch product details for Top Products
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

  const topProducts = topProductsResults.filter((p): p is NonNullable<typeof p> => p !== null);

  const formattedRecentOrders = recentOrders.map(order => ({
    ...order,
    totalPrice: Number(order.totalPrice), // 👈 Convert Decimal to Number here
    createdAt: order.createdAt.toISOString(), // Optional: ensure dates are strings
  }));

  // Calculate Total Revenue using the filtered stats
  const totalRevenue = revenueStats.reduce((acc, order) => acc + Number(order.totalPrice), 0);

  // Grouping logic for the chart
  const salesMap = revenueStats.reduce((acc, order) => {
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
    recentOrders: formattedRecentOrders, 
    topProducts,
    pendingCount // 👈 Return this to your page
  };
}

export async function getLowStockProducts() {
  return await prisma.productVariant.findMany({
    where: {
      stock: {
        lt: 10, // "lt" means less than
      },
    },
    include: {
      product: {
        select: {
          title: true,
          images: true,
        },
      },
    },
    orderBy: {
      stock: 'asc', // Show the most urgent ones first
    },
    take: 5, // Just the top 5 most urgent
  });
}