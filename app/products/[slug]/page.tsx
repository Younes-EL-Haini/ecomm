import prisma from "@/lib/prisma";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

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
      variants: true,
    },
  });

  if (!product) {
    return <div className="p-10">Product not found</div>;
  }

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
        <ProductGallery images={product.images} title={product.title} />
        {/* RIGHT: INFO */}
        <div className="lg:sticky lg:top-24">
          <ProductInfo
            productId={product.id}
            title={product.title}
            description={product.description}
            price={Number(product.price)}
            ratingCount={ratingCount}
            avgRating={avgRating}
            stock={product.stock}
            variants={product.variants}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
