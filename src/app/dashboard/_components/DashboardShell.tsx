"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";
import type { Categorie } from "@/lib/types";
import AjouterDepenseModal from "@/app/dashboard/_components/AjouterDepenseModal";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/historique", label: "Historique" },
  { href: "/dashboard/categories", label: "Catégories" },
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
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/dashboard" className="text-base font-semibold text-slate-900">
            Money Tracker
          </Link>

          <nav className="flex items-center gap-1 overflow-x-auto text-sm">
            {NAV_LINKS.map((link) => {
              const actif =
                link.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-3 py-1.5 font-medium transition-colors ${
                    actif
                      ? "bg-accent/10 text-accent"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <form action={signOut}>
            <button
              type="submit"
              className="rounded-xl px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6">
        {children}
      </main>

      <button
        type="button"
        onClick={() => setModalOuvert(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white shadow-lg shadow-accent/30 transition-transform hover:bg-indigo-700 active:scale-95"
      >
        <span className="text-lg leading-none">+</span>
        <span className="hidden sm:inline">Ajouter une dépense</span>
      </button>

      {modalOuvert ? (
        <AjouterDepenseModal onClose={() => setModalOuvert(false)} categories={categories} />
      ) : null}
    </div>
  );
}
