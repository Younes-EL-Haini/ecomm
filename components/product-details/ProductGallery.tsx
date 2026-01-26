"use client";

import { ProductImage } from "@/lib/generated/prisma";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type Props = {
  images: ProductImage[];
  title: string;
  selectedColor: string | null;
};

const ProductGallery = ({ images, title, selectedColor }: Props) => {
  // 1. Filter images based on color
  const filteredImages = selectedColor
    ? images.filter((img) => img.color === selectedColor)
    : images;

  // 2. State for the currently clicked thumbnail
  const [selected, setSelected] = useState(filteredImages[0] || images[0]);

  // 3. Sync: If the user changes color in ProductInfo, reset the main image
  useEffect(() => {
    const mainOfColor =
      filteredImages.find((img) => img.isMain) || filteredImages[0];
    if (mainOfColor) {
      setSelected(mainOfColor);
    }
  }, [selectedColor]);

  const thumbnails = filteredImages.slice(0, 8);

  return (
    <div className="space-y-4">
      {/* MAIN IMAGE CONTAINER */}
      <div className="relative aspect-4/5 w-full max-h-[520px] overflow-hidden rounded-2xl">
        <Image
          src={selected?.url || "/images/hero-product.jpg"}
          alt={selected?.alt || title}
          fill
          priority
          className="object-contain"
        />
      </div>

      {/* THUMBNAILS GRID */}
      <div className="flex flex-wrap gap-3">
        {thumbnails.map((img) => (
          <button
            key={img.id}
            onClick={() => setSelected(img)}
            className={cn(
              "relative h-20 w-20 overflow-hidden rounded-xl transition-all duration-200",
              selected?.id === img.id
                ? "ring-2 ring-zinc-900 ring-offset-2 scale-105"
                : "border border-zinc-100 opacity-70 hover:opacity-100",
            )}
          >
            <Image
              src={img.url}
              alt={img.alt || title}
              fill
              sizes="80px"
              className="object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
