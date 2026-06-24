"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
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

const inputCls =
  "h-11 w-full rounded-xl border border-border bg-input px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const labelCls = "text-xs font-semibold uppercase tracking-wider text-muted-foreground";

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
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-card shadow-2xl sm:rounded-3xl">
        {/* Handle mobile */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between px-6 pb-2 pt-4">
          <h2 className="text-base font-bold text-foreground">
            {enEdition ? "Modifier l'article" : "Ajouter un article"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          action={formAction}
          onSubmit={(e) => {
            if (nouvelleCategorieOuverte) e.preventDefault();
          }}
          className="flex flex-col gap-4 px-6 pb-8 pt-2"
        >
          {/* Catégorie */}
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Catégorie</label>
            <select
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
              className={inputCls}
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
            <div className="flex flex-col gap-2 rounded-2xl border border-border bg-secondary/50 p-3">
              <div className="flex gap-2">
                <input
                  value={nouvelleCategorieEmoji}
                  onChange={(e) => setNouvelleCategorieEmoji(e.target.value)}
                  placeholder="🏷️"
                  maxLength={4}
                  className="h-11 w-14 rounded-xl border border-border bg-input px-2 text-center text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <input
                  value={nouvelleCategorieNom}
                  onChange={(e) => setNouvelleCategorieNom(e.target.value)}
                  placeholder="Nom de la catégorie"
                  className={inputCls}
                />
              </div>
              {catError ? <p className="text-xs text-destructive">{catError}</p> : null}
              <button
                type="button"
                disabled={catPending}
                onClick={creerNouvelleCategorie}
                className="self-start rounded-xl bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-40"
              >
                Créer la catégorie
              </button>
            </div>
          ) : null}

          {/* Nom */}
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Article</label>
            <input
              name="nom_article"
              required
              defaultValue={depense?.nom_article}
              placeholder="Rolex Submariner 116610"
              className={inputCls}
            />
          </div>

          {/* Prix */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Prix achat (DA)</label>
              <input
                name="prix_achat"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={depense?.prix_achat}
                className={inputCls + " font-mono"}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Prix revente (DA)</label>
              <input
                name="prix_revente"
                type="number"
                min="0"
                step="0.01"
                defaultValue={depense?.prix_revente ?? undefined}
                onChange={(e) => setVendu(e.target.value.trim() !== "")}
                placeholder="Non vendu"
                className={inputCls + " font-mono"}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Date achat</label>
              <input
                name="date_achat"
                type="date"
                required
                defaultValue={depense?.date_achat}
                className={inputCls}
              />
            </div>
            {vendu ? (
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Date revente</label>
                <input
                  name="date_revente"
                  type="date"
                  defaultValue={depense?.date_revente ?? undefined}
                  className={inputCls}
                />
              </div>
            ) : null}
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Notes</label>
            <textarea
              name="notes"
              rows={2}
              defaultValue={depense?.notes ?? undefined}
              placeholder="Optionnel"
              className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {state.status === "error" ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </div>
          ) : null}

          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-border text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending || nouvelleCategorieOuverte}
              className="flex-1 h-11 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
            >
              {isPending ? "…" : enEdition ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
