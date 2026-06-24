"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DepenseWithCategorie } from "@/lib/types";
import { profit } from "@/lib/kpis";
import { formatMontant } from "@/lib/format";

const GRID = "#3A3A3C";
const TICK = "#8E8E93";

export default function JourVentesChart({ depenses }: { depenses: DepenseWithCategorie[] }) {
  const vendus = depenses
    .filter((d) => d.statut === "vendu" && d.prix_revente != null)
    .map((d) => ({
      nom: `${d.categorie?.emoji ? d.categorie.emoji + " " : ""}${
        d.nom_article.length > 22 ? d.nom_article.slice(0, 20) + "…" : d.nom_article
      }`,
      profit: profit(d),
    }))
    .sort((a, b) => b.profit - a.profit);

  if (vendus.length === 0) {
    return (
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Aucune vente aujourd'hui.
      </p>
    );
  }

  const hauteur = Math.max(180, vendus.length * 42);

  return (
    <ResponsiveContainer width="100%" height={hauteur}>
      <BarChart
        data={vendus}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: TICK }}
          tickFormatter={(v: number) =>
            v >= 1000000
              ? `${(v / 1000000).toFixed(1)}M`
              : v >= 1000
              ? `${(v / 1000).toFixed(0)}k`
              : String(v)
          }
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="nom"
          tick={{ fontSize: 11, fill: TICK }}
          width={170}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(v) => [formatMontant(Number(v)), "Profit"]}
          contentStyle={{
            borderRadius: "12px",
            border: `1px solid ${GRID}`,
            background: "#2C2C2E",
            color: "#E5E5EA",
            fontSize: 12,
          }}
        />
        <Bar dataKey="profit" fill="#F59E0B" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
