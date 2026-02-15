// components/AuthStatus.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, Package, ShoppingCart, User, MapPin } from "lucide-react";
import { useCartStore } from "@/cartStore";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const AuthStatus = () => {
  const { status, data: session } = useSession();
  const count = useCartStore((state) => state.count);
  const setCount = useCartStore((state) => state.setCount);
  const pathname = usePathname();
  const isActive = pathname === "/cart";

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await fetch("/api/cart/count");
        const data = await res.json();
        setCount(data.count);
      } catch (error) {
        console.error("Failed to fetch cart count", error);
      }
    };
    if (status === "authenticated") {
      fetchCartCount();
    }
  }, [status]); // Runs when login status changes

  if (status === "unauthenticated") {
    return (
      <Link className="nav-link" href="/api/auth/signin">
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* 1. THE CART LINK */}
      <Link
        href="/cart"
        className={cn(
          "relative p-2 rounded-full transition-all duration-200",
          isActive
            ? "text-primary fill-current" // Active styles
            : "text-muted-foreground hover:bg-accent", // Default styles
        )}
      >
        <ShoppingCart
          className={cn("w-5 h-5", isActive && "fill-current")} // Makes the icon "Solid" if it supports it
        />
        {count > 0 && (
          <span
            key={count}
            className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-bounce-once"
          >
            {count}
          </span>
        )}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer outline-none">
          <Avatar className="h-7 w-7">
            <AvatarImage
              src={session?.user?.image ?? ""}
              referrerPolicy="no-referrer"
            />
            <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-3 py-2 border-b">
            <p className="text-sm font-semibold truncate">
              {session?.user?.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>

          <DropdownMenuContent
            align="end"
            className="w-56 p-2 rounded-2xl shadow-xl border-zinc-100"
          >
            <DropdownMenuLabel className="px-2 py-3">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-bold text-zinc-900 leading-none">
                  {session?.user?.name}
                </p>
                <p className="text-[10px] text-zinc-500 font-medium truncate">
                  {session?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-zinc-100 mx-1" />

            {/* PROFILE LINK */}
            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg px-2 py-2.5 focus:bg-zinc-50"
            >
              <Link
                href="/account/profile"
                className="flex items-center gap-3 w-full"
              >
                <User className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium">Profile</span>
              </Link>
            </DropdownMenuItem>

            {/* ORDERS LINK */}
            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg px-2 py-2.5 focus:bg-zinc-50"
            >
              <Link
                href="/account/orders"
                className="flex items-center gap-3 w-full"
              >
                <Package className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium">Orders</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg px-2 py-2.5 focus:bg-zinc-50"
            >
              <Link
                href="/account/addresses"
                className="flex items-center gap-3 w-full"
              >
                <MapPin className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium">Addresses</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-zinc-100 mx-1" />

            {/* LOG OUT */}
            <DropdownMenuItem
              className="text-red-600 cursor-pointer rounded-lg px-2 py-2.5 focus:bg-red-50 focus:text-red-600 flex items-center gap-3"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-bold">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AuthStatus;
