// components/MobileNav.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, User, Settings, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import NavLinks from "./NavLinks";
import { useSession, signOut, signIn } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="p-2 cursor-pointer outline-none hover:bg-slate-100 rounded-full transition-colors">
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="flex flex-col w-[280px] p-0 border-r-0"
        >
          <SheetHeader className="p-6 text-left border-b">
            <SheetTitle className="text-blue-600 font-bold text-xl">
              STORE.
            </SheetTitle>
          </SheetHeader>

          {/* Main Links Area */}
          <div className="flex-1 overflow-y-auto p-4">
            <NavLinks className="gap-1" />
          </div>

          {/* Bottom Account Section (Fixed at bottom) */}
          <div className="p-4 border-t bg-slate-50/50">
            {status === "authenticated" ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-2 py-1">
                  <Avatar className="h-10 w-10 border border-white shadow-sm">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold truncate max-w-[150px]">
                      {session.user?.name}
                    </span>
                    <span className="text-xs text-slate-500 truncate max-w-[150px]">
                      {session.user?.email}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-md active:scale-95 transition-transform cursor-pointer"
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
