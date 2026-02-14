import { Skeleton } from "../ui/skeleton";

const HeroSkeleton = () => {
  return (
    // Match the outer container: max-width [1400px], mx-auto, px-4, py-6
    <div className="w-full max-w-[1400px] mx-auto px-4 py-6">
      {/* Match the Hero Box: h-[75vh] on mobile, h-[70vh] on md, rounded-[2.5rem] */}
      <div className="relative h-[75vh] md:h-[70vh] w-full overflow-hidden rounded-[2.5rem] bg-zinc-50 border border-slate-100 flex items-center">
        {/* Match the TEXT LAYER position: p-6 on mobile, lg:p-24 */}
        <div className="w-full flex justify-center md:justify-start p-6 lg:p-24 z-20">
          <div className="max-w-xl w-full text-center md:text-left space-y-6">
            {/* Header Skeleton (EXPLORE THE NEW) */}
            <div className="space-y-3 flex flex-col items-center md:items-start">
              <Skeleton className="h-10 md:h-16 w-64 md:w-96 rounded-xl bg-zinc-200/60" />
              <Skeleton className="h-10 md:h-16 w-48 md:w-64 rounded-xl bg-zinc-200/60" />
            </div>

            {/* Paragraph Skeleton */}
            <div className="space-y-2 flex flex-col items-center md:items-start">
              <Skeleton className="h-4 w-56 bg-zinc-200/50" />
              <Skeleton className="h-4 w-48 bg-zinc-200/50" />
            </div>

            {/* Button Skeleton: rounded-full, px-8, py-6 */}
            <Skeleton className="h-[60px] w-40 rounded-full bg-zinc-200/80 mt-4" />
          </div>
        </div>

        {/* IMAGE PLACEHOLDER (The Shoes/Product) */}
        <div className="absolute right-0 bottom-10 hidden md:block md:pr-20 lg:pr-32">
          <Skeleton className="h-[300px] w-[400px] rounded-3xl bg-zinc-200/40" />
        </div>

        {/* DOTS (Bottom center) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          <Skeleton className="h-1.5 w-10 rounded-full bg-zinc-200" />
          <Skeleton className="h-1.5 w-4 rounded-full bg-zinc-200" />
          <Skeleton className="h-1.5 w-4 rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
};

export default HeroSkeleton;
