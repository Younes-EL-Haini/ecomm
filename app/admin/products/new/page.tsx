// app/admin/products/new/page.tsx
import prisma from "@/lib/prisma";
import { createProduct } from "@/lib/actions/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      {/* ONLY ONE FORM TAG HERE */}
      <form action={createProduct} className="space-y-6">
        {/* Product Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Title
          </label>
          <Input name="title" placeholder="e.g. Premium Cotton Tee" required />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea name="description" placeholder="Describe your product..." />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price ($)</label>
          <Input
            name="price"
            type="number"
            step="0.01"
            placeholder="0.00"
            required
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="categoryId"
            required
            className="w-full border p-2 rounded-md bg-background"
          >
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image URLs - Matching your ProductImage logic */}
        <div>
          <label className="block text-sm font-medium mb-1">Image URLs</label>
          <div className="space-y-2">
            <Input name="images" placeholder="Image URL 1" />
            <Input name="images" placeholder="Image URL 2" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <Button type="submit">Create Product</Button>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
