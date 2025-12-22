// // components/NavBar.tsx
// import NavLinks from "./NavLinks";
// import AuthStatus from "./AuthStatus";

// const NavBar = () => {
//   return (
//     <nav className="flex justify-between space-x-6 mb-5 px-5 h-14 items-center bg-blue-100">
//       <NavLinks />
//       <AuthStatus />
//     </nav>
//   );
// };

// export default NavBar;

// components/NavBar.tsx
import NavLinks from "./NavLinks";
import AuthStatus from "./AuthStatus";
import MobileNav from "./MobileNav";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between h-16 items-center px-4">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tighter text-blue-600"
          >
            STORE.
          </Link>

          {/* Desktop Navigation (Hidden on Mobile) */}
          <div className="hidden md:block">
            <NavLinks className="space-x-1" />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Desktop Auth (Hidden on Mobile) */}
          <div className="hidden md:block">
            <AuthStatus />
          </div>

          {/* Mobile Trigger */}
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
