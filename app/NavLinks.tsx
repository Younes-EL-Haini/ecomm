// // components/NavLinks.tsx
// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import classNames from "classnames";

// const NavLinks = () => {
//   const currentPath = usePathname();
//   const links = [
//     { label: "Dashboard", href: "/" },
//     { label: "Product", href: "/products" },
//   ];

//   return (
//     <ul className="flex space-x-6 items-center">
//       <Link href="/" className="font-bold text-blue-900">
//         Logo
//       </Link>
//       {links.map((link) => (
//         <li key={link.href}>
//           <Link
//             className={classNames({
//               "text-blue-900": link.href === currentPath,
//               "text-blue-500": link.href !== currentPath,
//               "hover:text-blue-800 transition-colors": true,
//             })}
//             href={link.href}
//           >
//             {link.label}
//           </Link>
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default NavLinks;

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
