"use client";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { MapPin, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function CheckoutAddressForm({ address, setAddress }: any) {
  const [pos, setPos] = useState<[number, number]>([34.0181, -5.0078]); // Default: Fes, Morocco
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Helper: Move map view
  function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      map.flyTo(center, 16); // High zoom for accuracy
    }, [center]);
    return null;
  }

  // Fetch address details from coordinates
  const fetchAddress = async (lat: number, lng: number) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    );
    const data = await res.json();
    const addr = data.address;
    setAddress({
      ...address,
      line1: `${addr.road || ""} ${addr.house_number || ""}`.trim(),
      city: addr.city || addr.town || addr.village || "",
      postalCode: addr.postcode || "",
      country: addr.country || "",
    });
  };

  // Search function: Find coordinates from text
  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const newPos: [number, number] = [
          parseFloat(data[0].lat),
          parseFloat(data[0].lon),
        ];
        setPos(newPos);
        fetchAddress(newPos[0], newPos[1]);
      }
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPos([e.latlng.lat, e.latlng.lng]);
        fetchAddress(e.latlng.lat, e.latlng.lng);
      },
    });
    return <Marker position={pos} icon={icon} />;
  }

  return (
    <div className="bg-white p-8 border rounded-2xl shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <MapPin className="h-5 w-5 text-zinc-900" />
        <h2 className="text-xl font-bold">Shipping Details</h2>
      </div>

      {/* SEARCH BAR SECTION */}
      <div className="space-y-2">
        <Label className="text-zinc-600">Search Address</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Type your street, city, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-11 pr-10"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-zinc-400" />
            )}
          </div>
          <Button
            onClick={handleSearch}
            variant="secondary"
            className="h-11 px-4"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* MAP SECTION */}
      <div className="h-64 w-full rounded-xl overflow-hidden border border-zinc-200 z-0 relative">
        <MapContainer
          center={pos}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ChangeView center={pos} />
          <LocationMarker />
        </MapContainer>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label className="text-zinc-600">Full Name</Label>
          <Input
            value={address.fullName}
            onChange={(e) =>
              setAddress({ ...address, fullName: e.target.value })
            }
            placeholder="Recipient Name"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-600">Phone Number</Label>
          <Input
            type="tel"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            placeholder="+212 600-000000"
            className="h-11"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label className="text-zinc-600">Street Address</Label>
            <Input value={address.line1} readOnly className="h-11 bg-zinc-50" />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-600">City</Label>
            <Input value={address.city} readOnly className="h-11 bg-zinc-50" />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-600">Country</Label>
            <Input
              value={address.country}
              readOnly
              className="h-11 bg-zinc-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
