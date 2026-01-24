import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit2, Package } from "lucide-react";
import { DeleteProductButton } from "../DeleteProductButton";
import { formatMoney, getProductPrice } from "@/lib/utils/pricing";
import {
  AdminProductWithRelations,
  getAdminProducts,
} from "@/lib/actions/product";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Products
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your store inventory
          </p>
        </div>
        <Button asChild size="sm" className="md:h-10 md:px-4">
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      <div className="space-y-3">
        {products.map((product: AdminProductWithRelations) => {
          const mainImage = product.images[0]?.url;
          const hasUrl = typeof mainImage === "string" && mainImage.length > 0;
          const isValidProtocol =
            hasUrl &&
            (mainImage.startsWith("http") || mainImage.startsWith("/"));

          return (
            <div key={product.id}>
              {/* --- DESKTOP VIEW --- */}
              <div className="hidden md:flex flex-row items-center gap-4 p-4 bg-white border rounded-xl hover:border-slate-400 hover:shadow-md transition-all duration-200">
                <div className="relative h-16 w-16 bg-slate-100 rounded-lg overflow-hidden border shrink-0">
                  {isValidProtocol ? (
                    <Image
                      src={mainImage}
                      alt={product.title}
                      fill
                      sizes="64px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-slate-400">
                      <Package size={20} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg truncate">
                      {product.title}
                    </h3>
                    <StatusBadge isPublished={product.isPublished} />
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {product.category?.name || "Uncategorized"}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span>SKU: {product.sku || "—"}</span>
                  </p>
                </div>

                <div className="flex flex-row gap-12 px-8 border-l border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">
                      Price
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatMoney(
                        getProductPrice({
                          price: product.price,
                        }),
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">
                      Added
                    </span>
                    <span className="text-sm text-slate-600">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-l pl-6">
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="h-9 w-9 rounded-full"
                  >
                    <Link href={`/admin/products/${product.id}`}>
                      <Edit2 size={15} />
                    </Link>
                  </Button>
                  <DeleteProductButton
                    id={product.id}
                    productName={product.title}
                  />
                </div>
              </div>

              {/* --- MOBILE VIEW --- */}
              <div className="md:hidden flex gap-4 p-3 bg-white border rounded-xl shadow-sm items-center">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden border bg-slate-50 shrink-0">
                  {isValidProtocol ? (
                    <Image
                      src={mainImage}
                      alt={product.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-slate-400">
                      <Package size={24} />
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col min-w-0 justify-between py-0.5">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 truncate pr-2 text-sm">
                      {product.title}
                    </h3>
                    <StatusBadge isPublished={product.isPublished} />
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium uppercase mt-1">
                    {product.category?.name || "No Cat"} •{" "}
                    {product.sku || "N/A"}
                  </p>
                  <div className="flex justify-between items-end mt-2">
                    <p className="font-bold text-slate-900 text-base">
                      {formatMoney(
                        getProductPrice({
                          price: product.price,
                        }),
                      )}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-slate-100"
                      >
                        <Edit2 size={14} />
                      </Button>
                      <DeleteProductButton
                        id={product.id}
                        productName={product.title}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {products.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-xl text-muted-foreground">
            No products found. Start by adding one!
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ isPublished }: { isPublished: boolean }) {
  return isPublished ? (
    <span className="px-2 py-0.5 text-[9px] md:text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 rounded-md">
      Live
    </span>
  ) : (
    <span className="px-2 py-0.5 text-[9px] md:text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 rounded-md">
      Draft
    </span>
  );
}
