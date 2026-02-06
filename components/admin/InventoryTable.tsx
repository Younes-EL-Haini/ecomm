"use client";

import { Package, Plus, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InventoryTableProps {
  variants: any[];
  selectedColor: string | null;
  isFilterActive: boolean;
  onAddVariant: () => void;
  onUpdateVariant: (index: number, field: string, value: any) => void;
  onRemoveVariant: (index: number) => void;
  onSelect: (color: string, size: string) => void;
  onClearFilter: () => void;
}

export function InventoryTable({
  variants,
  selectedColor,
  isFilterActive,
  onAddVariant,
  onUpdateVariant,
  onRemoveVariant,
  onSelect,
  onClearFilter,
}: InventoryTableProps) {
  return (
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
            onClick={onClearFilter}
          >
            <Eye size={14} className="mr-1" /> View All
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddVariant}
          >
            <Plus size={14} className="mr-1" /> Add Row
          </Button>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead className="text-[10px] uppercase tracking-widest bg-slate-50 text-slate-500 border-b">
          <tr>
            <th className="px-6 py-4 text-left">Variant (Color / Size)</th>
            <th className="px-6 py-4 text-left">SKU</th>
            <th className="px-6 py-4 text-center">Stock</th>
            <th className="px-6 py-4 text-right">Price Delta</th>
            <th className="w-10 px-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {variants.map((variant, index) => {
            const isActive = selectedColor === variant.color && isFilterActive;
            return (
              <tr
                key={variant.tempId}
                onClick={() =>
                  onSelect(variant.color || "", variant.size || "")
                }
                className={`cursor-pointer transition-colors ${isActive ? "bg-indigo-50" : "hover:bg-slate-50"}`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <input
                      placeholder="Color"
                      className="font-semibold bg-transparent outline-none w-14"
                      value={variant.color || ""}
                      onChange={(e) =>
                        onUpdateVariant(index, "color", e.target.value)
                      }
                    />
                    <span className="text-slate-300">/</span>
                    <input
                      placeholder="Size"
                      className="font-semibold bg-transparent outline-none w-14"
                      value={variant.size || ""}
                      onChange={(e) =>
                        onUpdateVariant(index, "size", e.target.value)
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
                      onUpdateVariant(index, "sku", e.target.value)
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
                      onUpdateVariant(
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
                      onUpdateVariant(
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
                      onRemoveVariant(index);
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
  );
}
