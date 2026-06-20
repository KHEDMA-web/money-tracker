"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ProfitParMois } from "@/lib/kpis";
import { formatMontant } from "@/lib/format";

export default function EvolutionProfitChart({ data }: { data: ProfitParMois[] }) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">Pas encore de données.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#64748b" }} />
        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} width={70} />
        <Tooltip formatter={(value) => formatMontant(Number(value))} />
        <Line type="monotone" dataKey="profit" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
