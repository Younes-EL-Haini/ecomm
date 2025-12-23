import authOptions from "@/app/auth/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    const session = await getServerSession(authOptions)


  const user = await prisma.user.findUnique({
    where: {
        email: session?.user.email!
    }
  })

   if (!user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }



  const { productId, variantId, quantity = 1 } = await req.json();

  try {
    // This is the "Atomic" way to handle Add to Cart
    const cartItem = await prisma.cartItem.upsert({
      where: {
        // This works because of @@unique constraint
        userId_productId_variantId: {
          userId: user.id,
          productId,
          variantId: variantId || null, // Handle null variants
        },
      },
      update: {
        // Increment the quantity if it already exists
        quantity: { increment: quantity },
      },
      create: {
        userId: user.id,
        productId,
        variantId,
        quantity,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("CART_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }

}