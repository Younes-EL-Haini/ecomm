import { Metadata } from "next";
import { Users, UserPlus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomerTable, { FormattedCustomer } from "@/_components/CustomerTable";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Customers | Admin Dashboard",
};

export default async function CustomersPage() {
  // Fetch customers with their order aggregates
  const customers = await prisma.user.findMany({
    // where: { role: "CUSTOMER" },
    include: {
      orders: {
        select: {
          totalPrice: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Transform data for the table
  const formattedCustomers: FormattedCustomer[] = customers.map((user) => ({
    id: user.id,
    name: user.name || "Guest User",
    image: user.image,
    email: user.email,
    joinedDate: user.createdAt.toLocaleDateString(),
    totalOrders: user.orders.length,
    totalSpent: user.orders.reduce(
      (sum, order) => sum + Number(order.totalPrice),
      0,
    ),
    status: user.emailVerified ? "Verified" : "Unverified",
  }));

  return (
    <div className="p-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Customers
          </h1>
          <p className="text-slate-500">
            Manage your customer base and view their lifetime value.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden md:flex">
            <Download size={16} className="mr-2" /> Export CSV
          </Button>
          <Button className="bg-black text-white rounded-full px-6">
            <UserPlus size={16} className="mr-2" /> Add Customer
          </Button>
        </div>
      </div>

      {/* STATS SUMMARY CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Customers
              </p>
              <h3 className="text-2xl font-bold">
                {formattedCustomers.length}
              </h3>
            </div>
          </div>
        </div>
        {/* Add more summary cards as needed (e.g., Active this month) */}
      </div>

      {/* SEARCH & TABLE SECTION */}
      <section className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <Input
              placeholder="Search by name or email..."
              className="pl-4 h-10 bg-white"
            />
          </div>
        </div>

        <CustomerTable data={formattedCustomers} />
      </section>
    </div>
  );
}
