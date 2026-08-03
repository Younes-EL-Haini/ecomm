import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import Decimal from "decimal.js";
import { getResendClient } from "@/lib/resend";
import OrderConfirmationEmail from "@/emails/OrderConfirmation";

// Define shape for lightweight metadata parsed from Stripe
interface MetadataCartItem {
  v: string; // variantId
  q: number; // quantity
}

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20" as any,
  });

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
    console.error("❌ Webhook Signature Verification Failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle successful payments
  if (stripeEvent.type === "payment_intent.succeeded") {
    const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
    const shipping = paymentIntent.shipping;
    const userId = paymentIntent.metadata?.userId;
    const isDirect = paymentIntent.metadata?.isDirect === "true";

    // 1. Get essential items (IDs/Quantities) from metadata
    let rawItems: MetadataCartItem[] = [];
    try {
      rawItems = JSON.parse(paymentIntent.metadata?.cartItems || "[]");
    } catch (err) {
      console.error("❌ Error parsing cartItems metadata:", err);
      return new NextResponse("Invalid cart metadata format", { status: 400 });
    }

    if (!userId || rawItems.length === 0) {
      return new NextResponse("Missing metadata", { status: 400 });
    }

    const existingOrder = await prisma.order.findUnique({
      where: { stripeSessionId: paymentIntent.id },
    });

    if (existingOrder) return new NextResponse("Order exists", { status: 200 });

    // 2. Database Lookup: Fetch full product and variant information using the IDs
    const variantIds = rawItems.map((i) => i.v).filter(Boolean);

    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });

    // Create a lookup map for fast item lookup in Step 3
    const variantMap = new Map(variants.map((v) => [v.id, v]));

    // 3. SECURE DATA RECONSTRUCTION: Rebuild normalized cart items from your DB source of truth
    const cartItems = rawItems
      .map((item) => {
        const variant = variantMap.get(item.v);
        // Safety check if variantId is invalid
        if (!variant) {
          console.error(`VariantId ${item.v} not found in DB`);
          return null;
        }

        // Calculate final secure price from DB
        const basePrice = Number(variant.product.price);
        const delta = Number(variant.priceDelta || 0);
        const finalUnitPrice = basePrice + delta;

        // Collect needed properties for Stock and Resend later
        return {
          productId: variant.productId,
          variantId: variant.id,
          quantity: item.q,
          secureUnitPrice: finalUnitPrice,
          title: variant.product.title,
          // Primary product image or safe placeholder
          image:
            variant.product.images[0]?.url || "https://placehold.co/100x100.png",
          variantStock: variant.stock,
          isDirect: isDirect,
        };
      })
      .filter(Boolean); // Drop null entries

    if (cartItems.length === 0) {
      return new NextResponse("Invalid items in cart metadata", {
        status: 400,
      });
    }

    // Prepare address data, using shipping info provided to Stripe
    const addressData = {
      userId,
      line1: shipping?.address?.line1 || "N/A",
      line2: shipping?.address?.line2 || null,
      city: shipping?.address?.city || "N/A",
      fullName: shipping?.name || "Customer",
      // Best practice: Store phone in shipping address if available
      phone: shipping?.phone || "N/A",
      postalCode: shipping?.address?.postal_code || "N/A",
      country: shipping?.address?.country || "N/A",
      state: shipping?.address?.state || null,
    };

    try {
      // Execute DB actions in a secure Transaction
      await prisma.$transaction(async (tx) => {
        // Create the Shipping Address
        const address = await tx.address.create({
          data: addressData,
        });

        // Map reconstructed data to the prisma OrderItem schema
        const orderItemsData = cartItems.map((item) => ({
          productId: item!.productId, // Prisma requires productId link
          variantId: item!.variantId,
          quantity: item!.quantity,
          // DB fields are Decimal, map correctly
          unitPrice: new Decimal(item!.secureUnitPrice),
          totalPrice: new Decimal(item!.secureUnitPrice * item!.quantity),
        }));

        // Create the PAID Order
        await tx.order.create({
          data: {
            userId,
            stripeSessionId: paymentIntent.id,
            status: "PAID",
            totalPrice: new Decimal(paymentIntent.amount / 100),
            shippingAddressId: address.id,
            items: {
              create: orderItemsData,
            },
          },
        });

        // Secure Stock Management: Update Stock in Transaction
        for (const item of cartItems) {
          if (item && item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } },
            });
          }
        }

        // 4. ONLY clear user cart if NOT a direct buy
        if (!isDirect) {
          await tx.cartItem.deleteMany({ where: { userId } });
        }
      });
    } catch (err) {
      console.error("Prisma transaction error in webhook:", err);
      // Stripe will retry if we return 500
      return new NextResponse("Transaction Failed", { status: 500 });
    }

    // --- SECURE ORDER CONFIRMATION EMAIL LOGIC ---
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      const resendClient = getResendClient();

      if (user?.email && resendClient) {
        // Build emailItems from normalized cartItems, already containing image/title
        const emailItems = cartItems.map((item) => ({
          name: item!.title || "Product",
          q: item!.quantity,
          price: item!.secureUnitPrice || 0,
          image: item!.image || "https://placehold.co/100x100.png",
        }));

        const { data, error } = await resendClient.emails.send({
          from: "Loko Shop <onboarding@resend.dev>",
          to: user.email,
          subject: `Order Confirmation #${paymentIntent.id
            .slice(-8)
            .toUpperCase()}`,
          react: OrderConfirmationEmail({
            orderId: paymentIntent.id,
            customerName: user.name || "Customer",
            total: paymentIntent.amount / 100,
            cartItems: emailItems, // Passing array with image, name, q, price
          }),
        });

        if (error) {
          console.error("Resend API Error in webhook:", error);
        } else {
          console.log("Resend Success: Email sent with secure items list.");
        }
      }
    } catch (error) {
      // Don't crash webhook if email fails, order is secured
      console.error("Logic Error in Webhook Email Block:", error);
    }
  }

  // Acknowledge event to Stripe
  return new NextResponse("Success", { status: 200 });
}