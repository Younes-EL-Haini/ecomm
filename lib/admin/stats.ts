// lib/admin/stats.ts
import prisma from "@/lib/prisma";

export async function getSalesData() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const orders = await prisma.order.findMany({
    where: {
      status: "PAID",
      createdAt: { gte: sevenDaysAgo },
    },
    select: {
      totalPrice: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' }
  });

  // Grouping logic: Turn raw orders into { date: string, revenue: number }
  const salesMap = orders.reduce((acc, order) => {
    const date = order.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + Number(order.totalPrice);
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(salesMap).map(([date, revenue]) => ({
    date,
    revenue,
  }));
}