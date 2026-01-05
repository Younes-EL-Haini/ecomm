import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1️⃣ Fetch user + cart from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        cartItems: {
          include: { product: true, variant: true },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const cartItems = user.cartItems;
    if (cartItems.length === 0) {
      return new NextResponse("Cart is empty", { status: 400 });
    }

    // 2️⃣ Calculate total securely (base price + variant delta)
    const totalAmount = cartItems.reduce((acc, item) => {
      const basePrice = Number(item.product.price);
      const variantDelta = Number(item.variant?.priceDelta || 0);
      return acc + (basePrice + variantDelta) * item.quantity;
    }, 0);

    // 3️⃣ Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "mad",
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: user.id,
        cartItems: JSON.stringify(
          cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            variantId: item.variantId,
          }))
        ),
      },
    });

    // 4️⃣ Send secret + total to frontend
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      total: totalAmount,
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
