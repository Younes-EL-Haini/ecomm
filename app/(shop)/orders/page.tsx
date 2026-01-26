import { getServerSession } from "next-auth";
import OrderCard from "@/components/orders/OrderCard";
import Link from "next/link";
import { getMyOrders } from "@/lib/actions/order";

const OrdersPage = async () => {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return <p className="p-10">Please log in to view orders.</p>;
  }

  const orders = await getMyOrders(session.user.email);

  return (
    <div className="bg-gray-100">
      <div className="px-4 md:px-10 py-10 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
            <p className="text-gray-500 mb-4">
              You haven't placed any orders yet.
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
