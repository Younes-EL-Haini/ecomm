export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import Image from "next/image";
import authOptions from "../../../auth/authOptions";
import { Button } from "@/components/ui/button";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return (
    <div className="space-y-12">
      {/* HEADER INFO */}
      <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-zinc-100">
        <div className="relative size-32 rounded-full p-1 bg-white border shadow-sm">
          <div className="relative h-full w-full rounded-full overflow-hidden bg-zinc-50">
            <Image
              src={user.image || "/placeholder.png"}
              alt={user.name || "User"}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black tracking-tighter text-zinc-900">
            Personal Information
          </h1>
          <p className="text-zinc-500 font-medium">
            Manage your account details and settings.
          </p>
        </div>
      </div>

      {/* INFO GRID */}
      <div className="grid gap-8 max-w-2xl">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Full Name
          </p>
          <p className="text-lg font-bold text-zinc-900">
            {user.name || "Not set"}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Email Address
          </p>
          <p className="text-lg font-bold text-zinc-900">{user.email}</p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Member Since
          </p>
          <p className="text-lg font-bold text-zinc-900">
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <Button className="px-8 py-3 rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all">
        Edit Profile
      </Button>
    </div>
  );
};

export default ProfilePage;
