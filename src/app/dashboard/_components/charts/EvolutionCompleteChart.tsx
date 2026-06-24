"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { EvolutionComplete } from "@/lib/kpis";
import { formatMontant } from "@/lib/format";

const GRID = "#3A3A3C";
const TICK = "#8E8E93";

function formatLabel(key: string): string {
  if (key.length === 7) {
    const [year, month] = key.split("-");
    return new Date(Number(year), Number(month) - 1).toLocaleDateString("fr-FR", {
      month: "short",
      year: "2-digit",
    });
  }
  const [, month, day] = key.split("-");
  return new Date(Number(key.slice(0, 4)), Number(month) - 1, Number(day)).toLocaleDateString(
    "fr-FR",
    { day: "numeric", month: "short" }
  );
}

export default function EvolutionCompleteChart({ data }: { data: EvolutionComplete[] }) {
  if (data.length === 0) {
    return (
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Aucune activité sur cette période.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
        <XAxis
          dataKey="mois"
          tickFormatter={formatLabel}
          tick={{ fontSize: 11, fill: TICK }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: TICK }}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
          }
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          formatter={(value) => [formatMontant(Number(value)), ""]}
          labelFormatter={(label) => formatLabel(String(label))}
          contentStyle={{
            borderRadius: "12px",
            border: `1px solid ${GRID}`,
            background: "#2C2C2E",
            color: "#E5E5EA",
            fontSize: 12,
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
        <Line
          type="monotone"
          dataKey="investi"
          name="Investi"
          stroke={TICK}
          strokeWidth={2}
          dot={{ r: 4, fill: TICK }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="ventes"
          name="Ventes"
          stroke="#F59E0B"
          strokeWidth={2}
          dot={{ r: 4, fill: "#F59E0B" }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="profit"
          name="Profit"
          stroke="#4ADE80"
          strokeWidth={2}
          dot={{ r: 4, fill: "#4ADE80" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
