import { createClient } from "@/lib/supabase/server";
import { calculerKpis } from "@/lib/kpis";
import type { DepenseWithCategorie } from "@/lib/types";
import KpiCard from "@/app/dashboard/_components/KpiCard";
import ProfitParCategorieChart from "@/app/dashboard/_components/charts/ProfitParCategorieChart";
import EvolutionProfitChart from "@/app/dashboard/_components/charts/EvolutionProfitChart";
import { formatDate, formatJours, formatMontant, formatPourcentage } from "@/lib/format";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("depenses")
    .select("*, categorie:categories(*)")
    .order("date_achat", { ascending: false });

  const depenses = (data ?? []) as DepenseWithCategorie[];
  const kpis = calculerKpis(depenses);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Vue d&apos;ensemble de votre activité.</p>
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
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {kpis.categoriePlusRentable.emoji ? `${kpis.categoriePlusRentable.emoji} ` : ""}
            {kpis.categoriePlusRentable.nom} — {formatMontant(kpis.categoriePlusRentable.profit)}
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Profit par catégorie</h2>
          <ProfitParCategorieChart data={kpis.profitParCategorie} />
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Évolution du profit</h2>
          <EvolutionProfitChart data={kpis.evolutionParMois} />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Top 5 meilleures ventes</h2>
        {kpis.top5Ventes.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">Aucune vente pour le moment.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {kpis.top5Ventes.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <div>
                  <p className="font-medium text-slate-900">
                    {d.categorie?.emoji ? `${d.categorie.emoji} ` : ""}
                    {d.nom_article}
                  </p>
                  <p className="text-xs text-slate-400">{formatDate(d.date_revente)}</p>
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
