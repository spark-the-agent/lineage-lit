# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lineage Lit tracks the creative lineage of ideas — discovering how books, screenplays, and articles are connected through their creators' influences. Currently an MVP frontend prototype with mock data (no backend, no database, no auth).

## Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Build static export to `dist/`
- `npm run lint` — Run ESLint
- `npm start` — Serve production build

No test framework is configured.

## Tech Stack

- **Next.js 16** (App Router) with static export (`output: 'export'`)
- **React 19**, **TypeScript 5** (strict mode)
- **Tailwind CSS 4** via PostCSS
- **lucide-react** for icons
- Deployed on **Vercel** (static site, no SSR)

## Architecture

### Data Flow

All data is hardcoded mock data — no API calls, no database. The source of truth is:

- `lib/data.ts` — Creator and Work types + seed data (8 creators)
- `lib/social.ts` — Mock user profiles, activity, following
- `lib/recommendations.ts` — Client-side recommendation algorithm
- `lib/import.ts` — Goodreads CSV parser
- `lib/network-analysis.ts` — Graph analysis (centrality, clustering)
- `lib/citations.ts` — APA/MLA/Chicago formatting
- `lib/export.ts` — Export utilities (stub)

### Core Data Model

```typescript
Creator { id, name, years, bio, influencedBy: string[], influenced: string[], works: Work[] }
Work { id, title, year, type: 'book'|'screenplay'|'article', description }
```

Creator IDs are slug strings (e.g., `"hemingway"`, `"carver"`). Influence relationships are stored as arrays of these IDs on each Creator.

### Routing (App Router)

- `/` — Landing page with hero, featured lineage, interactive graph
- `/explore` — Creator discovery grid
- `/creators/[id]` — Creator detail (statically generated via `generateStaticParams`)
- `/recommendations` — AI recommendation cards
- `/profile` — User profile with saved items and Reading DNA
- `/community` — Activity feed and user directory
- `/import` — Goodreads CSV upload

### Component Patterns

- **Server components** are the default for pages and layouts
- **Client components** (`'use client'`) are used for interactivity: `LineageGraph`, `MobileNav`, `ReadingDNA`, `CreatorActions`, `SaveCreatorButton`, `ShareButton`
- Components live in `app/components/` (shared) or colocated with their route
- `LineageGraph` is a custom SVG force-directed graph simulation (no D3 dependency)

### Styling

- Dark theme: zinc-900/950 backgrounds, amber-400/500 accents
- Mobile-first responsive design with safe area inset support
- All styling via Tailwind utility classes

### Static Export Constraints

`next.config.ts` sets `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`. This means:

- No server-side features (API routes, middleware, SSR)
- All dynamic routes must use `generateStaticParams`
- Images cannot use Next.js optimization

### Path Alias

`@/*` maps to the project root (configured in `tsconfig.json`).

## docs/ARCHITECTURE.md

Contains the planned full-stack architecture (FastAPI + PostgreSQL + Neo4j) which is **not yet implemented**. The current app is frontend-only with mock data. The `backend/` directory exists but is empty.
