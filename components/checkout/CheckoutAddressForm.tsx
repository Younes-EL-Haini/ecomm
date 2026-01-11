"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

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
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Shipping address</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={form?.fullName}
            onChange={handleChange}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="line1">Street address</Label>
          <Input
            id="line1"
            name="line1"
            value={form?.line1}
            onChange={handleChange}
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={form?.city}
              onChange={handleChange}
              placeholder="Casablanca"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={form?.postalCode}
              onChange={handleChange}
              placeholder="20000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={form?.country}
            onChange={handleChange}
            placeholder="Morocco"
          />
        </div>

        <Button
          type="button"
          onClick={submit}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? "Saving address..." : "Continue to payment"}
        </Button>
      </CardContent>
    </Card>
  );
}
