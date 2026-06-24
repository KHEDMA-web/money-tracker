import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { calculerKpis, calculerEvolutionComplete } from "@/lib/kpis";
import type { DepenseWithCategorie } from "@/lib/types";
import KpiCard from "@/app/dashboard/_components/KpiCard";
import PeriodeSelector from "@/app/dashboard/_components/PeriodeSelector";
import ProfitParCategorieChart from "@/app/dashboard/_components/charts/ProfitParCategorieChart";
import EvolutionCompleteChart from "@/app/dashboard/_components/charts/EvolutionCompleteChart";
import { formatDate, formatJours, formatMontant, formatPourcentage } from "@/lib/format";

type Periode = "jour" | "semaine" | "mois" | "tout";

function filtrerParPeriode(
  depenses: DepenseWithCategorie[],
  periode: Periode
): DepenseWithCategorie[] {
  if (periode === "tout") return depenses;

  const auj = new Date();
  let debut: Date;

  if (periode === "jour") {
    debut = new Date(auj.getFullYear(), auj.getMonth(), auj.getDate());
  } else if (periode === "semaine") {
    debut = new Date(auj);
    debut.setDate(auj.getDate() - 6);
    debut.setHours(0, 0, 0, 0);
  } else {
    // mois
    debut = new Date(auj.getFullYear(), auj.getMonth(), 1);
  }

  return depenses.filter((d) => {
    const [y, m, day] = d.date_achat.split("-").map(Number);
    return new Date(y, m - 1, day) >= debut;
  });
}

function labelPeriode(periode: Exclude<Periode, "tout">): string {
  if (periode === "jour") return "aujourd'hui";
  if (periode === "semaine") return "ces 7 derniers jours";
  return "ce mois-ci";
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ periode?: string }>;
}) {
  const { periode: periodeParam = "jour" } = await searchParams;
  const periode = (["jour", "semaine", "mois", "tout"].includes(periodeParam)
    ? periodeParam
    : "tout") as Periode;

  const supabase = await createClient();
  const { data } = await supabase
    .from("depenses")
    .select("*, categorie:categories(*)")
    .order("date_achat", { ascending: false });

  const depenses = (data ?? []) as DepenseWithCategorie[];
  const depensesFiltrees = filtrerParPeriode(depenses, periode);
  const kpis = calculerKpis(depensesFiltrees);
  const evolutionComplete = calculerEvolutionComplete(depensesFiltrees, periode);

  const sousTitre =
    periode !== "tout"
      ? `Vue d'ensemble — ${labelPeriode(periode as Exclude<Periode, "tout">)}`
      : "Vue d'ensemble de votre activité.";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{sousTitre}</p>
        </div>
        <Suspense fallback={null}>
          <PeriodeSelector />
        </Suspense>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <KpiCard titre="Total investi" valeur={formatMontant(kpis.totalInvesti)} />
        <KpiCard titre="Total des ventes" valeur={formatMontant(kpis.totalVentes)} />
        <KpiCard
          titre="Profit total"
          valeur={formatMontant(kpis.profitTotal)}
          accent={kpis.profitTotal >= 0}
        />
        <KpiCard titre="Marge moyenne" valeur={formatPourcentage(kpis.margeMoyennePct)} />
        <KpiCard titre="ROI global" valeur={formatPourcentage(kpis.roiGlobalPct)} />
        <KpiCard
          titre="En stock / vendus"
          valeur={`${kpis.nbEnStock} / ${kpis.nbVendus}`}
        />
        <KpiCard titre="Valeur du stock actuel" valeur={formatMontant(kpis.valeurStock)} />
        <KpiCard titre="Temps moyen de détention" valeur={formatJours(kpis.tempsMoyenDetentionJours)} />
      </div>

      {kpis.categoriePlusRentable ? (
        <div className="rounded-2xl bg-accent/10 p-4">
          <p className="text-xs font-medium text-accent">Catégorie la plus rentable</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {kpis.categoriePlusRentable.emoji ? `${kpis.categoriePlusRentable.emoji} ` : ""}
            {kpis.categoriePlusRentable.nom} — {formatMontant(kpis.categoriePlusRentable.profit)}
          </p>
        </div>
      ) : null}

      <div className="rounded-2xl bg-card p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">
          Évolution — Investi · Ventes · Profit
        </h2>
        <EvolutionCompleteChart data={evolutionComplete} />
      </div>

      <div className="rounded-2xl bg-card p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Profit par catégorie</h2>
        <ProfitParCategorieChart data={kpis.profitParCategorie} />
      </div>

      <div className="rounded-2xl bg-card p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Top 5 meilleures ventes</h2>
        {kpis.top5Ventes.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Aucune vente sur cette période.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {kpis.top5Ventes.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <div>
                  <p className="font-medium text-foreground">
                    {d.categorie?.emoji ? `${d.categorie.emoji} ` : ""}
                    {d.nom_article}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(d.date_revente)}</p>
                </div>
                <span className="font-semibold text-accent">
                  {formatMontant((d.prix_revente ?? 0) - d.prix_achat)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
