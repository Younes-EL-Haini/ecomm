// components/NavLinks.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";

const NavLinks = () => {
  const currentPath = usePathname();
  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Product", href: "/products" },
  ];

  return (
    <ul className="flex space-x-6 items-center">
      <Link href="/" className="font-bold text-blue-900">
        Logo
      </Link>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            className={classNames({
              "text-blue-900": link.href === currentPath,
              "text-blue-500": link.href !== currentPath,
              "hover:text-blue-800 transition-colors": true,
            })}
            href={link.href}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
