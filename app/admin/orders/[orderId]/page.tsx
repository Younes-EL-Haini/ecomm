// app/admin/orders/[orderId]/page.tsx
import AdminOrderTemplate from "@/components/admin/AdminOrderTemplate";
import { getAdminOrderDetail } from "@/lib/orders";
import { notFound } from "next/navigation";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const param = await params;
  // 1. Fetch data directly using Prisma
  const order = await getAdminOrderDetail(param.orderId);

  // 2. Handle 404 if order doesn't exist
  if (!order) {
    notFound();
  }

  // 3. Pass the data to your layout
  return (
    <div className="max-w-[1400px] mx-auto p-6">
      {/* You can pass the 'order' object directly to the UI we built */}
      <AdminOrderTemplate order={order} />
    </div>
  );
}
