"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  authenticateUser,
  getStoredUser,
} from "../../ui/auth/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      router.replace(user.route);
    }
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const user = authenticateUser(email, password);
    if (!user) {
      setIsSubmitting(false);
      setError("Credenciales invalidas. Revisa el correo y la clave.");
      return;
    }

    router.replace(user.route);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl">
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Acceso seguro
          </p>
          <h1 className="text-2xl font-semibold">Ingresar al panel</h1>
          <p className="text-sm text-slate-300">
            Usa tu correo de Goberna para continuar.
          </p>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm">
            Correo
            <input
              className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
              autoComplete="email"
              name="email"
              placeholder="tu@correo.com"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Clave
            <input
              className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
              autoComplete="current-password"
              name="password"
              placeholder="••••••••"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? (
            <p className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
              {error}
            </p>
          ) : null}
          <button
            className="w-full rounded-full bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Validando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
