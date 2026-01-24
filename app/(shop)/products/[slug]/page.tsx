import ProductClient from "@/components/product-details/ProductClient";
import { getProductBySlug } from "@/lib/actions/product";

type Props = {
  params: Promise<{ slug: string }>;
};

const ProductPage = async ({ params }: Props) => {
  const slugParams = await params;

  const product = await getProductBySlug(slugParams.slug);

  if (!product) {
    return <div className="p-10">Product not found</div>;
  }

  const serializedProduct = JSON.parse(JSON.stringify(product));

  return <ProductClient product={serializedProduct} />;
};

export default ProductPage;
