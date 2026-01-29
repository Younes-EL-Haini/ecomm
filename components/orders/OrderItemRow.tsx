import Image from "next/image";

const OrderItemRow = ({ item }: any) => {
  const basePrice = Number(item.unitPrice);
  const delta = Number(item.variant?.priceDelta || 0);
  const finalPrice = basePrice + delta;

  return (
    <div className="flex items-center gap-4 py-3">
      <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={item.product.images?.[0]?.url || "/images/hero-product.jpg"}
          alt={item.product.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <p className="font-medium">{item.product.title}</p>

        {item.variant && (
          <p className="text-sm text-gray-500">{item.variant.name}</p>
        )}

        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
      </div>

      <div className="font-medium">
        ${(finalPrice * item.quantity).toFixed(2)}
      </div>
    </div>
  );
};

export default OrderItemRow;
