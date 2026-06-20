import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/app/dashboard/_components/DashboardShell";
import type { Categorie } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("nom", { ascending: true });

  return (
    <DashboardShell categories={(categories ?? []) as Categorie[]}>
      {children}
    </DashboardShell>
  );
}
