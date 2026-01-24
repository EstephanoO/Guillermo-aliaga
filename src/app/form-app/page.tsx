export default function FormAppPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-80 w-[520px] -translate-x-1/2 rounded-full bg-slate-900/80 blur-3xl" />
        <div className="absolute bottom-0 right-[-120px] h-72 w-72 rounded-full bg-zinc-900/90 blur-3xl" />
        <div className="absolute left-[-140px] top-1/3 h-64 w-64 rounded-full bg-slate-950 blur-3xl" />
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.48em] text-slate-400">
          GOBERNA FORMULARIO APP
        </span>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
          Descarga segura y directa
        </h1>
        <p className="mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
          Boton listo para descargar la APK con enlace directo.
        </p>

        <div className="mt-12 flex w-full items-center justify-center">
          <a
            href="https://github.com/EstephanoO/gobernar-territorio/releases/download/v1.0.0/goberna-territorio.apk"
            className="group relative w-full max-w-md rounded-full border border-white/10 bg-white/5 px-8 py-6 text-lg font-semibold uppercase tracking-[0.2em] text-white shadow-[0_20px_60px_-30px_rgba(255,255,255,0.5)] transition duration-300 hover:-translate-y-1 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            download
          >
            <span className="relative z-10">Descargar APK</span>
            <span className="absolute inset-x-6 bottom-3 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          </a>
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-slate-500">
          Disponible ahora
        </p>
      </section>
    </main>
  );
}
