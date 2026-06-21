import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Categorie, DepenseWithCategorie } from "@/lib/types";
import CategorieDetailClient from "@/app/dashboard/categories/[id]/CategorieDetailClient";

export default async function CategorieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [categorieRes, depensesRes, categoriesRes] = await Promise.all([
    supabase.from("categories").select("*").eq("id", id).single(),
    supabase
      .from("depenses")
      .select("*, categorie:categories(*)")
      .eq("categorie_id", id)
      .order("date_achat", { ascending: false }),
    supabase.from("categories").select("*").order("nom", { ascending: true }),
  ]);

  if (!categorieRes.data) notFound();

  return (
    <CategorieDetailClient
      categorie={categorieRes.data as Categorie}
      depenses={(depensesRes.data ?? []) as DepenseWithCategorie[]}
      categories={(categoriesRes.data ?? []) as Categorie[]}
    />
  );
}
