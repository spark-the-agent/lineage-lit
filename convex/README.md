# Lineage Lit - Convex Backend

Real-time backend for Lineage Lit using [Convex](https://convex.dev).

## Quick Start

```bash
# 1. Install Convex CLI globally
npm install -g convex

# 2. Login to Convex
npx convex dev

# 3. Deploy (in separate terminal)
npx convex dev
```

## Schema

### Core Entities

- **creators** - Authors, screenwriters, etc.
- **works** - Books, articles, screenplays
- **users** - Authenticated users (via Clerk)
- **readingList** - User's saved works
- **lineageRequests** - AI lineage discovery queue (PAID FEATURE)

### Key Relationships

- Creators have `influencedBy` and `influenced` arrays (slug references)
- Works have `influences` and `influenced` arrays (document IDs)
- Users can have reading lists and lineage discovery requests

## Functions

### Queries

- `creators.listCreators()` - List all creators
- `creators.searchCreators({ query })` - Search by name
- `creators.getCreator({ slug })` - Get creator with works & influences
- `creators.getWork({ slug })` - Get work with creator & lineage

### Mutations

- `creators.createCreator({ ... })` - Add new creator
- `creators.createWork({ ... })` - Add new work
- `creators.requestLineageDiscovery({ ... })` - Submit AI discovery request (PAID)

### AI Actions

- `ai.processLineageRequest` - Internal: calls OpenAI to analyze lineage

## Paid Feature: AI Lineage Discovery

**How it works:**
1. User submits work title + optional text (acknowledgments, preface)
2. Request queued in `lineageRequests` table
3. Convex action calls OpenAI GPT-4
4. Results stored with identified influences, confidence scores, evidence
5. User sees full lineage tree

**Revenue model:**
- Free: 3 AI discoveries/month
- Pro ($8/mo): Unlimited + advanced analysis
- Credit system: $0.50 per additional discovery

## Environment Variables

Add to `.env.local`:

```
# Convex
CONVEX_DEPLOYMENT=dev:your-deployment-name

# Clerk (Auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# OpenAI (AI features)
OPENAI_API_KEY=sk-...

# Stripe (Payments)
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Seeding Data

```bash
# Run in Convex dashboard or via CLI
npx convex run seed:seedDatabase
```

This migrates the 6 seed creators from the mock data.

## Next Steps

1. [ ] Set up Clerk authentication
2. [ ] Connect frontend to Convex (replace mock data)
3. [ ] Add Stripe integration
4. [ ] Implement usage limits per subscription tier
5. [ ] Add real-time subscriptions for collaborative editing
