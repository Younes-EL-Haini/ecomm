// import {
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { Button } from "../ui/button";

// export default function CheckoutPaymentForm() {
//   const stripe = useStripe();
//   const elements = useElements();

//   if (!stripe || !elements) {
//     return <p>Loading secure checkout...</p>;
//   }

//   return (
//     <form
//       onSubmit={async (e) => {
//         e.preventDefault();
//         await stripe.confirmPayment({
//           elements,
//           confirmParams: {
//             return_url: `${window.location.origin}/payment-success`,
//           },
//         });
//       }}
//       className="space-y-6"
//     >
//       <div className="rounded-lg border border-border bg-muted/40 p-4">
//         <PaymentElement />
//       </div>

//       <Button size="lg" className="w-full">
//         Pay now
//       </Button>
//     </form>
//   );
// }

"use client";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CheckoutPaymentForm({ shippingAddress }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!shippingAddress.line1 || !shippingAddress.fullName) {
      return alert("Please fill in shipping details");
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
            postal_code: shippingAddress.postalCode, // 👈 FIXED
            country: shippingAddress.country,
          },
        },
      },
    });

    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-xl bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Payment</h2>
      <PaymentElement />
      <Button className="w-full mt-6" disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
}
