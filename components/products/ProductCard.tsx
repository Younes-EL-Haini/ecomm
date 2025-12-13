import { Card } from "@/components/ui/card";
import { Product, ProductImage } from "@/lib/generated/prisma";
import ProductImageCard from "./ProductImage";
import ProductContent from "./ProductContent";

type ProductWithImage = Product & {
  images: ProductImage[];
};

const ProductCard = ({ product }: { product: ProductWithImage }) => {
  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 p-0 bg-blue-50">
      {/* IMAGE */}
      <ProductImageCard image={product.images?.[0]} stock={product.stock} />

      {/* CONTENT */}
      <ProductContent
        title={product.title}
        description={product.description}
        price={product.price}
        slug={product.slug}
      />
    </Card>
  );
};

export default ProductCard;
