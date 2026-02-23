"use client";

import { useEffect, useState } from "react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import { ProductFullDetails } from "@/lib/products";
import ProductSkeleton from "./ProductSkeleton";

const ProductClient = ({ product }: { product: ProductFullDetails }) => {
  const [isClientLoading, setIsClientLoading] = useState(true);

  useEffect(() => {
    // Simulate a brief moment for the client to mount and images to prep
    const timer = setTimeout(() => setIsClientLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isClientLoading) {
    return <ProductSkeleton />;
  }
  // 1. Get the same default color that your hook will pick (the first one)
  const initialColor = product.variants.find((v) => v.color)?.color || null;

  // 2. Set that as the starting state
  const [selectedColor, setSelectedColor] = useState<string | null>(
    initialColor,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ProductGallery
          images={product.images}
          title={product.title}
          selectedColor={selectedColor}
        />

        <div className="lg:sticky lg:top-24">
          <ProductInfo product={product} onColorChange={setSelectedColor} />
        </div>
      </div>
    </div>
  );
};

export default ProductClient;
