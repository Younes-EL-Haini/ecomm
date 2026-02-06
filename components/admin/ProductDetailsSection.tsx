"use client";

import { LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProductDetailsSectionProps {
  initialTitle?: string;
  initialDescription?: string;
}

export function ProductDetailsSection({
  initialTitle,
  initialDescription,
}: ProductDetailsSectionProps) {
  return (
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
            defaultValue={initialTitle}
            placeholder="e.g. Premium Cotton T-Shirt"
            required
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Description</label>
          <Textarea
            name="description"
            defaultValue={initialDescription}
            placeholder="Describe your product features..."
            required
            className="min-h-[150px]"
          />
        </div>
      </div>
    </section>
  );
}
