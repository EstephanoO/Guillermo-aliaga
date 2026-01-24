"use client";

import FormsMap from "./forms-map";
import { toUiRows } from "./forms-utils";
import { useFormsData } from "../hooks/use-forms-data";

type FormsDashboardProps = {
  candidate: string;
};

export default function FormsDashboard({ candidate }: FormsDashboardProps) {
  const { rows } = useFormsData(candidate);

  return (
    <div className="h-full w-full">
      <FormsMap rows={toUiRows(rows)} />
    </div>
  );
}
