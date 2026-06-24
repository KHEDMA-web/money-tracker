"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ProfitParCategorie } from "@/lib/kpis";
import { formatMontant } from "@/lib/format";

const GRID = "#3A3A3C";
const TICK = "#8E8E93";

export default function ProfitParCategorieChart({ data }: { data: ProfitParCategorie[] }) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Aucune vente pour le moment.</p>;
  }

  const chartData = data.map((d) => ({ nom: `${d.emoji ? d.emoji + " " : ""}${d.nom}`, profit: d.profit }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="nom" tick={{ fontSize: 12, fill: TICK }} />
        <YAxis tick={{ fontSize: 12, fill: TICK }} width={70} />
        <Tooltip
          formatter={(value) => formatMontant(Number(value))}
          contentStyle={{
            borderRadius: "12px",
            border: `1px solid ${GRID}`,
            background: "#2C2C2E",
            color: "#E5E5EA",
            fontSize: 12,
          }}
        />
        <Bar dataKey="profit" fill="#F59E0B" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
