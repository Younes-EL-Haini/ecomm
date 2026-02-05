"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Calendar, ChevronDown } from "lucide-react";

const RANGES = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 30 Days", value: "last30" },
  { label: "All time", value: "all-time" },
];

export function DateRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); // Gets the current URL path

  // Normalize current range for the select value
  const currentRange = searchParams.get("range") || "last7";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", e.target.value);

    // Push to the same path but with new params
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative inline-flex items-center">
      <div className="absolute left-4 z-10 text-gray-400 pointer-events-none">
        <Calendar size={16} />
      </div>

      <select
        value={currentRange}
        onChange={handleChange}
        className="appearance-none bg-white pl-11 pr-10 py-2.5 rounded-2xl border border-gray-100 shadow-sm text-sm font-semibold text-gray-700 hover:border-indigo-200 hover:bg-gray-50 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        {RANGES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>

      <div className="absolute right-4 z-10 text-gray-400 pointer-events-none">
        <ChevronDown size={14} />
      </div>
    </div>
  );
}
