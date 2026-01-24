import { Card } from "@/components/ui/card";
import ProductImageCard from "./ProductImage";
import ProductContent from "./ProductContent";
import { ProductWithRelations } from "@/lib/actions/product";

const ProductCard = ({ product }: { product: ProductWithRelations }) => {
  const hasStock = product.variants.some((variant: any) => variant.stock > 0);

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 p-0 bg-blue-50">
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
  );
};

export default ProductCard;
