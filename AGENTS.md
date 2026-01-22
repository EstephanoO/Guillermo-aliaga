# Repository Guidelines

## How to Use This Guide

- Single Next.js app; there are no component-level AGENTS files.
- Use this document as the baseline for structure, tooling, and feature conventions.
- UI copy is mostly Spanish; keep text consistent with existing tone.

## Available Skills

Use these skills for detailed patterns on-demand:

### Generic Skills (Any Project)
| Skill | Description | URL |
| --- | --- | --- |
| `nextjs-16` | App Router, Server Actions, Route Handlers | [SKILL.md](skills/nextjs-16/SKILL.md) |
| `react-19` | React 19 components, hooks, compiler rules | [SKILL.md](skills/react-19/SKILL.md) |
| `typescript` | TypeScript types and interfaces | [SKILL.md](skills/typescript/SKILL.md) |
| `zod-4` | Zod schemas and validation | [SKILL.md](skills/zod-4/SKILL.md) |
| `zustand-5` | Zustand client state management | [SKILL.md](skills/zustand-5/SKILL.md) |
| `tailwind-4` | Tailwind styling and UI patterns | [SKILL.md](skills/tailwind-4/SKILL.md) |
| `playwright` | Playwright E2E testing | [SKILL.md](skills/playwright/SKILL.md) |
| `skill-creator` | Creating new skills | [SKILL.md](skills/skill-creator/SKILL.md) |
| `skill-sync` | Syncing skills metadata | [SKILL.md](skills/skill-sync/SKILL.md) |
| `prowler-pr` | Pull request conventions and creation | [SKILL.md](skills/prowler-pr/SKILL.md) |

### App-Specific Skills
| Skill | Description | URL |
| --- | --- | --- |
| `maplibre` | Maplibre / react-maplibre maps | [SKILL.md](skills/maplibre/SKILL.md) |
| `apify` | Apify ingestion pipelines | [SKILL.md](skills/apify/SKILL.md) |
| `gemini` | Gemini AI analysis | [SKILL.md](skills/gemini/SKILL.md) |
| `drizzle` | Drizzle ORM schema, queries, migrations | [SKILL.md](skills/drizzle/SKILL.md) |
| `neon-postgres` | Neon Postgres integration | [SKILL.md](skills/neon-postgres/SKILL.md) |
| `vercel-deploy` | Vercel deployment and runtime | [SKILL.md](skills/vercel-deploy/SKILL.md) |

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
| --- | --- |
| App Router, Route Handlers, Server Actions | `nextjs-16` |
| Writing React components or hooks | `react-19` |
| Writing TypeScript types or interfaces | `typescript` |
| Creating Zod schemas | `zod-4` |
| Creating Zustand stores | `zustand-5` |
| Working with Tailwind classes | `tailwind-4` |
| Writing Playwright tests | `playwright` |
| Creating or updating skills | `skill-creator` |
| Syncing skills metadata | `skill-sync` |
| Creating PRs or PR templates | `prowler-pr` |
| MapLibre map work | `maplibre` |
| Apify ingestion or scraping | `apify` |
| Gemini AI analysis or prompts | `gemini` |
| Drizzle ORM schema or queries | `drizzle` |
| Neon Postgres integration | `neon-postgres` |
| Vercel deploy or runtime config | `vercel-deploy` |

---

## Project Overview

Dashboard-style Next.js 16 app that renders campaign analytics, charts, and mapping utilities.

| Area | Location | Tech / Notes |
| --- | --- | --- |
| App shell | `src/app/layout.tsx`, `src/app/globals.css` | Geist fonts, CSS variables, dark theme class toggle |
| Dashboard UI | `src/ui/`, `src/ui/dashboard/` | KPI cards, charts, filters, Tailwind 4 |
| Static data | `src/db/` | Dashboard metrics and CSV URL builder |
| API routes | `src/app/api/` | Excel parsing, geocoding via Nominatim |
| Test pages | `src/app/test/`, `src/app/test/somistas/` | Upload + geocode workflows with MapLibre maps |
| Public assets | `public/` | Excel, CSV, images, misc assets |

---

## Development

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

## Key Features and Data Flow

- Dashboard metrics live in `src/db/dashboardData.ts` and are rendered by `src/ui/DashboardPage.tsx` and dashboard panels.
- Campaign mix charts in `src/ui/dashboard/CampaignsPie.tsx` load a CSV from `public/` (via `csvUrl`) and parse it client-side.
- Map workflows on `/test` and `/test/somistas` upload an Excel file, parse sheet rows in route handlers, then geocode in batches.
- API routes:
  - `GET /api/basquet` and `GET /api/somistas` read the local Excel file from `public/`.
  - `POST /api/basquet-upload` and `POST /api/somistas-upload` parse uploaded Excel files.
  - `POST /api/basquet-geocode` and `POST /api/somistas-geocode` call Nominatim and throttle requests.
- Map rendering is handled by MapLibre in `src/app/test/BasquetMap.tsx` and reused for Somistas.

---

## Styling and Theming

- Theme tokens live in `src/app/globals.css` as CSS variables.
- The `dark` class on `document.documentElement` toggles dark theme values.
- Tooltip styles for charts are centralized in `src/ui/dashboard/tooltipStyles.ts`.

---

## Linting

- ESLint uses Next.js core-web-vitals and TypeScript config via `eslint.config.mjs`.
- Run `npm run lint` before PRs.
