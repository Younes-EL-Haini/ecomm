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
            <NavItem href="/wishlist" icon={Heart} label="Wishlist" />
          </div>

          {/* ACCOUNT SECTION (MODERN LOOK) */}
          <div className="p-6 border-t bg-zinc-50/50 space-y-4">
            {status === "authenticated" ? (
              <div className="space-y-4">
                {/* User Info Display */}
                <div className="flex items-center gap-3 px-2 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-zinc-900 leading-none">
                      {session.user?.name}
                    </span>
                    <span className="text-xs text-zinc-500 mt-1">
                      {session.user?.email}
                    </span>
                  </div>
                </div>

                {/* Account Actions - HERE IS WHERE PROFILE/ORDERS GO */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/account/profile"
                    className="flex flex-col items-center justify-center p-3 bg-white border border-zinc-100 rounded-2xl hover:bg-zinc-100 transition-colors"
                  >
                    <User className="h-5 w-5 text-zinc-600 mb-1" />
                    <span className="text-[10px] font-bold uppercase">
                      Profile
                    </span>
                  </Link>
                  <Link
                    href="/account/orders"
                    className="flex flex-col items-center justify-center p-3 bg-white border border-zinc-100 rounded-2xl hover:bg-zinc-100 transition-colors"
                  >
                    <Package className="h-5 w-5 text-zinc-600 mb-1" />
                    <span className="text-[10px] font-bold uppercase">
                      Orders
                    </span>
                  </Link>
                </div>

                <button
                  onClick={() => signOut()}
                  className="flex items-center justify-center gap-2 w-full p-4 text-sm font-bold text-red-600 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-[0.98] transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
