import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import Decimal from "decimal.js";
import { resend } from "@/lib/resend";
import { OrderConfirmationEmail } from "@/components/emails/OrderConfirmation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

class OutOfStockError extends Error {}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (stripeEvent.type === "payment_intent.succeeded") {
    const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
    const shipping = paymentIntent.shipping;
    const userId = paymentIntent.metadata?.userId;
    const isDirect = paymentIntent.metadata?.isDirect === "true";

    // 1. Get items from metadata
    const rawItems = JSON.parse(paymentIntent.metadata?.cartItems || "[]");
    
    // 2. Normalize items: Ensure every item has a productId even if it came from a direct variant buy
    const cartItems = await Promise.all(rawItems.map(async (item: any) => {
      if (item.variantId && !item.id) {
        // If we only have variantId (Direct Buy), find the productId
        const v = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          select: { productId: true }
        });
        return { ...item, id: v?.productId };
      }
      return item;
    }));

    if (!userId || cartItems.length === 0) {
      return new NextResponse("Missing metadata", { status: 400 });
    }

    const existingOrder = await prisma.order.findUnique({
      where: { stripeSessionId: paymentIntent.id },
    });

    if (existingOrder) return new NextResponse("Order exists", { status: 200 });

    // 3. Filter out undefined IDs before Prisma call
    const productIds = cartItems.map(i => i.id).filter(Boolean) as string[];
    const variantIds = cartItems.map(i => i.variantId).filter(Boolean) as string[];

    const [products, variants] = await Promise.all([
      prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, price: true },
      }),
      variantIds.length
        ? prisma.productVariant.findMany({
            where: { id: { in: variantIds } },
            select: { id: true, stock: true },
          })
        : Promise.resolve([]),
    ]);

    const priceMap = new Map(products.map(p => [p.id, p.price]));
    const validVariantIds = new Set(variants.map(v => v.id));

    try {
      await prisma.$transaction(async (tx) => {
        // Create Address
        const address = await tx.address.create({
          data: {
            userId,
            line1: shipping?.address?.line1 || "N/A",
            city: shipping?.address?.city || "N/A",
            fullName: shipping?.name || "Customer",
            postalCode: shipping?.address?.postal_code || "N/A",
            country: shipping?.address?.country || "N/A"
          },
        });

        // Create Order
        await tx.order.create({
          data: {
            userId,
            stripeSessionId: paymentIntent.id,
            status: "PAID",
            totalPrice: new Decimal(paymentIntent.amount / 100),
            shippingAddressId: address.id,
            items: {
              create: cartItems.map(item => {
                const price = priceMap.get(item.id)?.toNumber() || 0;
                return {
                  productId: item.id,
                  variantId: item.variantId,
                  quantity: item.q,
                  unitPrice: new Decimal(price),
                  totalPrice: new Decimal(price * item.q),
                };
              }),
            },
          },
        });

        // Update Stock
        for (const item of cartItems) {
          if (item.variantId && validVariantIds.has(item.variantId)) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.q } },
            });
          }
        }

        // 4. ONLY clear cart if NOT a direct buy
        if (!isDirect) {
          await tx.cartItem.deleteMany({ where: { userId } });
        }
      });
    } catch (err) {
      console.error("Transaction Error:", err);
      return new NextResponse("Transaction Failed", { status: 500 });
    }
    // ... inside your webhook after the transaction
try {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true }
  });

  console.log("DEBUG: Attempting to send email to user:", user?.email);

  if (user?.email) {
    const { data, error } = await resend.emails.send({
      from: 'Store <onboarding@resend.dev>',
      // FOR TESTING: Hardcode the email you use to log into Resend here
      to: user.email, 
      subject: 'Order Confirmation TEST',
      react: OrderConfirmationEmail({
        orderId: paymentIntent.id,
        customerName: user.name || 'Customer',
        total: paymentIntent.amount / 100
      }),
    });

    if (error) {
      console.error("Resend API Error:", error);
    } else {
      console.log("Resend Success Data:", data);
    }
  } else {
    console.log("DEBUG: No user email found in DB for ID:", userId);
  }
} catch (error) {
  console.error("Logic Error in Email Block:", error);
}
  }

  return new NextResponse("Success", { status: 200 });
}