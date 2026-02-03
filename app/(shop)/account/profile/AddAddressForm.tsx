"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const AddAddressForm = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: formData.get("label"),
          fullName: formData.get("fullName"),
          line1: formData.get("line1"),
          line2: formData.get("line2"),
          city: formData.get("city"),
          state: formData.get("state"),
          postalCode: formData.get("postalCode"),
          country: formData.get("country"),
          isDefault: formData.get("isDefault") === "on",
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.issues) {
          setErrors(result.issues);
          toast.error("Please check the highlighted fields.");
        } else {
          toast.error(result.error || "Failed to add address");
        }
        setLoading(false);
        return;
      }

      toast.success("Address added successfully!"); // 👈 Success Toast

      // Delay reload slightly so user can see the success toast
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error("A network error occurred.");
      setLoading(false);
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

      <div className="space-y-4">
        <input
          name="label"
          placeholder="Label (Home, Work)"
          className="input"
        />
        <input
          name="fullName"
          placeholder="Address full Name *"
          required
          className="input"
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1">{errors.fullName[0]}</p>
        )}
        <input
          name="line1"
          placeholder="Address line 1 *"
          required
          className="input"
        />
        {errors.line1 && (
          <p className="text-red-500 text-xs mt-1">{errors.line1[0]}</p>
        )}
        <input name="line2" placeholder="Address line 2" className="input" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input name="city" placeholder="City *" required className="input" />
        {errors.city && (
          <p className="text-red-500 text-xs mt-1">{errors.city[0]}</p>
        )}
        <input name="state" placeholder="State" className="input" />
        {errors.state && (
          <p className="text-red-500 text-xs mt-1">{errors.state[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          name="postalCode"
          placeholder="Postal code *"
          required
          className="input"
        />
        {errors.postalCode && (
          <p className="text-red-500 text-xs mt-1">{errors.postalCode[0]}</p>
        )}
        <input
          name="country"
          placeholder="Country *"
          required
          className="input"
        />
        {errors.country && (
          <p className="text-red-500 text-xs mt-1">{errors.country[0]}</p>
        )}
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
