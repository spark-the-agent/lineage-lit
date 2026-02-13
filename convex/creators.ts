import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUser } from "./lib/auth";

// ============== QUERIES ==============

// List all creators with their works embedded
export const listCreators = query({
  args: {},
  handler: async (ctx) => {
    const creators = await ctx.db.query("creators").order("desc").take(100);

    // Embed works for each creator (capped at 10 per creator)
    const creatorsWithWorks = await Promise.all(
      creators.map(async (creator) => {
        const works = await ctx.db
          .query("works")
          .withIndex("by_creator", (q) => q.eq("creatorId", creator._id))
          .take(10);

        return {
          slug: creator.slug,
          name: creator.name,
          years: creator.years,
          bio: creator.bio,
          influencedBy: creator.influencedBy,
          influenced: creator.influenced,
          works: works.map((w) => ({
            slug: w.slug,
            title: w.title,
            year: w.year,
            type: w.type,
            description: w.description,
          })),
        };
      }),
    );

    return creatorsWithWorks;
  },
});

// Search creators by name using Convex search index
export const searchCreators = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const sanitized = args.query.trim().slice(0, 100);
    if (sanitized.length < 2) return [];

    const results = await ctx.db
      .query("creators")
      .withSearchIndex("search_name", (q) => q.search("name", sanitized))
      .take(20);

    return results.map((c) => ({
      slug: c.slug,
      name: c.name,
      years: c.years,
      bio: c.bio,
      influencedBy: c.influencedBy,
      influenced: c.influenced,
    }));
  },
});

// Get creator by slug with their works and resolved influences
export const getCreator = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const creator = await ctx.db
      .query("creators")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!creator) return null;

    // Get works
    const works = await ctx.db
      .query("works")
      .withIndex("by_creator", (q) => q.eq("creatorId", creator._id))
      .collect();

    // Resolve influence slugs to { slug, name }
    // For small lists, use indexed lookups; for larger lists, scan and build map
    const allSlugs = [...creator.influencedBy, ...creator.influenced];
    const cappedSlugs = allSlugs.slice(0, 100);

    let slugToDoc: Map<string, { slug: string; name: string }>;

    if (cappedSlugs.length <= 5) {
      // Individual indexed lookups for small lists
      const docs = await Promise.all(
        cappedSlugs.map(async (slug) => {
          const c = await ctx.db
            .query("creators")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .unique();
          return c ? { slug: c.slug, name: c.name } : null;
        }),
      );
      slugToDoc = new Map(docs.filter(Boolean).map((d) => [d!.slug, d!]));
    } else {
      // Full scan for larger lists (creator table is small <200 docs)
      const allCreators = await ctx.db.query("creators").collect();
      const slugSet = new Set(cappedSlugs);
      slugToDoc = new Map(
        allCreators
          .filter((c) => slugSet.has(c.slug))
          .map((c) => [c.slug, { slug: c.slug, name: c.name }]),
      );
    }

    const resolveFromMap = (slugs: string[]) =>
      slugs
        .slice(0, 50)
        .map((s) => slugToDoc.get(s))
        .filter(Boolean);

    return {
      slug: creator.slug,
      name: creator.name,
      years: creator.years,
      bio: creator.bio,
      influencedBy: creator.influencedBy,
      influenced: creator.influenced,
      works: works.map((w) => ({
        slug: w.slug,
        title: w.title,
        year: w.year ?? 0,
        type: w.type,
        description: w.description,
      })),
      // Resolved relations for detail pages
      influencedByResolved: resolveFromMap(creator.influencedBy),
      influencedResolved: resolveFromMap(creator.influenced),
    };
  },
});

// Get work by slug
export const getWork = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const work = await ctx.db
      .query("works")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!work) return null;

    const creator = await ctx.db.get(work.creatorId);

    return {
      slug: work.slug,
      title: work.title,
      year: work.year ?? 0,
      type: work.type,
      description: work.description,
      creator: creator ? { slug: creator.slug, name: creator.name } : null,
    };
  },
});

// ============== MUTATIONS ==============

// Create a creator (auth-gated)
export const createCreator = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    years: v.string(),
    bio: v.string(),
    birthYear: v.optional(v.number()),
    deathYear: v.optional(v.number()),
    nationality: v.optional(v.string()),
    influencedBy: v.optional(v.array(v.string())),
    influenced: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await getAuthUser(ctx); // Auth gate

    const now = Date.now();
    return await ctx.db.insert("creators", {
      name: args.name,
      slug: args.slug,
      years: args.years,
      bio: args.bio,
      birthYear: args.birthYear,
      deathYear: args.deathYear,
      nationality: args.nationality,
      influencedBy: args.influencedBy ?? [],
      influenced: args.influenced ?? [],
      verified: false,
      aiGenerated: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Create a work (auth-gated)
export const createWork = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    year: v.optional(v.number()),
    type: v.union(
      v.literal("book"),
      v.literal("article"),
      v.literal("screenplay"),
      v.literal("essay"),
      v.literal("poem"),
    ),
    description: v.string(),
    creatorId: v.id("creators"),
    genre: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getAuthUser(ctx); // Auth gate

    return await ctx.db.insert("works", {
      title: args.title,
      slug: args.slug,
      year: args.year,
      type: args.type,
      description: args.description,
      creatorId: args.creatorId,
      genre: args.genre,
      influences: [],
      influenced: [],
      themes: [],
      verified: false,
      aiGenerated: false,
      createdAt: Date.now(),
    });
  },
});

// ============== AI LINEAGE DISCOVERY (PAID FEATURE) ==============

// Submit a lineage discovery request (auth-gated + rate-limited)
export const requestLineageDiscovery = mutation({
  args: {
    workTitle: v.string(),
    workAuthor: v.optional(v.string()),
    workType: v.optional(v.string()),
    sourceText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    // Rate limit: check AI request budget
    if (user.aiRequestsUsed >= user.aiRequestsLimit) {
      throw new Error(
        `AI request limit reached (${user.aiRequestsLimit}). Upgrade your plan for more requests.`,
      );
    }

    // Increment usage atomically in the same mutation
    await ctx.db.patch(user._id, {
      aiRequestsUsed: user.aiRequestsUsed + 1,
    });

    const requestId = await ctx.db.insert("lineageRequests", {
      userId: user._id,
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });

    // Schedule AI processing
    await ctx.scheduler.runAfter(0, internal.ai.processLineageRequest, {
      requestId,
    });

    return requestId;
  },
});

// Get user's lineage requests (auth-gated)
export const getMyLineageRequests = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return [];

    return await ctx.db
      .query("lineageRequests")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(20);
  },
});
