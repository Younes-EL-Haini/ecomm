import ProductClient from "@/components/product-details/ProductClient";
import { getProductBySlug } from "@/lib/products";

type Props = {
  params: Promise<{ slug: string }>;
};

const ProductPage = async ({ params }: Props) => {
  const slugParams = await params;

  const product = await getProductBySlug(slugParams.slug);

  if (!product) {
    return <div className="p-10">Product not found</div>;
  }

  return <ProductClient product={product} />;
};

export default ProductPage;
