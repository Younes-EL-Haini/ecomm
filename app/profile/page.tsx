// app/profile/page.tsx
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import Image from "next/image";
import authOptions from "../auth/authOptions";
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
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <h1 className="text-3xl font-bold">My Profile</h1>

      {/* PROFILE CARD */}
      <div className="bg-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row gap-8 items-center">
        {/* Avatar */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden border">
          <Image
            src={user.image || "/placeholder.png"}
            alt={user.name || "User Avatar"}
            fill
            className="object-cover"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-medium">{user.name || "Not set"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Member since</p>
            <p className="text-lg font-medium">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* ADDRESSES */}
      <div>
        <h2 className="text-2xl font-bold mb-6">My Addresses</h2>

        {user.addresses.length === 0 ? (
          <p className="text-gray-500">You don’t have any addresses yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {user.addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white p-6 rounded-2xl border shadow-sm"
              >
                {address.isDefault && (
                  <span className="inline-block mb-2 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    Default
                  </span>
                )}

                <p className="font-medium">{address.label || "Address"}</p>

                <p className="text-sm text-gray-600 mt-2">
                  {address.line1}
                  {address.line2 && `, ${address.line2}`}
                </p>

                <p className="text-sm text-gray-600">
                  {address.city}
                  {address.state && `, ${address.state}`} {address.postalCode}
                </p>

                <p className="text-sm text-gray-600">{address.country}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <AddAddressForm />
      </div>
    </div>
  );
};

export default ProfilePage;
