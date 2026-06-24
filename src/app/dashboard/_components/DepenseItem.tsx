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

  const margePositive = marge != null && marge >= 0;

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
    <li className="rounded-2xl border border-border bg-card p-4 transition-colors hover:border-border/60">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {!masquerCategorie && depense.categorie?.emoji ? (
              <span className="text-base leading-none">{depense.categorie.emoji}</span>
            ) : null}
            <p className="truncate text-sm font-semibold text-foreground">
              {depense.nom_article}
            </p>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                depense.statut === "vendu"
                  ? "bg-[var(--profit-bg)] text-[var(--profit)]"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {depense.statut === "vendu" ? "Vendu" : "Stock"}
            </span>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {masquerCategorie ? null : `${depense.categorie?.nom ?? "Sans catégorie"} · `}
            {formatDate(depense.date_achat)}
            {depense.date_revente ? ` → ${formatDate(depense.date_revente)}` : ""}
          </p>

          {depense.notes ? (
            <p className="mt-1 text-xs italic text-muted-foreground">{depense.notes}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1 text-right">
          <p className="font-mono text-sm font-semibold text-foreground">
            {formatMontant(depense.prix_achat)}
            {depense.prix_revente != null ? (
              <> → {formatMontant(depense.prix_revente)}</>
            ) : null}
          </p>
          {marge != null ? (
            <p
              className={`font-mono text-xs font-semibold ${
                margePositive ? "text-[var(--profit)]" : "text-destructive"
              }`}
            >
              {margePositive ? "+" : ""}
              {formatMontant(marge)}
            </p>
          ) : null}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex justify-end gap-1 text-xs">
        {depense.statut === "en_stock" ? (
          <button
            type="button"
            onClick={() => setVenteOuverte((v) => !v)}
            className="rounded-lg px-3 py-1.5 font-semibold text-[var(--profit)] transition-colors hover:bg-[var(--profit-bg)]"
          >
            Vendu
          </button>
        ) : null}
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          Modifier
        </button>
        <button
          type="button"
          disabled={enSuppression}
          onClick={onDelete}
          className="rounded-lg px-3 py-1.5 font-medium text-destructive transition-colors hover:bg-[var(--loss-bg)] disabled:opacity-40"
        >
          Supprimer
        </button>
      </div>

      {/* Mini-form vente */}
      {venteOuverte ? (
        <div className="mt-3 flex flex-wrap items-end gap-2 rounded-xl border border-[var(--profit)]/20 bg-[var(--profit-bg)] p-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Prix revente (DA)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={prixRevente}
              onChange={(e) => setPrixRevente(e.target.value)}
              autoFocus
              className="w-32 rounded-xl border border-border bg-input px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Date revente
            </label>
            <input
              type="date"
              value={dateRevente}
              onChange={(e) => setDateRevente(e.target.value)}
              className="rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          {error ? (
            <p className="w-full text-xs text-destructive">{error}</p>
          ) : null}
          <button
            type="button"
            disabled={pending || !prixRevente}
            onClick={confirmerVente}
            className="rounded-xl bg-[var(--profit)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {pending ? "…" : "Confirmer"}
          </button>
          <button
            type="button"
            onClick={() => setVenteOuverte(false)}
            className="rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary"
          >
            Annuler
          </button>
        </div>
      ) : null}
    </li>
  );
}
