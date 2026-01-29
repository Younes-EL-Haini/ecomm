export const serializeProduct = (product: any) => {
  if (!product) return null;
  return {
    ...product,
    price: Number(product.price),
    variants: product.variants?.map((v: any) => ({
      ...v,
      priceDelta: Number(v.priceDelta),
    })),
  };
};