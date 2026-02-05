"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

export function SearchFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="relative w-full md:w-72">
      <Search
        className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
          isPending ? "text-indigo-500 animate-pulse" : "text-slate-400"
        }`}
        size={16}
      />
      <Input
        placeholder="Search by ID or customer..."
        className="pl-10 bg-white rounded-2xl border-gray-100 focus-visible:ring-indigo-500/20"
        defaultValue={searchParams.get("search") || ""}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
