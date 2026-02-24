import ProductClient from "@/components/product-details/ProductClient";
import { SITE_CONFIG } from "@/lib/constants";
import { getProductBySlug } from "@/lib/products";
import { Metadata } from "next";
import { notFound } from "next/navigation"; // Senior move: use the official 404 handler
import ProductLoading from "./loading";
import { Suspense } from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

// app/products/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.title, // Becomes "ProductName | YourStore" automatically
    description: product.description?.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description || undefined,
      url: `/products/${slug}`, // Relative path works because of metadataBase
      images: [
        {
          url: product.images[0]?.url || SITE_CONFIG.ogImage,
          width: 800,
          height: 1000,
        },
      ],
    },
  };
}

const ProductPage = async ({ params }: Props) => {
  const { slug } = await params;

  return (
    // We pass the slug into a child component that handles the fetching
    <Suspense fallback={<ProductLoading />}>
      <ProductContent slug={slug} />
    </Suspense>
  );
};

// 3. The Data Fetcher - THIS IS WHAT TRIGGERS THE SKELETON
async function ProductContent({ slug }: { slug: string }) {
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}

export default ProductPage;
