# TODO

## ✅ Fait

### Fonctionnalités core
- [x] Sélecteur de période Jour / Semaine / Mois / Tout sur le dashboard
- [x] KPIs recalculés selon la période sélectionnée
- [x] Graphique multi-courbes Investi · Ventes · Profit (granularité par jour ou par mois)
- [x] Vue "Jour" : barres horizontales profit par article (au lieu d'un point unique inutile)
- [x] Fix bug "Tout" qui renvoyait les données "Jour"
- [x] Bouton « Vendu » rapide avec saisie prix + date de revente
- [x] Fix barre blanche au clic sur charts (activeBar ambre clair #FCD34D)

### Auth
- [x] Connexion par nom d'utilisateur (plus d'email visible)
- [x] Variables AUTH_USERNAME et AUTH_EMAIL dans .env / Vercel
- [x] Credentials : track26 / 123456789

### Catégories
- [x] Catégories créées en base : ⌚ Montre, 🚗 Voiture, 🚤 Jet Ski, ⛵ Bateau
- [x] Fix emojis stockés en `?` (encodage PowerShell → réinsertion via Node.js)
- [x] UX catégories : ligne entière cliquable, icônes ✏️ 🗑 séparées
- [x] Fix categories force-dynamic (cache Next.js stale)

### Design dark anthracite iOS
- [x] Thème sombre #1C1C1E, accent ambre #F59E0B, profit vert #4ADE80
- [x] Navigation en bas style iOS avec icônes Lucide
- [x] FAB bouton + avec glow ambre
- [x] Police Outfit + JetBrains Mono pour les chiffres
- [x] shadcn/ui initialisé (Base Nova)
- [x] Fix couleurs : text-slate-* → text-foreground/muted sur toutes les pages
- [x] Charts dark theme : grille, tooltip, ticks adaptés (#3A3A3C / #8E8E93 / #2C2C2E)
- [x] ProfitParCategorieChart : barres ambre (était indigo)

### Bugs corrigés (audit complet)
- [x] `margeMoyennePct` était identique à `roiGlobalPct` (erreur mathématique)
- [x] `formatDate` parsait les dates en UTC → décalage timezone corrigé
- [x] `filtrerParPeriode` même bug timezone → parse local
- [x] `modifierDepense` / `supprimerDepense` ne revalidaient pas `/categories/[id]`
- [x] `dashboard/layout.tsx` sans force-dynamic → catégories FAB potentiellement stale
- [x] `labelPeriode` retournait `null as unknown as string` → type propre

### Mobile
- [x] Zoom désactivé : maximumScale=1, userScalable=false dans le viewport
- [x] Fix zoom iOS sur focus input : font-size 16px !important
- [x] touch-action: manipulation (tap rapide, pas de double-tap zoom)

### Déploiement & données
- [x] Premier déploiement Vercel : https://money-tracker-ashy-xi.vercel.app
- [x] Variables d'env configurées sur Vercel (sans BOM — via Bash printf)
- [x] 59 ventes de test insérées (jan→juin 2026, 4 catégories, vraies données DA)
- [x] `scripts/seed.mjs` et `scripts/seed2.mjs` pour rejouer l'insertion

---

## À faire ensuite

### Mobile — stabilité
- [ ] Vérifier safe-area (notch / home indicator) sur iPhone avec encoche
- [ ] Vérifier la modal en plein écran mobile (scroll avec clavier virtuel ouvert)
- [ ] Tester sur Android — rendu polices, nav bas, inputs date

### Dashboard — améliorations
- [ ] Remplir les jours sans activité avec des zéros dans le graphique (éviter les gaps)
- [ ] Ajouter un indicateur visuel quand la période n'a aucune donnée
- [ ] Objectif mensuel de profit avec barre de progression

### Fonctionnalités futures
- [ ] Export PDF / Excel des données
- [ ] Notifications / rappels (article en stock depuis longtemps)
- [ ] Support multi-utilisateurs si demandé
- [ ] Support multilingue FR / EN / AR si demandé
