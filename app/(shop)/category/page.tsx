export const dynamic = "force-dynamic";

import { getCategories } from "@/lib/products";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="pt-24 min-h-screen max-w-7xl mx-auto px-4">
      <h1 className="text-7xl font-black uppercase italic tracking-tighter mb-16">
        Collections —
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            href={`/category/${cat.slug}`}
            key={cat.id}
            className="group relative overflow-hidden rounded-2xl bg-zinc-100 shadow-sm"
          >
            {/* Image */}
            <div className="relative w-full aspect-4/5">
              <img
                src={cat.imageUrl || "/placeholder-cat.jpg"}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />

            {/* Title */}
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                {cat.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
