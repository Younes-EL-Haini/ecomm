// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-12-15.clover", 
// });

// export async function POST(req: Request) {
//   try {
//     const { cartItems } = await req.json();

//     if (!cartItems || cartItems.length === 0) {
//       return new NextResponse("No items in cart", { status: 400 });
//     }

//     const line_items = cartItems.map((item: any) => {
//       // Calculate final price: Base Price + Variant Price Delta (if it exists)
//       const basePrice = Number(item.product.price);
//       const delta = Number(item.variant?.priceDelta || 0);
//       const unitAmount = Math.round((basePrice + delta) * 100);

//       return {
//         price_data: {
//           currency: "mad",
//           product_data: {
//             name: `${item.product.title}${item.variant?.color ? ` (${item.variant.color})` : ""}`,
//             images: item.product.images[0]?.url ? [item.product.images[0].url] : [],
//           },
//           unit_amount: unitAmount, // Stripe uses santimat (cents)
//         },
//         quantity: item.quantity,
//       };
//     });

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items,
//       mode: "payment",
//       success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
//       // This metadata is what you will use in the Webhook to fulfill the order
//       metadata: {
//         userId: cartItems[0].userId, // Handy to know who bought it
//         cartItems: JSON.stringify(cartItems.map((i: any) => ({
//           pId: i.product.id,
//           vId: i.variant?.id || null,
//           q: i.quantity
//         }))),
//       },
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (error: any) {
//     console.error("STRIPE_ERROR:", error.message);
//     return new NextResponse(error.message, { status: 500 });
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)


// export async function POST(request: NextRequest){
//     try {
//         const { amount } = await request.json()
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount:amount,
//             currency: "usd",
//             automatic_payment_methods: {enabled: true}
//         })

//         return NextResponse.json({clientSecret: paymentIntent.client_secret})
//     } catch (error) {
//         console.error("Internal Error:",error)
//         return NextResponse.json(
//             { error: `Internal Server Error: ${error}`},
//             { status: 500 }
//         )
//     }
// }

// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth"; // Or your auth library
// import prisma from "@/lib/prisma";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-12-15.clover" as any,
// });

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(); // Get the logged-in user
//     if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

//     // 1. Fetch cart from DB to calculate REAL price
//     const userWithCart = await prisma.user.findUnique({
//       where: { email: session.user.email },
//       include: { cartItems: { include: { product: true, variant: true } } },
//     });

//     if (!userWithCart?.cartItems.length) {
//       return new NextResponse("Cart is empty", { status: 400 });
//     }

//     // 2. Calculate total in "subcurrency" (cents/santimat)
//     const totalAmount = userWithCart.cartItems.reduce((acc, item) => {
//       const price = Number(item.product.price) + Number(item.variant?.priceDelta || 0);
//       return acc + price * item.quantity;
//     }, 0);

//     const amountInCents = Math.round(totalAmount * 100);

//     // 3. Create Intent with METADATA (so we know what was bought later)
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amountInCents,
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//       metadata: {
//         userId: userWithCart.id,
//         // Store simple item list as a string for the webhook
//         cartItems: JSON.stringify(userWithCart.cartItems.map(i => ({ id: i.productId, q: i.quantity })))
//       },
//     });

//     return NextResponse.json({ 
//         clientSecret: paymentIntent.client_secret,
//         amount: totalAmount // Send back to display on UI
//     });
//   } catch (error) {
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

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

    // 3. Create Stripe Payment Intent
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(totalAmount * 100), // Convert to cents/santimat
    //   currency: "usd",
    //   automatic_payment_methods: { enabled: true },
    // });

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