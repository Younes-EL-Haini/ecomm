"use client";

import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPaymentForm from "@/components/checkout/CheckoutPaymentForm";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import OrderSummary from "@/components/checkout/OrderSummary";
import { CheckoutSummary } from "@/lib/cart";

import dynamic from "next/dynamic";
import CheckoutSkeleton from "@/components/checkout/CheckoutSkeleton";

const CheckoutAddressForm = dynamic(
  () => import("@/components/checkout/CheckoutAddressForm"),
  { ssr: false }, // This is mandatory for Leaflet!
);

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");
        setClientSecret(data.clientSecret);
        setSummary(data.orderSummary);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Checkout initialization failed");
      });
  }, []);

  if (!clientSecret || !summary) {
    return <CheckoutSkeleton />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Left: Shipping & Payment (Col-span 7) */}
      <div className="lg:col-span-7 space-y-8">
        <CheckoutAddressForm address={address} setAddress={setAddress} />
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutPaymentForm shippingAddress={address} />
        </Elements>
      </div>

      {/* Right: Order Summary (Col-span 5) */}
      <div className="lg:col-span-5">
        <OrderSummary items={summary.items} subtotal={summary.subtotal} />
      </div>
    </div>
  );
}
