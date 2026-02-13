import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUser } from "./lib/auth";

// ============== QUERIES ==============

// Get the current authenticated user's full document.
// Auth-gated — only the signed-in user can access their own data.
export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return null;

    // Fetch saved creators and liked works from junction tables
    const savedCreators = await ctx.db
      .query("savedCreators")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const likedWorks = await ctx.db
      .query("likedWorks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return {
      ...user,
      savedCreators: savedCreators.map((s) => s.creatorSlug),
      likedWorks: likedWorks.map((l) => l.workSlug),
    };
  },
});

// Get a user's public profile by Convex ID (for other users' profiles).
// Returns only public-safe fields.
export const getPublicProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    return {
      _id: user._id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      achievements: user.achievements,
      createdAt: user.createdAt,
    };
  },
});

// Check if a creator is saved by the current user
export const isSaved = query({
  args: { creatorSlug: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return false;

    const saved = await ctx.db
      .query("savedCreators")
      .withIndex("by_user_slug", (q) =>
        q.eq("userId", user._id).eq("creatorSlug", args.creatorSlug),
      )
      .unique();

    return saved !== null;
  },
});

// Check if a work is liked by the current user
export const isLiked = query({
  args: { workSlug: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return false;

    const liked = await ctx.db
      .query("likedWorks")
      .withIndex("by_user_slug", (q) =>
        q.eq("userId", user._id).eq("workSlug", args.workSlug),
      )
      .unique();

    return liked !== null;
  },
});

// Get all saved creator slugs for the current user
export const getSavedCreators = query({
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

    const saved = await ctx.db
      .query("savedCreators")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return saved.map((s) => s.creatorSlug);
  },
});

// Get all liked work slugs for the current user
export const getLikedWorks = query({
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

    const liked = await ctx.db
      .query("likedWorks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return liked.map((l) => l.workSlug);
  },
});

// Get followers for a user
export const getFollowers = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.userId))
      .collect();

    // Batch user lookups — collect unique IDs, fetch once
    const userIds = [...new Set(follows.map((f) => f.followerId))];
    const users = await Promise.all(userIds.map((id) => ctx.db.get(id)));
    const userMap = new Map(users.filter(Boolean).map((u) => [u!._id, u!]));

    return follows
      .map((f) => {
        const user = userMap.get(f.followerId);
        return user
          ? { _id: user._id, name: user.name, avatarUrl: user.avatarUrl }
          : null;
      })
      .filter(Boolean);
  },
});

// Get who a user is following
export const getFollowing = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
      .collect();

    // Batch user lookups
    const userIds = [...new Set(follows.map((f) => f.followingId))];
    const users = await Promise.all(userIds.map((id) => ctx.db.get(id)));
    const userMap = new Map(users.filter(Boolean).map((u) => [u!._id, u!]));

    return follows
      .map((f) => {
        const user = userMap.get(f.followingId);
        return user
          ? { _id: user._id, name: user.name, avatarUrl: user.avatarUrl }
          : null;
      })
      .filter(Boolean);
  },
});

// ============== MUTATIONS ==============

// Create or retrieve a user after Clerk authentication.
// Idempotent — safe to call on every sign-in.
// Auth-gated: uses the JWT identity, no clerkId arg needed.
export const getOrCreate = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // Check if user already exists by tokenIdentifier
    const existing = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (existing) {
      // Update name/avatar if they changed in Clerk
      if (
        args.name !== existing.name ||
        args.avatarUrl !== existing.avatarUrl
      ) {
        await ctx.db.patch(existing._id, {
          name: args.name,
          avatarUrl: args.avatarUrl,
        });
      }
      return existing._id;
    }

    // Create new user with default state
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject, // Clerk user ID from JWT
      tokenIdentifier: identity.tokenIdentifier,
      email: args.email,
      name: args.name,
      avatarUrl: args.avatarUrl,
      viewedCreators: [],
      streakData: {
        currentStreak: 0,
        longestStreak: 0,
        lastVisitDate: "",
        streakStartDate: "",
      },
      achievements: [],
      subscriptionStatus: "free",
      aiRequestsUsed: 0,
      aiRequestsLimit: 3,
      createdAt: Date.now(),
    });

    // Record "joined" activity
    await ctx.db.insert("activities", {
      userId,
      type: "joined",
      createdAt: Date.now(),
    });

    return userId;
  },
});
