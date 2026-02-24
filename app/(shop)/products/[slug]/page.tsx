import { Suspense, use } from "react"; // Add 'use'
import ProductClient from "@/components/product-details/ProductClient";
import ProductLoading from "./loading";
import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";

// PAGE IS SYNC (No 'async')
export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ProductLoading />}>
      {/* Pass the promise itself to the child */}
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Use React.use() to unwrap the promise.
  // This tells Next.js: "I'm waiting on this, but go ahead and show the skeleton."
  const { slug } = use(params);

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return <ProductClient product={product} />;
}
