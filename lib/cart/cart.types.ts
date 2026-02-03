import { Prisma } from "../generated/prisma";

export type CartWithProducts = Prisma.CartItemGetPayload<{
  include: {
    product: { include: { images: true, name: true } };
    variant: true;
  };
}>;
