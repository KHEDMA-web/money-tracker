"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Categorie, Depense, DepenseWithCategorie, Statut } from "@/lib/types";
import { supprimerDepense } from "@/lib/actions/depenses";
import { formatDate, formatMontant } from "@/lib/format";
import AjouterDepenseModal from "@/app/dashboard/_components/AjouterDepenseModal";

export default function HistoriqueClient({
  depenses,
  categories,
}: {
  depenses: DepenseWithCategorie[];
  categories: Categorie[];
}) {
  const router = useRouter();
  const [recherche, setRecherche] = useState("");
  const [filtreCategorie, setFiltreCategorie] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<"" | Statut>("");
  const [depenseEnEdition, setDepenseEnEdition] = useState<Depense | null>(null);
  const [enSuppression, setEnSuppression] = useState<string | null>(null);

  const depensesFiltrees = useMemo(() => {
    return depenses
      .filter((d) =>
        recherche.trim() === ""
          ? true
          : d.nom_article.toLowerCase().includes(recherche.trim().toLowerCase())
      )
      .filter((d) => (filtreCategorie ? d.categorie_id === filtreCategorie : true))
      .filter((d) => (filtreStatut ? d.statut === filtreStatut : true));
  }, [depenses, recherche, filtreCategorie, filtreStatut]);

  async function gererSuppression(id: string) {
    if (!window.confirm("Supprimer définitivement cette dépense ?")) return;
    setEnSuppression(id);
    try {
      await supprimerDepense(id);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur lors de la suppression.");
    } finally {
      setEnSuppression(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Historique</h1>
        <p className="text-sm text-slate-500">{depenses.length} article(s) au total.</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un article…"
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        />
        <select
          value={filtreCategorie}
          onChange={(e) => setFiltreCategorie(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji ? `${c.emoji} ` : ""}
              {c.nom}
            </option>
          ))}
        </select>
        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value as "" | Statut)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        >
          <option value="">Tous les statuts</option>
          <option value="en_stock">En stock</option>
          <option value="vendu">Vendu</option>
        </select>
      </div>

      {depensesFiltrees.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-400 shadow-sm">
          Aucune dépense ne correspond à ces filtres.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {depensesFiltrees.map((d) => {
            const marge = d.statut === "vendu" && d.prix_revente != null ? d.prix_revente - d.prix_achat : null;
            return (
              <li key={d.id} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium text-slate-900">
                      {d.categorie?.emoji ? <span>{d.categorie.emoji}</span> : null}
                      {d.nom_article}
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          d.statut === "vendu"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {d.statut === "vendu" ? "Vendu" : "En stock"}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {d.categorie?.nom ?? "Sans catégorie"} · Acheté le {formatDate(d.date_achat)}
                      {d.date_revente ? ` · Revendu le ${formatDate(d.date_revente)}` : ""}
                    </p>
                    {d.notes ? <p className="mt-1 text-xs text-slate-500">{d.notes}</p> : null}
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatMontant(d.prix_achat)}
                      {d.prix_revente != null ? ` → ${formatMontant(d.prix_revente)}` : ""}
                    </p>
                    {marge != null ? (
                      <p className={`text-xs font-medium ${marge >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {marge >= 0 ? "+" : ""}
                        {formatMontant(marge)}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDepenseEnEdition(d)}
                    className="rounded-lg px-2 py-1 font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    disabled={enSuppression === d.id}
                    onClick={() => gererSuppression(d.id)}
                    className="rounded-lg px-2 py-1 font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {depenseEnEdition ? (
        <AjouterDepenseModal
          onClose={() => setDepenseEnEdition(null)}
          categories={categories}
          depense={depenseEnEdition}
        />
      ) : null}
    </div>
  );
}
