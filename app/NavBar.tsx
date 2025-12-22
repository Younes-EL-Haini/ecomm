// components/NavBar.tsx
import NavLinks from "./NavLinks";
import AuthStatus from "./AuthStatus";

const NavBar = () => {
  return (
    <nav className="flex justify-between space-x-6 mb-5 px-5 h-14 items-center bg-blue-100">
      <NavLinks />
      <AuthStatus />
    </nav>
  );
};

export default NavBar;
