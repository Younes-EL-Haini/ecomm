import { Suspense } from "react";
import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductClient from "@/components/product-details/ProductClient";
import ProductLoading from "./loading"; // Import your real skeleton

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ProductLoading />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 1. Unwrapping the params promise
  const { slug } = await params;

  // 2. The actual data fetch
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // 3. Once this is ready, it replaces the skeleton
  return <ProductClient product={product} />;
}
