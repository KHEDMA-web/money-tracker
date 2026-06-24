"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const authUsername = process.env.AUTH_USERNAME;
  const authEmail    = process.env.AUTH_EMAIL;

  // Si AUTH_USERNAME est défini, on valide le nom d'utilisateur
  if (authUsername && username !== authUsername) {
    redirect("/login?error=invalid_credentials");
  }

  // On utilise AUTH_EMAIL si défini, sinon on traite le username comme un email
  const email = authEmail || username;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/login?error=invalid_credentials");
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
