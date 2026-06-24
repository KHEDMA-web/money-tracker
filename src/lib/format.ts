export function formatMontant(valeur: number): string {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(valeur)} DA`;
}

export function formatPourcentage(valeur: number | null): string {
  if (valeur == null || !Number.isFinite(valeur)) return "—";
  return `${valeur.toFixed(1)} %`;
}

export function formatDate(valeur: string | null): string {
  if (!valeur) return "—";
  const [y, m, d] = valeur.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(y, m - 1, d));
}

export function formatJours(valeur: number | null): string {
  if (valeur == null || !Number.isFinite(valeur)) return "—";
  return `${Math.round(valeur)} j`;
}
