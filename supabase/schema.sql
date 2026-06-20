-- Money Tracker — schéma Supabase
-- À exécuter dans le SQL Editor du projet Supabase.

create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nom text not null,
  emoji text,
  created_at timestamptz not null default now()
);

create table if not exists depenses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  categorie_id uuid references categories (id) on delete set null,
  nom_article text not null,
  prix_achat numeric not null check (prix_achat >= 0),
  prix_revente numeric check (prix_revente is null or prix_revente >= 0),
  statut text not null default 'en_stock' check (statut in ('en_stock', 'vendu')),
  date_achat date not null,
  date_revente date,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists depenses_owner_id_idx on depenses (owner_id);
create index if not exists depenses_categorie_id_idx on depenses (categorie_id);
create index if not exists categories_owner_id_idx on categories (owner_id);

alter table categories enable row level security;
alter table depenses enable row level security;

create policy "owner can manage categories" on categories
  for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "owner can manage depenses" on depenses
  for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
