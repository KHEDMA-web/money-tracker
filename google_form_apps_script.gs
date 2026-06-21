/**
 * Crée automatiquement le Google Form "Money Tracker — Proposition client".
 *
 * MODE D'EMPLOI :
 * 1. Va sur https://script.google.com → "Nouveau projet"
 * 2. Supprime le code par défaut, colle tout ce fichier
 * 3. En haut, sélectionne la fonction "creerFormulaire" puis clique "Exécuter"
 * 4. La première fois, Google demande une autorisation (c'est ton propre compte) → Accepter
 * 5. Une fois terminé : Affichage → Journaux d'exécution (ou Ctrl+Entrée) pour récupérer
 *    le lien d'édition et le lien à partager
 *
 * OPTIONNEL — pour que les 3 palettes de couleurs soient intégrées automatiquement :
 * - Avant d'exécuter, mets les fichiers suivants à la racine de ton Google Drive
 *   (Mon Drive, sans sous-dossier) : palette-a-indigo.png, palette-b-emeraude.png, palette-c-ambre.png
 *   (ils sont dans docs/design-mockups/ du repo)
 * - Si tu ne les uploades pas, le script fonctionne quand même : il crée tout le
 *   formulaire sans les images, tu pourras les ajouter à la main ensuite si tu veux.
 */
function creerFormulaire() {
  const form = FormApp.create("Money Tracker — Votre application sur mesure, à votre image");
  form.setDescription(
    "Avant de finaliser votre application de suivi d'achat-revente, j'aimerais connaître vos préférences sur le design, les indicateurs affichés et la langue. Merci de prendre quelques minutes pour répondre — vos réponses orienteront directement le développement final."
  );
  form.setLimitOneResponsePerUser(true);
  form.setCollectEmail(false);

  // ---------- Section 1 — Design ----------
  form.addSectionHeaderItem().setTitle("Design");

  ajouterImageSiDisponible(form, "palette-a-indigo.png", "Design A — Indigo Classique");
  ajouterImageSiDisponible(form, "palette-b-emeraude.png", "Design B — Émeraude Premium");
  ajouterImageSiDisponible(form, "palette-c-ambre.png", "Design C — Ambre Doré");

  form
    .addMultipleChoiceItem()
    .setTitle("Quel design préférez-vous ?")
    .setChoiceValues([
      "Design A — Indigo Classique (sobre, professionnel)",
      "Design B — Émeraude Premium (vert, croissance/argent)",
      "Design C — Ambre Doré (orange/doré, ambiance premium/luxe)",
    ])
    .showOtherOption(true)
    .setRequired(true);

  form
    .addParagraphTextItem()
    .setTitle("Avez-vous une remarque sur le design (logo, style, ambiance) ?")
    .setRequired(false);

  // ---------- Section 2 — KPIs ----------
  form.addSectionHeaderItem().setTitle("Indicateurs (KPIs) à afficher sur le Dashboard");

  form
    .addCheckboxItem()
    .setTitle("Quels indicateurs souhaitez-vous voir en priorité ?")
    .setChoiceValues([
      "Total investi",
      "Total des ventes",
      "Profit total",
      "Marge moyenne (%)",
      "ROI global (%)",
      "Nombre d'articles en stock / vendus",
      "Valeur du stock actuel",
      "Temps moyen de détention (durée moyenne avant revente)",
      "Top 5 des meilleures ventes",
      "Catégorie la plus rentable",
      "Graphique : profit par catégorie",
      "Graphique : évolution du profit dans le temps",
      "Vue par période (jour / semaine / mois)",
      "Objectif mensuel de profit (barre de progression)",
    ])
    .showOtherOption(true)
    .setRequired(true);

  form
    .addMultipleChoiceItem()
    .setTitle("Souhaitez-vous une vue par période sur le dashboard (jour / semaine / mois) ?")
    .setChoiceValues(["Oui, c'est important pour moi", "Oui, ce serait un plus", "Non, pas nécessaire"])
    .setRequired(true);

  // ---------- Section 3 — Langue ----------
  form.addSectionHeaderItem().setTitle("Langue de l'application");

  form
    .addCheckboxItem()
    .setTitle("Dans quelle(s) langue(s) voulez-vous utiliser l'application ?")
    .setChoiceValues(["Français", "Anglais", "Arabe", "Peu importe, une seule langue suffit"])
    .setRequired(true);

  form
    .addMultipleChoiceItem()
    .setTitle("Si plusieurs langues : laquelle doit être la langue par défaut à l'ouverture ?")
    .setChoiceValues(["Français", "Anglais", "Arabe", "Pas de préférence"])
    .setRequired(false);

  // ---------- Section 4 — Autres questions ----------
  form.addSectionHeaderItem().setTitle("Autres questions pertinentes");

  form
    .addMultipleChoiceItem()
    .setTitle("Sur quel appareil utiliserez-vous principalement l'application ?")
    .setChoiceValues(["Téléphone (iPhone)", "Téléphone (Android)", "Ordinateur", "Les deux (mobile + ordinateur)"])
    .setRequired(true);

  form
    .addMultipleChoiceItem()
    .setTitle("Combien d'utilisateurs auront besoin d'un accès à l'application ?")
    .setChoiceValues(["1 seul utilisateur (vous)"])
    .showOtherOption(true)
    .setRequired(true);

  form
    .addMultipleChoiceItem()
    .setTitle("Souhaitez-vous pouvoir exporter vos données (PDF / Excel) ?")
    .setChoiceValues(["Oui, c'est important", "Pourquoi pas, en option", "Non, pas nécessaire"])
    .setRequired(true);

  form
    .addMultipleChoiceItem()
    .setTitle(
      "Voulez-vous recevoir des notifications/rappels (ex : objectif du mois, article en stock depuis longtemps) ?"
    )
    .setChoiceValues(["Oui", "Non", "Je ne sais pas / à voir ensemble"])
    .setRequired(true);

  form
    .addTextItem()
    .setTitle("Avez-vous un nom ou un logo déjà choisi pour l'application (autre que « Money Tracker ») ?")
    .setRequired(false);

  // ---------- Section 5 — Tarif et prestations ----------
  form.addSectionHeaderItem().setTitle("Tarif et prestations").setHelpText(
    "Le tarif ci-dessous couvre la création complète de l'application sur mesure :\n" +
      "- Dashboard avec tous les indicateurs choisis ci-dessus et leurs graphiques\n" +
      "- Historique complet des articles avec recherche et filtres\n" +
      "- Gestion des catégories, cliquables, affichant le détail et le suivi de chaque article qui s'y trouve\n" +
      "- Suivi des dépenses et reventes sur mesure (ajout, modification, suppression, statut « vendu »)\n" +
      "- Connexion sécurisée et hébergement de la base de données\n" +
      "- Application 100% responsive, optimisée pour mobile (iPhone en priorité) et ordinateur\n" +
      "- Design choisi ci-dessus et langue(s) sélectionnée(s)"
  );

  form
    .addCheckboxItem()
    .setTitle("Je valide la prestation complète décrite ci-dessus pour 30 000 DA")
    .setChoiceValues(["Oui, je valide la création complète pour 30 000 DA"])
    .setRequired(true);

  form
    .addCheckboxItem()
    .setTitle("Souhaitez-vous une fonctionnalité supplémentaire, en plus de ce qui est prévu ?")
    .setChoiceValues(["Oui, je souhaite quelque chose en plus (précisez dans la question suivante)"])
    .setRequired(false);

  form
    .addParagraphTextItem()
    .setTitle("Si oui, décrivez la fonctionnalité supplémentaire souhaitée")
    .setRequired(false);

  form.addTextItem().setTitle("Nom").setRequired(true);
  form.addTextItem().setTitle("Téléphone").setRequired(true);
  form.addTextItem().setTitle("Email").setRequired(false);

  Logger.log("Formulaire créé avec succès !");
  Logger.log("Lien d'édition : " + form.getEditUrl());
  Logger.log("Lien à partager au client : " + form.getPublishedUrl());
}

function ajouterImageSiDisponible(form, nomFichier, titre) {
  try {
    const fichiers = DriveApp.getFilesByName(nomFichier);
    if (!fichiers.hasNext()) {
      Logger.log("Image non trouvée dans Drive (ignorée) : " + nomFichier);
      return;
    }
    const blob = fichiers.next().getBlob();
    form.addImageItem().setTitle(titre).setImage(blob);
  } catch (e) {
    Logger.log("Impossible d'ajouter l'image " + nomFichier + " : " + e.message);
  }
}
