export default function KpiCard({
  titre,
  valeur,
  sousTitre,
  accent = false,
}: {
  titre: string;
  valeur: string;
  sousTitre?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500">{titre}</p>
      <p className={`mt-1 text-2xl font-semibold ${accent ? "text-accent" : "text-slate-900"}`}>
        {valeur}
      </p>
      {sousTitre ? <p className="mt-1 text-xs text-slate-400">{sousTitre}</p> : null}
    </div>
  );
}
