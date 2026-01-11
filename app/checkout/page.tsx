"use client";

import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutAddressForm from "@/components/checkout/CheckoutAddressForm";
import CheckoutPaymentForm from "@/components/checkout/CheckoutPaymentForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Checkout() {
  const [step, setStep] = useState<"address" | "payment">("address");
  const [address, setAddress] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔑 Create PaymentIntent after address is submitted
  useEffect(() => {
    if (step === "payment" && address) {
      const createPaymentIntent = async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address }),
          });

          if (!res.ok) {
            const text = await res.text();
            console.error(text);
            alert("Failed to initialize payment");
            setStep("address"); // go back to address if failed
            return;
          }

          const data = await res.json();
          setClientSecret(data.clientSecret);
        } catch (err) {
          console.error(err);
          alert("Something went wrong");
          setStep("address");
        } finally {
          setLoading(false);
        }
      };

      createPaymentIntent();
    }
  }, [step, address]);

  return (
    <div className="max-w-xl mx-auto py-10">
      {/* STEP 1 — ADDRESS FORM */}
      {step === "address" && (
        <CheckoutAddressForm
          onSuccess={(addr) => {
            setAddress(addr);
            setStep("payment");
          }}
        />
      )}

      {/* STEP 2 — LOADING PAYMENT INTENT */}
      {step === "payment" && loading && (
        <p className="text-center text-lg">Preparing secure payment…</p>
      )}

      {/* STEP 3 — PAYMENT FORM */}
      {step === "payment" && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutPaymentForm />
        </Elements>
      )}
    </div>
  );
}
