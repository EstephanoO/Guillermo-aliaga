import type { CSSProperties } from "react";

const NAV_ITEMS = [
  { id: "overview", label: "Vista general" },
  { id: "funnel", label: "Embudo de datos" },
  { id: "volunteers", label: "Voluntarios" },
  { id: "goals", label: "Metas y proyección" },
  { id: "capture", label: "WhatsApp y formularios" },
  { id: "social", label: "Facebook y Ads" },
  { id: "channels", label: "Canal y web" },
] as const;

const navStyle: CSSProperties = {
  backgroundColor: "var(--card)",
  borderColor: "var(--border)",
  color: "var(--text-2)",
};

export default function SidebarNav() {
  return (
    <aside className="hidden lg:block">
      <nav
        className="sticky top-24 rounded-xl border p-3 shadow-[0_10px_22px_-18px_rgba(15,23,42,0.2)]"
        style={navStyle}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em]">
          Navegación
        </p>
        <div className="mt-3 space-y-2 text-sm font-semibold">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </aside>
  );
}
