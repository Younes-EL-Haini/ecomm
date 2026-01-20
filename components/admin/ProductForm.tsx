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
  ArrowLeft,
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

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [images, setImages] = useState<{ url: string; color?: string }[]>(
    initialData?.images.map((img) => ({
      url: img.url,
      color: img.color ?? undefined,
    })) || [],
  );

  const onUpload = (result: any) => {
    setImages((prev) => [
      ...prev,
      {
        url: result.info.secure_url,
        color: selectedColor ?? undefined,
      },
    ]);
  };

  const visibleImages = selectedColor
    ? images.filter((img) => img.color === selectedColor)
    : images;

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((image) => image.url !== url));
  };

  async function handleSubmit(formData: FormData) {
    const action = (
      isEditing ? updateProduct.bind(null, initialData!.id) : createProduct
    ) as (data: FormData) => Promise<{ success: boolean; error?: string }>;

    toast.promise(action(formData), {
      loading: isEditing ? "Saving changes..." : "Creating product...",
      success: (result) => {
        if (!result?.success)
          throw new Error(result?.error || "Something went wrong");
        router.push("/admin/products");
        router.refresh();
        return isEditing ? "Product updated!" : "Product created!";
      },
      error: (err) => err.message || "Failed to save product",
    });
  }

  return (
    <form action={handleSubmit} className="relative min-h-screen pb-20">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-black transition-colors mb-4"
          >
            <ArrowLeft size={16} /> Back to Products
          </button>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            {isEditing ? "Edit Product" : "New Product"}
          </h1>
        </div>
      </div>

      {/* --- MAIN GRID --- */}
      {/* items-start is crucial to prevent the sidebar from stretching to full height */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
        {/* --- LEFT COLUMN: MAIN CONTENT --- */}
        <div className="space-y-8">
          {/* GENERAL INFO */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b">
              <LayoutGrid size={20} className="text-indigo-500" />
              <h2 className="font-bold text-slate-800 text-lg">
                Product Details
              </h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Title
                </label>
                <Input
                  name="title"
                  defaultValue={initialData?.title}
                  className="h-12 text-base border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Description
                </label>
                <Textarea
                  name="description"
                  defaultValue={initialData?.description}
                  className="min-h-[200px] border-slate-200 focus:ring-2 focus:ring-indigo-500/20 resize-none"
                  required
                />
              </div>
            </div>
          </section>

          {/* VARIANTS */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b">
              <div className="flex items-center gap-2">
                <Package size={20} className="text-emerald-500" />
                <h2 className="font-bold text-slate-800 text-lg">
                  Inventory & Variants
                </h2>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg"
              >
                + Add Row
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b">
                  <tr>
                    <th className="px-6 py-4">Variant</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4 text-center">Stock</th>
                    <th className="px-6 py-4 text-right">Price Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {initialData?.variants?.map((variant) => (
                    <tr
                      key={variant.id}
                      onClick={() => {
                        setSelectedColor(variant.color ?? null);
                        setSelectedSize(variant.size ?? null);
                      }}
                      className={`cursor-pointer transition-colors ${
                        selectedColor === variant.color &&
                        selectedSize === variant.size
                          ? "bg-indigo-50/50"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold">
                        {variant.name}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                        {variant.sku || "—"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${variant.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                        >
                          {variant.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-600">
                        {variant.priceDelta ? `+$${variant.priceDelta}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* MEDIA - FIXING THE WHITE SPACE ISSUE HERE */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon size={20} className="text-amber-500" />
              <h2 className="font-bold text-slate-800 text-lg">Images</h2>
              {selectedColor && (
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  Filtering by {selectedColor}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {visibleImages.map((img) => (
                <div
                  key={img.url}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border"
                >
                  <img src={img.url} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(img.url)}
                    className="absolute top-2 right-2 bg-white text-rose-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-lg"
                  >
                    <X size={14} />
                  </button>
                  <input type="hidden" name="images" value={img.url} />
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
                    className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 transition"
                  >
                    <Plus className="text-slate-400 mb-1" size={24} />
                    <span className="text-xs font-bold text-slate-400">
                      Upload
                    </span>
                  </button>
                )}
              </CldUploadWidget>

              {/* EMPTY STATE within section */}
              {visibleImages.length === 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <p className="text-sm italic">
                    No images for this color selection.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* --- RIGHT COLUMN: SIDEBAR (STICKY) --- */}
        <aside className="lg:sticky lg:top-8 space-y-6">
          {/* PRICING */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-800">Pricing & Category</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Base Price
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={initialData?.price.toString()}
                    className="pl-8 bg-slate-50"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Category
                </span>
                <select
                  name="categoryId"
                  defaultValue={initialData?.categoryId}
                  className="w-full h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm focus:ring-1 focus:ring-black outline-none"
                  required
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

          {/* STATUS */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
            <h3 className="font-bold text-slate-800 mb-2">Visibility</h3>
            {[
              { id: "isPublished", label: "Published" },
              { id: "featured", label: "Featured Product" },
            ].map((item) => (
              <label
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 cursor-pointer transition"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <input
                  type="checkbox"
                  name={item.id}
                  defaultChecked={(initialData as any)?.[item.id]}
                  className="w-5 h-5 accent-black"
                />
              </label>
            ))}
          </section>

          {/* SEO - Moved to bottom of sidebar */}
          <section className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-blue-400" />
              <h3 className="font-bold">SEO Listing</h3>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">
                URL Slug
              </label>
              <div className="flex bg-slate-800 rounded-lg overflow-hidden ring-1 ring-slate-700">
                <span className="px-3 py-2 text-slate-500 text-xs border-r border-slate-700">
                  /p/
                </span>
                <input
                  name="slug"
                  defaultValue={initialData?.slug}
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-blue-300 outline-none"
                />
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* --- FLOATING ACTION FOOTER --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/60 backdrop-blur-xl border-t border-slate-200 z-100">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <p className="hidden sm:block text-sm text-slate-500 font-medium italic">
            {isEditing ? `Editing: ${initialData.title}` : "Unsaved Product"}
          </p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" type="button" onClick={() => router.back()}>
              Discard
            </Button>
            <Button
              type="submit"
              size="lg"
              className="px-12 bg-black hover:bg-slate-800 text-white rounded-full transition-transform active:scale-95 shadow-xl"
            >
              {isEditing ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
