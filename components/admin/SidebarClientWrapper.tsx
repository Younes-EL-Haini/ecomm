"use client";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";

export default function SidebarClientWrapper() {
  const [collapsed, setCollapsed] = useState(false);

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
