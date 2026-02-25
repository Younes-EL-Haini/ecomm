import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-zinc-50/50">
        {/* 1. GALLERY SKELETON */}
        <div className="flex flex-col gap-4">
          {/* Fixed aspect ratio syntax */}
          <Skeleton className="aspect-4/5 w-full rounded-3xl bg-zinc-100" />

          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-20 w-20 rounded-2xl bg-zinc-100" />
            <Skeleton className="h-20 w-20 rounded-2xl bg-zinc-100" />
            <Skeleton className="h-20 w-20 rounded-2xl bg-zinc-100" />
          </div>
        </div>

        {/* 2. INFO SKELETON */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-3/4 bg-zinc-100 rounded-lg" />
            <Skeleton className="h-4 w-32 bg-zinc-100" />
          </div>

          <Skeleton className="h-8 w-24 bg-zinc-100 mt-4" />
          <Skeleton className="h-4 w-20 bg-zinc-100" />

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12 bg-zinc-100" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={`size-${i}`}
                    className="h-10 w-16 rounded-full"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12 bg-zinc-100" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={`color-${i}`}
                    className="h-10 w-full rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-8">
            <div className="flex gap-3">
              <Skeleton className="h-12 w-32 rounded-full" />
              <Skeleton className="h-12 flex-1 rounded-full" />
            </div>
            <Skeleton className="h-12 w-full rounded-full" />
          </div>

          <div className="border-t pt-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
