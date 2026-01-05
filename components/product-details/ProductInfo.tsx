"use client";

import { useState } from "react";
import { useProductVariants } from "./useProductVariants";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import VariantPicker from "./VariantPicker";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCartStore } from "@/cartStore";

interface Props {
  product: any; // Using any temporarily to bypass Decimal/Plain object issues
  onColorChange: (color: string | null) => void;
}

const ProductInfo = ({ product, onColorChange }: Props) => {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const increment = useCartStore((state) => state.increment);

  const {
    selectedSize,
    selectedColor,
    handleSizeChange,
    handleColorChange,
    selectedVariant,
    availableColors,
    availableSizes,
    sizes,
    colors,
  } = useProductVariants(product.variants, onColorChange);

  // General stock check
  const inStock = product.stock > 0;
  // Specific variant stock check
  const variantInStock = selectedVariant && selectedVariant.stock > 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant?.id || null,
          quantity: 1,
        }),
      });
      if (res.ok) {
        toast.success(`${product.title} added to cart`, {
          description: "Ready to checkout?",
          action: {
            label: "View Cart",
            onClick: () => router.push("/cart"),
          },
        });
        increment();
        router.refresh();
      } else {
        toast.error("Could not add to cart. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please check your connection.");
    } finally {
      setIsAdding(false);
    }
  };

  const basePrice = Number(product.price);
  const delta = Number(selectedVariant?.priceDelta || 0);

  const displayedPrice = basePrice + delta;

  return (
    <div className="space-y-6">
      {/* TITLE & RATING */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold leading-tight">
          {product.title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>⭐ {product.avgRating || "0.0"}</span>
          <span>•</span>
          <span>{product.ratingCount || 0} reviews</span>
        </div>
      </div>

      <p className="text-2xl font-semibold text-primary">
        {displayedPrice.toFixed(2)} MAD
      </p>

      {/* STOCK STATUS */}
      <p
        className={cn(
          "text-sm font-medium",
          inStock ? "text-green-600" : "text-red-600"
        )}
      >
        {inStock ? "In stock" : "Out of stock"}
      </p>

      {/* VARIANTS */}
      <div className="space-y-4">
        {sizes.length > 0 && (
          <VariantPicker
            label="Size"
            options={sizes}
            selected={selectedSize}
            available={availableSizes}
            onSelect={handleSizeChange} // Use the custom handler
          />
        )}
        {colors.length > 0 && (
          <VariantPicker
            label="Color"
            options={colors}
            selected={selectedColor}
            available={colors} // Keep all colors clickable, let the handler snap the size
            onSelect={handleColorChange} // Use the custom handler
            isColor
          />
        )}
      </div>

      {/* LOW STOCK WARNING */}
      {selectedVariant &&
        selectedVariant.stock <= 5 &&
        selectedVariant.stock > 0 && (
          <p className="text-sm text-orange-600 font-medium">
            ⚠️ Only {selectedVariant.stock} left in stock
          </p>
        )}

      {/* CTA */}
      <Button
        size="lg"
        className="w-full lg:w-auto"
        disabled={isAdding || !variantInStock}
        onClick={handleAddToCart}
      >
        {isAdding
          ? "Adding..."
          : variantInStock
          ? "Add to cart"
          : "Unavailable"}
      </Button>

      <div className="border-t pt-6 text-sm text-muted-foreground leading-relaxed">
        {product.description}
      </div>
    </div>
  );
};

export default ProductInfo;
