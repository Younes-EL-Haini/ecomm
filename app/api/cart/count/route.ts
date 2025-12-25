// app/api/cart/count/route.ts
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ count: 0 });

  const count = await prisma.cartItem.count({
    where: { user: { email: session.user.email } },
  });

  return NextResponse.json({ count });
}
