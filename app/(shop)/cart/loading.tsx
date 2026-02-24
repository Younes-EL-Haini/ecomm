"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Title */}
      <Skeleton className="h-10 w-48 mb-8 bg-zinc-100" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT: ITEM LIST */}
        <div className="lg:col-span-2 space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={`cart-item-${i}`} className="flex gap-4 border-b pb-6">
              {/* Image */}
              <div className="h-28 w-28 md:h-32 md:w-32 rounded-lg overflow-hidden shrink-0">
                <Skeleton className="h-full w-full bg-zinc-100" />
              </div>

              {/* Info */}
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-1/2 bg-zinc-100" />
                <Skeleton className="h-4 w-1/3 bg-zinc-100" />
                <Skeleton className="h-6 w-20 mt-4 bg-zinc-100" />
              </div>

              {/* Controls */}
              <div className="flex flex-col items-end justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-24 rounded-lg bg-zinc-100" />
                  <Skeleton className="h-8 w-8 rounded-md bg-zinc-100" />
                </div>
                <Skeleton className="h-7 w-24 bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="h-fit rounded-lg border p-6 space-y-6 bg-zinc-50/50">
          <Skeleton className="h-7 w-32 bg-zinc-100" />
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16 bg-zinc-100" />
              <Skeleton className="h-4 w-20 bg-zinc-100" />
            </div>
            <div className="flex justify-between border-t pt-4">
              <Skeleton className="h-6 w-20 bg-zinc-100" />
              <Skeleton className="h-6 w-24 bg-zinc-100" />
            </div>
          </div>
          <Skeleton className="h-12 w-full rounded-md bg-zinc-100" />
        </div>
      </div>
    </div>
  );
}
