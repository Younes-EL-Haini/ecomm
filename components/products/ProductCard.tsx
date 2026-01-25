import { Card } from "@/components/ui/card";
import ProductImageCard from "./ProductImage";
import ProductContent from "./ProductContent";
import { ProductWithRelations } from "@/lib/actions/product";
import Link from "next/link";

const ProductCard = ({ product }: { product: ProductWithRelations }) => {
  const hasStock = product.variants.some((variant: any) => variant.stock > 0);

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <Card className="group flex h-full flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 p-0">
        {/* IMAGE */}
        <ProductImageCard image={product.images[0]} stock={hasStock} />

        {/* CONTENT */}
        <ProductContent
          title={product.title}
          description={product.description}
          price={product.price}
          slug={product.slug}
        />
      </Card>
    </Link>
  );
};

export default ProductCard;
