"use client";

import { useRouter } from "next/navigation";
import { getStoredUser } from "../ui/auth/auth";

export default function Page() {
  const router = useRouter();

  const handleAccess = () => {
    const user = getStoredUser();
    router.replace(user ? user.route : "/login");
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="absolute inset-x-0 top-10 flex items-center justify-center">
        <p className="text-3xl font-black uppercase tracking-[0.5em] text-amber-300 drop-shadow sm:text-4xl">
          Maquina-Electoral
        </p>
      </div>
      <button
        className="motion-safe:animate-[pulse_4s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 px-12 py-5 text-base font-semibold uppercase tracking-[0.3em] text-slate-950 shadow-xl shadow-amber-500/30 ring-1 ring-amber-200/60 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-0"
        type="button"
        onClick={handleAccess}
      >
        Entrar
      </button>
    </main>
  );
}
