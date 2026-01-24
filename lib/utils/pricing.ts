import { Decimal } from "@prisma/client/runtime/library";

/* ---------- CORE HELPERS ---------- */

export const toNumber = (v?: Decimal | number | string | null) => 
  v ? Number(v) : 0;

export const formatMoney = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

/* ---------- CALCULATION LOGIC ---------- */

/**
 * Calculates final price by adding a base and a delta.
 * Perfect for loops/tables where you have both values handy.
 */
export const calculateVariantPrice = (
  base?: Decimal | number | null, 
  delta?: Decimal | number | null
) => {
  return toNumber(base) + toNumber(delta);
};

/**
 * Takes a product-like object and returns the final price.
 * Good for single product displays or order items.
 */
export const getProductPrice = (product?: {
  price?: Decimal | number | null;
  variant?: { priceDelta?: Decimal | null } | null;
}) => {
  if (!product) return 0;
  return calculateVariantPrice(product.price, product.variant?.priceDelta);
};

/* ---------- ORDER SPECIFIC ---------- */

export const getOrderItemTotal = (item: {
  unitPrice: Decimal;
  quantity: number;
  variant?: { priceDelta?: Decimal | null } | null;
}) => {
  const unitPrice = calculateVariantPrice(item.unitPrice, item.variant?.priceDelta);
  return unitPrice * item.quantity;
};