import { Prisma } from "../generated/prisma";


export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: { include: { images: { take: 1 }, name: true } };
        variant: true;
      };
    };
  };
}>;

// Serialized Type for the UI (Decimal -> Number)
export type SerializedOrder = Omit<OrderWithRelations, 'totalPrice' | 'items'> & {
  totalPrice: number;
  items: (Omit<OrderWithRelations['items'][number], 'totalPrice' | 'price'> & {
    totalPrice: number;
    price: number;
    product: OrderWithRelations['items'][number]['product'];
  })[];
};

// Admin Specific Types
export type AdminOrderSummary = Prisma.OrderGetPayload<{
  include: {
    user: true;
    _count: { select: { items: true } };
  };
}>;