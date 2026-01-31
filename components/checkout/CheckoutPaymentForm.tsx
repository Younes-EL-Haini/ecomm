"use client";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreditCard, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPaymentForm({ shippingAddress }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!shippingAddress.line1 || !shippingAddress.fullName) {
      toast.error("Please fill in shipping details first");
      return;
    }

    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
        shipping: {
          name: shippingAddress.fullName,
          address: {
            line1: shippingAddress.line1,
            city: shippingAddress.city,
            postal_code: shippingAddress.postalCode,
            country: shippingAddress.country,
          },
        },
      },
    });

    if (error) {
      toast.error(error.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 border rounded-2xl shadow-sm space-y-6"
    >
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="bg-zinc-100 p-2 rounded-lg">
          <CreditCard className="h-5 w-5 text-zinc-900" />
        </div>
        <h2 className="text-xl font-bold">Payment Method</h2>
      </div>

      <div className="py-2">
        <PaymentElement />
      </div>

      <div className="pt-4 space-y-4">
        <Button
          className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-lg shadow-lg shadow-zinc-200 transition-all active:scale-[0.98]"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" /> Processing...
            </span>
          ) : (
            "Complete Purchase"
          )}
        </Button>

        <p className="flex items-center justify-center gap-2 text-xs text-zinc-400 font-medium">
          <Lock className="h-3 w-3" />
          Your payment is encrypted and secure.
        </p>
      </div>
    </form>
  );
}
