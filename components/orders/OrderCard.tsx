import Link from "next/link";
import Image from "next/image";

const statusColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const OrderCard = ({ order }: any) => {
  return (
    <Link href={`/orders/${order.id}`} className="group block mb-6">
      <div className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
          <div className="flex items-center gap-6">
            {/* Larger Image - Now size-20 (80px) instead of size-16 */}
            <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
              <Image
                src={
                  order.items[0]?.product.images[0]?.url || "/placeholder.png"
                }
                alt="Product"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="space-y-1">
              {/* Bigger Title Font */}
              <p className="text-xl font-bold text-gray-900 tracking-tight">
                Order #{order.id.slice(-6).toUpperCase()}
              </p>

              <p className="text-sm text-gray-500 font-medium">
                {order.items.length}{" "}
                {order.items.length === 1 ? "Item" : "Items"} •{" "}
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  dateStyle: "long",
                })}
              </p>

              {/* Price stands out more */}
              <p className="text-lg font-extrabold text-blue-600">
                ${order.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Larger, cleaner Badge */}
          <div className="flex items-center">
            <span
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border ${
                statusColors[order.status]
              } border-current/10`}
            >
              {order.status}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
