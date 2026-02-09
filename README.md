# Lineage Lit

**Discover the creative DNA of books, screenplays, and articles.**

Track how ideas flow from creator to creator. See who influenced your favorite writers and what they inspired.

## 🚀 Live Demo

[https://lineage-lit.vercel.app](https://lineage-lit.vercel.app)

## 💰 Business Model

### Free Tier
- Browse existing lineage database
- Basic recommendations
- View community activity
- Limited Goodreads import (50 books)

### Pro ($8/month)
- **AI Lineage Discovery** - Upload any work, get full influence tree
- Unlimited Goodreads imports with AI analysis
- Export lineage graphs (PDF, PNG)
- Advanced recommendations
- Priority support

### Usage Credits
- $0.50 per additional AI discovery beyond plan limits

## 🏗️ Architecture

**Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind CSS

**Backend:** Convex (real-time, serverless)
- Instant sync across users
- No infrastructure to manage
- Scales automatically

**AI:** OpenAI GPT-4 for lineage analysis

**Auth:** Clerk

**Payments:** Stripe

## 🎯 Revenue-First Roadmap

### Week 1: Revenue-Ready MVP
- [x] Convex backend with creator/works schema
- [x] AI lineage discovery (paid feature)
- [ ] Stripe integration
- [ ] Usage tracking & limits
- [ ] Launch with 6 seed creators

### Week 2: Growth
- [ ] Expand to 50 creators (AI + scraping)
- [ ] Goodreads import with AI recommendations
- [ ] Referral system ($5 credit per referral)
- [ ] Content marketing ("The Hemingway Lineage" blog posts)

### Week 3: Engagement
- [ ] Real-time collaborative editing
- [ ] Community challenges ("Map the sci-fi lineage")
- [ ] Public API for researchers
- [ ] University/education pricing

### Week 4: Scale
- [ ] Mobile app (React Native)
- [ ] Chrome extension ("Show lineage on Goodreads/Amazon")
- [ ] Publisher partnerships
- [ ] Seed funding pitch

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your Convex, Clerk, OpenAI, and Stripe keys

# Run Convex dev server (terminal 1)
npx convex dev

# Run Next.js dev server (terminal 2)
npm run dev
```

## 📝 AI Lineage Discovery

Our killer paid feature:

1. **Upload** a book's acknowledgments, preface, or bibliography
2. **AI analyzes** the text for influence claims and stylistic similarities
3. **Discover** the full creative lineage with confidence scores
4. **Explore** connections in the interactive graph

**Example:**
> "The Road by Cormac McCarthy"
> 
> **Identified Influences:**
> - Ernest Hemingway (confidence: 92%) - Sparse prose, iceberg theory
> - Herman Melville (confidence: 67%) - Biblical themes, American mythology
> - T.S. Eliot (confidence: 54%) - Waste Land imagery, fragmentary narrative

## 🤝 Contributing

Lineage Lit is community-driven. Submit influence claims, add creators, or verify connections.

**For curators:** We're building a verification system with reputation scores.

## 📧 Contact

- Twitter: [@lineagelit](https://twitter.com/lineagelit)
- Email: spark.the.agent@protonmail.com

---

Built with ⚡ by Spark Moonclaw
