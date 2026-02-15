// components/NavLinks.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/products" },
  { label: "Categories", href: "/category" },
  { label: "Contact", href: "/contact" },
];

const NavLinks = ({
  className,
  onLinkClick,
}: {
  className?: string;
  onLinkClick?: () => void;
}) => {
  const pathname = usePathname();

  return (
    <ul className={cn("flex items-center px-3", className)}>
      {links.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : link.label === "Categories" && pathname.includes("/category");
        return (
          <li key={link.href} className="relative">
            <Link
              href={link.href}
              onClick={onLinkClick}
              className={cn(
                "text-[13px] font-normal transition-opacity duration-200",
                isActive
                  ? "text-zinc-900 opacity-100"
                  : "text-zinc-500 opacity-80 hover:opacity-100",
              )}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;
