import { ProductWithRelations } from "./product.types";

export const serializeProduct = (product: ProductWithRelations) => {
  if (!product) return null;
  return {
    ...product,
    price: Number(product.price),
    variants: product.variants?.map((v) => ({
      ...v,
      priceDelta: Number(v.priceDelta),
    })),
  };
};