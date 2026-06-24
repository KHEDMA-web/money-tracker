import { createClient } from "@/lib/supabase/server";
import type { Categorie } from "@/lib/types";
import CategoriesClient from "@/app/dashboard/categories/CategoriesClient";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("nom", { ascending: true });

  return <CategoriesClient categories={(data ?? []) as Categorie[]} />;
}
