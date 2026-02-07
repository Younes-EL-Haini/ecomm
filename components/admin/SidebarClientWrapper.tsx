"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";

export default function SidebarClientWrapper() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // 1. Define the media query (Tailwind's md is 768px)
    const mql = window.matchMedia("(max-width: 1024px)"); // I suggest 1024px (lg) so it collapses earlier on tablets

    // 2. Define the handler
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    // 3. Set initial state and add listener
    handler(mql);
    mql.addEventListener("change", handler);

    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <aside
      className={`hidden md:flex flex-col border-r bg-background
                  transition-all duration-300
                  ${collapsed ? "w-16" : "w-44"}`}
    >
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
    </aside>
  );
}
