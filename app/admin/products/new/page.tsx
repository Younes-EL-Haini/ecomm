import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  // 1. Fetch data needed for the form
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8 max-w-3xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
        <div className="text-sm text-muted-foreground">Draft mode enabled</div>
      </div>

      {/* 2. Reuse the shared Client Component */}
      <ProductForm categories={categories} />
    </div>
  );
}
