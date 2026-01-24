"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { clearStoredUser, getStoredUser } from "../../ui/auth/auth";

export default function AdminPage() {
  const router = useRouter();
  const user = getStoredUser();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.id !== "admin") {
      router.replace(user.route);
      return;
    }
  }, [router, user]);

  const handleLogout = () => {
    clearStoredUser();
    router.replace("/login");
  };

  if (!user || user.id !== "admin") return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-6 text-slate-100">
      <div className="max-w-xl space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
          Administracion
        </p>
        <h1 className="text-3xl font-semibold">Panel de control</h1>
        <p className="text-sm text-slate-300">
          Acceso exclusivo para administradores. Revisa metricas y operaciones.
        </p>
      </div>
      <button
        className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        type="button"
        onClick={handleLogout}
      >
        Cerrar sesion
      </button>
    </main>
  );
}
