import Hero from "@/components/hero/Hero";
import ProductCard from "@/components/products/ProductCard";
import ProductGrid from "@/components/products/ProductGrid";

const MainPage = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <section className="px-4 md:px-10 mt-10">
        <ProductGrid />
      </section>
    </div>
  );
};

export default MainPage;
