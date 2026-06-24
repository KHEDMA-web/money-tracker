const URL = 'https://drhyutobqazfiuwsuqko.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyaHl1dG9icWF6Zml1d3N1cWtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjA1ODE4MCwiZXhwIjoyMDk3NjM0MTgwfQ.yDuwWNoWGS2M-HSw1HfMOufm0PDtBMwoDiSS0UqN7Yo';

const OWNER   = '1451788a-2565-4a88-a0e0-90b613151775';
const MONTRE  = 'eb968810-1d17-49a8-b318-0ada68e07b55';
const VOITURE = 'df883187-fe1e-468d-b16e-35e6209e662b';
const JETSKI  = 'ecd63041-885b-406b-ab33-a30c0faddf3b';
const BATEAU  = '8772abbc-f7cd-4581-b26d-36b8c9e577e5';

const d = (cat, nom, achat, revente, dateA, dateR) => ({
  owner_id: OWNER,
  categorie_id: cat,
  nom_article: nom,
  prix_achat: achat,
  prix_revente: revente,
  date_achat: dateA,
  date_revente: dateR,
  statut: revente != null ? 'vendu' : 'en_stock',
  notes: null,
});

const depenses = [
  // Janvier 2026
  d(MONTRE,  'Rolex Submariner 116610LN',     850000,   980000,   '2026-01-03', '2026-01-12'),
  d(VOITURE, 'Volkswagen Golf 7 GTI',         3200000,  3550000,  '2026-01-07', '2026-01-25'),
  d(MONTRE,  'Omega Seamaster 300M',          620000,   710000,   '2026-01-10', '2026-01-28'),
  d(JETSKI,  'Sea-Doo Spark 90cv',            1800000,  null,     '2026-01-15', null),
  d(MONTRE,  'Audemars Piguet Royal Oak',     2100000,  2480000,  '2026-01-20', '2026-02-08'),
  // Fevrier 2026
  d(VOITURE, 'BMW Serie 3 320d',              4100000,  4450000,  '2026-02-02', '2026-02-18'),
  d(MONTRE,  'TAG Heuer Carrera',             380000,   430000,   '2026-02-05', '2026-02-20'),
  d(BATEAU,  'Yamaha FX Cruiser SVHO',        5200000,  5800000,  '2026-02-10', '2026-03-05'),
  d(VOITURE, 'Kia Sportage 4x4',              3800000,  4100000,  '2026-02-14', '2026-03-01'),
  d(MONTRE,  'Patek Philippe Calatrava',      4500000,  5100000,  '2026-02-20', '2026-03-10'),
  // Mars 2026
  d(JETSKI,  'Kawasaki Ultra 310R',           2900000,  3250000,  '2026-03-01', '2026-03-20'),
  d(MONTRE,  'Richard Mille RM 011',          12000000, 13500000, '2026-03-05', '2026-03-25'),
  d(VOITURE, 'Mercedes GLC 300',              7500000,  7950000,  '2026-03-08', '2026-04-02'),
  d(MONTRE,  'Hublot Classic Fusion',         1200000,  1350000,  '2026-03-12', '2026-03-28'),
  d(BATEAU,  'Sunseeker Predator 50',         28000000, null,     '2026-03-18', null),
  // Avril 2026
  d(VOITURE, 'Toyota Land Cruiser 300',       9800000,  10500000, '2026-04-03', '2026-04-22'),
  d(MONTRE,  'Rolex Daytona 116500LN',        1850000,  2200000,  '2026-04-06', '2026-04-18'),
  d(JETSKI,  'BRP Sea-Doo RXP-X 300',         3400000,  3750000,  '2026-04-10', '2026-04-28'),
  d(MONTRE,  'Breitling Navitimer B01',       720000,   800000,   '2026-04-14', '2026-05-03'),
  d(VOITURE, 'Audi A6 Quattro 2023',          6200000,  6600000,  '2026-04-20', '2026-05-08'),
  // Mai 2026
  d(MONTRE,  'IWC Portugieser Chronographe',  850000,   960000,   '2026-05-02', '2026-05-16'),
  d(BATEAU,  'Zodiac Neo 5.5',                1400000,  1600000,  '2026-05-05', '2026-05-22'),
  d(VOITURE, 'Range Rover Sport P400',        12500000, 13400000, '2026-05-08', '2026-05-28'),
  d(MONTRE,  'Cartier Santos-Dumont',         950000,   1060000,  '2026-05-12', '2026-05-30'),
  d(JETSKI,  'Yamaha VX Cruiser HO',          2100000,  null,     '2026-05-18', null),
  // Juin 2026
  d(VOITURE, 'Porsche Cayenne Coupe',         18000000, 19500000, '2026-06-01', '2026-06-15'),
  d(MONTRE,  'Rolex GMT-Master II Pepsi',     1650000,  1920000,  '2026-06-04', '2026-06-18'),
  d(BATEAU,  'Boston Whaler 270 Dauntless',   9500000,  null,     '2026-06-08', null),
  d(MONTRE,  'Chopard L.U.C XP',              1100000,  1240000,  '2026-06-12', '2026-06-22'),
  d(VOITURE, 'BMW X5 M Competition',          14500000, null,     '2026-06-20', null),
];

const r = await fetch(`${URL}/rest/v1/depenses`, {
  method: 'POST',
  headers: {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',
  },
  body: JSON.stringify(depenses),
});

console.log('Status:', r.status);
if (!r.ok) {
  console.log('Error:', await r.text());
} else {
  console.log(`${depenses.length} entrees inserees.`);
}
