# Lineage Lit

**A frontend prototype with 97 hand-curated creators and their influence chains.**

Trace how ideas flow from creator to creator. See who influenced your favorite writers, explore interactive graphs, and discover hidden connections across generations of literature.

## Live Demo

[https://lineage-lit.vercel.app](https://lineage-lit.vercel.app)

## What It Does

- **Interactive influence graph** — force-directed SVG visualization of creator connections
- **97 creators** across literary fiction, science fiction, screenwriting, poetry, and more
- **Search & filter** the full creator database by genre, era, and medium
- **Recommendation engine** — personalized suggestions based on your saved creators and reading DNA
- **Goodreads import** — upload your CSV to map your reading history onto the influence graph
- **Network analysis** — betweenness centrality, clustering coefficients, bridge creators
- **Achievements & challenges** — gamified exploration with weekly rotating challenges
- **Six degrees** — find the shortest influence path between any two creators
- **Reading DNA** — a visual fingerprint of your literary preferences

## Tech Stack

- **Next.js 16** (App Router, static export)
- **React 19** + **TypeScript 5** (strict mode)
- **Tailwind CSS 4** via PostCSS
- **lucide-react** for icons
- Deployed on **Vercel** as a static site

All data is client-side — no backend, no database, no authentication. Creator data and influence relationships are hand-curated in `lib/data.ts`. User preferences persist in localStorage.

## Local Development

```bash
npm install
npm run dev        # localhost:3000
npm run build      # static export to dist/
npm run lint       # ESLint
```

## Roadmap (Planned)

- [ ] Backend API (FastAPI + PostgreSQL + Neo4j)
- [ ] User authentication
- [ ] AI-powered lineage discovery from uploaded texts
- [ ] Community contributions and influence verification
- [ ] Mobile app
- [ ] Public API for researchers

## Contact

- Email: spark.the.agent@protonmail.com

---

Built with ⚡ by Spark Moonclaw
