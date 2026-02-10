import { Prisma } from "../generated/prisma";


export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    images: { select: { url: true; position: true } };
    variants: { select: { stock: true; color: true; priceDelta?:true } };
    category: true;
  };
}>;

export type ProductFullDetails = Prisma.ProductGetPayload<{
  include: { images: true; reviews: true; variants: true, category: true };
}> & {
  avgRating?: string | number;
  ratingCount?: number;
};

export type AdminProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    images: { select: { url: true; position: true } };
    variants: { select: { id: true; stock: true } };
  };
}>;

export type ProductSerialized = ReturnType<typeof import("./product.serializer").serializeProduct>;