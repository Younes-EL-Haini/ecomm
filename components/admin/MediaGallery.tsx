"use client";

import { Image as ImageIcon, X, Plus } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

interface MediaGalleryProps {
  images: any[];
  visibleImages: any[];
  selectedColor: string | null;
  isFilterActive: boolean;
  onUpload: (result: any) => void;
  onRemoveImage: (url: string) => void;
  onClearFilter: () => void;
}

export function MediaGallery({
  images,
  visibleImages,
  selectedColor,
  isFilterActive,
  onUpload,
  onRemoveImage,
  onClearFilter,
}: MediaGalleryProps) {
  return (
    <section className="p-6 bg-white border rounded-2xl border-slate-200">
      {/* Hidden inputs for form data persistence */}
      {images.map((img, idx) => (
        <div key={idx}>
          <input type="hidden" name="image_url" value={img.url} />
          <input type="hidden" name="image_color" value={img.color || ""} />
          <input type="hidden" name="image_size" value={img.size || ""} />
        </div>
      ))}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ImageIcon size={20} className="text-amber-500" />
          <h2 className="text-lg font-bold">
            {!isFilterActive ? "Full Gallery" : `${selectedColor} Gallery`}
          </h2>
        </div>
        {isFilterActive && (
          <div className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            {selectedColor}
            <button type="button" onClick={onClearFilter}>
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
              onClick={() => onRemoveImage(img.url)}
              className="absolute p-1 transition bg-white rounded-full shadow-sm top-2 right-2 text-rose-500 opacity-0 group-hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <CldUploadWidget uploadPreset="my_shop_preset" onSuccess={onUpload}>
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
  );
}
