"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "../generated/prisma";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    
    revalidatePath("/admin/orders");
    revalidatePath("/account/orders");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update status" };
  }
}

// Add more mutations here (cancelOrder, deleteOrder, etc.)