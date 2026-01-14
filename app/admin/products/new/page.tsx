import prisma from "@/lib/prisma";
import { createProduct } from "@/lib/actions/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8 max-w-3xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
        <div className="text-sm text-muted-foreground">Draft mode enabled</div>
      </div>

      <form action={createProduct} className="space-y-8">
        {/* --- SECTION: VISIBILITY --- */}
        <section className="p-6 bg-slate-50 border rounded-xl space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Visibility & Status
          </h2>
          <div className="flex gap-8">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="isPublished"
                className="w-5 h-5 rounded border-gray-300 accent-primary"
              />
              <div className="flex flex-col">
                <span className="font-medium">Published</span>
                <span className="text-xs text-muted-foreground">
                  Visible to customers
                </span>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="featured"
                className="w-5 h-5 rounded border-gray-300 accent-primary"
              />
              <div className="flex flex-col">
                <span className="font-medium">Featured Product</span>
                <span className="text-xs text-muted-foreground">
                  Show on homepage hero
                </span>
              </div>
            </label>
          </div>
        </section>

        {/* --- SECTION: GENERAL INFO --- */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">General Information</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Title</label>
            <Input
              name="title"
              placeholder="e.g. Midnight Running Shoes"
              required
              className="text-lg py-6"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (USD)</label>
              <Input
                name="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                name="categoryId"
                required
                className="w-full h-10 border rounded-md px-3 bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* --- SECTION: SEO & URL --- */}
        <section className="p-6 border-2 border-dashed rounded-xl space-y-4 bg-blue-50/30">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-blue-900">
              Search Engine Optimization
            </h2>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">
              SEO
            </span>
          </div>
          <p className="text-sm text-blue-800/70">
            Preview how your product appears in search engines.
          </p>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900">
                URL Slug
              </label>
              <div className="flex items-center group">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  myshop.com/products/
                </span>
                <input
                  name="slug"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="custom-url-handle"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900">
                Meta Description
              </label>
              <Textarea
                name="description"
                placeholder="Briefly describe the product for Google search results..."
                className="bg-white"
                required
              />
            </div>
          </div>
        </section>

        {/* --- SECTION: MEDIA --- */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Product Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input name="images" placeholder="Primary Image URL" required />
            <Input name="images" placeholder="Secondary Image URL" />
          </div>
        </section>

        {/* --- SECTION: INVENTORY & VARIANTS --- */}
        <section className="p-6 border rounded-xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Inventory & Variants</h2>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium">SKU</label>
              <Input name="sku" placeholder="SKU-123" className="w-32" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500">
                Size
              </label>
              <select
                name="variantSize"
                className="w-full border rounded-md h-9 text-sm px-2 bg-white"
              >
                <option value="">None</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
                <option value="XL">Extra Large</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500">
                Color
              </label>
              <Input
                name="variantColor"
                placeholder="e.g. Red"
                className="bg-white h-9 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500">
                Stock
              </label>
              <Input
                name="variantStock"
                type="number"
                defaultValue="0"
                className="bg-white h-9"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500">
                Price Delta
              </label>
              <Input
                name="variantPriceDelta"
                type="number"
                step="0.01"
                defaultValue="0"
                className="bg-white h-9"
              />
            </div>
          </div>
        </section>

        {/* --- STICKY FOOTER ACTIONS --- */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t flex justify-center gap-4 z-50">
          <div className="max-w-3xl w-full flex gap-4">
            <Button variant="outline" type="button" className="flex-1 py-6">
              Discard
            </Button>
            <Button type="submit" className="flex-2 py-6 text-lg">
              Save & Create Product
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
