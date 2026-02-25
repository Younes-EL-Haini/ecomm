"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  const skeletonBg = "bg-zinc-200/80";

  return (
    /* This wrapper is the secret. 
       'w-full bg-white' makes the page white INSTANTLY.
       '-mt-2' (if needed) and 'min-h-screen' ensures no gray shows.
    */
    <div className="w-full bg-white min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* GALLERY SIDE */}
          <div className="flex flex-col gap-4">
            <Skeleton
              className={`aspect-4/5 w-full rounded-3xl ${skeletonBg}`}
            />
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className={`h-20 w-20 rounded-2xl ${skeletonBg}`}
                />
              ))}
            </div>
          </div>

          {/* INFO SIDE */}
          <div className="space-y-6">
            <Skeleton className={`h-10 w-3/4 rounded-lg ${skeletonBg}`} />
            <Skeleton className={`h-4 w-32 ${skeletonBg}`} />
            <div className="space-y-4 pt-10">
              <Skeleton className={`h-8 w-24 ${skeletonBg}`} />
              <Skeleton className={`h-10 w-full rounded-full ${skeletonBg}`} />
              <Skeleton className={`h-12 w-full rounded-full ${skeletonBg}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
