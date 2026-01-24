import Image from "next/image";
import CandidateDashboardShell from "../../ui/dashboard/CandidateDashboardShell";
import FormsDashboard from "../components/forms-dashboard";

export default function GiovannaCastagninoPage() {
  return (
    <CandidateDashboardShell
      header={
        <div className="flex items-center gap-3">
          <div
            className="relative h-10 w-10 overflow-hidden rounded-full border"
            style={{ borderColor: "var(--border)" }}
          >
            <Image
              src="/giovanna-castagnino.jpg"
              alt="Giovanna Castagnino"
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
              Giovanna Castagnino · Senadora Nacional #12
            </p>
          </div>
        </div>
      }
      sidebar={null}
    >
      <FormsDashboard candidate="giovanna" />
    </CandidateDashboardShell>
  );
}
