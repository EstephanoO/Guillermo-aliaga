# UI AGENTS

## Alcance
- Este archivo cubre los componentes en `src/ui` y `src/ui/dashboard`.

## Componentes base (`src/ui`)
- `src/ui/DashboardPage.tsx`: pagina principal del dashboard; controla el tema (claro/oscuro) y monta `DashboardHeader` con boton flotante de toggle.
- `src/ui/chart1.tsx`: `WsppChart` con lineas diarias de canal WSP; usa Recharts, `wspTotals` y `getTooltipStyles` para tooltips.

## Secciones del dashboard (`src/ui/dashboard`)
- `src/ui/dashboard/DashboardHeader.tsx`: encabezado con candidato, partido, ultima actualizacion y barra de progreso de objetivo de votos.
- `src/ui/dashboard/SidebarNav.tsx`: navegacion lateral con anclas a secciones del dashboard.
- `src/ui/dashboard/PrimaryKpis.tsx`: grilla de KPIs principales con tonos y deltas.
- `src/ui/dashboard/HeroCard.tsx`: resumen de seguidores totales; renderiza `KpiCard` por red.
- `src/ui/dashboard/CampaignDataStrip.tsx`: franja con fuente del CSV y boton de descarga.
- `src/ui/dashboard/CampaignsPie.tsx`: carga CSV, agrega gasto/resultados, muestra pies y rankings; maneja estados loading/empty/error.
- `src/ui/dashboard/DataFunnelPanel.tsx`: embudo de datos con porcentajes y notas de reglas.
- `src/ui/dashboard/VolunteersPanel.tsx`: distribucion de voluntarios y progreso contra meta.
- `src/ui/dashboard/VolunteerTypesPanel.tsx`: tarjetas por tipo de voluntario con porcentaje y barra.
- `src/ui/dashboard/GoalsProjectionPanel.tsx`: metas electorales, escenarios y relacion votos/voluntarios.
- `src/ui/dashboard/DataCapturePanel.tsx`: tabla de formularios y resumen de WhatsApp.
- `src/ui/dashboard/WsppPanel.tsx`: vista del canal WSP con KPIs, resumen neto y filtro de tendencia diaria.
- `src/ui/dashboard/SocialAdsPanel.tsx`: seguidores, resultados de Ads, sentimiento y temas top.
- `src/ui/dashboard/WebMetricsPanel.tsx`: mix de contactos web y tasa de respuesta.
- `src/ui/dashboard/DataSourcesFooter.tsx`: listado de fuentes y nota de costo de scrapeo.

## Componentes compartidos (`src/ui/dashboard/components`)
- `src/ui/dashboard/components/ChartCard.tsx`: contenedor de seccion con titulo, subtitulo y accion opcional.
- `src/ui/dashboard/components/KpiCard.tsx`: tarjeta de KPI compacta usada en `HeroCard`.
- `src/ui/dashboard/components/FilterBar.tsx`: grupo de botones para filtros segmentados.
- `src/ui/dashboard/components/StackedBarCard.tsx`: barra apilada con leyenda y totales.
- `src/ui/dashboard/components/EmptyState.tsx`: mensaje para estados sin datos.
- `src/ui/dashboard/components/LoadingSkeleton.tsx`: placeholder animado para cargas.

## Utilidades
- `src/ui/dashboard/tooltipStyles.ts`: estilos comunes para tooltips de charts.
