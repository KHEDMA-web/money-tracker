# Money Tracker

Suivi d'activité d'achat-revente (montres, voitures, jet-ski, bateaux…) : dépenses, marges, KPIs.

Application mono-utilisateur construite avec Next.js (App Router), TypeScript, Tailwind CSS v4, Supabase (DB + Auth), Recharts et shadcn/ui.

## Stack

- Next.js 16 (App Router, TypeScript strict)
- Tailwind CSS v4
- Supabase (Postgres + Auth)
- Recharts pour les graphiques
- shadcn/ui (Base Nova) + lucide-react pour les icônes
- Police Outfit + JetBrains Mono

## Production

**URL :** https://money-tracker-ashy-xi.vercel.app

Variables d'environnement requises sur Vercel (déjà configurées) :

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service (admin) |
| `AUTH_USERNAME` | Nom d'utilisateur affiché sur le login |
| `AUTH_EMAIL` | Email Supabase réel (jamais affiché) |

## Démarrage local

1. Installer les dépendances :

   ```bash
   npm install
   ```

2. Créer un projet Supabase, puis exécuter `supabase/schema.sql` dans le SQL Editor.

3. Copier `.env.local.example` vers `.env.local` et renseigner les 5 variables.

4. Lancer le serveur :

   ```bash
   npm run dev
   ```

5. Ouvrir [http://localhost:3000](http://localhost:3000) — redirige vers `/login`.

## Connexion

La page de connexion affiche un champ **Nom d'utilisateur** (pas d'email visible).  
En interne, `AUTH_USERNAME` est comparé à la saisie, puis `AUTH_EMAIL` est utilisé pour authentifier via Supabase Auth — l'email reste complètement caché côté utilisateur.

## Fonctionnalités

- Connexion par **nom d'utilisateur** (email Supabase caché)
- Dashboard avec sélecteur de période **Jour / Semaine / Mois / Tout** — KPIs et graphiques recalculés dynamiquement
- KPIs : total investi, ventes, profit, marge moyenne, ROI, stock en valeur, temps moyen de détention, top 5 ventes, catégorie la plus rentable
- Graphique multi-courbes Investi · Ventes · Profit avec marqueurs, granularité adaptée à la période
- **Catégories** avec emoji (⌚ Montre, 🚗 Voiture, 🚤 Jet Ski, ⛵ Bateau) — ligne entière cliquable pour le détail, icônes ✏️ 🗑 séparées pour modifier/supprimer
- Articles : ajout, modification, suppression, recherche et filtres dans l'historique
- Bouton « Vendu » rapide sur chaque article en stock
- Design dark anthracite iOS avec navigation en bas style mobile
- **Zoom désactivé** sur mobile (pinch-to-zoom + zoom iOS sur focus input)

## Design

Thème sombre anthracite style iOS (`#1C1C1E`), accent ambre (`#F59E0B`), profit vert (`#4ADE80`).  
Navigation en bas (Dashboard / Historique / Catégories) avec FAB ambre pour ajouter un article.  
Responsive mobile-first, optimisé iPhone — zoom entièrement désactivé.

## Structure

```
src/
├── app/
│   ├── login/                 ← connexion (nom d'utilisateur)
│   ├── dashboard/
│   │   ├── page.tsx            ← KPIs + graphiques + sélecteur période
│   │   ├── historique/         ← liste, recherche, filtres, édition/suppression, marquer vendu
│   │   ├── categories/         ← CRUD catégories (icônes modifier/supprimer séparées)
│   │   │   └── [id]/           ← détail catégorie : articles, ajout/édition/suppression
│   │   └── _components/        ← DashboardShell (nav bas), PeriodeSelector, DepenseItem,
│   │                              AjouterDepenseModal, KpiCard, graphiques
│   └── page.tsx                ← redirige vers /dashboard
├── components/ui/              ← composants shadcn/ui
├── lib/
│   ├── actions/                ← Server Actions (depenses, categories, auth)
│   ├── supabase/               ← clients Supabase (browser, server, proxy)
│   ├── kpis.ts                 ← calculs des indicateurs + évolution multi-courbes
│   └── types.ts
└── proxy.ts                    ← protection des routes (middleware)
```

## Déploiement

Le projet est connecté à GitHub (`KHEDMA-web/money-tracker`).  
Chaque `git push` déclenche un build automatique sur Vercel (Git Integration activée).  
Pour forcer un redéploiement manuel : `vercel deploy --prod`.
