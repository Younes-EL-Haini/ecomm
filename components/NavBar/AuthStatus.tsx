// components/AuthStatus.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
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
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/orders">Orders</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600 cursor-pointer"
            onClick={() => signOut()}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AuthStatus;
