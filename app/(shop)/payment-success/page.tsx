// app/payment-success/page.tsx
import authOptions from "@/app/auth/authOptions";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { CheckCircle2, Home, Package, Truck } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    payment_intent?: string;
  }>;
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);

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
      userId: session?.user.id,
    },
    include: {
      items: { include: { product: true } }, // if you have order items table
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
    // This wrapper creates the gray background for the entire viewport
    <div className="min-h-screen bg-zinc-100/80 flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {/* The White Card - This will now "pop" against the gray bg */}
        <div className="bg-white rounded-4xl shadow-xl shadow-zinc-200/50 overflow-hidden border border-white">
          {/* Header Section */}
          <div className="bg-zinc-900 p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-full mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-white italic tracking-tighter uppercase">
              Order Confirmed
            </h1>
            <p className="text-zinc-400 font-medium mt-2">
              Order #{order.id.slice(-8).toUpperCase()}
            </p>
          </div>

          <div className="p-10 space-y-10">
            {/* Confirmation Text */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-zinc-900">
                Cheers, {session?.user.name?.split(" ")[0] || "Customer"}!
              </h2>
              <p className="text-zinc-500 mt-3 leading-relaxed">
                Your payment was successful and your order is being processed.
                We’ll send you a tracking link as soon as it ships.
              </p>
            </div>

            {/* Compact Order Details */}
            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200/60">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-200 pb-3">
                <div className="flex items-center gap-2 font-bold text-zinc-900 uppercase text-xs tracking-widest">
                  <Package className="w-4 h-4" />
                  Package Details
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  PAID
                </span>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-900">
                        {item.product.title}
                      </span>
                      <span className="text-zinc-500 text-xs">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-zinc-900">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="pt-4 border-t border-zinc-200 flex justify-between items-baseline">
                  <span className="text-zinc-500 text-sm font-medium">
                    Total Charged
                  </span>
                  <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                asChild
                variant="outline"
                className="h-14 rounded-xl border-zinc-200 text-zinc-600 font-semibold hover:bg-zinc-50"
              >
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              <Button
                asChild
                className="h-14 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold"
              >
                <Link href={`/account/orders/${order.id}`}>
                  <Truck className="w-4 h-4 mr-2" />
                  Track Order
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-zinc-400 text-sm font-medium">
          Secure payment processed by Stripe. Need help?{" "}
          <Link
            href="/support"
            className="text-zinc-900 underline underline-offset-4"
          >
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
