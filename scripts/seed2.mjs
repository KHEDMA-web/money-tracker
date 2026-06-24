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

const TODAY = '2026-06-24';

const depenses = [
  // ── AUJOURD'HUI (8 ventes) — vue "Jour" ─────────────────────────
  d(MONTRE,  'Rolex Explorer II 226570',       780000,   920000,   TODAY, TODAY),
  d(MONTRE,  'Panerai Luminor Marina PAM01359',1450000,  1680000,  TODAY, TODAY),
  d(VOITURE, 'Volkswagen Touareg 3.0 TDI',     6800000,  7400000,  TODAY, TODAY),
  d(MONTRE,  'Tudor Black Bay 58',             420000,   510000,   TODAY, TODAY),
  d(JETSKI,  'Sea-Doo GTX Limited 300',        3600000,  4050000,  TODAY, TODAY),
  d(MONTRE,  'Zenith El Primero 36000',        680000,   790000,   TODAY, TODAY),
  d(VOITURE, 'Skoda Octavia RS 245',           3100000,  3450000,  TODAY, TODAY),
  d(MONTRE,  'Longines Master Collection',     310000,   375000,   TODAY, TODAY),

  // ── JUIN 2026 jours variés — bonne courbe "Mois" ────────────────
  d(MONTRE,  'Rolex Oyster Perpetual 41',      550000,   640000,   '2026-06-02', '2026-06-05'),
  d(VOITURE, 'Ford Mustang GT V8 2022',        7200000,  7900000,  '2026-06-03', '2026-06-10'),
  d(MONTRE,  'Jaeger-LeCoultre Reverso',       1900000,  2200000,  '2026-06-05', '2026-06-14'),
  d(JETSKI,  'Yamaha FZR SVHO',               3200000,  3600000,  '2026-06-06', '2026-06-16'),
  d(VOITURE, 'Hyundai Tucson N-Line 4x4',      3600000,  3950000,  '2026-06-07', '2026-06-17'),
  d(MONTRE,  'Vacheron Constantin Overseas',   3800000,  4350000,  '2026-06-09', '2026-06-19'),
  d(BATEAU,  'Beneteau Flyer 9 SUV',           8500000,  9400000,  '2026-06-10', '2026-06-20'),
  d(VOITURE, 'Jeep Wrangler Rubicon',          7800000,  8500000,  '2026-06-11', '2026-06-21'),
  d(MONTRE,  'A. Lange & Söhne Saxonia',       6200000,  7100000,  '2026-06-13', '2026-06-22'),
  d(VOITURE, 'Nissan GT-R 2020',               9500000,  10800000, '2026-06-14', '2026-06-23'),
  d(MONTRE,  'Piaget Altiplano',               2400000,  2750000,  '2026-06-16', TODAY),
  d(JETSKI,  'Kawasaki Jet Ski STX 160',       2200000,  2520000,  '2026-06-17', TODAY),
  d(VOITURE, 'Chevrolet Corvette C8',          15500000, 17200000, '2026-06-19', TODAY),
  d(MONTRE,  'Girard-Perregaux Laureato',      1600000,  1850000,  '2026-06-21', TODAY),

  // ── BOOST MOIS PRECEDENTS — courbe "Tout" plus haute ────────────
  d(MONTRE,  'Breguet Tradition 7097',         5500000,  6400000,  '2026-01-25', '2026-02-05'),
  d(VOITURE, 'Lamborghini Urus Performante',   42000000, 47500000, '2026-02-25', '2026-03-15'),
  d(MONTRE,  'F.P. Journe Chronometre Bleu',   18000000, 21000000, '2026-03-28', '2026-04-10'),
  d(VOITURE, 'Ferrari California T',           38000000, 43000000, '2026-04-25', '2026-05-12'),
  d(BATEAU,  'Riva Aquarama Super',            55000000, 63000000, '2026-05-20', '2026-06-10'),
  d(MONTRE,  'Patek Philippe Nautilus 5711',   22000000, 26000000, '2026-05-25', '2026-06-08'),
  d(VOITURE, 'Bentley Bentayga V8',            35000000, 39500000, '2026-06-02', '2026-06-16'),
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
