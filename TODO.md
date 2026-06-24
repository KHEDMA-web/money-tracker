# TODO

## ✅ Fait

### Fonctionnalités core
- [x] Sélecteur de période Jour / Semaine / Mois / Tout sur le dashboard
- [x] KPIs recalculés selon la période sélectionnée
- [x] Graphique multi-courbes Investi · Ventes · Profit avec marqueurs (granularité par jour ou par mois)
- [x] Défaut : vue "Jour" à l'ouverture du dashboard
- [x] Fix bug "Tout" qui renvoyait les données "Jour" (param URL mal géré)
- [x] Bouton « Vendu » rapide avec saisie prix + date de revente
- [x] Fix revalidatePath manquant sur /dashboard/categories/[id]

### Auth
- [x] Connexion par nom d'utilisateur (plus d'email visible)
- [x] Variables AUTH_USERNAME et AUTH_EMAIL dans .env / Vercel
- [x] Credentials : track26 / 123456789
- [x] Mot de passe mis à jour via Supabase Admin API

### Catégories
- [x] Catégories créées en base : ⌚ Montre, 🚗 Voiture, 🚤 Jet Ski, ⛵ Bateau
- [x] Fix emojis stockés en `?` (encodage PowerShell → réinsertion via Node.js)
- [x] UX catégories : ligne entière cliquable pour ouvrir, icônes ✏️ 🗑 séparées
- [x] Fix categories force-dynamic (cache Next.js stale)

### Design dark anthracite iOS
- [x] Thème sombre #1C1C1E, accent ambre #F59E0B, profit vert #4ADE80
- [x] Navigation en bas style iOS avec icônes Lucide
- [x] FAB bouton + avec glow ambre
- [x] Police Outfit + JetBrains Mono pour les chiffres
- [x] shadcn/ui initialisé (Base Nova)
- [x] Fix couleurs : text-slate-* → text-foreground/muted sur toutes les pages
- [x] Fix fonds bg-white → bg-card, borders → border-border

### Mobile
- [x] Fix bouton flottant qui chevauchait le contenu
- [x] Fix titre "Money Tracker" qui cassait sur deux lignes
- [x] Zoom désactivé : maximumScale=1, userScalable=false dans le viewport
- [x] Fix zoom iOS sur focus input : font-size 16px !important
- [x] touch-action: manipulation sur tous les éléments (tap rapide, pas de double-tap zoom)

### Déploiement
- [x] Premier déploiement Vercel : https://money-tracker-ashy-xi.vercel.app
- [x] Variables d'env configurées sur Vercel (sans BOM — via Bash printf)
- [x] Git Integration activée (push GitHub → build automatique)

---

## À faire ensuite

### Mobile — stabilité
- [ ] Vérifier safe-area (notch / home indicator) sur iPhone avec encoche
- [ ] Vérifier la modal `AjouterDepenseModal` en plein écran mobile (scroll avec clavier virtuel ouvert)
- [ ] Tester sur Android — rendu polices, nav bas, inputs date

### Dashboard — améliorations
- [ ] Remplir les jours/semaines sans activité avec des zéros dans le graphique (éviter les gaps)
- [ ] Ajouter un indicateur visuel quand la période n'a aucune donnée
- [ ] Objectif mensuel de profit avec barre de progression

### Fonctionnalités futures
- [ ] Export PDF / Excel des données
- [ ] Notifications / rappels (article en stock depuis longtemps)
- [ ] Support multi-utilisateurs si demandé
- [ ] Support multilingue FR / EN / AR si demandé
