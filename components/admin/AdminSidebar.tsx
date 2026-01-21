import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  return (
    <ScrollArea className="flex-1">
      <div className="p-2 lg:p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant="ghost"
            className="
              w-full justify-center lg:justify-start
              gap-0 lg:gap-2
            "
          >
            <Link href={item.href} className="flex items-center">
              <item.icon size={18} />

              {/* LABEL: hidden until lg */}
              <span className="ml-2 hidden lg:inline">{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
