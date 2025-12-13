import prisma from "@/lib/prisma";
import ProductCard from "./ProductCard";

const ProductGrid = async () => {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    include: {
      images: {
        orderBy: { position: "asc" },
        take: 1, // only main image
      },
    },
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
