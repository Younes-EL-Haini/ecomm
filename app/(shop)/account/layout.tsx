import { Metadata } from "next";
import AccountSidebar from "@/components/account/AccountSidebar";

// ✅ This works now because this file is a Server Component!
export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your profile and orders.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-3">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* ✅ Client component for navigation */}
          <AccountSidebar />

          {/* PAGE CONTENT */}
          <main className="mt-10 flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
