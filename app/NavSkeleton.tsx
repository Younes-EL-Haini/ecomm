import { Skeleton } from "@/components/ui/skeleton";

const NavSkeleton = () => {
  return (
    <nav className="w-full border-b bg-white h-16 flex items-center">
      <div className="max-w-7xl mx-auto w-full flex justify-between px-4">
        <div className="flex items-center gap-8">
          <Skeleton className="h-6 w-24" /> {/* Logo placeholder */}
          <div className="hidden md:flex gap-6">
            <Skeleton className="h-4 w-20" /> {/* Link 1 */}
            <Skeleton className="h-4 w-20" /> {/* Link 2 */}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-full" />{" "}
          {/* Avatar/Mobile Menu placeholder */}
        </div>
      </div>
    </nav>
  );
};

export default NavSkeleton;
