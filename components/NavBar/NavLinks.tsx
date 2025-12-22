// components/NavLinks.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { label: "Dashboard", href: "/" },
  { label: "Products", href: "/products" },
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
    <ul className={cn("flex items-center", className)}>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <li key={link.href} className="relative px-4 py-2">
            <Link
              href={link.href}
              onClick={onLinkClick}
              className={cn(
                "relative z-10 text-sm font-medium transition-colors duration-300",
                isActive ? "text-white" : "text-slate-600 hover:text-slate-900"
              )}
            >
              {link.label}
            </Link>
            {/* Active/Hover Background Pill */}
            {isActive && (
              <motion.div
                layoutId="active-nav-pill"
                className="absolute inset-0 bg-blue-600 rounded-lg shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;
