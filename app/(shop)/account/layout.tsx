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
    <div className="flex flex-col lg:flex-row gap-0 lg:gap-12">
      <AccountSidebar />
      <main className="flex-1 min-w-0 px-4 py-6 lg:py-10">{children}</main>
    </div>
  );
}
