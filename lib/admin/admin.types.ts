// types/admin.ts

import { Order } from "../generated/prisma";

export interface LowStockVariant {
  id: string;
  stock: number;
  size: string | null;
  color: string | null;
  productId: string;
  product: {
    title: string;
    images: { 
      url: string 
    }[];
  };
}

// You can also add your Dashboard summary types here later
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingCount: number;
}

export interface CustomerHeaderData {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
  joinedDate: string;
  status: "Verified" | "Unverified";
}

// We extend the Prisma Order type but "overwrite" the fields 
// that change during serialization (Decimal -> number, Date -> string)
export interface SerializedOrder extends Omit<Order, "totalPrice" | "createdAt" | "updatedAt"> {
  totalPrice: number;
  createdAt: Order["createdAt"];
  updatedAt: Order["createdAt"];
}