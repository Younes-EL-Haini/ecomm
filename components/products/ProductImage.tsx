import Image from "next/image";

type ProductImageCardProps = {
  image?: { url: string; alt?: string | null };
  stock: number;
};

const ProductImageCard = ({ image, stock }: ProductImageCardProps) => {
  const inStock = stock > 0;
  return (
    <div className="relative h-72 w-full bg-gray-100 overflow-hidden">
      <Image
        src="/images/hero-product.jpg"
        alt={image?.alt || "Product Image"}
        fill
        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
      />

      {/* STOCK BADGE */}
      <div className="absolute top-3 left-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium text-white ${
            inStock ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {inStock ? "In stock" : "Out of stock"}
        </span>
      </div>
    </div>
  );
};

export default ProductImageCard;
