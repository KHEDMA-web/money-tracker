"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { creerDepense, modifierDepense } from "@/lib/actions/depenses";
import { creerCategorie } from "@/lib/actions/categories";
import {
  categorieActionInitialState,
  depenseActionInitialState,
  type Categorie,
  type Depense,
  type DepenseActionState,
} from "@/lib/types";

const NOUVELLE_CATEGORIE = "__nouvelle__";

export default function AjouterDepenseModal({
  onClose,
  categories,
  depense,
  categorieIdParDefaut,
}: {
  onClose: () => void;
  categories: Categorie[];
  depense?: Depense;
  categorieIdParDefaut?: string;
}) {
  const router = useRouter();
  const enEdition = Boolean(depense);

  const action = enEdition
    ? (prevState: DepenseActionState, formData: FormData) =>
        modifierDepense(depense!.id, prevState, formData)
    : creerDepense;

  const [state, formAction, isPending] = useActionState(action, depenseActionInitialState);

  const [categorieSelectionnee, setCategorieSelectionnee] = useState(
    depense?.categorie_id ?? categorieIdParDefaut ?? ""
  );
  const [vendu, setVendu] = useState(depense?.statut === "vendu");
  const [nouvelleCategorieOuverte, setNouvelleCategorieOuverte] = useState(false);
  const [nouvelleCategorieNom, setNouvelleCategorieNom] = useState("");
  const [nouvelleCategorieEmoji, setNouvelleCategorieEmoji] = useState("");
  const [catPending, setCatPending] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  useEffect(() => {
    if (state.status === "success") {
      onClose();
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  async function creerNouvelleCategorie() {
    setCatPending(true);
    setCatError(null);
    const formData = new FormData();
    formData.set("emoji", nouvelleCategorieEmoji);
    formData.set("nom", nouvelleCategorieNom);
    const result = await creerCategorie(categorieActionInitialState, formData);
    setCatPending(false);

    if (result.status === "error") {
      setCatError(result.error ?? "Erreur lors de la création.");
      return;
    }

    setCategorieSelectionnee(result.id ?? "");
    setNouvelleCategorieOuverte(false);
    setNouvelleCategorieNom("");
    setNouvelleCategorieEmoji("");
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {enEdition ? "Modifier la dépense" : "Ajouter une dépense"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <form
          action={formAction}
          onSubmit={(e) => {
            if (nouvelleCategorieOuverte) e.preventDefault();
          }}
          className="mt-4 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="categorie_id" className="text-sm font-medium text-slate-700">
              Catégorie
            </label>
            <select
              id="categorie_id"
              name="categorie_id"
              value={nouvelleCategorieOuverte ? NOUVELLE_CATEGORIE : categorieSelectionnee}
              onChange={(e) => {
                if (e.target.value === NOUVELLE_CATEGORIE) {
                  setNouvelleCategorieOuverte(true);
                } else {
                  setNouvelleCategorieOuverte(false);
                  setCategorieSelectionnee(e.target.value);
                }
              }}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            >
              <option value="">Sans catégorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji ? `${c.emoji} ` : ""}
                  {c.nom}
                </option>
              ))}
              <option value={NOUVELLE_CATEGORIE}>+ Nouvelle catégorie…</option>
            </select>
          </div>

          {nouvelleCategorieOuverte ? (
            <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3">
              <div className="flex gap-2">
                <input
                  value={nouvelleCategorieEmoji}
                  onChange={(e) => setNouvelleCategorieEmoji(e.target.value)}
                  placeholder="🏷️"
                  maxLength={4}
                  className="w-16 rounded-xl border border-slate-200 px-2 py-2 text-center text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
                <input
                  value={nouvelleCategorieNom}
                  onChange={(e) => setNouvelleCategorieNom(e.target.value)}
                  placeholder="Nom de la catégorie"
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
              {catError ? <p className="text-xs text-red-600">{catError}</p> : null}
              <button
                type="button"
                disabled={catPending}
                onClick={creerNouvelleCategorie}
                className="self-start rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50"
              >
                Créer la catégorie
              </button>
            </div>
          ) : null}

          <div className="flex flex-col gap-1">
            <label htmlFor="nom_article" className="text-sm font-medium text-slate-700">
              Nom / description de l&apos;article
            </label>
            <input
              id="nom_article"
              name="nom_article"
              required
              defaultValue={depense?.nom_article}
              placeholder="Rolex Submariner 116610"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="prix_achat" className="text-sm font-medium text-slate-700">
                Prix d&apos;achat (DA)
              </label>
              <input
                id="prix_achat"
                name="prix_achat"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={depense?.prix_achat}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="prix_revente" className="text-sm font-medium text-slate-700">
                Prix de revente (DA)
              </label>
              <input
                id="prix_revente"
                name="prix_revente"
                type="number"
                min="0"
                step="0.01"
                defaultValue={depense?.prix_revente ?? undefined}
                onChange={(e) => setVendu(e.target.value.trim() !== "")}
                placeholder="Non vendu"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="date_achat" className="text-sm font-medium text-slate-700">
                Date d&apos;achat
              </label>
              <input
                id="date_achat"
                name="date_achat"
                type="date"
                required
                defaultValue={depense?.date_achat}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            {vendu ? (
              <div className="flex flex-col gap-1">
                <label htmlFor="date_revente" className="text-sm font-medium text-slate-700">
                  Date de revente
                </label>
                <input
                  id="date_revente"
                  name="date_revente"
                  type="date"
                  defaultValue={depense?.date_revente ?? undefined}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="notes" className="text-sm font-medium text-slate-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              defaultValue={depense?.notes ?? undefined}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          {state.status === "error" ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
          ) : null}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending || nouvelleCategorieOuverte}
              className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isPending ? "Enregistrement…" : enEdition ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
