"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutAddressForm({ address, setAddress }: any) {
  const update = (e: any) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  return (
    <div className="space-y-4 p-6 border rounded-xl">
      <h2 className="text-xl font-bold">Shipping Details</h2>
      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input name="fullName" value={address.fullName} onChange={update} />
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input name="line1" value={address.line1} onChange={update} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="city"
          placeholder="City"
          value={address.city}
          onChange={update}
        />
        <Input
          name="postalCode"
          placeholder="Postal Code"
          value={address.postalCode}
          onChange={update}
        />
      </div>
      <Input
        name="country"
        placeholder="Country"
        value={address.country}
        onChange={update}
      />
    </div>
  );
}
