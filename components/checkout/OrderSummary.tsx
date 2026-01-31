export default function OrderSummary({
  items,
  subtotal,
}: {
  items: any[];
  subtotal: number;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm sticky top-10">
      <h2 className="text-lg font-bold mb-4">Order Summary</h2>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-4">
            <div className="h-16 w-16 rounded-lg bg-zinc-100 border overflow-hidden shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 text-sm">
              <p className="font-medium text-zinc-900 line-clamp-1">
                {item.title}
              </p>
              <p className="text-zinc-500">
                Qty: {item.quantity} • {item.variantName}
              </p>
              <p className="font-semibold mt-1">${item.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between text-zinc-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-zinc-600">
          <span>Shipping</span>
          <span className="text-emerald-600 font-medium">Free</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-zinc-900 pt-2 border-t">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
