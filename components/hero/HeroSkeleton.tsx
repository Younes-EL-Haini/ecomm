import { Skeleton } from "../ui/skeleton";

const HeroSkeleton = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-6">
      {/* Container matched to dark hero wrapper */}
      <div className="relative h-[75vh] md:h-[70vh] w-full overflow-hidden rounded-[2.5rem] bg-zinc-950 border border-slate-800 flex items-center">
        {/* TEXT CONTENT SKELETON */}
        <div className="w-full flex justify-start p-8 md:p-16 lg:p-24 z-20">
          <div className="max-w-xl w-full text-left space-y-6">
            {/* Title Skeleton (2 lines, white-tinted skeleton) */}
            <div className="space-y-3">
              <Skeleton className="h-10 sm:h-12 md:h-16 w-3/4 md:w-full rounded-xl bg-zinc-800/80" />
              <Skeleton className="h-10 sm:h-12 md:h-16 w-1/2 md:w-2/3 rounded-xl bg-zinc-800/80" />
            </div>

            {/* Subtitle Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-72 sm:w-80 bg-zinc-800/60" />
              <Skeleton className="h-4 w-56 sm:w-64 bg-zinc-800/60" />
            </div>

            {/* Button Skeleton */}
            <Skeleton className="h-14 w-36 rounded-full bg-zinc-800/90 mt-4" />
          </div>
        </div>

        {/* INDICATOR DOTS SKELETON */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
          <Skeleton className="h-2 w-8 rounded-full bg-zinc-800" />
          <Skeleton className="h-2 w-2 rounded-full bg-zinc-800/50" />
          <Skeleton className="h-2 w-2 rounded-full bg-zinc-800/50" />
        </div>
      </div>
    </div>
  );
};

export default HeroSkeleton;
