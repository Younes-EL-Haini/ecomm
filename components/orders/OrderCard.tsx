import OrderItemRow from "./OrderItemRow";

const statusColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const OrderCard = ({ order }: any) => {
  return (
    <div className="border rounded-2xl p-5 bg-white shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-500">Order #{order.id.slice(-6)}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[order.status]
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className="divide-y">
        {order.items.map((item: any) => (
          <OrderItemRow key={item.id} item={item} />
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-4 font-semibold">
        Total: ${order.totalPrice.toString()}
      </div>
    </div>
  );
};

export default OrderCard;
