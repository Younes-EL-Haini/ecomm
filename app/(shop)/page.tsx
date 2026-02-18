import Hero from "@/components/hero/Hero";
import CategorySpotlight from "@/components/home/CategorySpotlight";
import Features from "@/components/home/Features";
import ProductGrid from "@/components/products/ProductGrid";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";
import { SITE_CONFIG } from "@/lib/constants";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  // We don't need 'title.template' here because it's in the layout!
  // Setting 'title' as a simple string here uses the 'default' from layout.
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,

  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: "/", // Points to the root
  },
};

const MainPage = () => {
  return (
    <div className="flex flex-col bg-gray-100">
      <Hero />
      <Features />
      <CategorySpotlight />
      <section className="px-4 md:px-10 mt-10">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid
            title="Featured Collection"
            limit={8}
            featuredOnly={true}
          />
        </Suspense>
      </section>
    </div>
  );
};

export default MainPage;
