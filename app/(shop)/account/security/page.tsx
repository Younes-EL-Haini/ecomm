import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { ShieldCheck, Mail } from "lucide-react";

export default async function SecurityPage() {
  const session = await getServerSession(authOptions);

  // Check if the user is using Google (OAuth)
  // Most OAuth providers don't send a password hash to the DB
  const isOAuth = !session?.user?.image?.includes("placeholder"); // Or check your DB 'password' field

  return (
    <div className="animate-in space-y-10">
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase">
          Security Settings
        </h1>
        <p className="text-zinc-500 text-sm font-medium mt-1">
          Manage your account security and authentication methods.
        </p>
      </div>

      <div className="max-w-2xl">
        {isOAuth ? (
          /* GOOGLE USER VIEW */
          <div className="p-8 rounded-4xl bg-zinc-50 border border-zinc-100 space-y-6">
            <div className="size-12 bg-white rounded-2xl border border-zinc-200 flex items-center justify-center shadow-sm">
              <ShieldCheck className="text-zinc-900" size={24} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-zinc-900">
                Social Authentication
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Your account is secured via{" "}
                <span className="font-bold text-zinc-900">Google</span>. Since
                you use a social provider, you don't need a separate password
                for our store.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="size-8 rounded-full border-2 border-white bg-zinc-200 flex items-center justify-center overflow-hidden">
                  <img src={session?.user?.image || ""} alt="User" />
                </div>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Verified Connection
              </span>
            </div>
          </div>
        ) : (
          /* REGULAR EMAIL/PASSWORD USER VIEW (For future use) */
          <div className="space-y-6">
            <p className="text-zinc-500">
              Standard password change form goes here.
            </p>
          </div>
        )}

        {/* SHARED ACCOUNT INFO */}
        <div className="mt-12 p-8 rounded-4xl border border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-500">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Primary Email
              </p>
              <p className="font-bold text-zinc-900">{session?.user?.email}</p>
            </div>
          </div>
          <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-md uppercase">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
