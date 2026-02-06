"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { formatSlug, generateSmartSku } from "./product.utils";

export async function createProduct(formData: FormData) {
  const title = formData.get("title") as string;
  const rawSlug = formData.get("slug") as string;
  const color = formData.get("variantColor") as string;
  const size = formData.get("variantSize") as string;
  const imageUrls = formData.getAll("images") as string[];

  // Use Utils
  let slug = formatSlug(rawSlug || title);
  const smartSku = generateSmartSku(title, color, size);

  // Slug uniqueness logic
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Determine variant naming logic
  const value = (size && color) ? `${size} / ${color}` : (size || color || "Default");
  const type = (size && color) ? "COMBINED" : size ? "SIZE" : color ? "COLOR" : "BASE";

  await prisma.product.create({
    data: {
      title,
      sku: smartSku,
      slug,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      isPublished: formData.get("isPublished") === "on",
      featured: formData.get("featured") === "on",
      category: { connect: { id: formData.get("categoryId") as string } },
      images: {
        create: imageUrls.filter(url => url.trim() !== "").map((url, index) => ({
          url, position: index
        })),
      },
      variants: {
        create: {
          name: value,
          type,
          value,
          size: size || null,
          color: color || null,
          stock: parseInt(formData.get("variantStock") as string) || 0,
          priceDelta: parseFloat(formData.get("variantPriceDelta") as string) || 0,
        }
      }
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProduct(id: string) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productVariant.deleteMany({ where: { productId: id } });
      await tx.review.deleteMany({ where: { productId: id } });
      await tx.cartItem.deleteMany({ where: { productId: id } });
      try { await tx.inventory.delete({ where: { productId: id } }); } catch (e) {}
      await tx.product.delete({ where: { id } });
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Linked to active Orders." };
  }
}

export async function togglePublishStatus(id: string, currentStatus: boolean) {
  await prisma.product.update({
    where: { id },
    data: { isPublished: !currentStatus },
  });
  
  revalidatePath("/admin/products");
  revalidatePath("/"); // Update user site
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

// export async function updateProduct(id: string, formData: FormData) {
//   try {
//     const title = formData.get("title") as string;
//     const price = formData.get("price") as string;
//     const categoryId = formData.get("categoryId") as string;
//     const description = formData.get("description") as string;
//     const slug = formData.get("slug") as string;
//     const isPublished = formData.get("isPublished") === "on";
//     const featured = formData.get("featured") === "on";

//     await prisma.product.update({
//       where: { id },
//       data: {
//         title,
//         price: parseFloat(price),
//         categoryId,
//         description,
//         slug,
//         isPublished,
//         featured,
//       },
//     });

//     revalidatePath("/admin/products");
//     revalidatePath("/");

//     return { success: true };
//   } catch (error) {
//     console.error(error);
//     return { success: false, error: "Failed to update product" };
//   }
// }

export async function updateProduct(id: string, formData: FormData) {
  try {
    // 1. Extract values
    const title = formData.get("title") as string;
    const price = formData.get("price") as string;
    const categoryId = formData.get("categoryId") as string;
    const description = formData.get("description") as string;
    const slug = formData.get("slug") as string;
    const isPublished = formData.get("isPublished") === "on";
    const featured = formData.get("featured") === "on";
    const vColors = formData.getAll("v_color") as string[];
  const vSizes = formData.getAll("v_size") as string[];
  const vSkus = formData.getAll("v_sku") as string[];
  const vStocks = formData.getAll("v_stock") as string[];
  const vDeltas = formData.getAll("v_priceDelta") as string[];

    // 2. Get paired arrays for images
    const imageUrls = formData.getAll("image_url") as string[];
    const imageColors = formData.getAll("image_color") as string[];

    await prisma.$transaction(async (tx) => {
      // 3. Update Product details
      await tx.product.update({
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

      await tx.productImage.deleteMany({ 
        where: { productId: id } 
      });
      
      // Re-create them using the index to pair URL with Color
      if (imageUrls.length > 0) {
        await tx.productImage.createMany({
          data: imageUrls.map((url, index) => ({
            url,
            productId: id,
            position: index,
            // Pair URL at index with Color at index
            color: imageColors[index] !== "" ? imageColors[index] : null,
          })),
        });
      }

      await tx.productVariant.deleteMany({ where: { productId: id } });
    
    await tx.productVariant.createMany({
      data: vColors.map((color, i) => {
        const size = vSizes[i];
        const name = (size && color) ? `${size} / ${color}` : (size || color || "Default");
        
        return {
          productId: id,
          name,
          color: color || null,
          size: size || null,
          sku: vSkus[i] || null,
          stock: parseInt(vStocks[i]) || 0,
          priceDelta: parseFloat(vDeltas[i]) || 0,
          type: (size && color) ? "COMBINED" : size ? "SIZE" : color ? "COLOR" : "BASE",
          value: name
        };
      })
    });
  
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, error: "Failed to update product" };
  }
}
