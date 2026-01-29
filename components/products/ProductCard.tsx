import { Card } from "@/components/ui/card";
import ProductImageCard from "./ProductImage";
import ProductContent from "./ProductContent";
import { ProductWithRelations } from "@/lib/products";
import Link from "next/link";

const ProductCard = ({ product }: { product: ProductWithRelations }) => {
  const hasStock = product.variants.some((variant: any) => variant.stock > 0);

  const uniqueColors = Array.from(
    new Set(product.variants.map((v) => v.color)),
  ).filter(Boolean); // Removes null/undefined if any

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <Card className="group flex h-full flex-col overflow-hidden rounded-4xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 p-0 border-none bg-white">
        {/* IMAGE */}
        <ProductImageCard image={product.images[0]} stock={hasStock} />

        {/* COLOR SWATCHES SECTION */}
        {uniqueColors.length > 0 && (
          <div className="pt-4 flex gap-1.5 items-center justify-center">
            {uniqueColors.slice(0, 5).map((color) => (
              <div
                key={color}
                className="size-3 rounded-full border border-zinc-200 shadow-inner"
                style={{ backgroundColor: color?.toLowerCase() }}
                title={color || undefined}
              />
            ))}

            {uniqueColors.length > 5 && (
              <span className="text-[10px] font-bold text-zinc-400">
                +{uniqueColors.length - 5}
              </span>
            )}
          </div>
        )}

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
