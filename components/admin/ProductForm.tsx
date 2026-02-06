"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  createProduct,
  getProductForEdit,
  updateProduct,
} from "@/lib/products";
import { Category } from "@/lib/generated/prisma";
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
import { formatMoney, toNumber } from "@/lib/utils/pricing";

interface VariantFormState {
  tempId: string;
  id?: string; // Optional because new rows don't have one
  name: string;
  sku: string | null;
  stock: number;
  priceDelta: number;
  color: string | null;
  size: string | null;
  // Make these optional so the "New Row" doesn't crash
  createdAt?: Date | string;
  productId?: string;
  type?: string;
  value?: string;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: Awaited<ReturnType<typeof getProductForEdit>>;
}

export default function ProductForm({
  categories,
  initialData,
}: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Initialize with existing variants or one empty row for a new product
  const [variants, setVariants] = useState<VariantFormState[]>(
    initialData?.variants?.length
      ? initialData.variants.map((v) => ({ ...v, tempId: v.id }))
      : [
          {
            tempId: "1",
            name: "",
            sku: "",
            stock: 0,
            priceDelta: 0,
            color: "",
            size: "",
          },
        ],
  );

  const addVariant = () => {
    const newVariant = {
      tempId: Math.random().toString(36).substr(2, 9),
      name: "",
      sku: "",
      stock: 0,
      priceDelta: 0,
      color: selectedColor || "", // Pre-fill with active color filter
      size: "",
    };
    setVariants([...variants, newVariant]);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    // Auto-generate name for the UI
    const color = updated[index].color;
    const size = updated[index].size;
    updated[index].name =
      size && color ? `${size} / ${color}` : size || color || "Default";
    setVariants(updated);
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 1) return; // Keep at least one
    setVariants(variants.filter((_, i) => i !== index));
  };

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
      <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8 items-start">
        {/* --- LEFT COLUMN: MAIN CONTENT --- */}
        <div className="space-y-8 min-w-0">
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
                onClick={addVariant}
                className="rounded-lg border-slate-200 hover:bg-slate-50"
              >
                <Plus size={16} className="mr-1" /> Add Row
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      Variant Details (Color/Size)
                    </th>
                    <th className="px-6 py-4 text-left">SKU</th>
                    <th className="px-6 py-4 text-center">Stock</th>
                    <th className="px-6 py-4 text-right">Price Delta</th>
                    <th className="px-4 py-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {variants.map((variant, index) => (
                    <tr
                      key={variant.tempId}
                      onClick={() => {
                        setSelectedColor(variant.color ?? null);
                        setSelectedSize(variant.size ?? null);
                      }}
                      className={`group transition-colors ${
                        selectedColor === variant.color &&
                        selectedSize === variant.size
                          ? "bg-indigo-50/50"
                          : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <input
                            placeholder="Color"
                            className="w-24 bg-transparent border-b border-transparent focus:border-indigo-500 outline-none font-semibold transition-colors"
                            value={variant.color || ""}
                            onChange={(e) =>
                              updateVariant(index, "color", e.target.value)
                            }
                          />
                          <span className="text-slate-300">/</span>
                          <input
                            placeholder="Size"
                            className="w-20 bg-transparent border-b border-transparent focus:border-indigo-500 outline-none font-semibold transition-colors"
                            value={variant.size || ""}
                            onChange={(e) =>
                              updateVariant(index, "size", e.target.value)
                            }
                          />
                        </div>
                        {/* Hidden inputs to send data to Server Action */}
                        <input
                          type="hidden"
                          name="v_color"
                          value={variant.color || ""}
                        />
                        <input
                          type="hidden"
                          name="v_size"
                          value={variant.size || ""}
                        />
                      </td>

                      <td className="px-6 py-4">
                        <input
                          name="v_sku"
                          placeholder="SKU-AUTO"
                          className="w-32 bg-transparent border-b border-transparent focus:border-indigo-500 outline-none font-mono text-xs text-slate-500"
                          value={variant.sku || ""}
                          onChange={(e) =>
                            updateVariant(index, "sku", e.target.value)
                          }
                        />
                      </td>

                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          name="v_stock"
                          className="w-16 bg-slate-100 rounded px-2 py-1 text-center font-bold text-xs"
                          value={variant.stock}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "stock",
                              parseInt(e.target.value) || 0,
                            )
                          }
                        />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-slate-400 text-xs">$</span>
                          <input
                            type="number"
                            step="0.01"
                            name="v_priceDelta"
                            className="w-20 bg-transparent border-b border-transparent focus:border-indigo-500 outline-none text-right font-medium text-indigo-600"
                            value={variant.priceDelta}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "priceDelta",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                          />
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X size={16} />
                        </button>
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
                <div key={img.url} className="group relative aspect-square ...">
                  <img
                    src={img.url}
                    className="w-full h-full object-cover rounded-xl"
                  />

                  {/* 1. The URL */}
                  <input type="hidden" name="image_url" value={img.url} />

                  {/* 2. The Color associated with this specific image */}
                  {/* Even if selectedColor is null, we send an empty string to keep the arrays aligned */}
                  <input
                    type="hidden"
                    name="image_color"
                    value={img.color || ""}
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(img.url)}
                    className="..."
                  >
                    <X size={14} />
                  </button>
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
                    defaultValue={toNumber(initialData?.price) || ""}
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
                  /products/
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
