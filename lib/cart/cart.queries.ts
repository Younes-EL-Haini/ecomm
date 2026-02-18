"use server";
import prisma from "@/lib/prisma";
import { CartWithProducts } from "./cart.types";

export async function getMyCart(email: string): Promise<CartWithProducts[]> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      cartItems: {
        orderBy: { createdAt: "asc" },
        include: {
          product: { include: { images: true, title: true } },
          variant: true,
        },
      },
    },
  });

  return (user?.cartItems as CartWithProducts[]) || [];
}