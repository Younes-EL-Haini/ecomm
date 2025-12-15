import React from "react";

type Props = {
  title: string;
  description: string;
  price: number;
  avgRating: string;
  ratingCount: number;
};

const ProductInfo = ({
  title,
  description,
  price,
  avgRating,
  ratingCount,
}: Props) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>

      {/* Rating */}
      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
        <span>⭐ {avgRating}</span>
        <span>({ratingCount} reviews)</span>
      </div>

      {/* Price */}
      <p className="mt-4 text-2xl font-semibold text-blue-600">
        ${price.toFixed(2)}
      </p>

      {/* Description */}
      <p className="mt-6 text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
};

export default ProductInfo;
