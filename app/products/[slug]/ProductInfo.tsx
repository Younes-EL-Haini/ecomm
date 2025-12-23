"use client";

import { Button } from "@/components/ui/button";
import { ProductVariant } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Props = {
  productId: string; // Added this
  title: string;
  description: string;
  price: number;
  avgRating: string;
  ratingCount: number;
  stock: number;
  variants?: ProductVariant[];
};

const ProductInfo = ({
  productId,
  title,
  description,
  price,
  avgRating,
  ratingCount,
  stock,
  variants,
}: Props) => {
  const [isAdding, setIsAdding] = useState(false);
  const handleAddToCart = async () => {
    try {
      setIsAdding(true);

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: productId,
          variantId: selectedVariant?.id || null,
          quantity: 1,
        }),
      });
      console.log(response);

      if (!response.ok) {
        if (response.status === 401) {
          alert("Please login to add items to cart"); // Replace with a Toast later
          return;
        }
        throw new Error("Failed to add to cart");
      }

      // Success!
      alert("Added to cart!"); // Replace with shadcn toast for a pro feel
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const inStock = stock > 0;

  const sizes = Array.from(
    new Set(variants?.map((v) => v.size).filter(Boolean))
  );
  const colors = Array.from(
    new Set(variants?.map((v) => v.color).filter(Boolean))
  );

  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  // Compute available colors for the selected size
  const availableColors =
    variants
      ?.filter((v) => v.size === selectedSize && v.stock > 0)
      .map((v) => v.color)
      .filter(Boolean) || [];

  // Compute available sizes for the selected color
  const availableSizes =
    variants
      ?.filter((v) => v.color === selectedColor && v.stock > 0)
      .map((v) => v.size)
      .filter(Boolean) || [];

  const selectedVariant = variants?.find(
    (v) =>
      (v.size ?? undefined) === selectedSize &&
      (v.color ?? undefined) === selectedColor
  );

  const variantInStock = selectedVariant && selectedVariant.stock > 0;

  const handleSizeChange = (size: string) => {
    // update selected size
    setSelectedSize(size);

    // auto-correct color if current selection is invalid
    const validColorsForSize = variants
      ?.filter((v) => v.size === size && v.stock > 0)
      .map((v) => v.color)
      .filter(Boolean);

    if (!validColorsForSize?.includes(selectedColor)) {
      setSelectedColor(validColorsForSize?.[0] ?? null);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);

    const validSizesForColor = variants
      ?.filter((v) => v.color === color && v.stock > 0)
      .map((v) => v.size)
      .filter(Boolean);

    if (!validSizesForColor?.includes(selectedSize)) {
      setSelectedSize(validSizesForColor?.[0] ?? null);
    }
  };

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <h1 className="text-2xl lg:text-3xl font-bold leading-tight">{title}</h1>

      {/* RATING */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>⭐ {avgRating}</span>
        <span>•</span>
        <span>{ratingCount} reviews</span>
      </div>

      {/* PRICE */}
      <p className="text-2xl font-semibold text-primary">
        {price.toFixed(2)} MAD
      </p>

      {/* STOCK */}
      <p
        className={`text-sm font-medium ${
          inStock ? "text-green-600" : "text-red-600"
        }`}
      >
        {inStock ? "In stock" : "Out of stock"}
      </p>

      {/* VARIANTS */}
      {sizes.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Size:{" "}
            <span className="text-primary font-semibold">{selectedSize}</span>
          </p>

          <div className="flex gap-2">
            {sizes.map((size) => {
              const isDisabled = !availableSizes.includes(size);
              const isSelected = selectedSize === size;

              return (
                <Button
                  key={size}
                  variant="outline"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && handleSizeChange(size!)}
                  className={cn(
                    "flex-none h-10 w-12 rounded-lg border text-sm font-medium transition-all duration-200 transform",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary ring-1 ring-primary scale-105"
                      : "border-border hover:border-primary/50",
                    isDisabled ? "opacity-40 cursor-not-allowed" : ""
                  )}
                >
                  {size}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Color:{" "}
            <span className="text-primary font-semibold">{selectedColor}</span>
          </p>

          <div className="flex gap-5 flex-wrap">
            {colors.map((color) => {
              const isSelected = selectedColor === color;

              return (
                <Button
                  key={color}
                  onClick={() => handleColorChange(color!)}
                  className={cn(
                    "flex-1 h-10 w-16 rounded-full border transition-all duration-200 transform",
                    isSelected
                      ? "ring-2 ring-primary scale-110"
                      : "border-border hover:ring-1 hover:ring-primary/50"
                  )}
                  style={{ backgroundColor: color?.toLowerCase() }}
                  aria-label={color ?? undefined}
                  title={color ?? undefined}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <Button
        size="lg"
        disabled={!inStock}
        onClick={handleAddToCart}
        className="w-full lg:w-auto"
      >
        {variantInStock ? "Add to cart" : "Unavailable"}
      </Button>

      {selectedVariant && selectedVariant.stock <= 5 && (
        <p className="text-sm text-orange-600 font-medium">
          ⚠️ Only {selectedVariant.stock} left in stock
        </p>
      )}

      {/* DESCRIPTION */}
      <div className="border-t pt-6 text-sm text-muted-foreground leading-relaxed">
        {description}
      </div>
    </div>
  );
};

export default ProductInfo;
