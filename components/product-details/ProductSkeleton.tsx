import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Page Title Skeleton */}
      <Skeleton className="h-10 w-48 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT: ITEM LIST SKELETON */}
        <div className="lg:col-span-2 space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 border-b pb-6">
              {/* Image Skeleton - Matches 28x28 or 32x32 */}
              <Skeleton className="h-28 w-28 md:h-32 md:w-32 rounded-lg shrink-0" />

              {/* Product Info Skeleton */}
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-1/2" /> {/* Title */}
                <Skeleton className="h-4 w-1/3" /> {/* Variant Info */}
                <Skeleton className="h-6 w-20 mt-4" /> {/* Price */}
              </div>

              {/* Controls Skeleton */}
              <div className="flex flex-col items-end justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-24 rounded-lg" />{" "}
                  {/* Qty Controls */}
                  <Skeleton className="h-8 w-8 rounded-md" /> {/* Trash Icon */}
                </div>
                <Skeleton className="h-7 w-24" /> {/* Line Total */}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: SUMMARY SKELETON */}
        <div className="h-fit rounded-lg border bg-muted/10 p-6 space-y-6">
          <Skeleton className="h-7 w-32" /> {/* Summary Title */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between border-t pt-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <Skeleton className="h-12 w-full rounded-md" />{" "}
          {/* Checkout Button */}
        </div>
      </div>
    </div>
  );
}
