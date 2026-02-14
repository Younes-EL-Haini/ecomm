import { Skeleton } from "@/components/ui/skeleton";

const NavSkeleton = () => {
  return (
    // Match the real nav: sticky, h-12, bg-gray-100, and px-6
    <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-gray-100 backdrop-blur-xl h-12 flex items-center">
      <div className="max-w-7xl mx-auto w-full flex justify-between px-6 items-center">
        <div className="flex items-center gap-10">
          {/* Match "STORE." text size with a skeleton */}
          <Skeleton className="h-5 w-16 bg-zinc-200" />

          <div className="hidden md:flex gap-8">
            <Skeleton className="h-3 w-14 bg-zinc-200" />
            <Skeleton className="h-3 w-14 bg-zinc-200" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Avatar and Mobile toggle placeholders */}
          <Skeleton className="h-8 w-8 rounded-full bg-zinc-200" />
          <Skeleton className="h-8 w-8 rounded-lg md:hidden bg-zinc-200" />
        </div>
      </div>
    </nav>
  );
};

export default NavSkeleton;
