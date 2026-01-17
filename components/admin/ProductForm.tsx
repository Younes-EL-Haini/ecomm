"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product";
import {
  Category,
  Product,
  ProductImage,
  ProductVariant,
} from "@/lib/generated/prisma";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  Package,
  Globe,
  Image as ImageIcon,
  X,
  Plus,
} from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

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

  const [images, setImages] = useState<string[]>(
    initialData?.images.map((img) => img.url) || [],
  );

  const onUpload = (result: any) => {
    setImages((prev) => [...prev, result.info.secure_url]);
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((image) => image !== url));
  };

  async function handleSubmit(formData: FormData) {
    // Use a type cast to tell TS both functions return a success object
    const action = (
      isEditing ? updateProduct.bind(null, initialData!.id) : createProduct
    ) as (data: FormData) => Promise<{ success: boolean; error?: string }>;

    toast.promise(action(formData), {
      loading: isEditing ? "Saving changes..." : "Creating product...",
      success: (result) => {
        if (!result?.success) {
          throw new Error(result?.error || "Something went wrong");
        }

        // Perform the redirect and refresh here
        router.push("/admin/products");
        router.refresh();

        return isEditing ? "Product updated!" : "Product created!";
      },
      error: (err) => err.message || "Failed to save product",
    });
  }

  return (
    <form action={handleSubmit} className="relative max-w-6xl mx-auto pb-32">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {isEditing ? "Edit Product" : "New Product"}
          </h1>
          <p className="text-slate-500 mt-1">
            {isEditing
              ? `Product ID: ${initialData.id}`
              : "Set up your product details and variants."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT COLUMN: MAIN CONTENT --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* GENERAL INFO CARD */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
              <LayoutGrid size={18} className="text-slate-400" />
              <h2 className="font-semibold text-slate-800">Basic Details</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Product Title
                </label>
                <Input
                  name="title"
                  defaultValue={initialData?.title}
                  placeholder="e.g. Premium Cotton T-Shirt"
                  className="h-11 border-slate-200 focus:ring-black focus:border-black"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <Textarea
                  name="description"
                  defaultValue={initialData?.description}
                  placeholder="Tell customers more about this item..."
                  className="min-h-[150px] border-slate-200 focus:ring-black focus:border-black resize-none"
                  required
                />
              </div>
            </div>
          </section>

          {/* VARIANTS CARD */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-slate-400" />
                <h2 className="font-semibold text-slate-800">
                  Variants & Inventory
                </h2>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 border-dashed"
              >
                + Add Row
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                    <th className="px-6 py-3">Variant Name</th>
                    <th className="px-6 py-3">SKU</th>
                    <th className="px-6 py-3 text-center">Stock</th>
                    <th className="px-6 py-3 text-right">Price Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {initialData?.variants?.map((variant) => (
                    <tr
                      key={variant.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {variant.name}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                        {variant.sku || "—"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${variant.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                        >
                          {variant.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600">
                        {variant.priceDelta ? `+$${variant.priceDelta}` : "—"}
                      </td>
                    </tr>
                  ))}
                  {(!initialData?.variants ||
                    initialData.variants.length === 0) && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-10 text-center text-slate-400 italic"
                      >
                        No variants specified.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* SEO CARD */}
          <section className="bg-slate-900 text-slate-300 rounded-xl border border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-blue-400" />
              <h2 className="font-semibold text-white">
                Search Engine Listing
              </h2>
            </div>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">
                  URL Slug
                </label>
                <div className="flex rounded-md overflow-hidden ring-1 ring-slate-700">
                  <span className="px-3 py-2 bg-slate-800 text-slate-500 text-sm select-none">
                    /products/
                  </span>
                  <input
                    name="slug"
                    defaultValue={initialData?.slug}
                    className="flex-1 bg-transparent px-3 py-2 text-sm text-blue-400 outline-none"
                    placeholder="product-url-slug"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* --- RIGHT COLUMN: SIDEBAR --- */}
        <div className="space-y-8">
          {/* STATUS CARD */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-slate-800">Product Status</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Published</span>
                  <span className="text-xs text-slate-500 italic">
                    Live on store
                  </span>
                </div>
                <input
                  type="checkbox"
                  name="isPublished"
                  defaultChecked={initialData?.isPublished}
                  className="w-5 h-5 accent-black rounded cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Featured</span>
                  <span className="text-xs text-slate-500 italic">
                    Home hero section
                  </span>
                </div>
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={initialData?.featured}
                  className="w-5 h-5 accent-black rounded cursor-pointer"
                />
              </label>
            </div>
          </section>

          {/* PRICING & CAT */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Base Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  $
                </span>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={initialData?.price.toString()}
                  className="pl-8 bg-slate-50 focus:bg-white"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                name="categoryId"
                defaultValue={initialData?.categoryId}
                className="w-full h-11 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* MEDIA CARD */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <ImageIcon size={18} className="text-slate-400" />
              <h2 className="font-semibold text-slate-800">Product Images</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((url) => (
                <div
                  key={url}
                  className="relative aspect-square rounded-lg overflow-hidden border"
                >
                  <img
                    src={url}
                    alt="Product"
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                  >
                    <X size={14} />
                  </button>
                  {/* HIDDEN INPUTS: These send the data to your Server Action */}
                  <input type="hidden" name="images" value={url} />
                </div>
              ))}

              <CldUploadWidget
                uploadPreset="my_shop_preset"
                onSuccess={onUpload}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-50 transition"
                  >
                    <Plus className="text-slate-400 mb-2" />
                    <span className="text-xs font-medium text-slate-500">
                      Upload
                    </span>
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </section>
        </div>
      </div>

      {/* --- STICKY ACTION FOOTER --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-slate-200 z-100">
        <div className="max-w-6xl mx-auto flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            type="button"
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-800"
          >
            Discard
          </Button>
          <Button
            type="submit"
            size="lg"
            className="px-8 bg-slate-900 hover:bg-black text-white rounded-full transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            {isEditing ? "Save Product Changes" : "Create Product"}
          </Button>
        </div>
      </div>
    </form>
  );
}
