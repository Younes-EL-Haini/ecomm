"use client";

import { Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Category } from "@prisma/client";
import { toNumber } from "@/lib/utils/pricing";

interface ProductSidebarProps {
  categories: Category[];
  initialData?: any;
}

export function ProductSidebar({
  categories,
  initialData,
}: ProductSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Pricing & Category */}
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
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Visibility Switches */}
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

      {/* SEO Section */}
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
            placeholder="product-url-slug"
            className="w-full px-3 py-2 text-sm text-blue-300 outline-none bg-slate-800 rounded-lg ring-1 ring-slate-700 placeholder:text-slate-600"
          />
        </div>
      </section>
    </aside>
  );
}
