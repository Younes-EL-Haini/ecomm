"use client";

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
      className="bg-white p-6 rounded-2xl border shadow-sm space-y-4"
    >
      <h3 className="text-lg font-semibold">Add New Address</h3>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <input name="label" placeholder="Label (Home, Work)" className="input" />

      <input
        name="line1"
        placeholder="Address line 1 *"
        required
        className="input"
      />

      <input name="line2" placeholder="Address line 2" className="input" />

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

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isDefault" />
        Set as default address
      </label>

      <button
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition"
      >
        {loading ? "Saving..." : "Add Address"}
      </button>
    </form>
  );
};

export default AddAddressForm;
