import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUser } from "./lib/auth";

// ============== SAVE / LIKE / VIEW ==============

// Toggle a saved creator. Returns the new saved state.
export const toggleSaveCreator = mutation({
  args: {
    creatorSlug: v.string(),
    creatorName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    // Check junction table for existing save
    const existing = await ctx.db
      .query("savedCreators")
      .withIndex("by_user_slug", (q) =>
        q.eq("userId", user._id).eq("creatorSlug", args.creatorSlug),
      )
      .unique();

    if (existing) {
      // Unsave
      await ctx.db.delete(existing._id);
      return false;
    }

    // Save
    await ctx.db.insert("savedCreators", {
      userId: user._id,
      creatorSlug: args.creatorSlug,
      createdAt: Date.now(),
    });

    // Record activity on save
    await ctx.db.insert("activities", {
      userId: user._id,
      type: "saved_creator",
      targetType: "creator",
      targetId: args.creatorSlug,
      targetName: args.creatorName,
      createdAt: Date.now(),
    });

    return true;
  },
});

// Toggle a liked work. Returns the new liked state.
export const toggleLikeWork = mutation({
  args: {
    workSlug: v.string(),
    workTitle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    // Check junction table for existing like
    const existing = await ctx.db
      .query("likedWorks")
      .withIndex("by_user_slug", (q) =>
        q.eq("userId", user._id).eq("workSlug", args.workSlug),
      )
      .unique();

    if (existing) {
      // Unlike
      await ctx.db.delete(existing._id);
      return false;
    }

    // Like
    await ctx.db.insert("likedWorks", {
      userId: user._id,
      workSlug: args.workSlug,
      createdAt: Date.now(),
    });

    // Record activity on like
    await ctx.db.insert("activities", {
      userId: user._id,
      type: "liked_work",
      targetType: "work",
      targetId: args.workSlug,
      targetName: args.workTitle,
      createdAt: Date.now(),
    });

    return true;
  },
});

// Record a creator view (idempotent — only records first view)
// Caps viewedCreators at 100 entries.
export const recordCreatorView = mutation({
  args: {
    creatorSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    const alreadyViewed = user.viewedCreators.some(
      (v) => v.slug === args.creatorSlug,
    );

    if (!alreadyViewed) {
      let viewedCreators = [
        ...user.viewedCreators,
        { slug: args.creatorSlug, timestamp: Date.now() },
      ];

      // Cap at 100 most recent
      if (viewedCreators.length > 100) {
        viewedCreators = viewedCreators.slice(-100);
      }

      await ctx.db.patch(user._id, { viewedCreators });
    }
  },
});

// Unlock an achievement (idempotent)
export const unlockAchievement = mutation({
  args: {
    achievementId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    const alreadyUnlocked = user.achievements.some(
      (a) => a.id === args.achievementId,
    );

    if (alreadyUnlocked) return false;

    await ctx.db.patch(user._id, {
      achievements: [
        ...user.achievements,
        { id: args.achievementId, unlockedAt: Date.now() },
      ],
    });

    return true;
  },
});

// Update streak data
export const updateStreak = mutation({
  args: {
    streakData: v.object({
      currentStreak: v.number(),
      longestStreak: v.number(),
      lastVisitDate: v.string(),
      streakStartDate: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    await ctx.db.patch(user._id, { streakData: args.streakData });
  },
});

// ============== FOLLOW / UNFOLLOW ==============

export const toggleFollow = mutation({
  args: {
    targetUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    // Check if already following
    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("by_pair", (q) =>
        q.eq("followerId", user._id).eq("followingId", args.targetUserId),
      )
      .unique();

    if (existingFollow) {
      // Unfollow
      await ctx.db.delete(existingFollow._id);
      return false;
    }

    // Follow
    await ctx.db.insert("follows", {
      followerId: user._id,
      followingId: args.targetUserId,
      createdAt: Date.now(),
    });

    // Record activity
    const targetUser = await ctx.db.get(args.targetUserId);
    await ctx.db.insert("activities", {
      userId: user._id,
      type: "followed_user",
      targetType: "user",
      targetId: args.targetUserId,
      targetName: targetUser?.name,
      createdAt: Date.now(),
    });

    return true;
  },
});

// ============== MIGRATION ==============

// One-time migration of localStorage data to Convex on first sign-in
export const migrateFromLocalStorage = mutation({
  args: {
    savedCreators: v.array(v.string()),
    likedWorks: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    // Import saved creators (skip duplicates)
    for (const creatorSlug of args.savedCreators) {
      const existing = await ctx.db
        .query("savedCreators")
        .withIndex("by_user_slug", (q) =>
          q.eq("userId", user._id).eq("creatorSlug", creatorSlug),
        )
        .unique();

      if (!existing) {
        await ctx.db.insert("savedCreators", {
          userId: user._id,
          creatorSlug,
          createdAt: Date.now(),
        });
      }
    }

    // Import liked works (skip duplicates)
    for (const workSlug of args.likedWorks) {
      const existing = await ctx.db
        .query("likedWorks")
        .withIndex("by_user_slug", (q) =>
          q.eq("userId", user._id).eq("workSlug", workSlug),
        )
        .unique();

      if (!existing) {
        await ctx.db.insert("likedWorks", {
          userId: user._id,
          workSlug,
          createdAt: Date.now(),
        });
      }
    }
  },
});
