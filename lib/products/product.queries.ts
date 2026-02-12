"use server";
import prisma from "@/lib/prisma";
import { serializeProduct } from "./product.serializer";
import { AdminProductWithRelations, ProductFullDetails, ProductWithRelations } from "./product.types";

export async function getProducts(): Promise<ProductWithRelations[]> {
  return await prisma.product.findMany({
    where: { isPublished: true, isArchived: false },
    orderBy: { createdAt: "asc" },
    include: {
      category: true,
      images: { orderBy: { position: "asc" }, take: 1 },
      variants: { select: { stock: true, color: true } },
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