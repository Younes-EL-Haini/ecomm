// lib/actions/cart.ts
"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "../generated/prisma";

// Define the shape of our Cart data
export type CartWithProducts = Prisma.CartItemGetPayload<{
  include: {
    product: { include: { images: true } };
    variant: true;
  };
}>;

export async function getMyCart(email: string): Promise<CartWithProducts[]> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      cartItems: {
        orderBy: { createdAt: "asc" },
        include: {
          product: { include: { images: true } },
          variant: true,
        },
      },
    },
  });

  return user?.cartItems || [];
}