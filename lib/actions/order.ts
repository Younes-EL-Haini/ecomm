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
export async function getMyOrders(email: string): Promise<OrderWithRelations[]> {
  return await prisma.order.findMany({
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