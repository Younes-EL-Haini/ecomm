"use client";

import Image from "next/image";
import { useState } from "react";
import { ProductImage } from "@/lib/generated/prisma";

type Props = {
  images: ProductImage[];
  title: string;
};

const ProductGallery = ({ images, title }: Props) => {
  const mainImage = images.find((img) => img.isMain) || images[0];
  const [selected, setSelected] = useState(mainImage);

  const thumbnails = images.slice(0, 4);

  return (
    <div>
      {/* MAIN IMAGE */}
      <div className="relative h-[420px] w-full overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={selected?.url || "/images/placeholder.png"}
          alt={selected?.alt || title}
          fill
          className="object-cover"
        />
      </div>

      {/* THUMBNAILS */}
      <div className="mt-4 flex gap-3">
        {thumbnails.map((img) => (
          <button
            key={img.id}
            onClick={() => setSelected(img)}
            className={`relative h-24 w-24 overflow-hidden rounded-xl border ${
              selected.id === img.id ? "border-blue-600" : "border-transparent"
            }`}
          >
            <Image
              src={img.url || "/images/placeholder.png"}
              alt={img.alt || title}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
