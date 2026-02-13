import Image from "next/image";

type ProductImageCardProps = {
  image?: { url: string; alt?: string | null };
  stock: boolean;
};

const ProductImageCard = ({ image, stock }: ProductImageCardProps) => {
  return (
    <div className="relative w-full aspect-4/5 overflow-hidden bg-zinc-100">
      <Image
        src={image?.url || "/images/hero-product.jpg"}
        alt={image?.alt || "Product image"}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
};

export default ProductImageCard;
