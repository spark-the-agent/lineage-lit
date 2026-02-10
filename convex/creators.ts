import { v, type GenericId } from "convex/values";
import { query, mutation } from "./_generated/server";
import { internal } from "./_generated/api";

// ============== QUERIES ==============

// List all creators
export const listCreators = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("creators").order("desc").take(100);
  },
});

// Search creators by name
export const searchCreators = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const allCreators = await ctx.db.query("creators").collect();
    const lowerQuery = args.query.toLowerCase();
    return allCreators.filter(c => 
      c.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 20);
  },
});

// Get creator by slug with their works
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
    
    // Get influence relationships (full objects)
    const influencedBy = await Promise.all(
      creator.influencedBy.map(async (slug: string) => {
        const c = await ctx.db
          .query("creators")
          .withIndex("by_slug", (q) => q.eq("slug", slug))
          .unique();
        return c ? { id: c._id, slug: c.slug, name: c.name } : null;
      })
    );
    
    const influenced = await Promise.all(
      creator.influenced.map(async (slug: string) => {
        const c = await ctx.db
          .query("creators")
          .withIndex("by_slug", (q) => q.eq("slug", slug))
          .unique();
        return c ? { id: c._id, slug: c.slug, name: c.name } : null;
      })
    );
    
    return {
      ...creator,
      works,
      influencedBy: influencedBy.filter(Boolean),
      influenced: influenced.filter(Boolean),
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
    
    // Get influence relationships
    const influences = await Promise.all(
      work.influences.map((id: GenericId<"works">) => ctx.db.get(id))
    );
    const influenced = await Promise.all(
      work.influenced.map((id: GenericId<"works">) => ctx.db.get(id))
    );
    
    return {
      ...work,
      creator,
      influences: influences.filter(Boolean),
      influenced: influenced.filter(Boolean),
    };
  },
});

// ============== MUTATIONS ==============

// Create a creator (admin/curator only - add auth check in production)
export const createCreator = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    bio: v.string(),
    birthYear: v.optional(v.number()),
    deathYear: v.optional(v.number()),
    nationality: v.optional(v.string()),
    influencedBy: v.optional(v.array(v.string())),
    influenced: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("creators", {
      ...args,
      influencedBy: args.influencedBy || [],
      influenced: args.influenced || [],
      verified: false,
      aiGenerated: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Create a work
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
      v.literal("poem")
    ),
    description: v.string(),
    creatorId: v.id("creators"),
    genre: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("works", {
      ...args,
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

// Submit a lineage discovery request
export const requestLineageDiscovery = mutation({
  args: {
    workTitle: v.string(),
    workAuthor: v.optional(v.string()),
    workType: v.optional(v.string()),
    sourceText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // TODO: Check user subscription status and limits
    // For now, just create the request
    
    const requestId = await ctx.db.insert("lineageRequests", {
      // This will be set after auth is added
      userId: "temp" as GenericId<"users">, // Placeholder until auth is added
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

// Get user's lineage requests
export const getMyLineageRequests = query({
  args: {},
  handler: async (ctx) => {
    // TODO: Get actual user ID from auth
    return await ctx.db
      .query("lineageRequests")
      .order("desc")
      .take(20);
  },
});
