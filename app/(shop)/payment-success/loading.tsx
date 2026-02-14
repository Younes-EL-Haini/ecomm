import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentSuccessLoading() {
  return (
    <div className="min-h-screen bg-zinc-100/80 flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-4xl shadow-xl overflow-hidden border border-white">
          {/* Header Section Skeleton */}
          <div className="bg-zinc-900 p-10 text-center flex flex-col items-center">
            <Skeleton className="w-20 h-20 rounded-full bg-zinc-800 mb-6" />
            <Skeleton className="h-8 w-48 bg-zinc-800 rounded-lg mb-2" />
            <Skeleton className="h-4 w-32 bg-zinc-800 rounded-md" />
          </div>

          <div className="p-10 space-y-10">
            {/* Confirmation Text Skeleton */}
            <div className="space-y-3 flex flex-col items-center">
              <Skeleton className="h-7 w-40 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>

            {/* Order Details Box Skeleton */}
            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200/60">
              <div className="flex items-center justify-between mb-6 border-b border-zinc-200 pb-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-12 rounded" />
              </div>

              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}

                <div className="pt-4 border-t border-zinc-200 flex justify-between items-baseline">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-28" />
                </div>
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-14 rounded-xl w-full" />
              <Skeleton className="h-14 rounded-xl w-full" />
            </div>
          </div>
        </div>

        {/* Footer Text Skeleton */}
        <div className="flex justify-center mt-8">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    </div>
  );
}
