import prisma from "@/lib/prisma";
import ProductGallery from "../../../components/product-details/ProductGallery";
import ProductInfo from "../../../components/product-details/ProductInfo";

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

  // This is a "hacky" but very effective way to strip all
  // non-plain objects (like Decimals and Dates) into plain data.
  const serializedProduct = JSON.parse(JSON.stringify(product));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT: IMAGES */}
        <ProductGallery images={product.images} title={product.title} />
        {/* RIGHT: INFO */}
        <div className="lg:sticky lg:top-24">
          <ProductInfo product={serializedProduct} />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
