import { AlertCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LowStockVariant } from "@/lib/admin/admin.types";

interface LowStockAlertsProps {
  products: LowStockVariant[];
}

export function LowStockAlerts({ products }: LowStockAlertsProps) {
  if (products.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-50 rounded-lg text-rose-500">
            <AlertCircle size={20} />
          </div>
          <h3 className="font-bold text-gray-900">Inventory Alerts</h3>
        </div>
        <Badge
          variant="secondary"
          className="bg-rose-50 text-rose-600 border-none uppercase text-[10px]"
        >
          Action Required
        </Badge>
      </div>

      <div className="space-y-4">
        {products.map((variant) => (
          <div
            key={variant.id}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-gray-50 border">
                <Image
                  src={variant.product.images[0]?.url || "/placeholder.png"}
                  alt={variant.product.title || "image"}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 line-clamp-1">
                  {variant.product.title}
                </p>
                <p className="text-[10px] text-gray-400 uppercase font-medium">
                  Size: {variant.size} • Color: {variant.color}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p
                className={`text-sm font-black ${variant.stock === 0 ? "text-rose-600" : "text-amber-500"}`}
              >
                {variant.stock} left
              </p>
              <Link
                href={`/admin/products/${variant.productId}`}
                className="text-[10px] text-indigo-500 hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Restock <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
