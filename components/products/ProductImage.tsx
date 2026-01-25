import Image from "next/image";

type ProductImageCardProps = {
  image?: { url: string; alt?: string | null };
  stock: boolean;
};

const ProductImageCard = ({ image, stock }: ProductImageCardProps) => {
  return (
    <div className="relative w-full aspect-4/5 overflow-hidden rounded-xl group border border-slate-50">
      <Image
        src={image?.url || "/images/hero-product.jpg"}
        alt={image?.alt || "Product Image"}
        fill
        className="object-contain p-3 transition-transform duration-500 ease-in-out group-hover:scale-110"
      />
    </div>
  );
};

export default ProductImageCard;
