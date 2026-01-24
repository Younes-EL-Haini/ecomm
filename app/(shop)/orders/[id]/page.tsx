import { Badge } from "@/components/ui/badge";
import { getStatusClasses } from "@/lib/utils/order-styles";
import Image from "next/image";
import Link from "next/link";
import { formatMoney, getOrderItemTotal, toNumber } from "@/lib/utils/pricing";
import { getOrderById } from "@/lib/actions/order";

type Props = { params: Promise<{ id: string }> };

const OrderPage = async ({ params }: Props) => {
  const param = await params;

  const order = await getOrderById(param.id);

  if (!order)
    return <p className="p-20 text-center text-gray-500">Order not found</p>;

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      {/* 1. Minimal Header */}
      <div className="border-b pb-8 mb-8">
        <Link
          href="/orders"
          className="text-sm text-blue-600 hover:underline mb-4 block"
        >
          ← Back to Orders
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Order Details
        </h1>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
          <p>
            Order ID:{" "}
            <span className="text-gray-900 font-medium">
              #{order.id.slice(-8)}
            </span>
          </p>
          <p>
            Date:{" "}
            <span className="text-gray-900 font-medium">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </p>
          <p>
            Status:{" "}
            <Badge className={getStatusClasses(order.status, "sm")}>
              {order.status}
            </Badge>
          </p>
        </div>
      </div>

      {/* 2. Simplified Item List */}
      <div className="space-y-8">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-6 items-start">
            {/* Simple Portrait Image */}
            <div className="w-24 h-32 relative rounded-md overflow-hidden bg-gray-50 border shrink-0">
              <Image
                src={item.product.images?.[0]?.url || "/placeholder.png"}
                alt={item.product.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 border-b pb-8">
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="text-lg font-bold hover:underline"
                  >
                    {item.product.title}
                  </Link>
                  {item.variant && (
                    <p className="text-sm text-gray-500 mt-1">
                      Size: {item.variant.size} | Color: {item.variant.color}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1 font-medium">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="text-lg font-bold">
                  {formatMoney(getOrderItemTotal(item))}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Simple Summary at Bottom */}
      <div className="mt-10 flex justify-end">
        <div className="w-full max-w-xs space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatMoney(toNumber(order.totalPrice))}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <div className="flex justify-between border-t pt-3 text-xl font-bold text-gray-900">
            <span>Total</span>
            <span>{formatMoney(toNumber(order.totalPrice))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
