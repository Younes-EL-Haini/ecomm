"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}) {
  return (
    // <ScrollArea className="flex-1">
    //   <div className="p-2 lg:p-4 space-y-2">
    //     {navItems.map((item) => (
    //       <Button
    //         key={item.href}
    //         asChild
    //         variant="ghost"
    //         className="
    //           w-full justify-center lg:justify-start
    //           gap-0 lg:gap-2
    //         "
    //       >
    //         <Link href={item.href} className="flex items-center">
    //           <item.icon size={18} />

    //           {/* LABEL: hidden until lg */}
    //           <span className="ml-2 hidden lg:inline">{item.label}</span>
    //         </Link>
    //       </Button>
    //     ))}
    //   </div>
    // </ScrollArea>
    // <div className="flex flex-col h-full bg-white border-r border-slate-200">
    //   {/* --- TOGGLE BUTTON --- */}
    //   <div className="p-4 flex justify-start">
    //     <Button
    //       variant="outline"
    //       size="sm"
    //       onClick={() => setCollapsed((prev) => !prev)}
    //     >
    //       <Menu size={18} />
    //     </Button>
    //   </div>

    //   {/* --- NAV ITEMS --- */}
    //   <ScrollArea className="flex-1">
    //     <div className="p-2 lg:p-4 space-y-2">
    //       {navItems.map((item) => (
    //         <Button
    //           key={item.href}
    //           asChild
    //           variant="ghost"
    //           className={`
    //             w-full justify-center
    //             gap-0
    //             ${!collapsed ? "lg:justify-start lg:gap-2" : ""}
    //           `}
    //         >
    //           <Link href={item.href} className="flex items-center">
    //             <item.icon size={18} />
    //             {/* Show label only if not collapsed */}
    //             {!collapsed && (
    //               <span className="ml-2 hidden lg:inline">{item.label}</span>
    //             )}
    //           </Link>
    //         </Button>
    //       ))}
    //     </div>
    //   </ScrollArea>
    // </div>

    <div className="flex flex-col h-full">
      {/* TOGGLE BUTTON */}
      <div className="p-4 flex justify-start">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu size={18} />
        </Button>
      </div>

      {/* NAV ITEMS */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className={`w-full justify-start ${!collapsed ? "gap-2" : "gap-0"} transition-all duration-300`}
            >
              <Link href={item.href} className="flex items-center">
                <item.icon size={18} />
                {!collapsed && <span className="ml-2">{item.label}</span>}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
