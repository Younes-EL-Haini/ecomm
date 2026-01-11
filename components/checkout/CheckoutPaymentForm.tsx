import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";

export default function CheckoutPaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  if (!stripe || !elements) {
    return <p>Loading secure checkout...</p>;
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/payment-success`,
          },
        });
      }}
      className="space-y-6"
    >
      <div className="rounded-lg border border-border bg-muted/40 p-4">
        <PaymentElement />
      </div>

      <Button size="lg" className="w-full">
        Pay now
      </Button>
    </form>
  );
}
