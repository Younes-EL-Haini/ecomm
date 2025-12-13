import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product, ProductImage } from "@/lib/generated/prisma";

type ProductWithImage = Product & {
  images: ProductImage[];
};

const ProductCard = ({ product }: { product: ProductWithImage }) => {
  const image = product.images?.[0];
  const inStock = product.stock > 0;

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 p-0 bg-blue-50">
      {/* IMAGE */}
      <div className="relative h-72 w-full bg-gray-100 overflow-hidden">
        <Image
          src="/images/hero-product.jpg"
          alt={image?.alt || product.title}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />

        {/* STOCK BADGE */}
        <div className="absolute top-3 left-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium text-white ${
              inStock ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {inStock ? "In stock" : "Out of stock"}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <CardContent className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{product.title}</h3>

        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>

        {/* FOOTER */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>

          <Link href={`/products/${product.slug}`}>
            <Button
              size="sm"
              variant="outline"
              className="cursor-pointer hover:text-blue-600 transition"
            >
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
