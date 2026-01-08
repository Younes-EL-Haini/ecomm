// app/profile/page.tsx
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import Image from "next/image";
import authOptions from "../auth/authOptions";

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

  // 2️⃣ Fetch user from DB
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      image: true,
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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="bg-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row gap-8 items-center">
        {/* Avatar */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden border border-gray-200">
          <Image
            src={user.image || "/placeholder.png"}
            alt={user.name || "User Avatar"}
            fill
            className="object-cover"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="text-lg font-medium">{user.name || "Not set"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Member Since</p>
            <p className="text-lg font-medium">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder for Addresses */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Shipping Addresses</h2>
        <p className="text-gray-500">You don’t have any addresses yet.</p>
      </div>
    </div>
  );
};

export default ProfilePage;
