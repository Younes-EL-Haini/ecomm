import prisma from "@/lib/prisma";
import { UserContextSummary } from "./chat.types";

export async function getUserContext(userId: string): Promise<UserContextSummary> {
  // Fetch everything we need in parallel to maximize query performance
  const [user, cartItems, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    }),
    prisma.cartItem.findMany({
      where: { userId },
      include: { product: { select: { title: true, price: true } } }
    }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { items: { include: { product: { select: { title: true } } } } }
    })
  ]);

  // 1. Format Cart Context
  const cartSummary = cartItems.length > 0
    ? cartItems.map(item => `- ${item.product.title} (Qty: ${item.quantity}, Price: $${item.product.price})`).join("\n")
    : "The customer's shopping cart is currently empty.";

  // 2. Format Order Context
  const recentOrdersSummary = orders.length > 0
    ? orders.map(order => `- Order ID: ${order.id}, Status: ${order.status}, Total: $${order.totalPrice}, Items: ${order.items.map(i => i.product.title).join(", ")}`).join("\n")
    : "No past orders found for this customer account.";

  return {
    customerName: user?.name || "Customer",
    cartSummary,
    recentOrdersSummary
  };
}