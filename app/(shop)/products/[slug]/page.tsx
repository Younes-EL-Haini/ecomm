import { getProductBySlugCached } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductClient from "@/components/product-details/ProductClient";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugCached(slug);

  if (!product) return {};

  return {
    title: product.title,
    description:
      product.description?.slice(0, 160) || `Buy ${product.title} at Sable`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 1. Unwrapping the params promise
  const { slug } = await params;

  // 2. The actual data fetch
  const product = await getProductBySlugCached(slug);

  if (!product) {
    notFound();
  }

  // 3. Once this is ready, it replaces the skeleton
  return <ProductClient product={product} />;
}
