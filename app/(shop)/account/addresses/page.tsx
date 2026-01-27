import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import authOptions from "../../../auth/authOptions";
import AddAddressForm from "../profile/AddAddressForm"; // Adjust path as needed

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
        {user?.addresses.map((address) => (
          <div
            key={address.id}
            className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 hover:border-zinc-300 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                {address.label || "Home"}
              </span>
              {address.isDefault && (
                <span className="text-[9px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full uppercase">
                  Default
                </span>
              )}
            </div>
            <p className="text-zinc-900 font-bold">{address.line1}</p>
            <p className="text-zinc-500 text-sm font-medium">
              {address.city}, {address.postalCode}
            </p>
            <p className="text-zinc-400 text-xs font-bold mt-2 uppercase">
              {address.country}
            </p>
          </div>
        ))}
      </div>

      {/* ADD FORM */}
      <AddAddressForm />
    </div>
  );
};

export default AddressesPage;
