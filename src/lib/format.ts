export function formatMontant(valeur: number): string {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(valeur)} DA`;
}

export function formatPourcentage(valeur: number | null): string {
  if (valeur == null || !Number.isFinite(valeur)) return "—";
  return `${valeur.toFixed(1)} %`;
}

export function formatDate(valeur: string | null): string {
  if (!valeur) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(valeur));
}

export function formatJours(valeur: number | null): string {
  if (valeur == null || !Number.isFinite(valeur)) return "—";
  return `${Math.round(valeur)} j`;
}
