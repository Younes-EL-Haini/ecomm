export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { SITE_CONFIG } from "@/lib/constants";
import ProductClient from "@/components/product-details/ProductClient";
import ProductSkeleton from "@/components/product-details/ProductSkeleton";

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. MODIFIED METADATA (NON-BLOCKING)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // We use a separate promise here
  const productPromise = getProductBySlug(slug);
  const product = await productPromise;

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.title,
    description: product.description?.slice(0, 160),
    openGraph: {
      title: product.title,
      images: [{ url: product.images[0]?.url || SITE_CONFIG.ogImage }],
    },
  };
}

// 2. DATA WRAPPER with a forced artificial delay for testing
async function ProductData({ slug }: { slug: string }) {
  // ARTIFICIAL DELAY: Delete this line after you confirm it works!
  await new Promise((resolve) => setTimeout(resolve, 4000));

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return <ProductClient product={product} />;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="min-h-screen">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductData slug={slug} />
      </Suspense>
    </div>
  );
}
