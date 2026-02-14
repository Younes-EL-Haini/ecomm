import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* LEFT: Shipping & Payment (7 Cols) */}
      <div className="lg:col-span-7 space-y-8">
        {/* --- ADDRESS FORM SKELETON --- */}
        <div className="bg-white p-8 border rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-7 w-40" />
          </div>

          {/* Search Bar Section */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <div className="flex gap-2">
              <Skeleton className="h-11 flex-1 rounded-md" />
              <Skeleton className="h-11 w-12 rounded-md" />
            </div>
          </div>

          {/* Map Section: Matches h-64 */}
          <Skeleton className="h-64 w-full rounded-xl" />

          {/* Inputs Grid */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* --- PAYMENT FORM SKELETON --- */}
        <div className="bg-white p-8 border rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-7 w-40" />
          </div>
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>

      {/* RIGHT: Order Summary (5 Cols) */}
      <div className="lg:col-span-5">
        <div className="bg-white p-6 rounded-2xl border sticky top-10 space-y-6">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full rounded-md pt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
