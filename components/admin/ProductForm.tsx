"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Lib utilities
import { createProduct, updateProduct } from "@/lib/products";

// Extracted Components
import { InventoryTable } from "./InventoryTable";
import { MediaGallery } from "./MediaGallery";
import { ProductDetailsSection } from "./ProductDetailsSection";
import { ProductSidebar } from "./ProductSidebar";

export default function ProductForm({ categories, initialData }: any) {
  const router = useRouter();
  const isEditing = !!initialData;

  // 1. STATE MANAGEMENT
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Refs for Cloudinary stale closure fix
  const colorRef = useRef<string | null>(null);
  const sizeRef = useRef<string | null>(null);

  const [variants, setVariants] = useState(
    initialData?.variants?.length
      ? initialData.variants.map((v: any) => ({ ...v, tempId: v.id }))
      : [{ tempId: "1", color: "", size: "", stock: 0, priceDelta: 0 }],
  );

  const [images, setImages] = useState(
    initialData?.images?.map((img: any) => ({
      url: img.url,
      color: img.color ?? "",
      size: img.size ?? "",
    })) || [],
  );

  // Sync refs with state
  useEffect(() => {
    colorRef.current = selectedColor;
    sizeRef.current = selectedSize;
  }, [selectedColor, selectedSize]);

  // 2. FILTER LOGIC
  const isFilterActive = selectedColor !== null;
  const visibleImages = !isFilterActive
    ? images
    : images.filter(
        (img: any) =>
          (img.color || "").toString().trim().toLowerCase() ===
          selectedColor.toLowerCase().trim(),
      );

  // 3. HANDLERS
  const onUpload = (result: any) => {
    const newImage = {
      url: result.info.secure_url,
      color: colorRef.current || "",
      size: sizeRef.current || "",
    };
    setImages((prev: any) => [...prev, newImage]);
    toast.success(
      colorRef.current ? `Tagged as ${colorRef.current}` : "Added to General",
    );
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };

    // If we're changing the color of the currently selected row, update the filter
    if (field === "color" && selectedColor === variants[index].color) {
      setSelectedColor(value);
    }
    setVariants(updated);
  };

  // 4. SERVER ACTION SUBMISSION
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
        return "Product saved successfully!";
      },
      error: (err) => err.message || "Failed to save",
    });
  }

  return (
    <form action={handleSubmit} className="relative min-h-screen pb-20">
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
          {isEditing ? "Edit" : "New"} Product
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8 px-4">
        <div className="space-y-8">
          {/* PRODUCT DETAILS (Title/Description) */}
          <ProductDetailsSection
            initialTitle={initialData?.title}
            initialDescription={initialData?.description}
          />

          {/* VARIANTS TABLE */}
          <InventoryTable
            variants={variants}
            selectedColor={selectedColor}
            isFilterActive={isFilterActive}
            onAddVariant={() =>
              setVariants([
                ...variants,
                {
                  tempId: Date.now().toString(),
                  color: "",
                  size: "",
                  stock: 0,
                  priceDelta: 0,
                },
              ])
            }
            onUpdateVariant={updateVariant}
            onRemoveVariant={(idx) =>
              setVariants(variants.filter((_: any, i: any) => i !== idx))
            }
            onSelect={(c, s) => {
              setSelectedColor(c);
              setSelectedSize(s);
            }}
            onClearFilter={() => {
              setSelectedColor(null);
              setSelectedSize(null);
            }}
          />

          {/* MEDIA GALLERY (Includes hidden inputs for images) */}
          <MediaGallery
            images={images}
            visibleImages={visibleImages}
            selectedColor={selectedColor}
            isFilterActive={isFilterActive}
            onUpload={onUpload}
            onRemoveImage={(url) =>
              setImages(images.filter((img: any) => img.url !== url))
            }
            onClearFilter={() => setSelectedColor(null)}
          />
        </div>

        {/* SIDEBAR (Pricing/Category/SEO) */}
        <ProductSidebar categories={categories} initialData={initialData} />
      </div>

      {/* FOOTER BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <p className="text-sm italic text-slate-500">
            {isEditing ? `Editing: ${initialData.title}` : "Unsaved Product"}
          </p>
          <div className="flex gap-4">
            <Button variant="ghost" type="button" onClick={() => router.back()}>
              Discard
            </Button>
            <Button
              type="submit"
              size="lg"
              className="px-12 text-white bg-black rounded-full hover:bg-slate-800"
            >
              Save Product
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
