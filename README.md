# Money Tracker

Suivi d'activité d'achat-revente (montres, voitures, sneakers…) : dépenses, marges, KPIs.

Application mono-utilisateur construite avec Next.js (App Router), TypeScript, Tailwind CSS v4, Supabase (DB + Auth), Recharts et shadcn/ui.

## Stack

- Next.js 16 (App Router, TypeScript strict)
- Tailwind CSS v4
- Supabase (Postgres + Auth email/password)
- Recharts pour les graphiques
- shadcn/ui (Base Nova) + lucide-react pour les icônes
- Police Outfit + JetBrains Mono

## Démarrage

1. Installer les dépendances :

   ```bash
   npm install
   ```

2. Créer un projet Supabase, puis exécuter `supabase/schema.sql` dans le SQL Editor (tables `categories` et `depenses`, RLS owner-only).

3. Créer un utilisateur (le seul compte de l'app) dans Supabase Auth → Users.

4. Copier `.env.local.example` vers `.env.local` et renseigner :

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```

5. Lancer le serveur de développement :

   ```bash
   npm run dev
   ```

6. Ouvrir [http://localhost:3000](http://localhost:3000) — redirige vers `/login`.

## Fonctionnalités

- Connexion mono-utilisateur (Supabase Auth)
- Dashboard avec sélecteur de période **Jour / Semaine / Mois / Tout** — tous les KPIs et graphiques se recalculent selon la période
- KPIs : total investi, ventes, profit, marge moyenne, ROI, stock en valeur, temps moyen de détention, top 5 ventes, catégorie la plus rentable
- Graphique multi-courbes Investi · Ventes · Profit avec marqueurs, granularité adaptée à la période
- Catégories : création, renommage, suppression, page détail par catégorie
- Articles : ajout, modification, suppression, recherche et filtres dans l'historique
- Bouton « Vendu » rapide sur chaque article en stock : saisie du prix et de la date de revente en un clic
- Design dark anthracite iOS avec navigation en bas style mobile

## Design

Thème sombre anthracite style iOS (#1C1C1E), accent ambre (#F59E0B), profit vert (#4ADE80).
Navigation en bas (Dashboard / Historique / Catégories) avec FAB central pour ajouter un article.
Responsive mobile-first, optimisé iPhone.

## Structure

```
src/
├── app/
│   ├── login/                 ← connexion (email/password)
│   ├── dashboard/
│   │   ├── page.tsx            ← KPIs + graphiques + sélecteur période
│   │   ├── historique/         ← liste, recherche, filtres, édition/suppression, marquer vendu
│   │   ├── categories/         ← CRUD catégories
│   │   │   └── [id]/           ← détail catégorie : articles, ajout/édition/suppression, marquer vendu
│   │   └── _components/        ← DashboardShell (nav bas), PeriodeSelector, DepenseItem,
│   │                              AjouterDepenseModal, KpiCard, graphiques
│   └── page.tsx                ← redirige vers /dashboard
├── components/ui/              ← composants shadcn/ui
├── lib/
│   ├── actions/                ← Server Actions (depenses, categories, auth)
│   ├── supabase/               ← clients Supabase (browser, server, proxy)
│   ├── kpis.ts                 ← calculs des indicateurs + évolution multi-courbes
│   └── types.ts
└── proxy.ts                    ← protection des routes
```

## Déploiement

Déployer sur Vercel et renseigner les mêmes variables d'environnement dans les paramètres du projet.
