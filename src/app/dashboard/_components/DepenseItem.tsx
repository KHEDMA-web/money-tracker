"use client";

import { useState } from "react";
import type { DepenseWithCategorie } from "@/lib/types";
import { formatDate, formatMontant } from "@/lib/format";
import { marquerVendu } from "@/lib/actions/depenses";

function aujourdhui(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function DepenseItem({
  depense,
  masquerCategorie = false,
  onEdit,
  onDelete,
  enSuppression,
  onVendu,
}: {
  depense: DepenseWithCategorie;
  masquerCategorie?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  enSuppression: boolean;
  onVendu: () => void;
}) {
  const [venteOuverte, setVenteOuverte] = useState(false);
  const [prixRevente, setPrixRevente] = useState("");
  const [dateRevente, setDateRevente] = useState(aujourdhui());
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const marge =
    depense.statut === "vendu" && depense.prix_revente != null
      ? depense.prix_revente - depense.prix_achat
      : null;

  async function confirmerVente() {
    setPending(true);
    setError(null);
    try {
      await marquerVendu(depense.id, Number(prixRevente), dateRevente);
      setVenteOuverte(false);
      onVendu();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la vente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <li className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-slate-900">
            {!masquerCategorie && depense.categorie?.emoji ? <span>{depense.categorie.emoji}</span> : null}
            {depense.nom_article}
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                depense.statut === "vendu"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {depense.statut === "vendu" ? "Vendu" : "En stock"}
            </span>
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {masquerCategorie ? null : `${depense.categorie?.nom ?? "Sans catégorie"} · `}
            Acheté le {formatDate(depense.date_achat)}
            {depense.date_revente ? ` · Revendu le ${formatDate(depense.date_revente)}` : ""}
          </p>
          {depense.notes ? <p className="mt-1 text-xs text-slate-500">{depense.notes}</p> : null}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1 text-right">
          <p className="text-sm font-semibold text-slate-900">
            {formatMontant(depense.prix_achat)}
            {depense.prix_revente != null ? ` → ${formatMontant(depense.prix_revente)}` : ""}
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
        {depense.statut === "en_stock" ? (
          <button
            type="button"
            onClick={() => setVenteOuverte((v) => !v)}
            className="rounded-lg px-2 py-1 font-medium text-emerald-600 hover:bg-emerald-50"
          >
            Vendu
          </button>
        ) : null}
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg px-2 py-1 font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          Modifier
        </button>
        <button
          type="button"
          disabled={enSuppression}
          onClick={onDelete}
          className="rounded-lg px-2 py-1 font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
        >
          Supprimer
        </button>
      </div>

      {venteOuverte ? (
        <div className="mt-3 flex flex-wrap items-end gap-2 rounded-xl bg-emerald-50 p-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Prix de revente (DA)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={prixRevente}
              onChange={(e) => setPrixRevente(e.target.value)}
              autoFocus
              className="w-32 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Date de revente</label>
            <input
              type="date"
              value={dateRevente}
              onChange={(e) => setDateRevente(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <button
            type="button"
            disabled={pending || prixRevente.trim() === ""}
            onClick={confirmerVente}
            className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {pending ? "Enregistrement…" : "Confirmer la vente"}
          </button>
          <button
            type="button"
            onClick={() => setVenteOuverte(false)}
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
          >
            Annuler
          </button>
          {error ? <p className="w-full text-xs text-red-600">{error}</p> : null}
        </div>
      ) : null}
    </li>
  );
}
