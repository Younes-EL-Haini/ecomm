"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product"; // We'll create updateProduct next

import {
  Category,
  Product,
  ProductImage,
  ProductVariant,
} from "@/lib/generated/prisma";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  categories: Category[];
  initialData?:
    | (Product & { images: ProductImage[] } & { variants: ProductVariant[] })
    | null;
}

export default function ProductForm({
  categories,
  initialData,
}: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  console.log(initialData?.variants, initialData);

  async function handleSubmit(formData: FormData) {
    const action = isEditing
      ? updateProduct.bind(null, initialData.id)
      : createProduct;

    const result = await action(formData);

    if (result?.success) {
      toast.success(isEditing ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } else {
      toast.error(result?.error || "Something went wrong");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Visibility */}
      {/* --- SECTION: VARIANTS MANAGER --- */}
      <section className="p-6 border rounded-xl space-y-4 bg-white">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-lg font-semibold">Product Variants</h2>
          <Button type="button" variant="outline" size="sm">
            + Add Variant
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2">Variant Name</th>
                <th className="px-4 py-2">Type (Size/Color)</th>
                <th className="px-4 py-2">SKU</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Price +/-</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {initialData?.variants?.map((variant) => (
                <tr key={variant.id}>
                  <td className="px-4 py-3 font-medium">{variant.name}</td>
                  <td className="px-4 py-3">
                    {variant.type}: {variant.value}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {variant.sku || "N/A"}
                  </td>
                  <td
                    className={`px-4 py-3 font-bold ${
                      variant.stock > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {variant.stock}
                  </td>
                  <td className="px-4 py-3">
                    {variant.priceDelta
                      ? `+$${variant.priceDelta}`
                      : "Base Price"}
                  </td>
                </tr>
              ))}
              {(!initialData?.variants ||
                initialData.variants.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    No variants added yet. This product is currently "One
                    Size/Color".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* General Info */}
      <section className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Product Title</label>
          <Input name="title" defaultValue={initialData?.title} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Price (USD)</label>
            <Input
              name="price"
              type="number"
              step="0.01"
              defaultValue={initialData?.price.toString()}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              name="categoryId"
              defaultValue={initialData?.categoryId}
              required
              className="w-full h-10 border rounded-md px-3 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="p-6 border-2 border-dashed rounded-xl space-y-4 bg-blue-50/30">
        <label className="text-sm font-medium text-blue-900">URL Slug</label>
        <Input
          name="slug"
          defaultValue={initialData?.slug}
          placeholder="midnight-running-shoes"
          required
        />
        <label className="text-sm font-medium text-blue-900">Description</label>
        <Textarea
          name="description"
          defaultValue={initialData?.description}
          required
        />
      </section>

      {/* Media (Simplified for now) */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Images</h2>
        <Input
          name="image1"
          defaultValue={initialData?.images[0]?.url}
          placeholder="Image URL"
          required
        />
      </section>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t flex justify-center z-50">
        <div className="max-w-3xl w-full flex gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.back()}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-2">
            {isEditing ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </div>
    </form>
  );
}
