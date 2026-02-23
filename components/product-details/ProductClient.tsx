"use client";

import { useEffect, useState, useMemo } from "react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import { ProductFullDetails } from "@/lib/products";
import ProductSkeleton from "./ProductSkeleton";

const ProductClient = ({ product }: { product: ProductFullDetails }) => {
  // 1. ALL HOOKS AT THE TOP
  const [isClientLoading, setIsClientLoading] = useState(true);

  // Use useMemo to calculate initial color so it doesn't recalculate on every render
  const initialColor = useMemo(
    () => product.variants.find((v) => v.color)?.color || null,
    [product.variants],
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(
    initialColor,
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsClientLoading(false), 500); // 1000ms is long, 500ms is snappier
    return () => clearTimeout(timer);
  }, []);

  // 2. NOW YOU CAN DO CONDITIONAL RETURNS
  if (isClientLoading) {
    return <ProductSkeleton />;
  }

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
