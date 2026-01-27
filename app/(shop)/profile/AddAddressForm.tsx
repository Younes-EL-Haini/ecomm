"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const AddAddressForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/addresses", {
      method: "POST",
      body: JSON.stringify({
        label: formData.get("label"),
        line1: formData.get("line1"),
        line2: formData.get("line2"),
        city: formData.get("city"),
        state: formData.get("state"),
        postalCode: formData.get("postalCode"),
        country: formData.get("country"),
        isDefault: formData.get("isDefault") === "on",
      }),
    });

    if (!res.ok) {
      setError("Failed to add address");
      setLoading(false);
      return;
    }

    window.location.reload(); // simple & clean for now
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm space-y-3"
    >
      <div className="space-y-1">
        <h3 className="text-xl font-bold tracking-tight text-zinc-900">
          Add New Address
        </h3>
        <p className="text-sm text-zinc-500">Used for shipping and billing</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="space-y-4">
        <input
          name="label"
          placeholder="Label (Home, Work)"
          className="input"
        />
        <input
          name="line1"
          placeholder="Address line 1 *"
          required
          className="input"
        />
        <input name="line2" placeholder="Address line 2" className="input" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input name="city" placeholder="City *" required className="input" />
        <input name="state" placeholder="State" className="input" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          name="postalCode"
          placeholder="Postal code *"
          required
          className="input"
        />
        <input
          name="country"
          placeholder="Country *"
          required
          className="input"
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-zinc-600 cursor-pointer">
        <input
          type="checkbox"
          name="isDefault"
          className="size-4 accent-black"
        />
        Set as default address
      </label>

      <Button
        disabled={loading}
        className="w-full rounded-xl hover:bg-zinc-800
 "
      >
        {loading ? "Saving..." : "Add Address"}
      </Button>
    </form>
  );
};

export default AddAddressForm;
