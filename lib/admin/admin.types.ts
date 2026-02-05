// types/admin.ts

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