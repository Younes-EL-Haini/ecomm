// app/payment-success/page.tsx
import prisma from "@/lib/prisma";

type Props = {
  searchParams: Promise<{
    payment_intent?: string;
  }>;
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const params = await searchParams;

  if (!params.payment_intent) {
    return (
      <div className="max-w-xl mx-auto p-10 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Invalid Payment
        </h1>
        <p className="text-muted-foreground mb-6">
          No payment information was found.
        </p>
        <a
          href="/"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md"
        >
          Go Home
        </a>
      </div>
    );
  }

  // ✅ Fetch order by PaymentIntent ID
  const order = await prisma.order.findUnique({
    where: {
      stripeSessionId: params.payment_intent,
    },
    include: {
      items: true, // if you have order items table
    },
  });

  if (!order) {
    return (
      <div className="max-w-xl mx-auto p-10 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Order Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          We could not find an order for this payment. Please contact support.
        </p>
        <a
          href="/"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md"
        >
          Go Home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-md p-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Payment Successful 🎉
          </h1>
          <p className="text-muted-foreground text-sm">
            Thank you for your purchase
          </p>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Amount Paid:</span>
            <span className="font-semibold">
              ${order.totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Payment ID:</span>
            <span className="text-sm text-muted-foreground break-all">
              {params.payment_intent}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Order ID:</span>
            <span className="text-sm text-muted-foreground">{order.id}</span>
          </div>

          {/* Shipping Address */}
          {order.shippingAddressId && (
            <div className="border-b pb-2">
              <h2 className="font-medium mb-1">Shipping Address</h2>
              <p className="text-sm">{order.shippingAddressId}</p>
            </div>
          )}

          {/* Order Items */}
          {order.items?.length > 0 && (
            <div>
              <h2 className="font-medium mb-2">Items</h2>
              <ul className="divide-y divide-gray-200">
                {order.items.map((item: any) => (
                  <li key={item.id} className="py-2 flex justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>${item.totalPrice.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Go Home Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
