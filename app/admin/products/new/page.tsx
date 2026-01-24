import ProductForm from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/actions/product";

export default async function NewProductPage() {
  // 1. Fetch data needed for the form
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-8 max-w-7xl mx-auto">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
