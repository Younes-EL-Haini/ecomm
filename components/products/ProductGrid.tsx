import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/products";

interface ProductGridProps {
  limit?: number;
  featuredOnly?: boolean;
  title?: string; // Optional title for sections
  categorySlug?: string;
}

const ProductGrid = async ({
  limit,
  featuredOnly,
  title,
  categorySlug,
}: ProductGridProps) => {
  const products = await getProducts({ limit, featuredOnly, categorySlug });

  if (products.length === 0) return null;

  return (
    <section className="space-y-8 py-10">
      {title && (
        <div className="flex items-end justify-between border-b pb-4">
          <h2 className="text-3xl font-bold tracking-tighter uppercase italic">
            {title}
          </h2>
          <span className="text-sm font-medium text-zinc-400">
            {products.length} Items
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-7">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
