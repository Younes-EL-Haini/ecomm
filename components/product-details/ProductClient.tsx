"use client";

import { useState } from "react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import { ProductFullDetails } from "@/lib/actions/product";

const ProductClient = ({ product }: { product: ProductFullDetails }) => {
  // 1. Get the same default color that your hook will pick (the first one)
  const initialColor =
    product.variants.find((v: any) => v.color)?.color || null;

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
