import { Suspense } from "react";
import ProductClient from "@/components/product-details/ProductClient";
import ProductLoading from "./loading";
import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";

// DO NOT USE async here. Keep the Page component synchronous.
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
  const { slug } = await params;

  // The 3-second delay is good for testing
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return <ProductClient product={product} />;
}
