export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import OrderTable from "@/components/admin/OrderTable";
import { CustomerHeader } from "@/components/admin/CustomerHeader";
import { toNumber } from "@/lib/utils/pricing";
import { CustomerHeaderData, SerializedOrder } from "@/lib/admin/admin.types";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await prisma.user.findUnique({
    where: { id: id },
    include: { orders: { orderBy: { createdAt: "desc" } } },
  });

  if (!customer) return <div>Not Found</div>;

  const formattedHeader: CustomerHeaderData = {
    id: customer.id,
    name: customer.name || "Guest",
    email: customer.email,
    image: customer.image,
    joinedDate: customer.createdAt.toLocaleDateString(),
    status: customer.emailVerified ? "Verified" : "Unverified",
  };

  const serializedOrders: SerializedOrder[] = customer.orders.map((order) => ({
    ...order,
    totalPrice: toNumber(order.totalPrice),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }));

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10">
      <CustomerHeader customer={formattedHeader} />

      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 px-2">
          Order History
        </h3>
        <OrderTable orders={serializedOrders} />
      </div>
    </div>
  );
}
