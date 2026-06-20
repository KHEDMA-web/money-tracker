# Money Tracker

Suivi d'activité d'achat-revente (montres, voitures, sneakers…) : dépenses, marges, KPIs.

Application mono-utilisateur construite avec Next.js (App Router), TypeScript, Tailwind CSS, Supabase (DB + Auth) et Recharts.

## Stack

- Next.js 16 (App Router, TypeScript strict)
- Tailwind CSS v4
- Supabase (Postgres + Auth email/password)
- Recharts pour les graphiques

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

## Structure

```
src/
├── app/
│   ├── login/                 ← connexion (email/password)
│   ├── dashboard/
│   │   ├── page.tsx            ← KPIs + graphiques
│   │   ├── historique/         ← liste, recherche, filtres, édition/suppression
│   │   ├── categories/         ← CRUD catégories
│   │   └── _components/        ← modal d'ajout, cartes KPI, graphiques
│   └── page.tsx                ← redirige vers /dashboard
├── lib/
│   ├── actions/                ← Server Actions (depenses, categories, auth)
│   ├── supabase/                ← clients Supabase (browser, server, proxy)
│   ├── kpis.ts                  ← calculs des indicateurs
│   └── types.ts
└── proxy.ts                     ← protection des routes (ex middleware.ts)
```

## Déploiement

Déployer sur Vercel et renseigner les mêmes variables d'environnement dans les paramètres du projet.
