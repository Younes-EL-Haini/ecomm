import { useState, useMemo, useCallback } from "react";
import { ProductVariant } from "@/lib/generated/prisma";

export const useProductVariants = (variants: ProductVariant[] = []) => {
  const sizes = useMemo(() => 
    Array.from(new Set(variants.map((v) => v.size).filter(Boolean))), 
  [variants]);

  const colors = useMemo(() => 
    Array.from(new Set(variants.map((v) => v.color).filter(Boolean))), 
  [variants]);

  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] || null);
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] || null);

  // Helper to find valid sizes for a specific color
  const getValidSizesForColor = useCallback(
    (color: string | null) =>
      variants
        .filter((v) => v.color === color && v.stock > 0)
        .map((v) => v.size),
    [variants]
  );

  const getValidColorsForSize = useCallback(
    (size: string | null) =>
      variants
        .filter((v) => v.size === size && v.stock > 0)
        .map((v) => v.color),
    [variants]
  );


  // HANDLE COLOR CHANGE (Your specific request)
  const handleColorChange = (color: string) => {
    setSelectedColor(color);

    const validSizes = getValidSizesForColor(color);
    // If current size isn't available in the new color, snap to the first available size
    if (!validSizes.includes(selectedSize)) {
      setSelectedSize(validSizes[0] || null);
    }
  };

  // HANDLE SIZE CHANGE
  const handleSizeChange = (size: string) => {
    setSelectedSize(size);

    const validColors = getValidColorsForSize(size);
    // If current color isn't available in the new size, snap to the first available color
    if (!validColors.includes(selectedColor)) {
      setSelectedColor(validColors[0] || null);
    }
  };

  const selectedVariant = useMemo(
    () =>
      variants.find(
        (v) =>
          (v.size ?? null) === selectedSize &&
          (v.color ?? null) === selectedColor
      ),
    [variants, selectedSize, selectedColor]
  );


  // Buttons should be disabled if they don't exist in stock AT ALL for the current cross-selection
  const availableSizes = useMemo(() => getValidSizesForColor(selectedColor), [selectedColor, variants]);
  const availableColors = useMemo(() => getValidColorsForSize(selectedSize), [selectedSize, variants]);

  return {
    selectedSize,
    selectedColor,
    handleSizeChange,
    handleColorChange,
    selectedVariant,
    availableColors,
    availableSizes,
    sizes,
    colors,
  };
};