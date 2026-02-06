"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, updateProduct } from "@/lib/products";
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
  Eye,
} from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useState, useRef, useEffect } from "react"; // Added useRef and useEffect
import { toNumber } from "@/lib/utils/pricing";

interface VariantFormState {
  tempId: string;
  id?: string;
  name: string;
  sku: string | null;
  stock: number;
  priceDelta: number;
  color: string | null;
  size: string | null;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: any;
}

export default function ProductForm({
  categories,
  initialData,
}: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  // 1. STATE MANAGEMENT
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // --- THE FIX: USE REFS FOR UPLOAD ---
  // This ensures the upload function ALWAYS sees the current input values
  const colorRef = useRef<string | null>(null);
  const sizeRef = useRef<string | null>(null);

  useEffect(() => {
    colorRef.current = selectedColor;
    sizeRef.current = selectedSize;
  }, [selectedColor, selectedSize]);

  const [variants, setVariants] = useState<VariantFormState[]>(
    initialData?.variants?.length
      ? initialData.variants.map((v: any) => ({ ...v, tempId: v.id }))
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

  const [images, setImages] = useState<
    { url: string; color?: string; size?: string }[]
  >(
    initialData?.images.map((img: any) => ({
      url: img.url,
      color: img.color ?? "",
      size: img.size ?? "",
    })) || [],
  );

  // 2. FILTER LOGIC
  const isFilterActive = selectedColor !== null;

  const visibleImages = !isFilterActive
    ? images
    : images.filter((img) => {
        const imgColor = (img.color || "").toString().trim().toLowerCase();
        const selColor = (selectedColor || "").toString().trim().toLowerCase();
        return imgColor === selColor;
      });

  // 3. HANDLERS
  const onUpload = (result: any) => {
    // Grab the values from the Ref so they are 100% up to date
    const currentColor = colorRef.current || "";
    const currentSize = sizeRef.current || "";

    if (!currentColor) {
      toast.info("Image added to Full Gallery (No color selected)");
    } else {
      toast.success(`Image added to ${currentColor} gallery`);
    }

    setImages((prev) => [
      ...prev,
      {
        url: result.info.secure_url,
        color: currentColor,
        size: currentSize,
      },
    ]);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-update selection if we are currently editing the selected variant
    if (field === "color" && selectedColor === variants[index].color) {
      setSelectedColor(value);
    }

    const color = updated[index].color;
    const size = updated[index].size;
    updated[index].name =
      size && color ? `${size} / ${color}` : size || color || "Default";
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        tempId: Math.random().toString(36).substr(2, 9),
        name: "",
        sku: "",
        stock: 0,
        priceDelta: 0,
        color: "",
        size: "",
      },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((image) => image.url !== url));
  };

  async function handleSubmit(formData: FormData) {
    const action = isEditing
      ? updateProduct.bind(null, initialData!.id)
      : createProduct;
    toast.promise(action(formData), {
      loading: isEditing ? "Saving changes..." : "Creating product...",
      success: (result: any) => {
        if (!result?.success) throw new Error(result?.error || "Error");
        router.push("/admin/products");
        router.refresh();
        return "Success!";
      },
      error: (err) => err.message || "Failed to save",
    });
  }

  return (
    <form action={handleSubmit} className="relative min-h-screen pb-20">
      {/* PERSISTENCE INPUTS */}
      {images.map((img, idx) => (
        <div key={`data-${idx}`}>
          <input type="hidden" name="image_url" value={img.url} />
          <input type="hidden" name="image_color" value={img.color || ""} />
          <input type="hidden" name="image_size" value={img.size || ""} />
        </div>
      ))}

      {/* HEADER */}
      <div className="px-4 pt-8 mb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-slate-500 mb-4 hover:text-black"
        >
          <ArrowLeft size={16} /> Back to Products
        </button>
        <h1 className="text-4xl font-extrabold text-slate-900">
          {isEditing ? "Edit Product" : "New Product"}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8 px-4">
        <div className="space-y-8">
          {/* PRODUCT DETAILS */}
          <section className="p-6 bg-white border rounded-2xl border-slate-200">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b">
              <LayoutGrid size={20} className="text-indigo-500" />
              <h2 className="text-lg font-bold">Product Details</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Title</label>
                <Input
                  name="title"
                  defaultValue={initialData?.title}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Description</label>
                <Textarea
                  name="description"
                  defaultValue={initialData?.description}
                  required
                  className="min-h-[150px]"
                />
              </div>
            </div>
          </section>

          {/* INVENTORY & VARIANTS */}
          <section className="overflow-hidden bg-white border rounded-2xl border-slate-200">
            <div className="flex items-center justify-between p-6 border-b bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Package size={20} className="text-emerald-500" />
                <h2 className="text-lg font-bold">Inventory</h2>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedColor(null);
                    setSelectedSize(null);
                  }}
                >
                  <Eye size={14} className="mr-1" /> View All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVariant}
                >
                  <Plus size={14} className="mr-1" /> Add Row
                </Button>
              </div>
            </div>

            <table className="w-full text-sm">
              <thead className="text-[10px] uppercase tracking-widest bg-slate-50 text-slate-500 border-b">
                <tr>
                  <th className="px-6 py-4 text-left">
                    Variant (Color / Size)
                  </th>
                  <th className="px-6 py-4 text-left">SKU</th>
                  <th className="px-6 py-4 text-center">Stock</th>
                  <th className="px-6 py-4 text-right">Price Delta</th>
                  <th className="w-10 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {variants.map((variant, index) => {
                  const isActive =
                    selectedColor === variant.color && isFilterActive;
                  return (
                    <tr
                      key={variant.tempId}
                      onClick={() => {
                        setSelectedColor(variant.color || "");
                        setSelectedSize(variant.size || "");
                      }}
                      className={`cursor-pointer transition-colors ${isActive ? "bg-indigo-50" : "hover:bg-slate-50"}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <input
                            placeholder="Color"
                            className="font-semibold bg-transparent outline-none w-14"
                            value={variant.color || ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              updateVariant(index, "color", v);
                              setSelectedColor(v); // Force state update for the gallery filter
                            }}
                          />
                          <span className="text-slate-300">/</span>
                          <input
                            placeholder="Size"
                            className="font-semibold bg-transparent outline-none w-14"
                            value={variant.size || ""}
                            onChange={(e) =>
                              updateVariant(index, "size", e.target.value)
                            }
                          />
                        </div>
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
                          value={variant.sku || ""}
                          onChange={(e) =>
                            updateVariant(index, "sku", e.target.value)
                          }
                          className="text-xs bg-transparent outline-none font-mono w-20"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          name="v_stock"
                          value={variant.stock}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "stock",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="w-16 px-2 py-1 text-center border rounded"
                        />
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-indigo-600">
                        $
                        <input
                          type="number"
                          step="0.01"
                          name="v_priceDelta"
                          value={variant.priceDelta}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "priceDelta",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-12 text-right bg-transparent outline-none"
                        />
                      </td>
                      <td className="px-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeVariant(index);
                          }}
                          className="text-slate-300 hover:text-rose-500"
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          {/* MEDIA SECTION */}
          <section className="p-6 bg-white border rounded-2xl border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ImageIcon size={20} className="text-amber-500" />
                <h2 className="text-lg font-bold">
                  {!isFilterActive
                    ? "Full Gallery"
                    : `${selectedColor} Gallery`}
                </h2>
              </div>
              {isFilterActive && (
                <div className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {selectedColor}
                  <button type="button" onClick={() => setSelectedColor(null)}>
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {visibleImages.map((img) => (
                <div
                  key={img.url}
                  className="relative border group aspect-square bg-slate-100 rounded-xl overflow-hidden"
                >
                  <img
                    src={img.url}
                    className="object-cover w-full h-full"
                    alt="Product"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-1 bg-black/40">
                    <p className="text-[8px] text-white text-center truncate">
                      {img.color || "General"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(img.url)}
                    className="absolute p-1 transition bg-white rounded-full shadow-sm top-2 right-2 text-rose-500 opacity-0 group-hover:opacity-100"
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
                    className="flex flex-col items-center justify-center transition border-2 border-dashed aspect-square border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 group"
                  >
                    <Plus
                      className="mb-1 text-slate-400 group-hover:text-indigo-500"
                      size={24}
                    />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Upload
                    </span>
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200 space-y-4">
            <h3 className="font-bold">Pricing & Category</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Base Price
                </span>
                <div className="relative">
                  <span className="absolute text-slate-400 left-3 top-1/2 -translate-y-1/2">
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
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Category
                </span>
                <select
                  name="categoryId"
                  defaultValue={initialData?.categoryId}
                  className="w-full h-10 px-3 text-sm border outline-none rounded-md bg-slate-50"
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

          <section className="p-6 space-y-3 bg-white border shadow-sm rounded-2xl border-slate-200">
            <h3 className="mb-2 font-bold">Visibility</h3>
            {[
              { id: "isPublished", label: "Published" },
              { id: "featured", label: "Featured" },
            ].map((item) => (
              <label
                key={item.id}
                className="flex items-center justify-between p-3 border cursor-pointer rounded-xl hover:bg-slate-50"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <input
                  type="checkbox"
                  name={item.id}
                  defaultChecked={initialData?.[item.id]}
                  className="w-5 h-5 accent-black"
                />
              </label>
            ))}
          </section>

          <section className="p-6 text-white bg-slate-900 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-blue-400" />
              <h3 className="font-bold">SEO</h3>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">
                Slug
              </label>
              <input
                name="slug"
                defaultValue={initialData?.slug}
                className="w-full px-3 py-2 text-sm text-blue-300 outline-none bg-slate-800 rounded-lg ring-1 ring-slate-700"
              />
            </div>
          </section>
        </aside>
      </div>

      {/* FOOTER BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <p className="text-sm italic text-slate-500">
            {isEditing ? `Editing: ${initialData.title}` : "New Product"}
          </p>
          <div className="flex gap-4">
            <Button variant="ghost" type="button" onClick={() => router.back()}>
              Discard
            </Button>
            <Button
              type="submit"
              size="lg"
              className="px-12 text-white bg-black rounded-full"
            >
              Save Product
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
