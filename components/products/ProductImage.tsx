import Image from "next/image";

type ProductImageCardProps = {
  image?: { url: string; alt?: string | null };
  stock: number;
};

const ProductImageCard = ({ image, stock }: ProductImageCardProps) => {
  const inStock = stock > 0;
  return (
    <div className="relative w-full aspect-4/5 bg-gray-100 overflow-hidden rounded-xl">
      <Image
        src={image?.url || "/images/hero-product.jpg"}
        alt={image?.alt || "Product Image"}
        fill
        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
      />

      <div className="absolute top-2 left-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium text-white ${
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
