# TODO

## Dashboard — vues journalière / hebdomadaire / mensuelle

- [ ] Ajouter un sélecteur de période sur le dashboard : **Jour / Semaine / Mois**
- [ ] Recalculer les KPIs (investi, ventes, profit, ROI, stock) selon la période sélectionnée
- [ ] Adapter le graphique d'évolution du profit pour afficher la granularité choisie (jour/semaine/mois) au lieu du seul découpage mensuel actuel
- [ ] Vue « globale » par défaut (toutes périodes confondues) en plus des 3 vues filtrées

## Mobile — stabilité parfaite

- [ ] Tester et fiabiliser l'affichage sur iPhone 17 Pro Max (priorité n°1)
- [ ] Tester sur un échantillon représentatif d'autres tailles d'écran (iPhone standard/mini, Android grand/petit écran)
- [ ] Vérifier : zones tactiles (boutons Vendu/Modifier/Supprimer), modales (AjouterDepenseModal) en plein écran mobile, graphiques (Recharts) responsives, barre de navigation du dashboard
- [ ] Vérifier le comportement clavier mobile sur les formulaires (inputs number/date) et le safe-area (notch / home indicator)
- [ ] **Bug constaté** : le bouton flottant « + Ajouter une dépense » (`DashboardShell.tsx`, `fixed bottom-5 right-5`) chevauche le contenu des graphiques en bas de page sur petit écran (visible sur capture mobile 430px) — prévoir un espacement bas (`padding-bottom`) sur le contenu ou repositionner le bouton
- [ ] **Bug constaté** : le titre « Money Tracker » du header passe sur deux lignes sur petit écran, ce qui désaligne la nav — réduire la taille ou raccourcir sur mobile

## Design & KPIs — à valider avec le client

- [ ] Envoyer le Google Form de proposition au client (voir `PROPOSITION_CLIENT_FORM.md`)
- [ ] Une fois la réponse reçue : implémenter le design choisi (palette de couleurs) et les KPIs sélectionnés
- [ ] Implémenter le support multilingue si demandé (FR / EN / AR)
