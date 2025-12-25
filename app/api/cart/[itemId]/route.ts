import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ itemId: string }> } // Define as Promise
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Await the params
    const { itemId } = await params;

    // 2. Get the body
    const { quantity } = await req.json();

    // 3. Update in Prisma
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: Math.max(1, quantity) },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("PATCH_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ itemId: string }> } // Define as Promise
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { itemId } = await params;

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}