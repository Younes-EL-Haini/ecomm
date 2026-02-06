import prisma from "@/lib/prisma";
import { OrderStatus } from "@/lib/generated/prisma";
import { LowStockVariant } from "./admin.types";

const REVENUE_STATUSES: OrderStatus[] = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

// Helper to calculate percentage change
function calculateTrend(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export async function getDashboardData(from: Date | undefined, to: Date | undefined) {
  // 1. Setup Date Ranges for Comparison
  const currentTo = to || new Date();
  const currentFrom = from || new Date(0);
  
  // Calculate duration to get the "Previous Period"
  const duration = currentTo.getTime() - currentFrom.getTime();
  const prevFrom = new Date(currentFrom.getTime() - duration);
  const prevTo = new Date(currentFrom.getTime());

  // Fetch everything in parallel
  const [
    ordersCount, 
    prevOrdersCount, // 👈 New
    totalProducts, 
    revenueStats, 
    prevRevenueStats, // 👈 New
    recentOrders, 
    topSoldData,
    pendingCount 
  ] = await Promise.all([
    
    // Current Orders
    prisma.order.count({ where: { createdAt: { gte: currentFrom, lte: currentTo } } }),
    
    // Previous Orders (for Trend)
    prisma.order.count({ where: { createdAt: { gte: prevFrom, lte: prevTo } } }),

    // Total Catalog Size
    prisma.product.count(),

    // Current Revenue
    prisma.order.findMany({
      where: {
        status: { in: REVENUE_STATUSES },
        createdAt: { gte: currentFrom, lte: currentTo },
      },
      select: { totalPrice: true, createdAt: true },
      orderBy: { createdAt: 'asc' }
    }),

    // Previous Revenue (for Trend)
    prisma.order.aggregate({
      where: {
        status: { in: REVENUE_STATUSES },
        createdAt: { gte: prevFrom, lte: prevTo },
      },
      _sum: { totalPrice: true }
    }),

    // Recent Orders
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    }),

    // Top Sold grouping
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: { 
        order: { 
          createdAt: { gte: currentFrom, lte: currentTo },
          status: { in: REVENUE_STATUSES }
        } 
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),

    // Pending Shipment Count
    prisma.order.count({ where: { status: "PAID" } })
  ]);

  // --- Calculations ---

  const totalRevenue = revenueStats.reduce((acc, order) => acc + Number(order.totalPrice), 0);
  const prevTotalRevenue = Number(prevRevenueStats._sum.totalPrice || 0);

  // Dynamic Trends
  const orderTrend = calculateTrend(ordersCount, prevOrdersCount);
  const revenueTrend = calculateTrend(totalRevenue, prevTotalRevenue);

  // Fetch product details for Top Products (same as before)
  const topProductsResults = await Promise.all(
    topSoldData.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, title: true, price: true, images: true }
      });
      if (!product) return null;
      return {
        ...product,
        quantitySold: item._sum.quantity || 0,
      };
    })
  );

  const topProducts = topProductsResults.filter((p): p is NonNullable<typeof p> => p !== null);

  const formattedRecentOrders = recentOrders.map(order => ({
    ...order,
    totalPrice: Number(order.totalPrice),
    createdAt: order.createdAt.toISOString(),
  }));

  // Chart Logic (same as before)
  const salesMap = revenueStats.reduce((acc, order) => {
    const date = order.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + Number(order.totalPrice);
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(salesMap).map(([date, revenue]) => ({ date, revenue }));

  return {
    totalOrders: ordersCount,
    totalProducts,
    totalRevenue,
    orderTrend, // 👈 Added
    revenueTrend, // 👈 Added
    chartData,
    recentOrders: formattedRecentOrders, 
    topProducts,
    pendingCount
  };
}

export async function getLowStockProducts(): Promise<LowStockVariant[]> {
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