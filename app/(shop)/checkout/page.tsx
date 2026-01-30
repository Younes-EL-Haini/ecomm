"use client";

import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutAddressForm from "@/components/checkout/CheckoutAddressForm";
import CheckoutPaymentForm from "@/components/checkout/CheckoutPaymentForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
    const params = new URLSearchParams(window.location.search);
    const isDirect = params.get("direct") === "true";

    const body = isDirect
      ? {
          variantId: params.get("variantId"),
          quantity: parseInt(params.get("quantity") || "1"),
        }
      : {};

    fetch(`/api/checkout${isDirect ? "?direct=true" : ""}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // 🔑 CRITICAL
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");
        setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Checkout initialization failed");
      });
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
