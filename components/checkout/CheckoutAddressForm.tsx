"use client";

import { useState } from "react";

type Address = {
  fullName: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
};

type Props = {
  onSuccess: (address: Address) => void;
};

export default function CheckoutAddressForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Address>({
    fullName: "",
    line1: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async () => {
    setLoading(true);

    const res = await fetch("/api/checkout/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to save address");
      return;
    }

    // ✅ PASS THE FORM OBJECT
    onSuccess(form);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Shipping address</h2>

      <input
        name="fullName"
        placeholder="Full name"
        value={form.fullName}
        onChange={handleChange}
        className="input"
      />

      <input
        name="line1"
        placeholder="Street address"
        value={form.line1}
        onChange={handleChange}
        className="input"
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="input"
        />
        <input
          name="postalCode"
          placeholder="Postal code"
          value={form.postalCode}
          onChange={handleChange}
          className="input"
        />
      </div>

      <input
        name="country"
        placeholder="Country"
        value={form.country}
        onChange={handleChange}
        className="input"
      />

      <button
        onClick={submit}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? "Saving..." : "Continue to payment"}
      </button>
    </div>
  );
}
