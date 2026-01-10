"use client";

import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutAddressForm from "./CheckoutAddressForm";
import CheckoutPaymentForm from "./CheckoutPaymentForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [address, setAddress] = useState<any>(null);

  const handleAddressSuccess = async (addressData: any) => {
    setAddress(addressData);

    // 🔥 CREATE PAYMENT INTENT HERE
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: addressData }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Failed to initialize payment");
      return;
    }

    setClientSecret(data.clientSecret);
  };

  return (
    <div>
      {!clientSecret ? (
        <CheckoutAddressForm onSuccess={handleAddressSuccess} />
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutPaymentForm />
        </Elements>
      )}
    </div>
  );
}
