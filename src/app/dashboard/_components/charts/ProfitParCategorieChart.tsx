"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ProfitParCategorie } from "@/lib/kpis";
import { formatMontant } from "@/lib/format";

export default function ProfitParCategorieChart({ data }: { data: ProfitParCategorie[] }) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">Aucune vente pour le moment.</p>;
  }

  const chartData = data.map((d) => ({ nom: `${d.emoji ? d.emoji + " " : ""}${d.nom}`, profit: d.profit }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="nom" tick={{ fontSize: 12, fill: "#64748b" }} />
        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} width={70} />
        <Tooltip formatter={(value) => formatMontant(Number(value))} />
        <Bar dataKey="profit" fill="#4f46e5" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
