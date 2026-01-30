import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import Decimal from "decimal.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover" as any,
});

class OutOfStockError extends Error {}


export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let stripeEvent: Stripe.Event;

  // 1️⃣ Verify webhook
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 2️⃣ Handle successful payment
  if (stripeEvent.type === "payment_intent.succeeded") {
    const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;

    const shipping = paymentIntent.shipping;

    const userId = paymentIntent.metadata?.userId;
    const cartItems: Array<{
      id: string;
      q: number;
      variantId?: string | null;
    }> = JSON.parse(paymentIntent.metadata?.cartItems || "[]");

    if (!userId || cartItems.length === 0) {
      return new NextResponse("Missing metadata", { status: 400 });
    }


    // 3️⃣ Check if order already exists (idempotency)
    const existingOrder = await prisma.order.findUnique({
      where: { stripeSessionId: paymentIntent.id },
    });

    if (existingOrder) {
      // Order already processed, return success
      return new NextResponse("Order already exists", { status: 200 });
    }

    // 4️⃣ Fetch products & variants
    const productIds = cartItems.map(i => i.id);
    const variantIds = cartItems
      .map(i => i.variantId)
      .filter(Boolean) as string[];

    const [products, variants] = await Promise.all([
      prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, price: true },
      }),
      variantIds.length
        ? prisma.productVariant.findMany({
            where: { id: { in: variantIds } },
            select: { id: true },
          })
        : Promise.resolve([]),
    ]);

    const priceMap = new Map(products.map(p => [p.id, p.price]));
    const validVariantIds = new Set(variants.map(v => v.id));

    // 5️⃣ Compute total order price
    const totalOrderPrice = cartItems.reduce((sum, item) => {
      const price = priceMap.get(item.id)?.toNumber() || 0;
      return sum + price * item.q;
    }, 0);

    // 6️⃣ Transaction: create order + update stock + clear cart
    try {
    await prisma.$transaction(async (tx) => {
      const address = await prisma.address.create({
  data: {
    userId,
    line1: shipping?.address?.line1 || "N/A",
    city: shipping?.address?.city || "N/A",
    fullName: shipping?.name,
    postalCode: shipping?.address?.postal_code || "ed",
    country: shipping?.address?.country || "wd"
  },
});
      // Create order
      await tx.order.create({
        data: {
          userId,
          stripeSessionId: paymentIntent.id,
          status: "PAID",
          totalPrice: new Decimal(totalOrderPrice),
          shippingAddressId: address.id,
          items: {
            create: cartItems.map(item => {
              const price = priceMap.get(item.id)?.toNumber() || 0;
              return {
                productId: item.id,
                variantId:
                  item.variantId && validVariantIds.has(item.variantId)
                    ? item.variantId
                    : null,
                quantity: item.q,
                unitPrice: new Decimal(price),
                totalPrice: new Decimal(price * item.q),
              };
            }),
          },
        },
      });

      // Decrement product stock
for (const item of cartItems) {
  // Variant stock has priority
  if (item.variantId && validVariantIds.has(item.variantId)) {
    const variant = await tx.productVariant.findUnique({
      where: { id: item.variantId },
      select: { stock: true },
    });

    if (!variant || variant.stock < item.q) {
      throw new OutOfStockError("Variant out of stock");
    }

    await tx.productVariant.update({
      where: { id: item.variantId },
      data: { stock: { decrement: item.q } },
    });
  }
}


      // Clear user's cart
      await tx.cartItem.deleteMany({
        where: { userId },
      });
    });
    } catch (err) {
  if (err instanceof OutOfStockError) {
    // 🔁 REFUND user
    await stripe.refunds.create({
      payment_intent: paymentIntent.id,
    });

    return new NextResponse("Out of stock, payment refunded", {
      status: 409,
    });
  }

  throw err;
}
  }

  return new NextResponse("Success", { status: 200 });
}
