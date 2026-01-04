import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Ensure you have auth set up
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover" as any,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(); 
    if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

    // 1. Fetch the REAL items from your DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        cartItems: { 
          include: { product: true, variant: true } 
        } 
      },
    });

    const cartItems = user?.cartItems || [];
    if (cartItems.length === 0) return new NextResponse("Cart is empty", { status: 400 });

    // 2. Calculate the total server-side (Prevent tampering!)
    const totalAmount = cartItems.reduce((acc, item) => {
      const basePrice = Number(item.product.price);
      const variantDelta = Number(item.variant?.priceDelta || 0);
      return acc + (basePrice + variantDelta) * item.quantity;
    }, 0);

    if (!user) {
  return new NextResponse("User not found in database", { status: 404 });
}
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(totalAmount * 100),
  currency: "usd",
  automatic_payment_methods: { enabled: true },
  metadata: {
    userId: user.id,
    cartItems: JSON.stringify(
      cartItems.map((item) => ({
        id: item.product.id,
        q: item.quantity,
        variantId: item.variantId || null, // ✅ include variantId here
      }))
    ),
  },
});
    // 4. Send BOTH the secret AND the real total back to the UI
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      total: totalAmount 
    });

  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}