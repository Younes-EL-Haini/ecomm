import { Prisma } from "@prisma/client";


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

// This captures the EXACT shape of the data including Admin-only fields
export type AdminOrderDetailRaw = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: { include: { images: true, price:true } };
        variant: true;
        price: true;
      };
    };
    user: true;
    shippingAddress: true;
  };
}>;

// The final type after serialization (Decimals converted to Numbers)
export type AdminOrderDetail = Omit<AdminOrderDetailRaw, "totalPrice" | "items"> & {
  totalPrice: number;
  items: (Omit<AdminOrderDetailRaw["items"][number], "totalPrice" | "price" | "variant"> & {
    totalPrice: number;
    price: number;
    name?: string;
    variant: (Omit<NonNullable<AdminOrderDetailRaw["items"][number]["variant"]>, "priceDelta"> & {
      priceDelta: number;
    }) | null;
  })[];
};