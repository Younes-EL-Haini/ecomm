// import React from "react";
// import { Skeleton } from "../ui/skeleton";

// const HeroSkeleton = () => {
//   return (
//     <section className="flex flex-col items-center justify-center p-6 md:flex-row md:justify-between bg-gray-50 min-h-[60vh] gap-6">
//       {/* Text Content Skeleton */}
//       <div className="w-full md:w-1/2 order-1">
//         <Skeleton />
//       </div>

//       {/* Image below text on mobile */}
//       <div className="w-full md:w-1/2 order-2">
//         <Skeleton />
//       </div>
//     </section>
//   );
// };

// export default HeroSkeleton;

// components/Hero/HeroSkeleton.tsx
import React from "react";
import { Skeleton } from "../ui/skeleton";

const HeroSkeleton = () => {
  return (
    <section className="flex flex-col items-center justify-center p-6 md:flex-row md:justify-between bg-gray-50 min-h-[60vh] gap-6">
      {/* Text Content Skeleton */}
      <div className="w-full md:w-1/2 order-1 pr-10">
        {/* Mimic Welcome Text (text-xl, mb-2) */}
        <Skeleton className="h-7 w-48 mb-2 rounded-md" />

        {/* Mimic Main Header (text-5xl, leading-tight, mb-4) */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-12 w-[90%] rounded-lg" />
          <Skeleton className="h-12 w-[70%] rounded-lg" />
        </div>

        {/* Mimic Descriptive Text (text-lg, mb-8) */}
        <div className="space-y-3 mb-8">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-[95%]" />
          <Skeleton className="h-5 w-[40%]" />
        </div>

        {/* Mimic Two Buttons (flex space-x-4) */}
        <div className="flex space-x-4">
          {/* Browse Products button skeleton */}
          <Skeleton className="h-[76px] w-48 rounded-md" />
          {/* About Us button skeleton */}
          <Skeleton className="h-[76px] w-36 rounded-md" />
        </div>
      </div>

      {/* Image Skeleton */}
      <div className="w-full md:w-1/2 order-2">
        {/* Mimic a large image (usually 16:9 or square) */}
        <Skeleton className="aspect-video w-full rounded-2xl" />
      </div>
    </section>
  );
};

export default HeroSkeleton;
