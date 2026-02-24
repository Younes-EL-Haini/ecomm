import { Suspense } from "react";
import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductClient from "@/components/product-details/ProductClient";

// 1. Super simple skeleton to test connection
function SimpleSkeleton() {
  return (
    <div className="p-20 text-center animate-pulse">
      <div className="h-10 w-48 bg-gray-200 mx-auto mb-4 rounded" />
      <p>Loading Product Data...</p>
    </div>
  );
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    // We use a local SimpleSkeleton first to rule out issues in loading.tsx
    <Suspense fallback={<SimpleSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Reduce delay to 2 seconds for stability
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return <ProductClient product={product} />;
}
