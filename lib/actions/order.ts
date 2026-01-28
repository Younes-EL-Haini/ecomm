// lib/actions/order.ts
"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "../generated/prisma";

// Define the Order type with all nested relations for the UI
export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: { include: { images: { take: 1 } } };
        variant: true;
      };
    };
  };
}>;

/**
 * Fetch all orders for a specific user
 */

export async function getMyOrders(email: string) {
  const orders = await prisma.order.findMany({
    where: { user: { email } },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: { include: { images: { take: 1 } } },
          variant: true,
        },
      },
    },
  });

  // Convert Decimals to Numbers before returning to the UI
  return orders.map(order => ({
    ...order,
    totalPrice: order.totalPrice.toNumber(), // Convert Decimal to Number
    items: order.items.map(item => ({
      ...item,
      price: item.totalPrice.toNumber() // Do the same for item prices
    }))
  }));
}

/**
 * Fetch a single order by ID
 */
export async function getOrderById(id: string): Promise<OrderWithRelations | null> {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: true,
        },
      },
    },
  });
}

/**
 * Type for the Admin Order List
 */
export type AdminOrderSummary = Prisma.OrderGetPayload<{
  include: {
    user: true;
    _count: {
      select: { items: true };
    };
  };
}>;

/**
 * Fetch all orders for the admin dashboard
 */
export async function getAdminOrders(): Promise<AdminOrderSummary[]> {
  return await prisma.order.findMany({
    include: {
      user: true,
      _count: {
        select: { items: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAdminOrderDetail(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: true,
        },
      },
      user: true,
      shippingAddress: true,
    },
  });

  if (!order) return null;

  return {
    ...order,
    totalPrice: Number(order.totalPrice),
    items: order.items.map((item) => ({
      ...item,
      totalPrice: Number(item.totalPrice),
      // We explicitly transform the variant here
      variant: item.variant ? {
        ...item.variant,
        priceDelta: item.variant.priceDelta ? Number(item.variant.priceDelta) : 0,
      } : null,
    })),
  };
}

// This helper type will now correctly see 'priceDelta' as a 'number'
export type AdminOrderDetail = Awaited<ReturnType<typeof getAdminOrderDetail>>;
