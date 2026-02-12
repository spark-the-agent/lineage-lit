# Architecture

## Current Backend: Convex

The app uses **Convex** as its backend: real-time, serverless, with schema, CRUD, AI integration, and seed data. The frontend uses `lib/convex-adapter.ts` and `lib/use-convex-data.ts` to talk to Convex when `NEXT_PUBLIC_CONVEX_URL` is set, and falls back to static mock data otherwise.

```
┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Convex        │
│   (Next.js)     │     │   (real-time DB │
│   + localStorage│     │   + functions   │
└─────────────────┘     │   + AI actions) │
        │               └─────────────────┘
        ▼
┌─────────────────┐
│   Visualization │
│   (custom SVG)  │
└─────────────────┘
```

See `convex/schema.ts`, `convex/README.md`, and the phase-two plan in `docs/plans/` for Convex-specific design.

---

## Deferred Stack (FastAPI + PostgreSQL + Neo4j)

The original plan below is **not implemented**. It remains as a possible future path when you need fine-grained graph queries or dedicated graph DB traversal. Neo4j could be added alongside Convex later if graph performance demands it.

### System Overview (deferred)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │────▶│   Database      │
│   (React)       │     │   (FastAPI)     │     │   (PostgreSQL)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       ▼
        │              ┌─────────────────┐
        │              │   Graph DB      │
        │              │   (Neo4j)       │
        │              └─────────────────┘
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│   Visualization │     │   ML/Rec        │
│   (D3/Cytoscape)│     │   (Python)      │
└─────────────────┘     └─────────────────┘
```

## Data Model

### Core Entities

```
Creator (Author/Screenwriter/Writer)
├── id: UUID
├── name: String
├── bio: Text
├── birth_date: Date
├── death_date: Date (optional)
├── nationality: String
├── influences: [Creator] (many-to-many)
├── influenced: [Creator] (many-to-many, reverse)
└── works: [Work]

Work (Book/Article/Screenplay)
├── id: UUID
├── title: String
├── type: Enum [BOOK, ARTICLE, SCREENPLAY, ESSAY]
├── publication_date: Date
├── description: Text
├── creators: [Creator] (many-to-many)
├── themes: [String]
├── genre: String
├── influences: [Work] (many-to-many, what inspired this)
├── influenced: [Work] (many-to-many, reverse)
└── lineage_score: Float (how well-documented is lineage)

Influence (Relationship)
├── source: Creator|Work
├── target: Creator|Work
├── type: Enum [MENTORSHIP, INSPIRATION, QUOTATION, STYLE]
├── strength: Int (1-10)
├── evidence: Text (quote, citation, etc.)
└── verified: Bool

User
├── id: UUID
├── email: String
├── reading_list: [UserWork]
├── discovered_creators: [Creator]
└── influence_preferences: JSON (what resonates)

UserWork (Reading tracking)
├── user: User
├── work: Work
├── status: Enum [WANT_TO_READ, READING, READ, DNF]
├── rating: Int (1-5)
├── review: Text
├── finished_date: Date
└── notes: Text
```

## API Endpoints (Draft)

### Works

- `GET /works` - List works (filter by type, genre, date)
- `GET /works/{id}` - Get work details with lineage
- `GET /works/{id}/lineage` - Get influence tree
- `POST /works` - Create work (admin/curator)

### Creators

- `GET /creators` - List creators
- `GET /creators/{id}` - Get creator with works and influences
- `GET /creators/{id}/network` - Get influence network graph
- `POST /creators` - Create creator

### Influences

- `GET /influences` - List influence relationships
- `POST /influences` - Add influence (with evidence)
- `GET /influences/verify` - Queue for verification

### Recommendations

- `GET /recommendations/for-you` - Based on reading history
- `GET /recommendations/similar-to/{work_id}` - Similar by lineage
- `GET /recommendations/by-influence/{creator_id}` - Same influences

### Users

- `POST /auth/register`
- `POST /auth/login`
- `GET /users/me`
- `GET /users/me/reading-list`
- `POST /users/me/reading-list` - Add to reading list

## Graph Queries (Neo4j)

```cypher
// Find influence path between two creators
MATCH path = shortestPath(
  (a:Creator {name: "Hemingway"})-[:INFLUENCED_BY*]->(b:Creator {name: "Carver"})
)
RETURN path

// Find creators influenced by same sources as user likes
MATCH (u:User {id: $user_id})-[:RATED {rating: 5}]->(w:Work)<-[:CREATED]-(c:Creator)
MATCH (c)-[:INFLUENCED_BY]->(influence:Creator)
MATCH (similar:Creator)-[:INFLUENCED_BY]->(influence)
WHERE similar <> c
RETURN similar, count(influence) as shared_influences
ORDER BY shared_influences DESC
LIMIT 10

// Get complete lineage tree for a work
MATCH (w:Work {id: $work_id})
MATCH path = (w)-[:INFLUENCED_BY*1..5]->(ancestor:Work)
RETURN path
```

## Tech Decisions

### Why Neo4j for Graph?

- Native graph operations
- Efficient shortest-path queries
- Natural fit for lineage/hierarchy
- Can visualize directly

### Why PostgreSQL?

- User data, reading lists (relational)
- Search/indexing
- ACID compliance for critical data
- Familiar, well-supported

### Hybrid Approach

- Postgres stores core entities and user data
- Neo4j stores relationships (influences, lineage)
- Sync via backend events

## MVP Scope

**Week 1:**

- Setup repo structure
- Design mockups (Figma or similar)
- Define 50 initial works with lineage

**Week 2:**

- Basic FastAPI backend
- PostgreSQL schema
- Simple React frontend

**Week 3:**

- Neo4j integration
- Graph visualization
- Influence tracking UI

_Current product uses Convex + static export; see phase-two plan for rollout._

---

_Architecture by Spark ⚡_
