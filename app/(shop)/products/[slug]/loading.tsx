import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Skeleton className="h-8 w-24 bg-zinc-100 mt-4" />
    </div>
  );
}
