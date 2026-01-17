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
  const isPublished = formData.get("isPublished") === "on";
  const featured = formData.get("featured") === "on";
  
  // Get all image URLs from the form
  // We expect fields named "images" in the form
  const imageUrls = formData.getAll("images") as string[];

  const rawSlug = formData.get("slug") as string;

  const stock = parseInt(formData.get("variantStock") as string) || 0;
  const priceDelta = parseFloat(formData.get("variantPriceDelta") as string) || 0;
  const size = formData.get("variantSize") as string;
  const color = formData.get("variantColor") as string;

  // 1. Create a Prefix (First 3 letters of Title, uppercase)
  // e.g., "Midnight Shoes" -> "MID"
  const prefix = title.substring(0, 3).toUpperCase();

  // 2. Clean up Color (First 3 letters) 
  // e.g., "Red" -> "RED"
  const colorCode = color ? color.substring(0, 3).toUpperCase() : "000";

  // 3. Assemble the Smart SKU
  // Result: MID-RED-L
  const smartSku = `${prefix}-${colorCode}-${size || 'UNI'}`;

  // 1. Generate clean base slug (removes special characters/spaces)
  let slug = (rawSlug || title)
    .toLowerCase()
    .replace(/\s+/g, '-')          // Replace spaces with -
    .replace(/[^\w-]+/g, '')       // Remove all non-word chars
    .replace(/--+/g, '-')          // Replace multiple - with single -
    .trim();
    

  // 2. Check if slug exists in DB
  const existing = await prisma.product.findUnique({
    where: { slug },
  });

  // 3. If exists, append a random 4-digit number to make it unique
  if (existing) {
    slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  let type = "BASE";
  let value = "Default";

  if (size && color) {
    type = "COMBINED";
    value = `${size} / ${color}`;
  } else if (size) {
    type = "SIZE";
    value = size;
  } else if (color) {
    type = "COLOR";
    value = color;
  }

  await prisma.product.create({
    data: {
      title,
      sku: smartSku,
      isPublished, // Now this will be true or false
      featured,    // Now this will be true or false
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
      variants: {
        create: {
          name: value, // e.g. "L / Red"
          type: type,
          value: value,
          size: size || null,
          color: color || null,
          stock: stock,
          priceDelta: priceDelta,
        }
      }
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");

  return { success: true };
}

export async function togglePublishStatus(id: string, currentStatus: boolean) {
  await prisma.product.update({
    where: { id },
    data: { isPublished: !currentStatus },
  });
  
  revalidatePath("/admin/products");
  revalidatePath("/"); // Update user site
}

export async function deleteProduct(id: string) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Delete dependent records using 'tx' (the transaction client)
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productVariant.deleteMany({ where: { productId: id } });
      await tx.review.deleteMany({ where: { productId: id } });
      await tx.cartItem.deleteMany({ where: { productId: id } });

      // 2. Handle Inventory (It might not exist, so we wrap it)
      try {
        await tx.inventory.delete({ where: { productId: id } });
      } catch (e) {
        // Ignore error if inventory doesn't exist
      }

      // 3. Finally delete the product
      await tx.product.delete({ where: { id } });
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Delete failed:", error);
    return { 
      success: false, 
      error: "Product is linked to active Orders and cannot be deleted." 
    };
  }
}

export async function archiveProduct(id: string) {
  try {
    await prisma.product.update({
      where: { id },
      data: { isArchived: true },
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to remove product" };
  }
}

export async function restoreProduct(id: string) {
  try {
    await prisma.product.update({
      where: { id },
      data: { isArchived: false },
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to restore product" };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const price = formData.get("price") as string;
    const categoryId = formData.get("categoryId") as string;
    const description = formData.get("description") as string;
    const slug = formData.get("slug") as string;
    const isPublished = formData.get("isPublished") === "on";
    const featured = formData.get("featured") === "on";

    await prisma.product.update({
      where: { id },
      data: {
        title,
        price: parseFloat(price),
        categoryId,
        description,
        slug,
        isPublished,
        featured,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update product" };
  }
}
