// app/profile/page.tsx
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import Image from "next/image";
import authOptions from "../../../auth/authOptions";
import AddAddressForm from "./AddAddressForm";

const ProfilePage = async () => {
  // 1️⃣ Get logged-in user
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <p className="p-10 text-center text-red-500 font-medium">
        You need to be logged in to view your profile.
      </p>
    );
  }

  // 2️⃣ Fetch user + addresses
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      image: true,
      createdAt: true,
      addresses: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!user) {
    return (
      <p className="p-10 text-center text-red-500 font-medium">
        User not found.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 1. THE HERO (Dresses the "Nude" top) */}
      <div className="bg-zinc-900 pt-24 pb-32 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Avatar with "Design Armor" */}
          <div className="relative size-32 md:size-40 rounded-full p-1 bg-linear-to-tr from-zinc-700 to-zinc-500 shadow-2xl">
            <div className="relative h-full w-full rounded-full overflow-hidden bg-zinc-800 border-4 border-zinc-900">
              <Image
                src={user.image || "/placeholder.png"}
                alt={user.name || "User"}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-2 right-2 size-5 bg-green-500 rounded-full border-4 border-zinc-900"></div>
          </div>

          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
              {user.name || "User Account"}
            </h1>
            <p className="text-zinc-400 font-medium tracking-tight">
              {user.email}
            </p>
            <div className="flex gap-2 justify-center md:justify-start pt-4">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                Verified Customer
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE DASHBOARD CONTENT */}
      <div className="max-w-6xl mx-auto px-6 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ADDRESS LIST (The 2/3 Column) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                  Shipping Addresses
                </h2>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  {user.addresses.length} Saved
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {user.addresses.map((address) => (
                  <div
                    key={address.id}
                    className="relative p-6 rounded-3xl bg-white border border-zinc-100 transition-all duration-300 hover:border-zinc-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                        {address.label || "Home"}
                      </span>
                      {address.isDefault && (
                        <span className="text-[9px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full uppercase">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-zinc-600 space-y-0.5">
                      <p className="text-zinc-900 font-bold">{address.line1}</p>
                      <p>
                        {address.city}, {address.postalCode}
                      </p>
                      <p className="text-zinc-400 text-[11px] uppercase tracking-tighter">
                        {address.country}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FORM (The 1/3 Column) */}
          <div className="lg:col-span-4 sticky top-24">
            <AddAddressForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
