export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 border-4 border-red-500">
      <h1 className="text-2xl font-bold mb-4">SKELETON IS ACTIVE</h1>
      {/* We use a raw div with a specific color instead of the Skeleton component */}
      <div className="h-20 w-full bg-blue-500 animate-pulse rounded-lg">
        TESTING VISIBILITY
      </div>
    </div>
  );
}
