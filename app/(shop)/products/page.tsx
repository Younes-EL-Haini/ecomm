import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";
import ProductGrid from "@/components/products/ProductGrid";

interface Props {
  searchParams: Promise<{ category?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  // const { category, sort } = await searchParams;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-10 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase italic">
            All Products
          </h1>
          <p className="text-zinc-500 text-sm mt-2">Showing all results</p>
        </div>

        {/* Simple Sort/Filter Placeholder - You can build this next! */}
        <div className="flex gap-4">
          <span className="text-xs font-bold uppercase text-zinc-400">
            Sort by: Newest
          </span>
        </div>
      </div>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid featuredOnly={true} />
      </Suspense>
    </div>
  );
}
