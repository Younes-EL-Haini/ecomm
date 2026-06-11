import prisma from "@/lib/prisma";
import { UserContextSummary, SearchProductsArgs } from "./chat.types";

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

/**
 * Executed dynamically by Llama 3.3 to search product catalog inventory.
 */
export async function searchProducts({ query, categorySlug, maxPrice }: SearchProductsArgs) {
  try {
    // Sanitize — treat empty strings as undefined
    const cleanQuery = query?.trim() || undefined;
    const cleanCategory = categorySlug?.trim() || undefined;
    const cleanPrice = typeof maxPrice === "number" && maxPrice > 0 ? maxPrice : undefined;

    const products = await prisma.product.findMany({
      where: {
        isArchived: false,
        isPublished: true,
        AND: [
          cleanQuery ? {
            OR: [
              { title: { contains: cleanQuery, mode: "insensitive" } },
              { description: { contains: cleanQuery, mode: "insensitive" } },
            ],
          } : {},
          cleanCategory ? { category: { slug: cleanCategory } } : {},
          cleanPrice ? { price: { lte: cleanPrice } } : {},
        ],
      },
      take: 4,
      select: {
        title: true,
        price: true,
        slug: true,
        description: true,
        inventory: {
          select: { quantity: true },
        },
        variants: {
          select: { stock: true },
        },
      },
    });

    if (products.length === 0) {
      return {
        found: false,
        message: "No matching products found."
      };
    }

    return products.map((p) => {
      const baseStock = p.inventory?.quantity ?? 0;
      const variantStock = p.variants.length > 0
        ? p.variants.reduce((sum, v) => sum + v.stock, 0)
        : 0;
      const totalStock = baseStock + variantStock;

      return {
        name: p.title,
        price: `$${p.price}`,
        link: `/products/${p.slug}`,
        description: p.description.substring(0, 80) + "...",
        stockStatus: totalStock > 0 ? "In Stock" : "Out of Stock",
        availableUnits: totalStock,
      };
    });

  } catch (error) {
    console.error("Product search failed:", error);
    return [];
  }
}