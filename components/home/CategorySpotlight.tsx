import Link from "next/link";
import { getHomeCategories } from "@/lib/products";
import Image from "next/image";

export default async function CategorySpotlight() {
  const categories = await getHomeCategories();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-12 max-w-7xl mx-auto px-4">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group relative w-full block overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-zinc-200/10 shadow-sm h-[450px] md:h-[550px] lg:h-[600px]"
          >
            {/* Next.js Image with fill */}
            <Image
              src={cat.imageUrl || "/placeholder.jpg"}
              alt={cat.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100 z-10" />

            {/* Text Overlay */}
            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 z-20">
              <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-black uppercase italic tracking-tighter text-white leading-[0.95]">
                {cat.name}
              </h2>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-zinc-300 mt-3 flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1">
                Explore Collection <span className="text-sm">→</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
