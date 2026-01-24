import Image from "next/image";
import CandidateDashboardShell from "../../ui/dashboard/CandidateDashboardShell";
import FormsDashboard from "../components/forms-dashboard";

export default function RocioPorrasPage() {
  return (
    <CandidateDashboardShell
      header={
        <div className="flex items-center gap-3">
          <div
            className="relative h-10 w-10 overflow-hidden rounded-full border"
            style={{ borderColor: "var(--border)" }}
          >
            <Image
              src="/Rocio-Porras.jpg"
              alt="Rocio Porras"
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.24em]"
              style={{ color: "var(--text-2)" }}
            >
              Somos Perú
            </p>
            <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>
              Rocio Porras · Senadora Nacional #4
            </p>
          </div>
        </div>
      }
      sidebar={null}
    >
      <FormsDashboard candidate="rocio" />
    </CandidateDashboardShell>
  );
}
