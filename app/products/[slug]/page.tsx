import ProductClient from "@/components/product-details/ProductClient";
import prisma from "@/lib/prisma";

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

  const serializedProduct = JSON.parse(JSON.stringify(product));

  return <ProductClient product={serializedProduct} />;
};

export default ProductPage;
