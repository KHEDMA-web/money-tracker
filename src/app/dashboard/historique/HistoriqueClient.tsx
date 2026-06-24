"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Categorie, Depense, DepenseWithCategorie, Statut } from "@/lib/types";
import { supprimerDepense } from "@/lib/actions/depenses";
import AjouterDepenseModal from "@/app/dashboard/_components/AjouterDepenseModal";
import DepenseItem from "@/app/dashboard/_components/DepenseItem";

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
        <h1 className="text-xl font-semibold text-foreground">Historique</h1>
        <p className="text-sm text-muted-foreground">{depenses.length} article(s) au total.</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un article…"
          className="flex-1 rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
        />
        <select
          value={filtreCategorie}
          onChange={(e) => setFiltreCategorie(e.target.value)}
          className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
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
          className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
        >
          <option value="">Tous les statuts</option>
          <option value="en_stock">En stock</option>
          <option value="vendu">Vendu</option>
        </select>
      </div>

      {depensesFiltrees.length === 0 ? (
        <p className="rounded-2xl bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
          Aucune dépense ne correspond à ces filtres.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {depensesFiltrees.map((d) => (
            <DepenseItem
              key={d.id}
              depense={d}
              onEdit={() => setDepenseEnEdition(d)}
              onDelete={() => gererSuppression(d.id)}
              enSuppression={enSuppression === d.id}
              onVendu={() => router.refresh()}
            />
          ))}
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
