import { Prisma } from "@prisma/client";

export type CartWithProducts = Prisma.CartItemGetPayload<{
  include: {
    product: { include: { images: true } };
    variant: true;
  };
}>;
