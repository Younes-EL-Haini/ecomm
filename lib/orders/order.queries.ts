"use server";

import prisma from "@/lib/prisma";
import { serializeOrder, serializeAdminDetail } from "./order.serializer";
import { SerializedOrder, AdminOrderSummary, OrderWithRelations } from "./order.types";

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

export async function getAdminOrders(): Promise<AdminOrderSummary[]> {
  return await prisma.order.findMany({
    include: {
      user: true,
      _count: { select: { items: true } },
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

  return serializeAdminDetail(order);
}
