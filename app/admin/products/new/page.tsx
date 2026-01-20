import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  // 1. Fetch data needed for the form
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-8 max-w-7xl mx-auto">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
