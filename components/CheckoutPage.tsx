import convertToSubcurrency from "@/convertToSubcurrency";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [dbTotal, setDbTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  //   useEffect(() => {
  //     fetch("/api/checkout", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => setClientSecret(data.clientSecret));
  //   }, [amount]);

  useEffect(() => {
    fetch("/api/checkout", { method: "POST" }) // No body needed! Server knows who you are.
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setDbTotal(data.total);
        // You can also set an 'amount' state here if you want to display it
      });
  }, []);

  if (!clientSecret || dbTotal === null) {
    return <div className="animate-pulse">Loading secure checkout...</div>;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://localhost:3000/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
    }

    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      {clientSecret && <PaymentElement />}
      {errorMessage && <div>{errorMessage}</div>}
      <button
        disabled={!stripe || loading}
        className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {loading ? "Processing..." : `Pay $${dbTotal.toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutPage;
