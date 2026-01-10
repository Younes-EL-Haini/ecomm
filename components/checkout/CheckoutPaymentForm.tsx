import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

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
    >
      <PaymentElement />
      <button className="btn-primary w-full mt-4">Pay now</button>
    </form>
  );
}
