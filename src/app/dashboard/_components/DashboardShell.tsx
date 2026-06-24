"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Clock, FolderOpen, Plus, LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import type { Categorie } from "@/lib/types";
import AjouterDepenseModal from "@/app/dashboard/_components/AjouterDepenseModal";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/historique", label: "Historique", icon: Clock, exact: false },
  { href: "/dashboard/categories", label: "Catégories", icon: FolderOpen, exact: false },
];

export default function DashboardShell({
  categories,
  children,
}: {
  categories: Categorie[];
  children: React.ReactNode;
}) {
  const [modalOuvert, setModalOuvert] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="text-base font-bold tracking-tight text-foreground">
            Money<span className="text-primary">Tracker</span>
          </span>

          <form action={signOut}>
            <button
              type="submit"
              className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Déconnexion"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </header>

      {/* ── Contenu ──────────────────────────────────────────────── */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pt-5 pb-32">
        {children}
      </main>

      {/* ── FAB ──────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setModalOuvert(true)}
        className="fixed bottom-[88px] right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg transition-transform active:scale-95 sm:bottom-[96px] sm:right-6"
        style={{ boxShadow: "0 0 24px var(--accent-glow), 0 4px 16px rgba(0,0,0,0.4)" }}
        aria-label="Ajouter une dépense"
      >
        <Plus className="h-6 w-6 text-primary-foreground" strokeWidth={2.5} />
      </button>

      {/* ── Navigation bas ───────────────────────────────────────── */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-around px-2 pb-5 pt-2">
          {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
            const actif = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-colors ${
                  actif
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-transform ${actif ? "scale-110" : ""}`}
                  strokeWidth={actif ? 2.5 : 1.75}
                />
                <span className={`text-[10px] font-medium tracking-wide ${actif ? "text-primary" : ""}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {modalOuvert ? (
        <AjouterDepenseModal onClose={() => setModalOuvert(false)} categories={categories} />
      ) : null}
    </div>
  );
}
