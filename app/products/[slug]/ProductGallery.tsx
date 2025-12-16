"use client";

import { CldImage } from "next-cloudinary";
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
        <CldImage
          src={selected.publicId || "/images/hero-product.jpg"}
          alt={selected.alt || title}
          fill
          crop="fill"
          gravity="center"
          aspectRatio="1:1"
          quality="auto"
          format="auto"
          sizes="(max-width: 768px) 100vw, 50vw"
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
            <CldImage
              src={img.publicId || "/images/hero-product.jpg"}
              alt={img.alt || title}
              fill
              crop="fill"
              gravity="center"
              aspectRatio="1:1"
              quality="auto"
              format="auto"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
