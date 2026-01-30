"use client";

import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutAddressForm from "@/components/checkout/CheckoutAddressForm";
import CheckoutPaymentForm from "@/components/checkout/CheckoutPaymentForm";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [address, setAddress] = useState({
    fullName: "",
    line1: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    fetch("/api/checkout", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  if (!clientSecret)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <CheckoutAddressForm address={address} setAddress={setAddress} />
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutPaymentForm shippingAddress={address} />
      </Elements>
    </div>
  );
}
