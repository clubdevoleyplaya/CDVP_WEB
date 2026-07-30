// Datos de ejemplo para /admin/analytics — no viene de ningún backend todavía.

export const DAILY_LABELS = [
  "17 jul", "18 jul", "19 jul", "20 jul", "21 jul", "22 jul", "23 jul",
  "24 jul", "25 jul", "26 jul", "27 jul", "28 jul", "29 jul", "30 jul",
];

export const DAILY_SALES_ARS = [
  180000, 220000, 150000, 340000, 410000, 380000, 260000,
  300000, 250000, 470000, 520000, 390000, 440000, 610000,
];

export const DAILY_VISITS = [
  420, 465, 380, 610, 705, 690, 520,
  540, 505, 780, 830, 690, 720, 940,
];

export const REVENUE_BY_CATEGORY = [
  { name: "Cursos", value: 46 },
  { name: "Programas", value: 28 },
  { name: "Combos", value: 16 },
  { name: "Descargables", value: 10 },
];

export const TOP_PRODUCTS = [
  { name: "Ataque", ventas: 34 },
  { name: "Beach Voley Pro — Gold", ventas: 21 },
  { name: "Defensa", ventas: 18 },
  { name: "Recepción", ventas: 15 },
  { name: "Plan de gimnasio PRO", ventas: 12 },
];

export const STATS = {
  ventasTotales: DAILY_SALES_ARS.reduce((a, b) => a + b, 0),
  visitasTotales: DAILY_VISITS.reduce((a, b) => a + b, 0),
  conversion: 4.1,
  ticketPromedio: 58500,
};
