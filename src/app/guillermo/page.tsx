"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { clearStoredUser, getStoredUser } from "../../ui/auth/auth";
import DashboardPage from "../../ui/DashboardPage";

export default function GuillermoPage() {
  const router = useRouter();
  const user = getStoredUser();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.id !== "guillermo") {
      router.replace(user.route);
      return;
    }
  }, [router, user]);

  const handleLogout = () => {
    clearStoredUser();
    router.replace("/login");
  };

  if (!user || user.id !== "guillermo") return null;

  return (
    <div className="relative">
      <DashboardPage />
      <button
        className="fixed right-6 top-6 z-50 rounded-full bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-100 shadow-lg ring-1 ring-slate-700 transition hover:bg-slate-800"
        type="button"
        onClick={handleLogout}
      >
        Cerrar sesion
      </button>
    </div>
  );
}
