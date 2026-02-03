import { z } from "zod";

export const AddressSchema = z.object({
  label: z.string().max(30).optional().nullable(),

  fullName: z.string().min(2).max(100).optional(),

  line1: z.string().min(3, "Address line is required"),
  line2: z.string().max(100).optional().nullable(),

  city: z.string().min(2),
  state: z.string().max(50).optional().nullable(),

  postalCode: z.string().min(3).max(20),
  country: z.string().min(2),

  isDefault: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof AddressSchema>;
