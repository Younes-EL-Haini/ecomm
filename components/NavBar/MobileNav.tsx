"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  User,
  ShoppingBag,
  Settings,
  LogOut,
  Home,
  Package,
  Heart,
  ChevronRight,
  MapPin,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSession, signOut, signIn } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => setIsOpen(false), [pathname]);

  // Helper for consistent link styling
  const NavItem = ({ href, icon: Icon, label }: any) => (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between w-full p-4 rounded-xl transition-all",
        pathname === href
          ? "bg-zinc-100 text-zinc-900"
          : "text-zinc-500 hover:bg-zinc-50",
      )}
    >
      <div className="flex items-center gap-4">
        <Icon className="h-5 w-5" />
        <span className="font-medium text-base">{label}</span>
      </div>
      <ChevronRight className="h-4 w-4 opacity-50" />
    </Link>
  );

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="p-2 cursor-pointer outline-none active:scale-95 transition-transform">
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="flex flex-col w-full sm:w-[350px] p-0 border-r-0"
        >
          <SheetHeader className="p-6 text-left border-b">
            <SheetTitle className="text-zinc-900 font-bold text-2xl tracking-tight">
              STORE.
            </SheetTitle>
          </SheetHeader>

          {/* MAIN NAVIGATION SECTION */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            <p className="px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
              Menu
            </p>
            <NavItem href="/" icon={Home} label="Home" />
            <NavItem href="/products" icon={ShoppingBag} label="All Products" />
            <NavItem href="/categories" icon={LayoutGrid} label="Categories" />
            <NavItem href="/wishlist" icon={Heart} label="Wishlist" />
          </div>

          {/* ACCOUNT SECTION (MODERN LOOK) */}
          <div className="p-6 border-t bg-zinc-50/50 space-y-4">
            {status === "authenticated" ? (
              <div className="space-y-3">
                {/* Compact User Header */}
                <div className="flex items-center gap-3 px-2 py-2 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback className="bg-zinc-900 text-white text-xs">
                      {session.user?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-black uppercase truncate">
                      {session.user?.name}
                    </span>
                    <button
                      onClick={() => signOut()}
                      className="text-[10px] text-red-500 font-bold uppercase tracking-tight flex items-center gap-1 hover:underline"
                    >
                      <LogOut className="h-3 w-3" /> Sign Out
                    </button>
                  </div>
                </div>

                {/* Condensed Action Row */}
                <div className="flex items-center justify-between gap-2">
                  {[
                    { href: "/account/profile", icon: User, label: "Profile" },
                    { href: "/account/orders", icon: Package, label: "Orders" },
                    {
                      href: "/account/addresses",
                      icon: MapPin,
                      label: "Address",
                    },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex flex-1 items-center justify-center gap-2 py-3 bg-zinc-100/50 rounded-xl hover:bg-zinc-100 transition-colors"
                    >
                      <item.icon className="h-4 w-4 text-zinc-600" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-[0.98] transition-all"
              >
                Sign In
              </button>
            )}{" "}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
