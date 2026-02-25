"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderSearch({
  paymentIntent,
}: {
  paymentIntent: string;
}) {
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // If we haven't found the order yet, refresh the page every 2 seconds
    // up to 5 times.
    if (retryCount < 5) {
      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        router.refresh(); // Tells Next.js to re-run the Server Component
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [retryCount, router]);

  return (
    <div className="max-w-xl mx-auto p-10 text-center">
      <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">Finalizing your order...</h1>
      <p className="text-muted-foreground">
        We're just waiting for confirmation from the bank.
      </p>
    </div>
  );
}
