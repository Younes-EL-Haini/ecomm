import { Prisma } from "../generated/prisma";

export type CartWithProducts = Prisma.CartItemGetPayload<{
  include: {
    product: { include: { images: true, name: true } };
    variant: true;
  };
}>;

export type CheckoutItemWithRelations = Prisma.ProductGetPayload<{
  include: {
    images: { select: { url: true; position: true } };
    variants: { select: { id: true; name: true; price: true } };
  };
}> & {
  quantity: number;
  selectedVariantId: string;
};

export type CheckoutSummary = {
  items: CheckoutItemWithRelations[];
  subtotal: number;
};