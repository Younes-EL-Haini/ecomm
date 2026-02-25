"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  // Use zinc-200 to ensure visibility against the gray-100 background
  const skeletonBg = "bg-zinc-200/80 dark:bg-zinc-800";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Page Title Skeleton */}
      <Skeleton className={`h-10 w-48 mb-8 ${skeletonBg}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT: ITEM LIST SKELETON (Now using cards like the right part) */}
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={`cart-card-${i}`}
              className="bg-white rounded-xl p-6 shadow-sm border flex flex-col md:flex-row gap-6"
            >
              {/* Image Skeleton */}
              <Skeleton
                className={`h-24 w-24 md:h-32 md:w-32 rounded-lg shrink-0 ${skeletonBg}`}
              />

              {/* Product Info Skeleton */}
              <div className="flex-1 space-y-3">
                <Skeleton className={`h-6 w-3/4 ${skeletonBg}`} /> {/* Title */}
                <Skeleton className={`h-4 w-1/4 ${skeletonBg}`} />{" "}
                {/* Variant */}
                <div className="pt-4">
                  <Skeleton className={`h-6 w-20 ${skeletonBg}`} />{" "}
                  {/* Price */}
                </div>
              </div>

              {/* Controls Skeleton */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0">
                <div className="flex items-center gap-3">
                  <Skeleton className={`h-9 w-24 rounded-lg ${skeletonBg}`} />{" "}
                  {/* Qty */}
                  <Skeleton
                    className={`h-9 w-9 rounded-md ${skeletonBg}`}
                  />{" "}
                  {/* Trash */}
                </div>
                <Skeleton className={`h-7 w-24 mt-auto ${skeletonBg}`} />{" "}
                {/* Line Total */}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: SUMMARY SKELETON */}
        <div className="h-fit rounded-xl border bg-white p-6 shadow-sm space-y-6">
          <Skeleton className={`h-7 w-32 ${skeletonBg}`} />{" "}
          {/* Summary Title */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className={`h-4 w-16 ${skeletonBg}`} />
              <Skeleton className={`h-4 w-20 ${skeletonBg}`} />
            </div>
            <div className="flex justify-between border-t pt-4">
              <Skeleton className={`h-6 w-20 ${skeletonBg}`} />
              <Skeleton className={`h-6 w-24 ${skeletonBg}`} />
            </div>
          </div>
          <Skeleton className={`h-12 w-full rounded-lg ${skeletonBg}`} />{" "}
          {/* Checkout Button */}
        </div>
      </div>
    </div>
  );
}
