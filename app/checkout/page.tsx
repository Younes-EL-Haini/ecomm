"use client";

import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutAddressForm from "@/components/checkout/CheckoutAddressForm";
import CheckoutPage from "@/components/checkout/CheckoutPage";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<any>(null);
  const [step, setStep] = useState<"address" | "payment">("address");

  // 🔑 Create PaymentIntent AFTER address step
  useEffect(() => {
    if (step !== "payment" || !address) return;

    const createPaymentIntent = async () => {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();
      setClientSecret(data.clientSecret);
    };

    createPaymentIntent();
  }, [step, address]);

  return (
    <div className="max-w-xl mx-auto py-10">
      {/* STEP 1 — ADDRESS */}
      {step === "address" && (
        <CheckoutAddressForm
          onSuccess={(addr) => {
            setAddress(addr);
            setStep("payment");
          }}
        />
      )}

      {/* STEP 2 — LOADING */}
      {step === "payment" && loading && (
        <p className="text-center">Preparing secure payment…</p>
      )}

      {/* STEP 3 — PAYMENT */}
      {step === "payment" && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutPage />
        </Elements>
      )}
    </div>
  );
}
