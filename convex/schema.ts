import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Lineage Lit - Convex Schema
// Tracks creative lineage of books, screenplays, and articles

export default defineSchema({
  // Creators (authors, screenwriters, etc.)
  creators: defineTable({
    name: v.string(),
    slug: v.string(), // URL-friendly ID (primary lookup key)
    years: v.string(), // Display string: "1899–1961" or "b. 1987"
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
    .index("by_name", ["name"])
    .searchIndex("search_name", { searchField: "name" }),

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
    tokenIdentifier: v.string(), // Clerk JWT token identifier for auth
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    // User state (viewedCreators kept on user doc, capped at 100)
    viewedCreators: v.array(
      v.object({ slug: v.string(), timestamp: v.number() }),
    ),
    streakData: v.object({
      currentStreak: v.number(),
      longestStreak: v.number(),
      lastVisitDate: v.string(), // YYYY-MM-DD
      streakStartDate: v.string(),
    }),
    achievements: v.array(v.object({ id: v.string(), unlockedAt: v.number() })),
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
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),

  // Junction table: saved creators (replaces array on users)
  savedCreators: defineTable({
    userId: v.id("users"),
    creatorSlug: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_slug", ["userId", "creatorSlug"]),

  // Junction table: liked works (replaces array on users)
  likedWorks: defineTable({
    userId: v.id("users"),
    workSlug: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_slug", ["userId", "workSlug"]),

  // Follows (separate table for bi-directional queries)
  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_pair", ["followerId", "followingId"]),

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
      v.literal("saved_creator"),
      v.literal("liked_work"),
      v.literal("followed_user"),
      v.literal("followed_creator"),
      v.literal("read_work"),
      v.literal("shared_lineage"),
      v.literal("discovered_lineage"),
      v.literal("contributed"),
    ),
    targetType: v.optional(v.string()), // "creator" | "work" | "user"
    targetId: v.optional(v.string()), // slug or user ID
    targetName: v.optional(v.string()), // display name
    metadata: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created", ["createdAt"])
    .index("by_user_created", ["userId", "createdAt"]),
});
