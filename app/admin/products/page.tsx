import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new">Add Product</Link>
      </div>

      <ul className="space-y-2">
        {products.map((product) => (
          <li key={product.id} className="border p-4 rounded">
            {product.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
