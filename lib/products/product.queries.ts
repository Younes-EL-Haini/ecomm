"use server";
import prisma from "@/lib/prisma";
import { serializeProduct } from "./product.serializer";
import { AdminProductWithRelations, ProductFullDetails, ProductWithRelations } from "./product.types";

export async function getProducts(options?: {
  limit?: number;
  featuredOnly?: boolean;
  hideOutOfStock?: boolean;
  categorySlug?: string;
  sort?: string;
}) {
  return await prisma.product.findMany({
    where: {
      isPublished: true,
      isArchived: false,
      // 1. Featured Filter
      // ...(options?.featuredOnly ? { featured: true } : {}),
      
      // 2. Category Filter
      ...(options?.categorySlug ? { category: { slug: options.categorySlug } } : {}),
      
      // 3. Stock Filter (Toggleable)
      ...(options?.hideOutOfStock ? {
        variants: { some: { stock: { gt: 0 } } }
      } : {}),
    },
    take: options?.limit,
    // 4. Sorting logic
    orderBy: options?.sort === "price_asc" 
      ? { price: "asc" } 
      : { createdAt: "desc" },
    include: {
      category: true,
      images: { orderBy: { position: "asc" }, take: 1 },
      variants: { select: { stock: true, color: true, priceDelta: true } },
    },
  });
}

export async function getProductBySlug(slug: string): Promise<ProductFullDetails | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true, reviews: true, variants: true, category: true },
  });
  return product ? (serializeProduct(product) as any) : null;
}

export async function getAdminProducts(): Promise<AdminProductWithRelations[]> {
  return await prisma.product.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: { orderBy: { position: "asc" }, take: 1 },
      variants: { select: { id: true, stock: true } },
    },
  });
}

export async function getCategories() {
  return await prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getHomeCategories() {
  return await prisma.category.findMany({
    where: {
      // Only show if an image exists and it has published products
      NOT: { imageUrl: null },
      products: {
        some: { isPublished: true }
      }
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return await prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
    }
  });
}

export async function getProductForEdit(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true, variants: true },
  });

  if (!product) return null;

  // Move your serialization logic here!
  return {
    ...product,
    price: Number(product.price),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    variants: product.variants.map((v) => ({
      ...v,
      priceDelta: Number(v.priceDelta),
      createdAt: v.createdAt.toISOString(),
    })),
    images: product.images.map((img) => ({ ...img })),
  };
}