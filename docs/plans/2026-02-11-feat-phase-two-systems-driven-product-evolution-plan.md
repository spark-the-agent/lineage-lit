---
title: "Phase Two: Systems-Driven Product Evolution"
type: feat
date: 2026-02-11
approach: Mike Krieger CPO — systems thinking, instant delight, viral loops
constraint: Connect existing Convex backend, progressive enhancement
---

# Phase Two: Systems-Driven Product Evolution

> "The best products don't add features — they amplify feedback loops."
> — Thinking like Mike Krieger, co-founder of Instagram

## Overview

Lineage Lit has a polished MVP with 10 pages, custom graph visualization, gamification, and a recommendation engine — all running on static mock data with 8 creators. A Convex backend with schema, AI integration, and seed data **already exists but is completely disconnected from the frontend**.

This plan transforms Lineage Lit from a beautiful demo into a living product by:

1. Wiring up the Convex backend (it's already built)
2. Redesigning the first 30 seconds to deliver instant delight
3. Expanding content density from 8 to 50+ creators
4. Activating viral sharing loops
5. Lighting up real social features
6. Shipping AI Lineage Discovery as the paid differentiator

Every decision is grounded in **systems thinking** — identifying reinforcing loops, leverage points, and the minimum intervention that creates maximum momentum.

---

## Systems Map

### The Product as a System

```
┌─────────────────────────────────────────────────────────────┐
│                    LINEAGE LIT SYSTEM                       │
│                                                             │
│  ┌──────────┐    R1: Content      ┌──────────────┐         │
│  │ Creators │───────Engine───────▶│  Connections  │         │
│  │ (Stock)  │◀────────────────────│   (Stock)     │         │
│  └────┬─────┘                     └──────┬───────┘         │
│       │                                  │                  │
│       │ R2: Discovery                    │ R3: Aha!         │
│       ▼                                  ▼                  │
│  ┌──────────┐                     ┌──────────────┐         │
│  │  Users   │────R4: Viral────▶   │  Shared      │         │
│  │ (Stock)  │    Sharing          │  Artifacts   │         │
│  └────┬─────┘                     └──────┬───────┘         │
│       │                                  │                  │
│       │ R5: Social                       │ R6: Acquisition  │
│       ▼                                  ▼                  │
│  ┌──────────┐                     ┌──────────────┐         │
│  │ Engaged  │◀───────────────────│  New Users    │         │
│  │ Community│                     │  (Flow)       │         │
│  └──────────┘                     └──────────────┘         │
│                                                             │
│  B1: Quality Gate — curated > crowdsourced                  │
│  B2: Complexity Ceiling — simple > feature-rich             │
└─────────────────────────────────────────────────────────────┘
```

### Reinforcing Loops (Growth Engines)

| Loop | Name | Mechanism | Current Status |
|------|------|-----------|----------------|
| **R1** | Content Engine | More creators → more connections → richer graph → more discovery | **BROKEN** — stuck at 8 creators |
| **R2** | Discovery Loop | User explores → saves creators → better recommendations → explores more | **WEAK** — exhausts in 5 minutes |
| **R3** | Aha Moment | Unexpected connection found → dopamine → deeper exploration | **BURIED** — graph is 80% down landing page |
| **R4** | Viral Sharing | User creates DNA card / finds path → shares → friend visits → new user | **DORMANT** — ShareableCard exists but isn't prominent |
| **R5** | Social Proof | User sees others' activity → engages → creates activity → others see | **FAKE** — 100% mock data |
| **R6** | Acquisition | Shared artifact appears on social → curiosity → visit → new user | **ZERO** — no public sharing flow |

### Balancing Loops (Quality Governors)

| Loop | Name | Mechanism |
|------|------|-----------|
| **B1** | Quality Gate | Every creator must have verified influences — curated beats crowdsourced |
| **B2** | Complexity Ceiling | Each feature must serve the core loop — resist feature bloat |

### Key Leverage Points (Ordered by Impact)

1. **Content density** (8 → 50+ creators) — unlocks R1, R2, R3 simultaneously
2. **First-30-seconds redesign** — moves R3 from buried to immediate
3. **Backend connection** — enables R5, R6 and the paid feature
4. **Shareable artifacts** — activates R4, R6 (viral acquisition)
5. **AI Lineage Discovery** — creates R1 flywheel (AI generates content)

---

## Problem Statement

### The Instagram Lens

Instagram succeeded because of one insight: **the filter preview was the product**. You saw the beautiful result *before* you committed. The aha moment was instant, zero-friction, and inherently shareable.

Lineage Lit's equivalent should be the influence graph — the moment you see that Hemingway shaped Carver who shaped Wolff, and you can *click* to explore each connection. But today:

- The interactive graph is buried 80% down the landing page
- A first-time visitor sees marketing copy before they see magic
- The aha moment requires scrolling past 6 sections
- Streak/challenge UI is hidden when you have no history (exactly when you need motivation most)
- The app exhausts its 8 creators in under 5 minutes

### The Systems Problem

The product has **no active reinforcing loops**. Every growth engine is either broken, weak, or dormant. The system is in equilibrium at zero — it can't grow because:

- Content is static (no R1)
- Social is fake (no R5)
- Sharing produces nothing (no R4/R6)
- The backend that could fix all of this **exists but isn't connected**

---

## Proposed Solution

### Design Principle: Minimum Viable Loop

Don't ship features. **Ship complete feedback loops.** Each phase activates at least one reinforcing loop end-to-end.

### Phase Architecture

```
Phase 1: "The First Click"     → Activates R3 (Aha Moment)
Phase 2: "The Living Graph"    → Activates R1 (Content Engine) + R2 (Discovery)
Phase 3: "The Share Moment"    → Activates R4 (Viral) + R6 (Acquisition)
Phase 4: "The Community"       → Activates R5 (Social Proof)
Phase 5: "The Intelligence"    → Amplifies ALL loops via AI
```

---

## Technical Approach

### Architecture Evolution

```
CURRENT                          PHASE 2 TARGET
┌──────────────┐                ┌──────────────┐
│  Next.js 16  │                │  Next.js 16  │
│  Static      │                │  Hybrid      │
│  Export      │                │  (SSG + CSR)  │
├──────────────┤                ├──────────────┤
│  lib/data.ts │                │  ConvexProvider│
│  (8 creators)│                │  ┌──────────┐ │
│  localStorage│                │  │ Convex   │ │
│              │                │  │ Backend  │ │
└──────────────┘                │  │ (live)   │ │
                                │  └──────────┘ │
                                │  localStorage │
                                │  (cache+local)│
                                ├──────────────┤
                                │  Clerk Auth   │
                                │  Stripe Billing│
                                └──────────────┘
```

### Critical Architecture Decision: Hybrid Mode

**Remove `output: 'export'` from `next.config.ts`.** This unlocks:
- Client-side Convex queries (real-time data)
- Server components that pre-render with static data
- API routes if needed later
- Keep `generateStaticParams` for SEO on creator pages

**Keep localStorage as local cache.** The persistence layer (`lib/persistence.ts`) becomes a fast local cache that syncs to Convex when authenticated. Unauthenticated users still get full functionality via localStorage — Convex adds sync and social.

### Data Shape Adapter

The frontend uses `Creator.id` (slug string) while Convex uses `_id` (DocId) + `slug`. Create a thin adapter:

```typescript
// lib/convex-adapter.ts
// Maps Convex documents to frontend Creator/Work types
// Keeps all existing components working unchanged
// Single point of translation between data shapes
```

This avoids rewriting every component while migrating incrementally.

---

## Implementation Phases

### Phase 1: "The First Click" — Instant Aha Moment

**System goal:** Activate R3 (Aha Moment) — deliver delight in under 10 seconds.

**The Krieger test:** Can someone screenshot this and send it to a friend within 30 seconds of landing?

#### 1.1 Redesign Landing Page Information Architecture

**Current order** (10 sections before graph):
Hero → Streak → Daily Lineage → Challenge → DNA Card → Features → Featured Lineage → Stats → Graph → DNA Teaser → Community CTA

**New order** (graph is THE hero):
```
┌─────────────────────────────────┐
│  HERO: "See How Ideas Connect"  │
│  [One-line value prop]          │
│  ↓ Scroll indicator             │
├─────────────────────────────────┤
│  INTERACTIVE GRAPH (600px)      │  ← THE product. Full width.
│  Pulsing "Click Hemingway"      │     First thing you interact with.
│  tooltip on first visit         │
├─────────────────────────────────┤
│  DAILY LINEAGE + CHALLENGE      │  ← Context after you've explored
├─────────────────────────────────┤
│  DNA CARD (interactive)         │  ← "This could be YOUR card"
├─────────────────────────────────┤
│  FEATURED LINEAGE CHAIN         │  ← Deeper storytelling
├─────────────────────────────────┤
│  CTA: Import / Sign Up          │  ← Convert after delight
└─────────────────────────────────┘
```

**Key changes to `app/page.tsx`:**
- Move `LineageGraph` to immediately after hero (position 2, not position 8)
- Increase graph height: 300px → 600px (mobile: 400px)
- Add first-visit tooltip: pulsing amber dot on Hemingway node with "Click to explore"
- Remove stats section (showing "6 creators" undermines confidence)
- Remove feature cards (show, don't tell)

#### 1.2 Graph Interaction Upgrade

**File:** `app/components/LineageGraph.tsx`

- Add node hover state: show creator name + "Click to explore" on first hover
- Add click-to-navigate: clicking a node goes to `/creators/[slug]`
- Add subtle continuous animation: nodes gently drift (not static after load)
- Add connection highlighting: hover a node to highlight its influence lines
- Mobile: increase tap target size to 48px minimum

#### 1.3 Streak Banner for New Users

**File:** `app/components/StreakBanner.tsx`

Currently returns `null` when streak is 0. Change to:
- New users see: "Start your discovery journey — explore your first creator"
- After 1 creator viewed: "1 creator discovered! Keep going..."
- After 1 day streak: current behavior kicks in

#### 1.4 Acceptance Criteria

- [x] First-time visitor sees interactive graph within 2 seconds of page load
- [x] Clicking any graph node navigates to creator detail page
- [x] Hovering a node highlights its influence connections
- [x] New users see welcome message instead of hidden streak banner
- [x] Mobile: graph is minimum 400px tall with 48px tap targets
- [ ] Lighthouse performance score remains above 90

---

### Phase 2: "The Living Graph" — Connect Convex + Expand Content

**System goal:** Activate R1 (Content Engine) and R2 (Discovery Loop).

**Leverage point:** Going from 8 to 50+ creators is the single highest-impact change. It transforms every feature — recommendations become useful, Six Degrees becomes a game, Insights become meaningful, and the graph becomes mesmerizing.

#### 2.1 Wire Up Convex Backend

**What exists:** Complete Convex schema (8 tables), CRUD operations, AI integration, seed data, deployed at `https://powerful-ostrich-963.convex.cloud`.

**What's needed:**

1. **Remove static export constraint**
   - File: `next.config.ts`
   - Remove `output: 'export'`
   - Keep `trailingSlash: true` and `images: { unoptimized: true }` for now
   - Update Vercel deployment config if needed

2. **Add ConvexProvider to layout**
   - File: `app/layout.tsx`
   - Install: `convex` package is already in `package.json`
   - Wrap app in `ConvexProvider` alongside existing `PersistenceProvider`
   - Add `NEXT_PUBLIC_CONVEX_URL` to `.env.local`

3. **Create data adapter layer**
   - New file: `lib/convex-adapter.ts`
   - Maps Convex `creators` documents → frontend `Creator` type
   - Maps Convex `works` documents → frontend `Work` type
   - Handles `_id` ↔ `slug` translation
   - All existing components continue using `Creator`/`Work` types unchanged

4. **Create Convex data hooks**
   - New file: `lib/use-convex-data.ts`
   - `useCreators()` — replaces `import { creators } from '@/lib/data'`
   - `useCreator(slug)` — replaces `creators.find(c => c.id === slug)`
   - `useWorks()` — replaces embedded works access
   - Each hook: calls `useQuery` → adapts via `convex-adapter` → returns `Creator[]`/`Work[]`
   - Falls back to `lib/data.ts` mock data if Convex is unavailable (graceful degradation)

5. **Migrate pages incrementally**
   - Start with `/explore` (simplest — just lists creators)
   - Then `/creators/[id]` (uses `getCreator` with relationship hydration)
   - Then remaining pages
   - Keep `generateStaticParams` for creator pages using Convex `listCreators` query

#### 2.2 Expand Creator Database to 50+

**Seed data strategy — three waves:**

**Wave 1 (20 creators) — Core literary canon:**
Expand existing lineages deeper. Add the "missing links":
- Wolff, Marquez (already referenced in influences but not in data)
- Fitzgerald, Stein, Pound (Hemingway's influences)
- Chekhov (Carver's primary influence)
- Flannery O'Connor, Toni Morrison (Southern Gothic branch)
- Philip K. Dick, Octavia Butler (Sci-Fi branch)
- Paddy Chayefsky → Aaron Sorkin → Phoebe Waller-Bridge (Screenwriting branch)
- David Foster Wallace, Don DeLillo (Postmodern branch)

**Wave 2 (20 more) — Cross-genre bridges:**
- Creators that connect literary movements
- International voices (Borges, Murakami, Achebe, Rushdie)
- Contemporary voices (Ocean Vuong, Carmen Maria Machado)

**Wave 3 (10+) — User-surprising connections:**
- Cross-medium influences (novelist → screenwriter → songwriter)
- Historical chains (ancient → modern)
- These create the "aha moments" that drive sharing

**Implementation:**
- Extend `convex/seed.ts` with curated data
- Each creator needs: name, slug, bio, birth/death years, 2-3 works, verified influences
- Influence relationships must be bidirectional (if A influences B, B's `influencedBy` includes A)
- Quality bar: every influence claim should be defensible with a citation

#### 2.3 Evolve Persistence Layer

**Current:** `PersistenceProvider` uses localStorage only.
**Target:** localStorage as fast cache, Convex as source of truth when authenticated.

```
Unauthenticated user:
  Save creator → localStorage (existing behavior, unchanged)

Authenticated user:
  Save creator → localStorage (instant UI) + Convex mutation (durable)
  On login → merge localStorage state into Convex user record
  On load → hydrate from Convex, cache to localStorage
```

**Files affected:**
- `app/components/PersistenceProvider.tsx` — add Convex sync layer
- `lib/persistence.ts` — add `syncToConvex()` and `hydrateFromConvex()` functions
- Convex: add `readingList` mutations (schema already has the table)

#### 2.4 Acceptance Criteria

- [x] App loads data from Convex in real-time (verify with Convex dashboard)
- [x] 50+ creators visible on `/explore` page
- [x] Creator detail pages work for all 50+ creators
- [x] Graph visualization handles 50+ nodes without performance degradation
- [x] Recommendations improve noticeably with larger dataset
- [x] Six Degrees finds paths of 3-6 hops (not just 1-2)
- [x] Insights page shows meaningful clusters and bridges
- [x] Unauthenticated users still work perfectly (localStorage fallback)
- [x] `npm run build` succeeds with Convex integration

---

### Phase 3: "The Share Moment" — Viral Artifacts

**System goal:** Activate R4 (Viral Sharing) and R6 (Acquisition).

**The Krieger insight:** Instagram's genius wasn't the filter — it was that the filtered photo was **inherently shareable**. Every user action produced something worth showing others. Lineage Lit needs artifacts that are:

1. Beautiful enough to screenshot
2. Personal enough to feel like "mine"
3. Surprising enough to spark conversation

#### 3.1 Shareable Reading DNA Card

**Current state:** `ShareableCard` component exists in `app/components/ShareableCard.tsx`, renders a beautiful card, but is only accessible deep in the Profile page.

**Target:** Make DNA card generation a **primary interaction** accessible from multiple surfaces.

- Landing page: "Generate your Reading DNA" CTA (after graph interaction)
- Profile page: prominent "Share Your DNA" button
- After Goodreads import: auto-generate card from imported data
- After exploring 5+ creators: prompt "See your emerging Reading DNA?"

**Card enhancements:**
- Dynamic card based on actual user behavior (saved creators, liked works)
- Animated card preview (subtle glow, particles)
- One-tap share to Twitter/Instagram Stories (via Web Share API, already in `ShareButton`)
- Download as PNG for manual sharing
- Unique URL: `/dna/[userId]` — shareable link that shows the card publicly

#### 3.2 Shareable Lineage Paths

**Current state:** Six Degrees finds paths but share is basic.

**Target:** Every path discovery produces a beautiful shareable artifact.

- "Hemingway → Faulkner → McCarthy: 2 degrees of separation"
- Rendered as an elegant horizontal chain with creator portraits
- Share button generates OG image for social preview
- Unique URL: `/path/[from]/[to]` — anyone can see the path

#### 3.3 "My Literary Universe" Graph

**New feature:** Personal graph showing only creators you've saved/explored.

- Renders your personal constellation of influences
- Grows as you explore more creators
- Shareable as image or link
- Shows how your taste connects across movements and eras
- Accessible from Profile page

#### 3.4 Open Graph / Social Previews

For every shareable URL, generate rich previews:
- `/creators/[id]` — creator card with name, years, key influences
- `/dna/[userId]` — Reading DNA card image
- `/path/[from]/[to]` — lineage path visualization
- Use Convex to serve OG images or generate at build time for static paths

#### 3.5 Acceptance Criteria

- [x] Reading DNA card generates from actual user data (saved creators, explored works)
- [x] DNA card shareable via Web Share API with fallback to copy-link
- [x] Six Degrees paths produce shareable image/link
- [x] Shared URLs render rich social previews (OG tags with images)
- [ ] "My Literary Universe" graph renders on profile page
- [x] At least 3 surfaces prompt card generation (landing, profile, post-import)

---

### Phase 4: "The Community" — Real Social

**System goal:** Activate R5 (Social Proof).

**Key principle:** Don't build social features that require a crowd. Build social features that work with 2 people and scale to 2,000.

#### 4.1 Clerk Authentication

**Current state:** Clerk configured in `convex.json` but not integrated into frontend.

**Implementation:**
- Install `@clerk/nextjs`
- Add `ClerkProvider` to `app/layout.tsx`
- Sign in / Sign up flows (modal, not full page — keep exploration frictionless)
- Update Convex mutations to use `ctx.auth.getUserIdentity()`
- Gate social features behind auth, keep browsing/exploration open

**Critical UX decision:** Never gate exploration behind auth. Users should be able to:
- Browse all creators ✓ (no auth)
- Interact with graph ✓ (no auth)
- Save creators locally ✓ (no auth, localStorage)
- See recommendations ✓ (no auth)
- **Auth required for:** sharing DNA publicly, following users, activity feed, AI discovery

#### 4.2 Real Activity Feed

**Current state:** `lib/social.ts` has mock activity data.

**Target:** Real activity via Convex `activities` table (schema already defined).

- When user saves a creator → activity created
- When user completes a challenge → activity created
- When user discovers a lineage (AI) → activity created
- Feed shows activities from followed users
- Real-time updates via Convex subscriptions

#### 4.3 Real Following

- Replace mock following data with Convex mutations
- Follow/unfollow buttons on community page and profile pages
- Following feed filters activity to people you follow
- "People who saved [Creator X] also follow..." recommendations

#### 4.4 DNA Comparison (Real Users)

**Current state:** `DNAComparison` component exists but compares against mock users.

**Target:** Compare your Reading DNA with any real user.
- "Compare with [username]" on any profile
- Side-by-side DNA cards
- "You share 73% literary DNA" — quantified compatibility
- Shareable comparison cards

#### 4.5 Acceptance Criteria

- [x] Users can sign up / sign in via Clerk (modal flow)
- [x] Unauthenticated browsing works identically to current experience
- [x] Activity feed shows real actions from followed users
- [ ] Following/unfollowing persists via Convex
- [x] DNA comparison works between real authenticated users
- [ ] Auth state syncs localStorage data to Convex on first login

---

### Phase 5: "The Intelligence" — AI Lineage Discovery

**System goal:** Amplify ALL loops. AI is the flywheel accelerator.

**This is the paid feature.** It's also the content engine that scales R1 without manual curation.

#### 5.1 AI Lineage Discovery UI

**Current state:** `convex/ai.ts` has full OpenAI integration (GPT-4o-mini), processes requests, returns identified influences. Zero frontend integration.

**Target:** Beautiful UI for submitting and viewing AI lineage analysis.

**New page:** `/discover` (or integrate into existing `/recommendations`)

**Flow:**
1. User enters a book title + author (or pastes from acknowledgments page)
2. System shows "Analyzing literary DNA..." with elegant loading animation
3. Results appear: identified influences with confidence scores, related works, lineage tree
4. User can "Add to Graph" — contributing AI-discovered connections
5. Contributions go through verification queue (Convex `contributions` table)

**Free tier:** 3 discoveries per month
**Pro tier ($8/mo):** Unlimited discoveries

#### 5.2 Stripe Integration

- Convex `users` table already has `subscriptionStatus`, `stripeCustomerId`, `stripeSubscriptionId`
- Implement Stripe Checkout for Pro subscription
- Webhook to update Convex user record on subscription changes
- Usage tracking: `aiRequestsUsed` / `aiRequestsLimit` fields already in schema
- Graceful limit UX: "You've used 3/3 free discoveries this month. Upgrade to Pro for unlimited."

#### 5.3 AI-Powered Recommendations Enhancement

**Current:** `lib/recommendations.ts` uses algorithmic scoring (shared influences, genre overlap).

**Enhancement:** Supplement with AI reasoning for Pro users.
- "Based on your Reading DNA, you might love Ted Chiang because..."
- AI generates natural language explanation, not just score
- Feels like a knowledgeable friend, not an algorithm

#### 5.4 Community Verification Loop

AI discoveries feed into community verification:
1. AI suggests: "Hemingway influenced Carver" (confidence: 0.92)
2. Community votes: 👍 Agree / 👎 Disagree / 📚 Add citation
3. High-confidence, community-verified connections become permanent graph edges
4. This creates R1 at scale: AI generates → community verifies → graph grows → more discovery

#### 5.5 Acceptance Criteria

- [x] AI Lineage Discovery page accepts book title + author input
- [x] Results show identified influences with confidence scores
- [ ] Free tier limited to 3 requests/month (enforced server-side)
- [ ] Stripe Checkout flow works for Pro subscription
- [ ] Pro users get unlimited AI discoveries
- [ ] AI-discovered connections can be added to the community graph
- [ ] Usage counter visible in user profile

---

## Alternative Approaches Considered

### 1. Stay Fully Static

**Rejected because:** The static architecture is the root cause of every broken feedback loop. 8 hardcoded creators can't sustain engagement. Mock social features can't create network effects. No backend means no AI features and no revenue.

### 2. Build FastAPI + PostgreSQL + Neo4j (from ARCHITECTURE.md)

**Rejected because:** The Convex backend already exists and is deployed. Building a separate backend doubles the work for similar outcomes. Convex provides real-time subscriptions, auth integration, and serverless deployment out of the box. The FastAPI architecture is better suited for a later stage when you need fine-grained control over graph queries. Neo4j could be added alongside Convex later if graph traversal performance becomes a bottleneck.

### 3. Ship AI Features First (Before Content Expansion)

**Rejected because:** AI Lineage Discovery on a graph of 8 creators would feel empty. The AI results would have nothing to connect to. Content density must come first — it's the substrate that makes every other feature valuable.

### 4. Ship Social Features First (Before Sharing)

**Rejected because:** Social features with no users create a ghost town. Viral sharing must come before social — sharing brings users in, then social retains them. Instagram launched filters (creation + sharing) before the social feed became the primary experience.

---

## Success Metrics

### North Star Metric
**Weekly Active Explorers** — users who view 3+ creator profiles per week.

### Phase Metrics

| Phase | Metric | Target |
|-------|--------|--------|
| Phase 1 | Time-to-first-interaction on landing page | < 5 seconds |
| Phase 1 | Creator profile views per session | 3+ (up from ~1) |
| Phase 2 | Average session duration | 4+ minutes |
| Phase 2 | Recommendation click-through rate | > 25% |
| Phase 3 | DNA cards generated per week | 50+ |
| Phase 3 | Shared artifacts per week | 20+ |
| Phase 4 | Users with 1+ follow | > 40% of authenticated |
| Phase 4 | Return visits within 7 days | > 30% |
| Phase 5 | AI discovery requests per week | 100+ |
| Phase 5 | Pro conversion rate | > 3% of active users |

### System Health Indicators

- **R1 (Content Engine):** Creators in graph growing week-over-week
- **R2 (Discovery):** Avg. creators explored per session trending up
- **R3 (Aha Moment):** % of visitors who view 2+ creators on first visit
- **R4 (Viral):** Shared artifacts per active user
- **R5 (Social):** Activity feed engagement rate
- **R6 (Acquisition):** % of new users arriving via shared link

---

## Dependencies & Prerequisites

### Technical Prerequisites
- [x] Convex deployment active at `https://powerful-ostrich-963.convex.cloud` ✅ (confirmed)
- [ ] `NEXT_PUBLIC_CONVEX_URL` environment variable configured
- [ ] `OPENAI_API_KEY` set in Convex dashboard (for Phase 5)
- [ ] Clerk application created and configured (for Phase 4)
- [ ] Stripe account with product/price configured (for Phase 5)
- [ ] Vercel deployment updated for non-static mode (Phase 2)

### Content Prerequisites
- [x] 50+ creators researched with verified influence relationships
- [x] Each creator has: name, slug, bio, birth/death years, 2-3 works, influences
- [x] Influence data sourced from: author interviews, acknowledgment pages, literary criticism
- [ ] Data entered into `convex/seed.ts` or bulk import script

### Design Prerequisites
- [ ] OG image templates for shareable artifacts (DNA cards, paths, creator cards)
- [ ] Loading/transition animations for Convex data fetching
- [ ] Auth modal designs (sign in, sign up, upgrade to Pro)
- [ ] Empty states for new authenticated users (no followers, no activity)

---

## Risk Analysis & Mitigation

### High Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| Removing `output: 'export'` breaks deployment | All pages down | Test in preview deployment first. Keep static generation for all current pages. Only add client-side Convex queries. |
| Graph performance with 50+ nodes | Slow/janky graph | Profile LineageGraph with 50 nodes. Add level-of-detail: show only 2-hop neighborhood by default, full graph on zoom out. |
| Convex cold starts slow first load | Poor first impression | Pre-seed common queries. Use localStorage as instant cache while Convex hydrates. Show skeleton UI during load. |

### Medium Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| Clerk + Convex auth integration complexity | Delayed Phase 4 | Follow Convex's official Clerk integration guide. Test auth flow in isolation before integrating. |
| Content quality at 50+ creators | Bad data undermines trust | Manual curation for Wave 1 (20 core). Community verification for later waves. "Verified" badge for curated creators. |
| AI hallucination in lineage discovery | Wrong influence claims | Always show confidence scores. Community verification required. Label AI-discovered connections distinctly. |

### Low Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| Stripe integration complexity | Delayed monetization | Stripe + Convex is well-documented. Can soft-launch Pro as "coming soon" while building. |
| Feature complexity overwhelms users | Confusion, churn | Progressive disclosure: new features appear as users engage more. Don't show AI discovery until 5+ creators explored. |

---

## Future Considerations

### Post-Phase 5 Opportunities

- **Embeddable widgets** — "Add your literary lineage to your blog/portfolio"
- **Chrome extension** — "See the lineage of any book on Amazon/Goodreads"
- **Public API** — let developers build on the lineage graph
- **Publisher partnerships** — "Discover the lineage behind [new book]" as marketing tool
- **Educational tier** — classrooms exploring literary influence for curriculum
- **Neo4j migration** — when graph traversal performance demands it, move relationship queries to a dedicated graph database alongside Convex

### Systems Evolution

As the system matures, new reinforcing loops emerge:
- **R7: Creator Network Effects** — more creators in graph → more paths between any two → more "aha moments" → more sharing → more users → more AI discoveries → more creators
- **R8: Data Moat** — verified influence relationships become proprietary dataset no competitor can replicate
- **R9: Taste Graph** — aggregated user preferences reveal which literary connections resonate most → improve recommendations → increase engagement

---

## References & Research

### Internal References
- Convex schema: `convex/schema.ts` (8 tables, fully indexed)
- Convex AI integration: `convex/ai.ts` (GPT-4o-mini, mock fallback)
- Convex seed data: `convex/seed.ts` (6 creators ready)
- Current data model: `lib/data.ts` (8 creators, 14 works)
- Persistence layer: `lib/persistence.ts` + `app/components/PersistenceProvider.tsx`
- Graph visualization: `app/components/LineageGraph.tsx` (custom SVG, 269 lines)
- Landing page: `app/page.tsx`
- Planned architecture: `docs/ARCHITECTURE.md` (FastAPI + Neo4j — not yet implemented)
- Revenue roadmap: `README.md` (Pro at $8/mo, AI discovery as core paid feature)
- Exploration ideas: `EXPLORATION.md` (Gutenberg, sitcom lineage, constellation maps)

### External References
- Convex + Clerk integration: https://docs.convex.dev/auth/clerk
- Convex + Next.js setup: https://docs.convex.dev/quickstart/nextjs
- Stripe + Convex webhooks: https://docs.convex.dev/production/integrations/stripe
- Web Share API: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share

### Architectural Inspiration
- Instagram's "filter-first" design philosophy (instant delight before commitment)
- Spotify Wrapped (shareable personal data artifacts driving viral acquisition)
- Obsidian's graph view (personal knowledge graph as primary navigation)
- Goodreads' import flow (bridging existing reading data into a new ecosystem)

---

*Plan authored 2026-02-11. Systems-driven approach inspired by Donella Meadows' "Thinking in Systems" and Mike Krieger's product philosophy at Instagram.*
