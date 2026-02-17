import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import authOptions from "../../../auth/authOptions";
import AddAddressForm from "../profile/AddAddressForm"; // Adjust path as needed
import AddressActions from "./AddressActions";
import { Address } from "@prisma/client";

const AddressesPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      addresses: { orderBy: { createdAt: "asc" } },
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* ADDRESS LIST */}
      <div className="space-y-4">
        {user?.addresses.map((address: Address) => (
          <div
            key={address.id}
            className="group relative p-6 rounded-4xl bg-zinc-50/50 border border-zinc-100 hover:border-zinc-300 hover:bg-white hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-500"
          >
            <div className="flex items-center mb-4">
              <span className="text-[10px] font-bold text-zinc-900 bg-white px-3 py-1 rounded-full border border-zinc-200 shadow-sm">
                {address.label || "Home"}
              </span>

              {/* Pro Actions - appearing on group-hover */}
              <AddressActions id={address.id} isDefault={address.isDefault} />

              {address.isDefault && (
                <span className="text-[9px] font-black text-green-600 uppercase bg-green-100/50 px-2 py-1 rounded-md">
                  Default
                </span>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-zinc-900 font-bold text-lg">{address.line1}</p>
              <p className="text-zinc-500 text-sm font-medium">
                {address.city}, {address.postalCode}
              </p>
              <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-3">
                {address.country}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ADD FORM */}
      <AddAddressForm />
    </div>
  );
};

export default AddressesPage;
