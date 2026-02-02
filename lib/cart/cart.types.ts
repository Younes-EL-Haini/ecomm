import { Prisma } from "../generated/prisma";

export type CartWithProducts = Prisma.CartItemGetPayload<{
  include: {
    product: { include: { images: true, name: true } };
    variant: true;
  };
}>;

export type CheckoutUIItem = {
  variantId: string;
  title: string;
  image: string | null;
  variantName: string;
  price: number;
  quantity: number;
};

export type CheckoutSummary = {
  items: CheckoutUIItem[];
  subtotal: number;
};

export type CheckoutUISummary = {
  items: CheckoutUIItem[];
  subtotal: number;
};
