"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// import { AiFillBug } from "react-icons/ai";
import classNames from "classnames";
import { useSession } from "next-auth/react";

const NavBar = () => {
  const currentPath = usePathname();
  const { status, data: session } = useSession();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Product", href: "/products" },
  ];

  return (
    <nav className="flex space-x-6 mb-5 px-5 h-14 items-center bg-blue-100">
      <Link href="/">Logo</Link>
      <ul className="flex space-x-6">
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
        <div>
          {status === "authenticated" && (
            <Link href="/api/auth/signout">Log out</Link>
          )}
          {status === "unauthenticated" && (
            <Link href="/api/auth/signin">Login</Link>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default NavBar;
