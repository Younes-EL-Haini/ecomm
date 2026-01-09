import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import authOptions from "@/app/auth/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    label,
    line1,
    line2,
    city,
    state,
    postalCode,
    country,
    isDefault,
  } = body;

  if (!line1 || !city || !postalCode || !country) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // If setting default → unset previous default
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId: user.id,
      label,
      line1,
      line2,
      city,
      state,
      postalCode,
      country,
      isDefault: Boolean(isDefault),
    },
  });

  return NextResponse.json(address);
}
