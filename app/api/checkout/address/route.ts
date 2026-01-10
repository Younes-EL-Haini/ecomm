import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { line1, city, postalCode, country } = body;

    if (!line1 || !city || !postalCode || !country) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // 🔑 DO NOT SAVE
    // Just validate and return

    return NextResponse.json({
      line1,
      city,
      postalCode,
      country,
    });
  } catch {
    return new NextResponse("Server error", { status: 500 });
  }
}
