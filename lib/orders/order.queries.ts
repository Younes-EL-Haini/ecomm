"use server";

import prisma from "@/lib/prisma";
import { serializeOrder, serializeAdminDetail } from "./order.serializer";
import { SerializedOrder, AdminOrderSummary, OrderWithRelations, AdminOrderDetail } from "./order.types";

export async function getMyOrders(email: string): Promise<SerializedOrder[]> {
  const orders = await prisma.order.findMany({
    where: { user: { email } },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: true,
        },
      },
    },
  });

  return orders.map(serializeOrder);
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

export async function getAdminOrders(filters?: { from?: Date | undefined; to?: Date | undefined; search?: string; }) {
  return await prisma.order.findMany({
    where: {
      ...(filters?.from || filters?.to ? {
        createdAt: {
          ...(filters.from && { gte: filters.from }),
          ...(filters.to && { lte: filters.to }),
        }
      } : {}),
      ...(filters?.search ? {
        OR: [
          { id: { contains: filters.search, mode: 'insensitive' } },
          { user: { name: { contains: filters.search, mode: 'insensitive' } } },
          { user: { email: { contains: filters.search, mode: 'insensitive' } } },
        ]
      } : {}),
    },
    include: {
      user: true,
      _count: { select: { items: true } }
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminCustomers(searchTerm?: string) {
  return await prisma.user.findMany({
    where: {
      ...(searchTerm
        ? {
            OR: [
              { name: { contains: searchTerm, mode: "insensitive" } },
              { email: { contains: searchTerm, mode: "insensitive" } },
              { id: { contains: searchTerm, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      orders: {
        select: {
          totalPrice: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
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
    totalPrice: order.totalPrice.toNumber(),
    items: order.items.map((item) => ({
      ...item,
      price: item.product.price.toNumber(),
      totalPrice: (item.product.price.toNumber() * item.quantity), 
      variant: item.variant ? {
        ...item.variant,
        priceDelta: item.variant.priceDelta ? item.variant.priceDelta.toNumber() : 0,
      } : null,
    })),
  } as AdminOrderDetail; 
}
