import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Lineage Lit - Convex Schema
// Tracks creative lineage of books, screenplays, and articles

export default defineSchema({
  // Creators (authors, screenwriters, etc.)
  creators: defineTable({
    name: v.string(),
    slug: v.string(), // URL-friendly ID
    bio: v.string(),
    birthYear: v.optional(v.number()),
    deathYear: v.optional(v.number()),
    nationality: v.optional(v.string()),
    // Influence relationships (arrays of creator slugs)
    influencedBy: v.array(v.string()),
    influenced: v.array(v.string()),
    // Metadata
    verified: v.boolean(), // Curator verified
    aiGenerated: v.boolean(), // Flag AI-generated bios
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_name", ["name"]),

  // Works (books, articles, screenplays)
  works: defineTable({
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
    // Lineage
    influences: v.array(v.id("works")), // What inspired this
    influenced: v.array(v.id("works")), // What this inspired
    // Content for AI analysis
    summary: v.optional(v.string()),
    themes: v.array(v.string()),
    genre: v.optional(v.string()),
    // Metadata
    verified: v.boolean(),
    aiGenerated: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_creator", ["creatorId"])
    .index("by_type", ["type"]),

  // Users (authenticated via Clerk)
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    // Subscription
    subscriptionStatus: v.union(
      v.literal("free"),
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due"),
    ),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    // Usage tracking
    aiRequestsUsed: v.number(), // Monthly AI requests
    aiRequestsLimit: v.number(),
    createdAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // User's reading list
  readingList: defineTable({
    userId: v.id("users"),
    workId: v.id("works"),
    status: v.union(
      v.literal("want_to_read"),
      v.literal("reading"),
      v.literal("read"),
      v.literal("dnf"),
    ),
    rating: v.optional(v.number()), // 1-5
    review: v.optional(v.string()),
    finishedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_work", ["userId", "workId"]),

  // AI Lineage Discovery Queue (paid feature)
  lineageRequests: defineTable({
    userId: v.id("users"),
    workTitle: v.string(),
    workAuthor: v.optional(v.string()),
    workType: v.optional(v.string()),
    // Input text (acknowledgments, preface, etc.)
    sourceText: v.optional(v.string()),
    // Processing
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed"),
    ),
    // Results
    result: v.optional(
      v.object({
        identifiedInfluences: v.array(
          v.object({
            name: v.string(),
            confidence: v.number(),
            evidence: v.string(),
          }),
        ),
        relatedWorks: v.array(v.string()),
        lineageTree: v.optional(v.string()), // JSON string
      }),
    ),
    error: v.optional(v.string()),
    // Cost tracking
    tokensUsed: v.optional(v.number()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  // Community contributions (pending verification)
  contributions: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("new_creator"),
      v.literal("new_work"),
      v.literal("influence_claim"),
    ),
    targetId: v.optional(v.id("creators")), // For influence claims
    data: v.string(), // JSON blob
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
    ),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  // Activity feed
  activities: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("joined"),
      v.literal("added_reading"),
      v.literal("rated_work"),
      v.literal("discovered_lineage"),
      v.literal("contributed"),
    ),
    targetType: v.optional(v.string()), // "creator" | "work"
    targetId: v.optional(v.string()),
    metadata: v.optional(v.string()), // JSON
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created", ["createdAt"]),
});
