import { OrderWithRelations, SerializedOrder } from "./order.types";

export const serializeOrder = (order: OrderWithRelations): SerializedOrder => ({
  ...order,
  totalPrice: order.totalPrice.toNumber(),
  items: order.items.map((item) => ({
    ...item,
    price: item.product.price.toNumber(),
    totalPrice: item.totalPrice.toNumber(),
    product: item.product,
  })),
});

// Helper for Admin details since they often have different nesting
export const serializeAdminDetail = (order: any) => {
  if (!order) return null;
  return {
    ...order,
    totalPrice: Number(order.totalPrice),
    items: order.items.map((item: any) => ({
      ...item,
      totalPrice: Number(item.totalPrice),
      variant: item.variant ? {
        ...item.variant,
        priceDelta: Number(item.variant.priceDelta || 0),
      } : null,
    })),
  };
};