"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CategorieActionState = {
  status: "idle" | "error" | "success";
  error?: string;
  id?: string;
};

export const categorieActionInitialState: CategorieActionState = { status: "idle" };

function revalidateCategorie() {
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/historique");
}

export async function creerCategorie(
  _prevState: CategorieActionState,
  formData: FormData
): Promise<CategorieActionState> {
  const nom = String(formData.get("nom") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "").trim() || null;
  if (!nom) return { status: "error", error: "Le nom de la catégorie est requis." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({ nom, emoji })
    .select("id")
    .single();
  if (error) return { status: "error", error: error.message };

  revalidateCategorie();
  return { status: "success", id: data.id };
}

export async function modifierCategorie(
  id: string,
  _prevState: CategorieActionState,
  formData: FormData
): Promise<CategorieActionState> {
  const nom = String(formData.get("nom") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "").trim() || null;
  if (!nom) return { status: "error", error: "Le nom de la catégorie est requis." };

  const supabase = await createClient();
  const { error } = await supabase.from("categories").update({ nom, emoji }).eq("id", id);
  if (error) return { status: "error", error: error.message };

  revalidateCategorie();
  return { status: "success" };
}

export async function supprimerCategorie(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidateCategorie();
}
