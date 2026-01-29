import { getServerSession } from "next-auth";
import OrderCard from "@/components/orders/OrderCard";
import { getMyOrders, SerializedOrder } from "@/lib/orders";
import authOptions from "@/app/auth/authOptions";

const OrdersPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const orders = await getMyOrders(session.user.email);
  const serializedOrders: SerializedOrder[] = JSON.parse(
    JSON.stringify(orders),
  );

  return (
    <div className="animate-in space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase">
            My Orders
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
            Manage and track your recent purchases.
          </p>
        </div>
      </div>

      {/* Luxury Status Tabs (Inspiration: Capture 625) */}
      <div className="flex items-center gap-8 border-b border-zinc-100 pb-1">
        {["All Orders", "On Shipping", "Arrived", "Cancelled"].map((tab, i) => (
          <button
            key={tab}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${
              i === 0
                ? "text-zinc-900 border-b-2 border-zinc-900"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            {tab}{" "}
            {i === 0 && (
              <span className="ml-1 text-[10px] text-zinc-400">
                {orders.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 rounded-[3rem] border border-zinc-100 bg-zinc-50/50">
          <p className="text-zinc-400 font-bold">No orders found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {serializedOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
