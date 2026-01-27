// app/profile/page.tsx
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import Image from "next/image";
import authOptions from "../../auth/authOptions";
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
    // <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
    //   <h1 className="text-3xl font-bold">My Profile</h1>

    //   {/* PROFILE CARD */}
    //   <div className="bg-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row gap-8 items-center">
    //     {/* Avatar */}
    //     <div className="relative w-32 h-32 rounded-full overflow-hidden border">
    //       <Image
    //         src={user.image || "/placeholder.png"}
    //         alt={user.name || "User Avatar"}
    //         fill
    //         className="object-cover"
    //       />
    //     </div>

    //     {/* User Info */}
    //     <div className="flex-1 space-y-4">
    //       <div>
    //         <p className="text-sm text-gray-500">Name</p>
    //         <p className="text-lg font-medium">{user.name || "Not set"}</p>
    //       </div>

    //       <div>
    //         <p className="text-sm text-gray-500">Email</p>
    //         <p className="text-lg font-medium">{user.email}</p>
    //       </div>

    //       <div>
    //         <p className="text-sm text-gray-500">Member since</p>
    //         <p className="text-lg font-medium">
    //           {new Date(user.createdAt).toLocaleDateString("en-US", {
    //             month: "long",
    //             day: "numeric",
    //             year: "numeric",
    //           })}
    //         </p>
    //       </div>
    //     </div>
    //   </div>

    //   {/* ADDRESSES */}
    //   <div>
    //     <h2 className="text-2xl font-bold mb-6">My Addresses</h2>

    //     {user.addresses.length === 0 ? (
    //       <p className="text-gray-500">You don’t have any addresses yet.</p>
    //     ) : (
    //       <div className="grid gap-6 md:grid-cols-2">
    //         {user.addresses.map((address) => (
    //           <div
    //             key={address.id}
    //             className="bg-white p-6 rounded-2xl border shadow-sm"
    //           >
    //             {address.isDefault && (
    //               <span className="inline-block mb-2 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
    //                 Default
    //               </span>
    //             )}

    //             <p className="font-medium">{address.label || "Address"}</p>

    //             <p className="text-sm text-gray-600 mt-2">
    //               {address.line1}
    //               {address.line2 && `, ${address.line2}`}
    //             </p>

    //             <p className="text-sm text-gray-600">
    //               {address.city}
    //               {address.state && `, ${address.state}`} {address.postalCode}
    //             </p>

    //             <p className="text-sm text-gray-600">{address.country}</p>
    //           </div>
    //         ))}
    //       </div>
    //     )}
    //   </div>
    //   <div className="grid gap-8 lg:grid-cols-2">
    //     <AddAddressForm />
    //   </div>
    // </div>
    // <div className="max-w-6xl mx-auto px-6 py-16">
    //   {/* 1. HERO SECTION (The Background "Suit") */}
    //   <div className="relative overflow-hidden rounded-[3rem] bg-zinc-900 p-8 md:p-12 mb-12 shadow-2xl">
    //     {/* Subtle Background Pattern */}
    //     <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

    //     <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
    //       {/* Premium Avatar Logic */}
    //       <div className="relative size-32 md:size-40 rounded-full p-1.5 bg-gradient-to-tr from-zinc-700 to-zinc-400 shadow-2xl">
    //         <div className="relative h-full w-full rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-900">
    //           <Image
    //             src={user.image || "/placeholder.png"}
    //             alt={user.name || "User"}
    //             fill
    //             className="object-cover"
    //           />
    //         </div>
    //         {/* Status indicator */}
    //         <div className="absolute bottom-2 right-2 size-6 bg-green-500 rounded-full border-4 border-zinc-900 shadow-lg"></div>
    //       </div>

    //       <div className="flex-1 text-center md:text-left">
    //         <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
    //           {user.name || "Guest User"}
    //         </h1>
    //         <p className="text-zinc-400 font-medium text-lg mt-1">
    //           {user.email}
    //         </p>

    //         <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
    //           <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-white/10">
    //             Premium Member
    //           </span>
    //           <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-white/10">
    //             Joined {new Date(user.createdAt).getFullYear()}
    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* 2. DASHBOARD GRID */}
    //   <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
    //     {/* LEFT SIDE: ADDRESSES & SETTINGS */}
    //     <div className="lg:col-span-8 space-y-12">
    //       <div>
    //         <div className="flex items-center justify-between mb-8">
    //           <h2 className="text-2xl font-black tracking-tight text-zinc-900">
    //             Shipping Addresses
    //           </h2>
    //           <div className="h-px flex-1 mx-6 bg-zinc-100 hidden sm:block"></div>
    //         </div>

    //         <div className="grid gap-6 sm:grid-cols-2">
    //           {user.addresses.map((address) => (
    //             <div
    //               key={address.id}
    //               className="group relative bg-zinc-50/50 hover:bg-white p-8 rounded-[2.5rem] border border-transparent hover:border-zinc-200 transition-all duration-500 hover:shadow-xl"
    //             >
    //               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">
    //                 {address.label || "Address"}
    //               </p>
    //               <div className="text-zinc-600 font-medium space-y-1">
    //                 <p className="text-zinc-900 font-bold text-lg">
    //                   {address.line1}
    //                 </p>
    //                 <p>
    //                   {address.city}, {address.postalCode}
    //                 </p>
    //                 <p className="text-zinc-400 text-xs">{address.country}</p>
    //               </div>
    //               {address.isDefault && (
    //                 <div className="absolute top-8 right-8 size-2 bg-green-500 rounded-full"></div>
    //               )}
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </div>

    //     {/* RIGHT SIDE: ADD ADDRESS (The "Utility" Column) */}
    //     <div className="lg:col-span-4">
    //       <div className="sticky top-8">
    //         <AddAddressForm />
    //       </div>
    //     </div>
    //   </div>
    // </div>
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
