// app/category/[slug]/page.tsx
import ProductGrid from "@/components/products/ProductGrid";
import { getCategoryBySlug } from "@/lib/products";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // We fetch the category name just for the Page Title
  const param = await params;
  const category = await getCategoryBySlug(param.slug);

  if (!category) notFound();

  return (
    <main className="pt-24 min-h-screen max-w-7xl mx-auto px-4">
      {/* High-end Page Header */}
      <div className="mb-12">
        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter">
          {category.name}
        </h1>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 mt-4">
          Browse the collection —
        </p>
      </div>

      {/* The Grid filtered by the URL slug */}
      <ProductGrid categorySlug={param.slug} />
    </main>
  );
}
