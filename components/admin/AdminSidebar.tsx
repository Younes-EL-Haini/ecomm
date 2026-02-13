"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full border-r border-zinc-100">
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
          {navItems.map((item) => {
            // Check if this specific link is the current page
            const isActive = pathname === item.href;

            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={`
                  w-full justify-start transition-all duration-300
                  ${!collapsed ? "gap-2" : "gap-0"} 
                  ${isActive ? "bg-zinc-100 font-bold" : "hover:bg-zinc-50"}
                `}
              >
                <Link href={item.href} className="flex items-center">
                  <item.icon
                    size={18}
                    className={isActive ? "text-zinc-900" : "text-zinc-500"}
                  />
                  {!collapsed && (
                    <span
                      className={`ml-2 ${isActive ? "text-zinc-900" : "text-zinc-600"}`}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
