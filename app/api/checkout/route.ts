// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import prisma from "@/lib/prisma";
// import Stripe from "stripe";
// import authOptions from "@/app/auth/authOptions";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-12-15.clover",
// });

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.email) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const { address } = await req.json();
//     if (!address) {
//       return new NextResponse("Missing address", { status: 400 });
//     }
    

//     // 1️⃣ Fetch user + cart from DB
//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email },
//       include: {
//         cartItems: {
//           include: { product: true, variant: true },
//         },
//       },
//     });

//     if (!user) {
//       return new NextResponse("User not found", { status: 404 });
//     }

//     const cartItems = user.cartItems;
//     if (cartItems.length === 0) {
//       return new NextResponse("Cart is empty", { status: 400 });
//     }

//     // 2️⃣ Calculate total securely (base price + variant delta)
//     const totalAmount = cartItems.reduce((acc, item) => {
//     if (!item.variant) {
//       throw new Error("Variant required for purchase");
//     }
//     const price =
//       Number(item.product.price) +
//       Number(item.variant.priceDelta);
//       return acc + price * item.quantity;
//     }, 0);

//     // 3️⃣ Create PaymentIntent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(totalAmount * 100),
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//       metadata: {
//         userId: user.id,
//         cartItems: JSON.stringify(
//           cartItems.map((item) => ({
//             id: item.productId,
//             q: item.quantity,
//             variantId: item.variantId,
//           }))
//         ),
//         shippingAddress: JSON.stringify(address),
//       },
//     });

//     // 4️⃣ Send secret + total to frontend
//     return NextResponse.json({
//       clientSecret: paymentIntent.client_secret,
//       total: totalAmount,
//     });
//   } catch (error: any) {
//     return new NextResponse(error.message, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover", // Use your preferred stable version
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch the user's cart from your DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        cartItems: {
          include: { product: true, variant: true },
        },
      },
    });

    if (!user || user.cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 2. Calculate the total (Price + Variant Delta)
    const totalAmount = user.cartItems.reduce((acc, item) => {
      // Ensuring variant exists as per your schema logic
      if (!item.variant) throw new Error("Variant required"); 
      const price = Number(item.product.price) + Number(item.variant.priceDelta);
      return acc + (price * item.quantity);
    }, 0);

    // 3. Create the Payment Intent
    // We don't need the address here yet; we'll get it at 'confirmation'
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Stripe expects cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: user.id,
        // We store the cart info so the webhook knows what was bought
        cartItems: JSON.stringify(user.cartItems.map(i => ({ id: i.productId, q: i.quantity,variantId: i.variantId })))
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      total: totalAmount,
    });

  } catch (error: any) {
    console.error("Checkout API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}