"use client";

import { useRouter, useSearchParams } from "next/navigation";

const PERIODES = [
  { value: "tout", label: "Tout" },
  { value: "mois", label: "Mois" },
  { value: "semaine", label: "Semaine" },
  { value: "jour", label: "Jour" },
] as const;

export default function PeriodeSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const periode = searchParams.get("periode") ?? "jour";

  function choisir(val: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("periode", val);
    router.replace(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="flex gap-1 rounded-xl bg-secondary p-1">
      {PERIODES.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => choisir(p.value)}
          className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
            periode === p.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
