import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "../auth/authOptions";
import AdminSidebar from "@/components/admin/AdminSidebar";

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
    <div className="flex min-h-screen w-full overflow-hidden">
      {/* SIDEBAR (desktop & tablet) */}
      <aside
        className="hidden md:flex flex-col border-r bg-background
                    w-16 lg:w-64 transition-all duration-300"
      >
        <AdminSidebar />
      </aside>

      {/* MAIN */}
      <div className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
