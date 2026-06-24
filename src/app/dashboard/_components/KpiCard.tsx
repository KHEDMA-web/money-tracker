export default function KpiCard({
  titre,
  valeur,
  sousTitre,
  accent = false,
  variante = "neutre",
}: {
  titre: string;
  valeur: string;
  sousTitre?: string;
  accent?: boolean;
  variante?: "neutre" | "profit" | "perte";
}) {
  const couleurValeur =
    variante === "profit"
      ? "text-[var(--profit)]"
      : variante === "perte"
      ? "text-destructive"
      : accent
      ? "text-primary"
      : "text-foreground";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition-colors hover:border-border/80">
      <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        {titre}
      </p>
      <p
        className={`mt-2 font-mono text-2xl font-semibold leading-none tracking-tight ${couleurValeur}`}
      >
        {valeur}
      </p>
      {sousTitre ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{sousTitre}</p>
      ) : null}
    </div>
  );
}
