"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";

type Props = {
  images: ProductImage[];
  title: string;
};

const ProductGallery = ({ images, title }: Props) => {
  const mainImage = images.find((img) => img.isMain) || images[0];
  const [selected, setSelected] = useState(mainImage);

  const thumbnails = images.slice(0, 4);

  return (
    <div className="space-y-4">
      {/* MAIN IMAGE */}
      <div className="relative aspect-4/5 w-full max-h-[520px] overflow-hidden rounded-2xl bg-muted">
        <Image
          src={selected?.url || "/images/hero-product.jpg"}
          alt={selected?.alt || title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3">
        {thumbnails.map((img) => (
          <button
            key={img.id}
            onClick={() => setSelected(img)}
            className={cn(
              "relative h-24 w-24 overflow-hidden rounded-xl border",
              selected.id === img.id ? "border-primary" : "border-transparent"
            )}
          >
            <Image
              src={img.url}
              alt={img.alt || title}
              fill
              sizes="96px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
