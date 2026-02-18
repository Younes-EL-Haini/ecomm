import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { CheckoutUIItem, CheckoutUIItemSchema } from "@/lib/cart";


export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover" as any,
  });

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const isDirect = searchParams.get("direct") === "true";
    
    // Safely parse body
    let body: any = {};
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }

    let checkoutItems: CheckoutUIItem[] = [];
    let userId = "";

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cartItems: { include: { product: { include: { images: true } }, variant: true } } }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    userId = user.id;

    if (isDirect) {
  // --- BUY IT NOW LOGIC ---
  const { variantId, quantity } = body;

  if (!variantId)
    return NextResponse.json({ error: "Variant ID missing" }, { status: 400 });

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: { include: { images: true } } },
  });

  if (!variant)
    return NextResponse.json({ error: "Variant not found" }, { status: 404 });

  checkoutItems.push({
    variantId: variant.id,
    quantity: Number(quantity) || 1,
    price: Number(variant.product.price) + Number(variant.priceDelta || 0),
    title: variant.product.title,
    image: variant.product.images[0]?.url || null,
    variantName: `${variant.color} / ${variant.size}`,
  });
} else {
  // --- NORMAL CART LOGIC ---
  if (user.cartItems.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  checkoutItems = user.cartItems.map((item) => ({
    variantId: item.variantId!,
    quantity: item.quantity,
    price:
      Number(item.product.price) +
      Number(item.variant?.priceDelta || 0),
    title: item.product.title,
    image: item.product.images[0]?.url || null,
    variantName: `${item.variant?.color} / ${item.variant?.size}`,
  }));
}


    const totalAmount = checkoutItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    if (checkoutItems.length === 0 || totalAmount <= 0) {
  return NextResponse.json(
    { error: "No items to checkout" },
    { status: 400 }
  );
}
    const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(totalAmount * 100),
  currency: "usd",
  automatic_payment_methods: { enabled: true },
  metadata: {
    userId: userId,
    isDirect: isDirect ? "true" : "false",
    // MODIFIED THIS LINE BELOW:
    cartItems: JSON.stringify(checkoutItems.map(i => ({
      variantId: i.variantId,
      quantity: i.quantity,   
      title: i.title,     
      image: i.image,     
      variantName: i.variantName,
      price: i.price          
    })))
  },
});

    const safeItems = CheckoutUIItemSchema.array().parse(checkoutItems);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderSummary: {
        items: safeItems,
        subtotal: totalAmount
      }
    });
  } catch (error: any) {
    console.error("STRIPE_API_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}