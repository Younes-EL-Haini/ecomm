import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: productId },
      include: { images: true, variants: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  // 1. Convert the main product
  const serializedProduct = {
    ...product,
    price: product.price ? Number(product.price) : 0,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),

    // 2. Deeply convert the variants array
    variants: product.variants.map((v) => ({
      ...v,
      // Force conversion of Decimal to Number
      priceDelta: v.priceDelta ? Number(v.priceDelta) : 0,
      // Force conversion of Date to String
      createdAt: v.createdAt.toISOString(),
    })),

    // 3. Ensure images are plain objects
    images: product.images.map((img) => ({
      ...img,
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-8 max-w-7xl mx-auto">
        <ProductForm
          categories={categories}
          initialData={serializedProduct as any}
        />
      </div>
    </div>
  );
}
