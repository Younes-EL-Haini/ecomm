// export const dynamic = "force-dynamic";

// import ProductClient from "@/components/product-details/ProductClient";
// import { SITE_CONFIG } from "@/lib/constants";
// import { getProductBySlug } from "@/lib/products";
// import { Metadata } from "next";
// import { notFound } from "next/navigation"; // Senior move: use the official 404 handler

// type Props = {
//   params: Promise<{ slug: string }>;
// };

// // app/products/[slug]/page.tsx
// // export async function generateMetadata({ params }: Props): Promise<Metadata> {
// //   const { slug } = await params;

// //   // Turns "nike-air-max" into "Nike Air Max"
// //   const cleanTitle = slug
// //     .split('-')
// //     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
// //     .join(' ');

// //   return {
// //     title: `${cleanTitle} | E-commerce`,
// //     description: `Buy ${cleanTitle} at the best price.`
// //   };
// // }

// const ProductPage = async ({ params }: Props) => {
//   const { slug } = await params;
//   const product = await getProductBySlug(slug);

//   if (!product) {
//     notFound(); // This triggers your global not-found.tsx page
//   }

//   return <ProductClient product={product} />;
// };

// export default ProductPage;

export const dynamic = "force-dynamic";

import { Suspense, use } from "react"; // Add 'use' here
import ProductClient from "@/components/product-details/ProductClient";
import ProductLoading from "./loading";
import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. Make the Page SYNC (remove 'async')
const ProductPage = ({ params }: Props) => {
  return (
    // This fallback will now show INSTANTLY
    <Suspense fallback={<ProductLoading />}>
      <ProductContent params={params} />
    </Suspense>
  );
};

// 2. This component handles the 'await' work
async function ProductContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // We await BOTH here so the Page doesn't have to wait
  const { slug } = await params;

  // Optional: Add a fake delay to PROVE it works
  // await new Promise(resolve => setTimeout(resolve, 3000));

  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return <ProductClient product={product} />;
}

export default ProductPage;
