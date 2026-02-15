// components/home/CategorySpotlight.tsx
import Link from "next/link";
import { getHomeCategories } from "@/lib/products";

export default async function CategorySpotlight() {
  const categories = await getHomeCategories();

  if (categories.length === 0) return null;

  return (
    <section className="py-12 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            // We keep your heights, but add flex-col to manage the space
            className="group flex flex-col relative overflow-hidden rounded-[3rem] bg-zinc-100 border border-zinc-100 shadow-sm h-[450px] md:h-[550px] lg:h-[650px]"
          >
            {/* The Image: We use h-full and w-full without absolute. 
      This ensures it fills the space but doesn't "vanish" */}
            <img
              src={cat.imageUrl!}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />

            {/* Gradient Overlay: This MUST stay absolute to sit ON TOP of the image */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-90" />

            {/* Text Container: We use responsive text sizes here */}
            <div className="absolute bottom-8 left-6 right-6 md:bottom-10 md:left-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl font-black uppercase italic tracking-tighter text-white leading-[0.8]">
                {cat.name}
              </h2>
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 mt-4">
                Explore Collection →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
