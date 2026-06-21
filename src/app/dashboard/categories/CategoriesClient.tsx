"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  creerCategorie,
  modifierCategorie,
  supprimerCategorie,
  categorieActionInitialState,
} from "@/lib/actions/categories";
import type { Categorie } from "@/lib/types";

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
        <h1 className="text-xl font-semibold text-slate-900">Catégories</h1>
        <p className="text-sm text-slate-500">{categories.length} catégorie(s).</p>
      </div>

      <form
        key={creerState.status === "success" ? "reset" : "form"}
        action={creerFormAction}
        className="flex flex-wrap items-end gap-2 rounded-2xl bg-white p-4 shadow-sm"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">Emoji</label>
          <input
            name="emoji"
            maxLength={4}
            placeholder="⌚️"
            className="w-16 rounded-xl border border-slate-200 px-2 py-2 text-center text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">Nouvelle catégorie</label>
          <input
            name="nom"
            required
            placeholder="Montres"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>
        <button
          type="submit"
          disabled={creerPending}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Ajouter
        </button>
        {creerState.status === "error" ? (
          <p className="w-full text-sm text-red-600">{creerState.error}</p>
        ) : null}
      </form>

      {categories.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-400 shadow-sm">
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
      <li className="rounded-2xl bg-white p-4 shadow-sm">
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
            className="w-16 rounded-xl border border-slate-200 px-2 py-2 text-center text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
          <input
            name="nom"
            required
            defaultValue={categorie.nom}
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={modifierPending}
            className="rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Enregistrer
          </button>
          <button
            type="button"
            onClick={() => setEnEdition(false)}
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
          >
            Annuler
          </button>
          {modifierError ? <p className="w-full text-sm text-red-600">{modifierError}</p> : null}
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <p className="flex items-center gap-2 text-sm font-medium text-slate-900">
        {categorie.emoji ? <span>{categorie.emoji}</span> : null}
        {categorie.nom}
      </p>
      <div className="flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => setEnEdition(true)}
          className="rounded-lg px-2 py-1 font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          Modifier
        </button>
        <button
          type="button"
          disabled={enSuppression}
          onClick={gererSuppression}
          className="rounded-lg px-2 py-1 font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
        >
          Supprimer
        </button>
      </div>
    </li>
  );
}
