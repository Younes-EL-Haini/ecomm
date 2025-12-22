"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import classNames from "classnames";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NavBar = () => {
  const currentPath = usePathname();
  const { status, data: session } = useSession();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Product", href: "/products" },
  ];

  if (status === "loading") return <nav className="h-14 bg-blue-100 mb-5" />;

  return (
    <nav className="flex justify-between space-x-6 mb-5 px-5 h-14 items-center bg-blue-100">
      <ul className="flex space-x-6">
        <Link href="/">Logo</Link>
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
      <div className="flex items-center">
        {status === "unauthenticated" ? (
          <Link className="nav-link" href="/api/auth/signin">
            Login
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer outline-none">
              <Avatar>
                <AvatarImage src={session?.user?.image ?? ""} />
                <AvatarFallback>{session?.user?.name}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48 **:[[role=menuitem]]:cursor-pointer"
            >
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-semibold">{session?.user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>

              <DropdownMenuItem asChild>
                <a href="/profile">Profile</a>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => signOut()}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}{" "}
      </div>
    </nav>
  );
};

export default NavBar;
