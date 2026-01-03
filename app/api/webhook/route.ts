import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import Decimal from "decimal.js";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover" as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle successful payments
  if (event.type === "payment_intent.succeeded") {
    const session = event.data.object as Stripe.PaymentIntent;

    // Pull the metadata we attached in the checkout route
    const userId = session.metadata?.userId;
    const cartItems = JSON.parse(session.metadata?.cartItems || "[]");
    
    // Suppose cartItems = [{ id: "p1", q: 2 }, { id: "p3", q: 1 }]
const productIds = cartItems.map((item: any) => item.id);

const products = await prisma.product.findMany({
  where: { id: { in: productIds } },
  select: { id: true, price: true }, // get the real price
});


// Map product ID to price for quick lookup
const priceMap = new Map(products.map(p => [p.id, p.price]));

    if (userId) {
      // 1. Create the permanent Order in Prisma
      
    await prisma.order.create({
   data: {
    userId,
    stripeSessionId: session.id,
    totalPrice: new Decimal(
      cartItems.reduce((sum:any, item:any) => sum + (priceMap.get(item.id)?.toNumber() || 0) * item.q, 0)
    ),
    status: "PAID",
    items: {
      create: cartItems.map((item:any) => {
        const price = priceMap.get(item.id)?.toNumber() || 0;
        return {
          productId: item.id,
          variantId: item.variantId || null,
          quantity: Number(item.q),
          unitPrice: new Decimal(price),
          totalPrice: new Decimal(price * item.q),
        };
      }),
    },
  },
});

      const order = await prisma.order.findMany()

      // 2. Clear the User's Cart now that they've paid
      await prisma.cartItem.deleteMany({
        where: { userId },
      });
    }
  }

  return new NextResponse("Success", { status: 200 });
}
