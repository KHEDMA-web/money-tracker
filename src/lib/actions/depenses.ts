"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { DepenseActionState, Statut } from "@/lib/types";

function parseDepenseForm(formData: FormData) {
  const categorie_id = String(formData.get("categorie_id") ?? "") || null;
  const nom_article = String(formData.get("nom_article") ?? "").trim();
  const prix_achat = Number(formData.get("prix_achat"));
  const prixReventeRaw = String(formData.get("prix_revente") ?? "").trim();
  const prix_revente = prixReventeRaw === "" ? null : Number(prixReventeRaw);
  const date_achat = String(formData.get("date_achat") ?? "");
  const dateReventeRaw = String(formData.get("date_revente") ?? "").trim();
  const date_revente = prix_revente != null && dateReventeRaw !== "" ? dateReventeRaw : null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!nom_article) throw new Error("Le nom de l'article est requis.");
  if (!Number.isFinite(prix_achat) || prix_achat < 0) {
    throw new Error("Le prix d'achat est invalide.");
  }
  if (!date_achat) throw new Error("La date d'achat est requise.");
  if (prix_revente != null && (!Number.isFinite(prix_revente) || prix_revente < 0)) {
    throw new Error("Le prix de revente est invalide.");
  }

  const statut: Statut = prix_revente != null ? "vendu" : "en_stock";

  return {
    categorie_id,
    nom_article,
    prix_achat,
    prix_revente,
    date_achat,
    date_revente,
    notes,
    statut,
  };
}

export async function creerDepense(
  _prevState: DepenseActionState,
  formData: FormData
): Promise<DepenseActionState> {
  try {
    const depense = parseDepenseForm(formData);
    const supabase = await createClient();
    const { error } = await supabase.from("depenses").insert(depense);
    if (error) return { status: "error", error: error.message };
  } catch (e) {
    return { status: "error", error: e instanceof Error ? e.message : "Erreur inconnue." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/historique");
  return { status: "success" };
}

export async function modifierDepense(
  id: string,
  _prevState: DepenseActionState,
  formData: FormData
): Promise<DepenseActionState> {
  try {
    const depense = parseDepenseForm(formData);
    const supabase = await createClient();
    const { error } = await supabase.from("depenses").update(depense).eq("id", id);
    if (error) return { status: "error", error: error.message };
  } catch (e) {
    return { status: "error", error: e instanceof Error ? e.message : "Erreur inconnue." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/historique");
  return { status: "success" };
}

export async function supprimerDepense(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("depenses").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/historique");
}

export async function marquerVendu(id: string, prixRevente: number, dateRevente: string) {
  if (!Number.isFinite(prixRevente) || prixRevente < 0) {
    throw new Error("Le prix de revente est invalide.");
  }
  if (!dateRevente) throw new Error("La date de revente est requise.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("depenses")
    .update({ statut: "vendu", prix_revente: prixRevente, date_revente: dateRevente })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/historique");
  revalidatePath("/dashboard/categories");
}
