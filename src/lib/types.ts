export type Statut = "en_stock" | "vendu";

export type Categorie = {
  id: string;
  nom: string;
  emoji: string | null;
  created_at: string;
};

export type Depense = {
  id: string;
  categorie_id: string | null;
  nom_article: string;
  prix_achat: number;
  prix_revente: number | null;
  statut: Statut;
  date_achat: string;
  date_revente: string | null;
  notes: string | null;
  created_at: string;
};

export type DepenseWithCategorie = Depense & {
  categorie: Categorie | null;
};

export type DepenseActionState = {
  status: "idle" | "error" | "success";
  error?: string;
};

export const depenseActionInitialState: DepenseActionState = { status: "idle" };

export type CategorieActionState = {
  status: "idle" | "error" | "success";
  error?: string;
  id?: string;
};

export const categorieActionInitialState: CategorieActionState = { status: "idle" };
