import { getProducts } from "@/lib/products";
import ProductCard from "@/components/products/ProductCard";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";

interface Props {
  searchParams: Promise<{ category?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category, sort } = await searchParams;

  // Notice: We do NOT pass hideOutOfStock: true here.
  // We want the shop page to show "Sold Out" items for social proof.
  const products = await getProducts({
    categorySlug: category,
    sort: sort,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-10 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase italic">
            {category ? category : "All Products"}
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            Showing {products.length} results
          </p>
        </div>

        {/* Simple Sort/Filter Placeholder - You can build this next! */}
        <div className="flex gap-4">
          <span className="text-xs font-bold uppercase text-zinc-400">
            Sort by: Newest
          </span>
        </div>
      </div>

      <Suspense fallback={<ProductGridSkeleton />}>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-7">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <h2 className="text-xl font-medium text-zinc-900">
              No products found
            </h2>
            <p className="text-zinc-500 mt-2">
              Try adjusting your filters or category.
            </p>
          </div>
        )}
      </Suspense>
    </div>
  );
}
