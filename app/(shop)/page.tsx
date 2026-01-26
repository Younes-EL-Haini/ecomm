import Hero from "@/components/hero/Hero";
import ProductGrid from "@/components/products/ProductGrid";

const MainPage = () => {
  return (
    <div className="flex flex-col bg-gray-100">
      <Hero />
      <section className="px-4 md:px-10 mt-10">
        <ProductGrid />
      </section>
    </div>
  );
};

export default MainPage;
