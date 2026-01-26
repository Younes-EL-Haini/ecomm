// components/NavBar.tsx
"use client";
import NavLinks from "./NavLinks";
import AuthStatus from "./AuthStatus";
import MobileNav from "./MobileNav";
import Link from "next/link";
import { useSession } from "next-auth/react";
import NavSkeleton from "./NavSkeleton";

const NavBar = () => {
  const { status } = useSession();
  if (status === "loading") return <NavSkeleton />;

  return (
    // We use bg-white/70 for a more "glassy" look
    <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-gray-100 backdrop-blur-xl">
      {/* Reduced h-16 to h-12 */}
      <div className="max-w-7xl mx-auto flex justify-between h-12 items-center px-6">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            /* Removed blue, made it zinc-900, reduced size to text-lg */
            className="text-lg font-bold tracking-tighter text-zinc-900 hover:opacity-70 transition-opacity"
          >
            STORE.
          </Link>

          <div className="hidden md:block">
            {/* Ensure NavLinks uses text-xs or text-[13px] */}
            <NavLinks className="space-x-8" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <AuthStatus />
          </div>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
