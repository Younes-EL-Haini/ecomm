"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// 1. Create a sub-component to handle the search params logic
function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const handleLogin = () => {
    signIn("google", {
      callbackUrl,
      redirect: true, // Ensure this is true to trigger the browser redirect
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter">
          Store. —
        </h1>
        <p className="text-zinc-500 font-medium uppercase text-xs tracking-[0.2em]">
          Identify yourself to continue
        </p>

        <Button
          onClick={handleLogin}
          className="group relative flex items-center justify-center gap-3 px-10 py-6 rounded-2xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-2xl"
        >
          Continue with Google
        </Button>
      </div>
    </div>
  );
}

// 2. Wrap it in Suspense (Required by Next.js when using useSearchParams)
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
