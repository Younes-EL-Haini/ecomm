import { z } from "zod";

export const CheckoutUIItemSchema = z.object({
  variantId: z.string().min(1),
  title: z.string().min(1),
  image: z.string().url().nullable(),
  variantName: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
});

export const CheckoutSummarySchema = z.object({
  items: CheckoutUIItemSchema.array(),
  subtotal: z.number().nonnegative(),
});

export type CheckoutSummary = z.infer<typeof CheckoutSummarySchema>;



export type CheckoutUIItem = z.infer<typeof CheckoutUIItemSchema>;
