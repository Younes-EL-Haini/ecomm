"use client"; // Only the sidebar needs to be a client component

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, MapPin, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export const navItems = [
  { label: "Profile", href: "/account/profile", icon: User },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Security", href: "/account/security", icon: Shield },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* MOBILE NAV */}
      <div className="lg:hidden sticky top-16 z-40 bg-white border-b rounded-2xl">
        <nav className="flex gap-2 overflow-x-auto px-2 py-2 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[88px] px-3 py-2 rounded-xl transition font-semibold text-xs",
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-100",
                )}
              >
                <item.icon size={18} />
                <span className="mt-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block lg:w-56 shrink-0">
          <div className="sticky mt-10 rounded-3xl bg-zinc-50 border border-zinc-200 p-4">
            <h2 className="text-xl font-black mb-6 px-2">Account</h2>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold text-sm",
                      isActive
                        ? "bg-zinc-900 text-white shadow-lg"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
                    )}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
      </div>
    </>
  );
}
