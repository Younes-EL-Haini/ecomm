"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

export default function CheckoutAddressForm({ address, setAddress }: any) {
  const update = (e: any) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  return (
    <div className="bg-white p-8 border rounded-2xl shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="bg-zinc-100 p-2 rounded-lg">
          <MapPin className="h-5 w-5 text-zinc-900" />
        </div>
        <h2 className="text-xl font-bold">Shipping Details</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label className="text-zinc-600">Full Name</Label>
          <Input
            name="fullName"
            placeholder="John Doe"
            className="h-11 rounded-lg border-zinc-200"
            value={address.fullName}
            onChange={update}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-600">Street Address</Label>
          <Input
            name="line1"
            placeholder="123 Luxury Lane"
            className="h-11 rounded-lg border-zinc-200"
            value={address.line1}
            onChange={update}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-zinc-600">City</Label>
            <Input
              name="city"
              placeholder="New York"
              className="h-11 rounded-lg border-zinc-200"
              value={address.city}
              onChange={update}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-600">Postal Code</Label>
            <Input
              name="postalCode"
              placeholder="10001"
              className="h-11 rounded-lg border-zinc-200"
              value={address.postalCode}
              onChange={update}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-600">Country</Label>
          <Input
            name="country"
            placeholder="United States"
            className="h-11 rounded-lg border-zinc-200"
            value={address.country}
            onChange={update}
          />
        </div>
      </div>
    </div>
  );
}
