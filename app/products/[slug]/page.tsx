import prisma from "@/lib/prisma";
import Image from "next/image";

type Props = {
  params: Promise<{ slug: string }>;
};

const ProductPage = async ({ params }: Props) => {
  const slugParams = await params;

  const product = await prisma.product.findUnique({
    where: { slug: slugParams.slug },
    include: {
      images: true,
      reviews: true,
    },
  });

  if (!product) {
    return <div className="p-10">Product not found</div>;
  }

  const mainImage = product.images[0];
  const thumbnails = product.images.slice(1, 4);

  const ratingCount = product.reviews.length;
  const avgRating =
    ratingCount > 0
      ? (
          product.reviews.reduce((a, r) => a + r.rating, 0) / ratingCount
        ).toFixed(1)
      : "0.0";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT: IMAGES */}
        <div>
          {/* Main image */}
          <div className="relative h-[420px] w-full overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={"/images/hero-product.jpg"}
              alt={mainImage?.alt || product.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="mt-4 flex gap-3">
            {thumbnails.map((img) => (
              <div
                key={img.id}
                className="relative h-24 w-24 overflow-hidden rounded-xl bg-gray-100"
              >
                <Image
                  src={"/images/hero-product.jpg"}
                  alt={img.alt || product.title}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        {/* RIGHT: INFO */}
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <span>⭐ {avgRating}</span>
            <span>({ratingCount} reviews)</span>
          </div>

          {/* Price */}
          <p className="mt-4 text-2xl font-semibold text-blue-600">
            ${product.price.toFixed(2)}
          </p>

          {/* Description */}
          <p className="mt-6 text-gray-700 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
