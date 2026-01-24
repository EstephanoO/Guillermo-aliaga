import {
  CONTACTADOS,
  CONTACTOS_FORMULARIOS,
  DATOS,
  DATOS_TOTAL,
  FOLLOWERS_BEFORE,
  FOLLOWERS_NOW,
  SUMMARY_FORMAT,
  TEMAS_CLAVE,
  VOLUNTARIOS,
  VOLUNTARIOS_TOTAL,
  WHATSAPP_FOLLOWERS,
} from "../../db/constants/dashboard";
import type { SummaryCard } from "../types/dashboard";
import { formatNumber, formatSeconds, formatShortDate } from "../utils/dashboardFormat";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardSidebarProps {
  summaryCards: SummaryCard[];
}

export default function DashboardSidebar({ summaryCards }: DashboardSidebarProps) {
  const sortedContacts = CONTACTOS_FORMULARIOS.slice().sort((a, b) =>
    a.dateKey.localeCompare(b.dateKey),
  );
  let cumulativeContacts = 0;
  const contactTimeline = sortedContacts.map((item) => {
    cumulativeContacts += item.leads;
    return {
      dateKey: item.dateKey,
      nuevos: item.leads,
      acumulado: cumulativeContacts,
    };
  });
  const latestContact = contactTimeline[contactTimeline.length - 1];
  const totalContacts = latestContact?.acumulado ?? 0;
  const latestContactsDelta = latestContact?.nuevos ?? 0;
  const latestContactLabel = latestContact
    ? formatShortDate(new Date(latestContact.dateKey))
    : "Sin datos";

  return (
    <aside
      className="order-2 w-full border-t px-4 py-5 lg:w-[320px] lg:border-l lg:border-t-0 lg:py-6"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="space-y-4">
        <section className="space-y-4">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.32em]"
            style={{ color: "var(--text-1)" }}
          >
            Operación
          </p>
          <div
            className="rounded-xl border p-4 transition duration-200 hover:ring-2 hover:ring-orange-400/80 dark:hover:ring-orange-300/70"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <p
                className="text-sm font-semibold uppercase tracking-[0.24em]"
                style={{ color: "var(--text-1)" }}
              >
                Contactos en tiempo real
              </p>
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--text-2)" }}
              >
                Actualizado {latestContactLabel}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "var(--text-2)" }}
                >
                  Contactos totales
                </p>
                <p className="mt-2 text-2xl font-semibold" style={{ color: "var(--text-1)" }}>
                  {formatNumber(totalContacts)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "var(--text-2)" }}
                >
                  Última carga
                </p>
                <p className="mt-2 text-lg font-semibold" style={{ color: "var(--text-1)" }}>
                  +{formatNumber(latestContactsDelta)}
                </p>
              </div>
            </div>
            <div className="mt-3 h-24">
              {contactTimeline.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={contactTimeline} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="contactFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
                    <XAxis
                      dataKey="dateKey"
                      tickFormatter={(value) => formatShortDate(new Date(value))}
                      tick={{ fontSize: 10, fill: "#5b6472" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis tick={{ fontSize: 10, fill: "#5b6472" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ stroke: "rgba(148, 163, 184, 0.4)", strokeOpacity: 0.2 }}
                      contentStyle={{
                        borderRadius: 12,
                        borderColor: "#d0d4dc",
                        background: "#ffffff",
                      }}
                      formatter={(value, name) => [
                        formatNumber(Number(value ?? 0)),
                        name === "nuevos" ? "Nuevos" : "Acumulado",
                      ]}
                      labelFormatter={(label) => formatShortDate(new Date(String(label)))}
                    />
                    <Area
                      type="monotone"
                      dataKey="acumulado"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fill="url(#contactFill)"
                      name="Acumulado"
                    />
                    <Line
                      type="monotone"
                      dataKey="nuevos"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 4 }}
                      name="Nuevos"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs" style={{ color: "var(--text-2)" }}>
                  Sin datos de contactos cargados.
                </p>
              )}
            </div>
          </div>
          <div
            className="rounded-xl border p-4 transition duration-200 hover:ring-2 hover:ring-orange-400/80 dark:hover:ring-orange-300/70"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <p
                className="text-sm font-semibold uppercase tracking-[0.24em]"
                style={{ color: "var(--text-1)" }}
              >
                Datos
              </p>
              <span
                className="text-xs font-semibold uppercase tracking-[0.22em]"
                style={{ color: "var(--text-2)" }}
              >
                Total {formatNumber(DATOS_TOTAL)}
              </span>
            </div>
            <div
              className="mt-3 grid grid-cols-2 gap-3 text-[10px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: "var(--text-2)" }}
            >
              <span>Digital</span>
              <span className="text-right">Territorial</span>
            </div>
            <div
              className="mt-2 grid grid-cols-2 gap-3 text-xl font-semibold"
              style={{ color: "var(--text-1)" }}
            >
              <span>{formatNumber(DATOS.digital)}</span>
              <span className="text-right">{formatNumber(DATOS.territorial)}</span>
            </div>
            <div className="mt-3 h-px w-full bg-slate-200/70 dark:bg-slate-800" />
            <p
              className="mt-3 text-sm font-semibold uppercase tracking-[0.24em]"
              style={{ color: "var(--text-1)" }}
            >
              Contactados
            </p>
            <div
              className="mt-3 grid grid-cols-2 gap-3 text-[10px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: "var(--text-2)" }}
            >
              <span>Digital</span>
              <span className="text-right">Territorial</span>
            </div>
            <div
              className="mt-2 grid grid-cols-2 gap-3 text-xl font-semibold"
              style={{ color: "var(--text-1)" }}
            >
              <span>{formatNumber(CONTACTADOS.digital)}</span>
              <span className="text-right">
                {formatNumber(CONTACTADOS.territorial)}
              </span>
            </div>
          </div>
          <div
            className="rounded-xl border p-4 transition duration-200 hover:ring-2 hover:ring-orange-400/80 dark:hover:ring-orange-300/70"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-sm font-semibold uppercase tracking-[0.24em]"
              style={{ color: "var(--text-1)" }}
            >
              Voluntarios
            </p>
            <div className="mt-3 grid grid-cols-[1fr_1.2fr] gap-4">
              <div>
                <p className="text-3xl font-semibold" style={{ color: "var(--text-1)" }}>
                  {formatNumber(VOLUNTARIOS_TOTAL)}
                </p>
              </div>
              <div className="space-y-2">
                {VOLUNTARIOS.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs font-semibold"
                    style={{ color: "var(--text-1)" }}
                  >
                    <span className="uppercase tracking-[0.18em]">{item.label}</span>
                    <span>{formatNumber(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="space-y-4">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.32em]"
            style={{ color: "var(--text-1)" }}
          >
            Crecimiento
          </p>
          <div
            className="rounded-xl border p-4 transition duration-200 hover:ring-2 hover:ring-orange-400/80 dark:hover:ring-orange-300/70"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-sm font-semibold uppercase tracking-[0.24em]"
              style={{ color: "var(--text-1)" }}
            >
              Seguidores
            </p>
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "var(--text-2)" }}
                >
                  Canal WhatsApp
                </span>
                <span className="text-lg font-semibold" style={{ color: "var(--text-1)" }}>
                  {formatNumber(WHATSAPP_FOLLOWERS)}
                </span>
              </div>
              <div className="mt-3 h-px w-full bg-slate-200/70 dark:bg-slate-800" />
              <p
                className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: "var(--text-2)" }}
              >
                Seguidores Facebook
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "var(--text-2)" }}
                >
                  Antes
                </p>
                <p
                  className="text-[10px] text-right font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "var(--text-2)" }}
                >
                  Después
                </p>
                <p className="text-2xl font-semibold" style={{ color: "var(--text-1)" }}>
                  {formatNumber(FOLLOWERS_BEFORE)}
                </p>
                <p
                  className="text-2xl font-semibold text-right"
                  style={{ color: "var(--text-1)" }}
                >
                  {formatNumber(FOLLOWERS_NOW)}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="space-y-4">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.32em]"
            style={{ color: "var(--text-1)" }}
          >
            Insights
          </p>
          <div
            className="rounded-xl border p-4 transition duration-200 hover:ring-2 hover:ring-orange-400/80 dark:hover:ring-orange-300/70"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-sm font-semibold uppercase tracking-[0.24em]"
              style={{ color: "var(--text-1)" }}
            >
              Usuarios y eventos
            </p>
            {summaryCards.length ? (
              <div className="mt-3 grid grid-cols-2 gap-3">
                {summaryCards.map((item) => (
                  <div key={item.label}>
                    <p
                      className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                      style={{ color: "var(--text-2)" }}
                    >
                      {item.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold" style={{ color: "var(--text-1)" }}>
                      {item.format === SUMMARY_FORMAT.SECONDS
                        ? formatSeconds(item.value)
                        : formatNumber(item.value)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm" style={{ color: "var(--text-2)" }}>
                Sin datos del informe panoramico.
              </p>
            )}
          </div>
          <div
            className="rounded-xl border p-4 transition duration-200 hover:ring-2 hover:ring-orange-400/80 dark:hover:ring-orange-300/70"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-sm font-semibold uppercase tracking-[0.24em]"
              style={{ color: "var(--text-1)" }}
            >
              Temas clave
            </p>
            <div className="mt-3 space-y-2 text-xs" style={{ color: "var(--text-1)" }}>
              {TEMAS_CLAVE.map((tema) => (
                <div key={tema.label} className="flex items-start justify-between gap-3">
                  <span
                    className="text-[11px] leading-relaxed"
                    style={{ color: "var(--text-2)" }}
                  >
                    {tema.label}
                  </span>
                  <span className="text-sm font-semibold">{tema.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="rounded-xl border p-4 transition duration-200 hover:ring-2 hover:ring-orange-400/80 dark:hover:ring-orange-300/70"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-sm font-semibold uppercase tracking-[0.24em]"
              style={{ color: "var(--text-1)" }}
            >
              Tendencia de comentarios
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--text-1)" }}>
              Predomina tono positivo y de apoyo, con picos en publicaciones de
              campaña territorial y eventos en vivo.
            </p>
          </div>
          <div
            className="rounded-xl border p-4 transition duration-200 hover:ring-2 hover:ring-orange-400/80 dark:hover:ring-orange-300/70"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center justify-between">
              <p
                className="text-sm font-semibold uppercase tracking-[0.24em]"
                style={{ color: "var(--text-1)" }}
              >
                Resumen IA
              </p>
              <span
                className="rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: "var(--text-2)",
                  borderColor: "var(--border)",
                }}
              >
                Insight
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-1)" }}>
              Mayormente positivo y de apoyo al candidato, con mensajes de respaldo,
              felicitaciones y consignas, destacando presencia en Loreto/Iquitos.
              Existe una minoría crítica/negativa con ataques y acusaciones, pero el
              tono general es de movilización política y unidad.
            </p>
          </div>
        </section>
      </div>
    </aside>
  );
}
