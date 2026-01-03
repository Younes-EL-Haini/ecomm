// app/payment-success/page.tsx
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    amount?: string;
    payment_intent?: string;
  }>;
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="max-w-xl mx-auto p-10 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful 🎉
      </h1>

      <p className="mb-2">
        Amount paid: <strong>${params.amount}</strong>
      </p>

      <p className="text-sm text-muted-foreground mb-6 break-all">
        Payment ID: {params.payment_intent}
      </p>

      <Link
        href="/"
        className="inline-block bg-black text-white px-6 py-3 rounded-md"
      >
        Go Home
      </Link>
    </div>
  );
}
