import type { DepenseWithCategorie } from "@/lib/types";

export function profit(depense: DepenseWithCategorie): number {
  if (depense.statut !== "vendu" || depense.prix_revente == null) return 0;
  return depense.prix_revente - depense.prix_achat;
}

function joursEntre(dateAchat: string, dateRevente: string): number {
  const ms = new Date(dateRevente).getTime() - new Date(dateAchat).getTime();
  return ms / (1000 * 60 * 60 * 24);
}

export type ProfitParCategorie = {
  categorieId: string | null;
  nom: string;
  emoji: string | null;
  profit: number;
};

export type ProfitParMois = {
  mois: string; // YYYY-MM
  profit: number;
};

export type EvolutionComplete = {
  mois: string; // YYYY-MM
  investi: number;
  ventes: number;
  profit: number;
};

export type Kpis = {
  totalInvesti: number;
  totalVentes: number;
  profitTotal: number;
  margeMoyennePct: number | null;
  roiGlobalPct: number | null;
  nbEnStock: number;
  nbVendus: number;
  valeurStock: number;
  profitParCategorie: ProfitParCategorie[];
  evolutionParMois: ProfitParMois[];
  tempsMoyenDetentionJours: number | null;
  top5Ventes: DepenseWithCategorie[];
  categoriePlusRentable: ProfitParCategorie | null;
};

export function calculerEvolutionComplete(
  depenses: DepenseWithCategorie[],
  periode: string
): EvolutionComplete[] {
  const map = new Map<string, EvolutionComplete>();
  for (const d of depenses) {
    // "tout" et "mois" groupent par mois ; "semaine" et "jour" groupent par jour
    const key = periode === "tout" ? d.date_achat.slice(0, 7) : d.date_achat.slice(0, 10);
    const entry = map.get(key) ?? { mois: key, investi: 0, ventes: 0, profit: 0 };
    entry.investi += d.prix_achat;
    if (d.statut === "vendu" && d.prix_revente != null) {
      entry.ventes += d.prix_revente;
      entry.profit += d.prix_revente - d.prix_achat;
    }
    map.set(key, entry);
  }
  return Array.from(map.values()).sort((a, b) => a.mois.localeCompare(b.mois));
}

export function calculerKpis(depenses: DepenseWithCategorie[]): Kpis {
  const vendus = depenses.filter((d) => d.statut === "vendu" && d.prix_revente != null);
  const enStock = depenses.filter((d) => d.statut === "en_stock");

  const totalInvesti = depenses.reduce((sum, d) => sum + d.prix_achat, 0);
  const totalVentes = vendus.reduce((sum, d) => sum + (d.prix_revente ?? 0), 0);
  const coutAchatVendus = vendus.reduce((sum, d) => sum + d.prix_achat, 0);
  const profitTotal = totalVentes - coutAchatVendus;

  const margeMoyennePct =
    vendus.length > 0 ? (profitTotal / vendus.length) / (coutAchatVendus / vendus.length) * 100 : null;
  const roiGlobalPct = coutAchatVendus > 0 ? (profitTotal / coutAchatVendus) * 100 : null;

  const valeurStock = enStock.reduce((sum, d) => sum + d.prix_achat, 0);

  const profitParCategorieMap = new Map<string, ProfitParCategorie>();
  for (const d of vendus) {
    const key = d.categorie_id ?? "sans-categorie";
    const existing = profitParCategorieMap.get(key);
    const p = profit(d);
    if (existing) {
      existing.profit += p;
    } else {
      profitParCategorieMap.set(key, {
        categorieId: d.categorie_id,
        nom: d.categorie?.nom ?? "Sans catégorie",
        emoji: d.categorie?.emoji ?? null,
        profit: p,
      });
    }
  }
  const profitParCategorie = Array.from(profitParCategorieMap.values()).sort(
    (a, b) => b.profit - a.profit
  );

  const profitParMoisMap = new Map<string, number>();
  for (const d of vendus) {
    if (!d.date_revente) continue;
    const mois = d.date_revente.slice(0, 7);
    profitParMoisMap.set(mois, (profitParMoisMap.get(mois) ?? 0) + profit(d));
  }
  const evolutionParMois = Array.from(profitParMoisMap.entries())
    .map(([mois, profit]) => ({ mois, profit }))
    .sort((a, b) => a.mois.localeCompare(b.mois));

  const detentions = vendus
    .filter((d) => d.date_revente)
    .map((d) => joursEntre(d.date_achat, d.date_revente as string));
  const tempsMoyenDetentionJours =
    detentions.length > 0 ? detentions.reduce((s, j) => s + j, 0) / detentions.length : null;

  const top5Ventes = [...vendus].sort((a, b) => profit(b) - profit(a)).slice(0, 5);

  const categoriePlusRentable = profitParCategorie[0] ?? null;

  return {
    totalInvesti,
    totalVentes,
    profitTotal,
    margeMoyennePct,
    roiGlobalPct,
    nbEnStock: enStock.length,
    nbVendus: vendus.length,
    valeurStock,
    profitParCategorie,
    evolutionParMois,
    tempsMoyenDetentionJours,
    top5Ventes,
    categoriePlusRentable,
  };
}
