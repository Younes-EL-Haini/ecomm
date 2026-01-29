"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

export async function deleteAddress(addressId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.address.delete({
    where: { id: addressId },
  });

  revalidatePath("/account/addresses");
}

export async function setDefaultAddress(addressId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  await prisma.$transaction([
    prisma.address.updateMany({
      where: { user: { email: session.user.email } },
      data: { isDefault: false },
    }),
    prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    }),
  ]);

  revalidatePath("/account/addresses");
}