"use client";

import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutAddressForm from "./CheckoutAddressForm";
import CheckoutPaymentForm from "./CheckoutPaymentForm";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "@/components/ui/separator";

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

    if (!res.ok) {
      console.error(await res.text());
      alert("Failed to initialize payment");
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      alert("Failed to initialize payment");
      return;
    }

    setClientSecret(data.clientSecret);
  };

  return (
    // <div>
    //   {!clientSecret ? (
    //     <CheckoutAddressForm onSuccess={handleAddressSuccess} />
    //   ) : (
    //     <Elements stripe={stripePromise} options={{ clientSecret }}>
    //       <CheckoutPaymentForm />
    //     </Elements>
    //   )}
    // </div>
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Checkout</CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete your purchase securely
          </p>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          {!clientSecret ? (
            <CheckoutAddressForm
              onSuccess={handleAddressSuccess}
              // form={address} // <-- pass form state
              // setForm={setAddress} // <-- pass setter
            />
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutPaymentForm />
            </Elements>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
