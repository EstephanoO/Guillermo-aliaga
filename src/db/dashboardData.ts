export const voteGoal = 172638;
export const voteProgress = 510;

export const csvUrl = new URL(
  "./constants/Campaña-Aliaga-Campañas-20-dic.-2022-20-ene.-2026.csv",
  import.meta.url,
).toString();

export const heroStats = [
  {
    label: "WhatsApp",
    value: 1206,
    detail: "Seguidores",
    delta: "+120 ult. 7 dias",
    accent: "#2f8f6f",
  },
  {
    label: "Facebook",
    value: 31000,
    detail: "Seguidores",
    delta: "+420 ult. 7 dias",
    accent: "#2d7bbd",
  },
  {
    label: "Voluntarios",
    value: 200,
    detail: "Activos",
    delta: "+18 ult. 7 dias",
    accent: "#c48a2c",
  },
  {
    label: "Web",
    value: 1000,
    detail: "Contactos",
    delta: "Ultimos 30 dias",
    accent: "#6b7280",
  },
];

export const wspOverview = [
  { label: "Alcance", value: 1718 },
  { label: "Seguidores", value: 63.8, suffix: "%", detail: "1 mil" },
  { label: "No seguidores", value: 622, detail: "36.2%" },
  { label: "Total nuevos", value: 510, prefix: "+" },
];

export const wspTotals = {
  netNew: 510,
  startedFollowing: 720,
  unfollowed: 210,
};

export const volunteerGoal = 300;

export const volunteerPie = [
  { name: "Digital", value: 90, color: "#38bdf8" },
  { name: "Casa", value: 60, color: "#f59e0b" },
  { name: "Movimiento", value: 50, color: "#22c55e" },
];

export const webPie = [
  { name: "Respondieron", value: 380, color: "#38bdf8" },
  { name: "No respondieron", value: 620, color: "#f97316" },
];

export const responseRate = 38;

export const campaignBudgetSummary = [
  {
    label: "Monto base",
    amount: 14346.11,
    note: "Gasto base",
  },
  {
    label: "Monto Facebook",
    amount: 16928.41,
    note: "+S/ 2,582.30 vs base",
    badge: "+18%",
  },
  {
    label: "Monto Banco",
    amount: 18959.82,
    note: "+S/ 2,031.41 vs FB",
    badge: "+12% sobre FB",
  },
];

export const campaignSpendRanking = [
  {
    name: "Campaña formulario somista - Copia",
    value: 2869.2,
  },
  {
    name: "Campaña de seguidores - Copia",
    value: 1694.92,
  },
  {
    name: "Campaña de seguidores - 1era semana enero",
    value: 847.46,
  },
  {
    name: "Campaña formulario somista",
    value: 846.5,
  },
  {
    name: "Campaña de seguidores",
    value: 844.51,
  },
];

export const campaignInteractionRanking = [
  {
    name: "Campaña \"Evento en la UNI\"",
    value: 148200,
  },
  {
    name: "Campaña Flyers Biografía",
    value: 109805,
  },
  {
    name: "Campaña \"interacción Forzay\"",
    value: 91256,
  },
  {
    name: "Campaña Video de Historia Guillermo Aliaga",
    value: 83368,
  },
  {
    name: "Campaña de interacción \"Mi manada\"",
    value: 56699,
  },
];

export const responseKpis = [
  { label: "Respondieron", value: 380 },
  { label: "No respondieron", value: 620 },
  { label: "Digital", value: 90 },
  { label: "Casa", value: 60 },
  { label: "Movimiento", value: 50 },
];
