// lib/actions/product.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string; // From a <select> dropdown
  
  // Get all image URLs from the form
  // We expect fields named "images" in the form
  const imageUrls = formData.getAll("images") as string[];

  const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  await prisma.product.create({
    data: {
      title,
      description,
      price,
      slug,             // Added this
      category: {
        connect: { id: categoryId } 
      },
      images: {
        create: imageUrls
          .filter(url => url.trim() !== "") // Remove empty strings
          .map((url,index) => ({
            url: url,
            position: index,
          })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}