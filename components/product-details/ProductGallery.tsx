"use client";

import { ProductImage } from "@prisma/client";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

type Props = {
  images: ProductImage[];
  title: string;
  selectedColor: string | null;
};

const ProductGallery = ({ images = [], title, selectedColor }: Props) => {
  // 1. Case-insensitive color filtering with useMemo
  const filteredImages = useMemo(() => {
    if (!selectedColor) return images;
    const matched = images.filter(
      (img) => img.color?.toLowerCase() === selectedColor.toLowerCase(),
    );
    // Fallback to all images if no color matches exist
    return matched.length > 0 ? matched : images;
  }, [images, selectedColor]);

  // 2. Default selected image initialization
  const [selected, setSelected] = useState<ProductImage | undefined>(
    () =>
      filteredImages.find((img) => img.isMain) ||
      filteredImages[0] ||
      images[0],
  );

  // 3. Sync state whenever selectedColor changes
  useEffect(() => {
    const mainOfColor =
      filteredImages.find((img) => img.isMain) || filteredImages[0];
    if (mainOfColor) {
      setSelected(mainOfColor);
    }
  }, [filteredImages]);

  const thumbnails = filteredImages.slice(0, 8);
  const mainImageSrc = selected?.url || images[0]?.url || "/placeholder.png";

  return (
    <div className="flex flex-col gap-4">
      {/* MAIN DISPLAY IMAGE */}
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl bg-zinc-100 shadow-sm border border-zinc-100">
        <Image
          src={mainImageSrc}
          alt={selected?.alt || title || "Product Image"}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-all duration-300"
        />
      </div>

      {/* THUMBNAILS GRID */}
      {thumbnails.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {thumbnails.map((img) => {
            const isSelected = selected?.id === img.id;

            return (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelected(img)}
                className={cn(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl transition-all duration-200 bg-zinc-100 cursor-pointer focus:outline-none",
                  isSelected
                    ? "ring-2 ring-black ring-offset-2 scale-105"
                    : "opacity-60 hover:opacity-100 border border-zinc-200",
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt || title || "Thumbnail"}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
