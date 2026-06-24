"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Pencil, Trash2 } from "lucide-react";
import { creerCategorie, modifierCategorie, supprimerCategorie } from "@/lib/actions/categories";
import { categorieActionInitialState, type Categorie } from "@/lib/types";

export default function CategoriesClient({ categories }: { categories: Categorie[] }) {
  const router = useRouter();
  const [creerState, creerFormAction, creerPending] = useActionState(
    creerCategorie,
    categorieActionInitialState
  );

  useEffect(() => {
    if (creerState.status === "success") router.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creerState]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Catégories</h1>
        <p className="text-sm text-muted-foreground">{categories.length} catégorie(s).</p>
      </div>

      <form
        key={creerState.status === "success" ? "reset" : "form"}
        action={creerFormAction}
        className="flex flex-wrap items-end gap-2 rounded-2xl bg-card p-4 shadow-sm"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Emoji</label>
          <input
            name="emoji"
            maxLength={4}
            placeholder="⌚️"
            className="w-16 rounded-xl border border-border px-2 py-2 text-center text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Nouvelle catégorie</label>
          <input
            name="nom"
            required
            placeholder="Montres"
            className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
        </div>
        <button
          type="submit"
          disabled={creerPending}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          Ajouter
        </button>
        {creerState.status === "error" ? (
          <p className="w-full text-sm text-red-600">{creerState.error}</p>
        ) : null}
      </form>

      {categories.length === 0 ? (
        <p className="rounded-2xl bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
          Aucune catégorie pour le moment.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {categories.map((c) => (
            <CategorieRow key={c.id} categorie={c} />
          ))}
        </ul>
      )}
    </div>
  );
}

function CategorieRow({ categorie }: { categorie: Categorie }) {
  const router = useRouter();
  const [enEdition, setEnEdition] = useState(false);
  const [enSuppression, setEnSuppression] = useState(false);
  const [modifierPending, setModifierPending] = useState(false);
  const [modifierError, setModifierError] = useState<string | null>(null);

  async function gererModification(formData: FormData) {
    setModifierPending(true);
    setModifierError(null);
    const result = await modifierCategorie(categorie.id, categorieActionInitialState, formData);
    setModifierPending(false);

    if (result.status === "error") {
      setModifierError(result.error ?? "Erreur.");
      return;
    }

    setEnEdition(false);
    router.refresh();
  }

  async function gererSuppression() {
    if (!window.confirm(`Supprimer la catégorie « ${categorie.nom} » ?`)) return;
    setEnSuppression(true);
    try {
      await supprimerCategorie(categorie.id);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur lors de la suppression.");
      setEnSuppression(false);
    }
  }

  if (enEdition) {
    return (
      <li className="rounded-2xl border border-primary/30 bg-card p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            gererModification(new FormData(e.currentTarget));
          }}
          className="flex flex-wrap items-end gap-2"
        >
          <input
            name="emoji"
            maxLength={4}
            defaultValue={categorie.emoji ?? ""}
            className="w-16 rounded-xl border border-border bg-input px-2 py-2 text-center outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
          <input
            name="nom"
            required
            defaultValue={categorie.nom}
            autoFocus
            className="flex-1 rounded-xl border border-border bg-input px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
          <button
            type="submit"
            disabled={modifierPending}
            className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            Enregistrer
          </button>
          <button
            type="button"
            onClick={() => setEnEdition(false)}
            className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
          >
            Annuler
          </button>
          {modifierError ? <p className="w-full text-sm text-destructive">{modifierError}</p> : null}
        </form>
      </li>
    );
  }

  return (
    <li className="relative flex items-center rounded-2xl border border-border bg-card transition-colors active:bg-secondary/50">
      {/* Zone cliquable principale → ouvre la catégorie */}
      <Link
        href={`/dashboard/categories/${categorie.id}`}
        className="flex flex-1 items-center gap-3 px-4 py-4 pr-2"
      >
        <span className="text-xl leading-none">
          {categorie.emoji ?? "📁"}
        </span>
        <span className="text-sm font-semibold text-foreground">{categorie.nom}</span>
        <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
      </Link>

      {/* Séparateur vertical */}
      <div className="h-8 w-px shrink-0 bg-border" />

      {/* Icônes modifier / supprimer */}
      <div className="flex items-center gap-0.5 px-2">
        <button
          type="button"
          onClick={() => setEnEdition(true)}
          className="rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          title="Modifier"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={enSuppression}
          onClick={gererSuppression}
          className="rounded-xl p-2.5 text-destructive transition-colors hover:bg-[var(--loss-bg)] disabled:opacity-40"
          title="Supprimer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
