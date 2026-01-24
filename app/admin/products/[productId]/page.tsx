import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";
import { getCategories, getProductForEdit } from "@/lib/actions/product";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const [product, categories] = await Promise.all([
    getProductForEdit(productId),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-8 max-w-7xl mx-auto">
        <ProductForm categories={categories} initialData={product} />
      </div>
    </div>
  );
}
