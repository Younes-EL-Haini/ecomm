import { ProductCardSkeleton } from "./ProductCardSkeleton";

export const ProductGridSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-7">
      {/* Show 8 skeletons as a placeholder */}
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
