import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "../auth/authOptions";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SidebarClientWrapper from "@/components/admin/SidebarClientWrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session?.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* SIDEBAR - Should have its own internal scroll if needed */}
      <SidebarClientWrapper />

      {/* MAIN - This should be the ONLY scrollable area */}
      <div className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
