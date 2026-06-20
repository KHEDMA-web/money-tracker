import { createClient } from "@/lib/supabase/server";
import type { Categorie, DepenseWithCategorie } from "@/lib/types";
import HistoriqueClient from "@/app/dashboard/historique/HistoriqueClient";

export default async function HistoriquePage() {
  const supabase = await createClient();

  const [depensesRes, categoriesRes] = await Promise.all([
    supabase
      .from("depenses")
      .select("*, categorie:categories(*)")
      .order("date_achat", { ascending: false }),
    supabase.from("categories").select("*").order("nom", { ascending: true }),
  ]);

  return (
    <HistoriqueClient
      depenses={(depensesRes.data ?? []) as DepenseWithCategorie[]}
      categories={(categoriesRes.data ?? []) as Categorie[]}
    />
  );
}
