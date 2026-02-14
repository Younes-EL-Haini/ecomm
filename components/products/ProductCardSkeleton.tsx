import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductCardSkeleton = () => {
  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-4xl border-none bg-white p-0 shadow-sm">
      {/* 1. Image Aspect Ratio: 4/5 */}
      <Skeleton className="aspect-4/5 w-full rounded-none bg-zinc-100" />

      {/* 2. Color Swatches Section */}
      <div className="flex items-center justify-center gap-1.5 pt-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="size-3 rounded-full bg-zinc-100" />
        ))}
      </div>

      {/* 3. Content Section */}
      <CardContent className="flex flex-1 flex-col p-5 space-y-3">
        {/* Category Label */}
        <Skeleton className="h-3 w-16 bg-zinc-100" />
        {/* Title */}
        <Skeleton className="h-5 w-full bg-zinc-100" />

        <div className="mt-4 flex items-center justify-between">
          {/* Price */}
          <Skeleton className="h-4 w-12 bg-zinc-100" />
          {/* "View Details" text */}
          <Skeleton className="h-3 w-14 bg-zinc-100" />
        </div>
      </CardContent>
    </Card>
  );
};
