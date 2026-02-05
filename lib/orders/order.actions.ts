"use server";

import prisma from "@/lib/prisma";
import { OrderStatus } from "@/lib/generated/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { 
          items: true // Make sure OrderItem includes the productVariantId
        },
      });

      if (!order) throw new Error("Order not found");

      const oldStatus = order.status;
      const inactiveStates: OrderStatus[] = ["CANCELLED", "REFUNDED"];
      
      const isGainingStock = !inactiveStates.includes(oldStatus) && inactiveStates.includes(newStatus);
      const isLosingStock = inactiveStates.includes(oldStatus) && !inactiveStates.includes(newStatus);

      // --- 1. RESTOCKING (Adding back to variant) ---
      if (isGainingStock) {
        for (const item of order.items) {
          if (!item.variantId) continue; // Safety check
          const variant = await tx.productVariant.findUnique({
    where: { id: item.variantId }
  });

  // 2. If it doesn't exist, log it and skip to avoid crashing the whole update
  if (!variant) {
    console.error(`❌ CRITICAL: Variant ${item.variantId} not found in DB. Skipping stock update.`);
    continue; 
  }

          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      // --- 2. REDUCING (Taking from variant) ---
      if (isLosingStock) {
        for (const item of order.items) {
          if (!item.variantId) continue;

          // Check if the specific variant has enough stock
          const variant = await tx.productVariant.findUnique({ 
            where: { id: item.variantId } 
          });

          if (!variant) {
            console.error(`❌ Variant ${item.variantId} not found.`);
            continue; 
          }

          if (!variant || variant.stock < item.quantity) {
             throw new Error(`Insufficient stock for ${variant?.name || "variant"}`);
          }

          

          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      // --- 3. Update Order Status ---
      return await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
      });
    });

    const plainResult = JSON.parse(JSON.stringify(result));

    revalidatePath("/admin");
    return { success: true, data: plainResult };
  } catch (error: any) {
    console.error("Update Error:", error.message);
    return { success: false, message: error.message || "Update failed" };
  }
}