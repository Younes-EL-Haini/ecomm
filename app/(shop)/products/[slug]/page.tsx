import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductClient from "@/components/product-details/ProductClient";
import { SITE_CONFIG } from "@/lib/constants";
import { getProductBySlug } from "@/lib/products";
import ProductLoading from "./loading"; // Import your skeleton component

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.title,
    description: product.description?.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description || undefined,
      url: `/products/${slug}`,
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

async function ProductData({ slug }: { slug: string }) {
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}

const ProductPage = async ({ params }: Props) => {
  const { slug } = await params;

  return (
    <Suspense fallback={<ProductLoading />}>
      <ProductData slug={slug} />
    </Suspense>
  );
};

export default ProductPage;
