# TODO

## ✅ Fait

- [x] Sélecteur de période Jour / Semaine / Mois / Tout sur le dashboard
- [x] KPIs recalculés selon la période sélectionnée
- [x] Graphique multi-courbes Investi · Ventes · Profit avec marqueurs (granularité par jour ou par mois)
- [x] Défaut : vue "Jour" à l'ouverture
- [x] Bug mobile : bouton flottant « + Ajouter » ne chevauche plus le contenu
- [x] Bug mobile : titre "Money Tracker" reste sur une ligne (shrink-0 whitespace-nowrap)
- [x] Fix revalidatePath manquant sur /dashboard/categories/[id]
- [x] Design dark anthracite iOS (fond #1C1C1E, accent ambre #F59E0B)
- [x] Navigation en bas style iOS avec icônes Lucide
- [x] FAB bouton + avec glow ambre
- [x] Police Outfit + JetBrains Mono pour les chiffres
- [x] shadcn/ui initialisé

## En attente du client

- [ ] Envoyer le Google Form de proposition au client (voir `PROPOSITION_CLIENT_FORM.md`)
- [ ] Une fois la réponse reçue : appliquer le design choisi (palette de couleurs) et les KPIs sélectionnés
- [ ] Implémenter le support multilingue si demandé (FR / EN / AR)

## À faire ensuite

### Mobile — stabilité

- [ ] Tester sur iPhone réel (Safari iOS) — vérifier : nav bas, FAB, modales, graphiques Recharts
- [ ] Tester sur Android — vérifier le rendu des polices Outfit/JetBrains Mono
- [ ] Vérifier le safe-area (notch / home indicator) sur iPhone avec encoche
- [ ] Vérifier les inputs date sur iOS Safari (comportement clavier, format)
- [ ] Vérifier la modal `AjouterDepenseModal` en plein écran mobile (scroll, clavier virtuel)

### Dashboard — améliorations

- [ ] Remplir les jours/semaines sans activité avec des zéros dans le graphique (éviter les gaps)
- [ ] Ajouter un indicateur visuel quand la période sélectionnée n'a aucune donnée (pas juste des zéros)
- [ ] Objectif mensuel de profit avec barre de progression (à valider avec le client)

### Fonctionnalités futures (selon retour client)

- [ ] Export PDF / Excel des données
- [ ] Notifications / rappels (article en stock depuis longtemps, objectif du mois)
- [ ] Support multi-utilisateurs si demandé
