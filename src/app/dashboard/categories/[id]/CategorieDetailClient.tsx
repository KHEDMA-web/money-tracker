"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Categorie, Depense, DepenseWithCategorie } from "@/lib/types";
import { supprimerDepense } from "@/lib/actions/depenses";
import AjouterDepenseModal from "@/app/dashboard/_components/AjouterDepenseModal";
import DepenseItem from "@/app/dashboard/_components/DepenseItem";

export default function CategorieDetailClient({
  categorie,
  depenses,
  categories,
}: {
  categorie: Categorie;
  depenses: DepenseWithCategorie[];
  categories: Categorie[];
}) {
  const router = useRouter();
  const [depenseEnEdition, setDepenseEnEdition] = useState<Depense | null>(null);
  const [ajoutOuvert, setAjoutOuvert] = useState(false);
  const [enSuppression, setEnSuppression] = useState<string | null>(null);

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
        <Link href="/dashboard/categories" className="text-sm text-muted-foreground hover:text-foreground">
          ← Catégories
        </Link>
        <div className="mt-1 flex items-center justify-between gap-3">
          <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            {categorie.emoji ? <span>{categorie.emoji}</span> : null}
            {categorie.nom}
          </h1>
          <button
            type="button"
            onClick={() => setAjoutOuvert(true)}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Ajouter un article
          </button>
        </div>
        <p className="text-sm text-muted-foreground">{depenses.length} article(s) dans cette catégorie.</p>
      </div>

      {depenses.length === 0 ? (
        <p className="rounded-2xl bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
          Aucun article dans cette catégorie pour le moment.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {depenses.map((d) => (
            <DepenseItem
              key={d.id}
              depense={d}
              masquerCategorie
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

      {ajoutOuvert ? (
        <AjouterDepenseModal
          onClose={() => setAjoutOuvert(false)}
          categories={categories}
          categorieIdParDefaut={categorie.id}
        />
      ) : null}
    </div>
  );
}
