import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Batch-resolve user docs by ID. Deduplicates lookups.
async function resolveUsers(
  ctx: {
    db: {
      get: (
        id: Id<"users">,
      ) => Promise<{
        _id: Id<"users">;
        name?: string;
        avatarUrl?: string;
      } | null>;
    };
  },
  userIds: Id<"users">[],
) {
  const uniqueIds = [...new Set(userIds)];
  const users = await Promise.all(uniqueIds.map((id) => ctx.db.get(id)));
  const map = new Map<string, { name?: string; avatarUrl?: string }>();
  for (const user of users) {
    if (user) map.set(user._id, { name: user.name, avatarUrl: user.avatarUrl });
  }
  return map;
}

// Global activity feed (most recent first)
export const getGlobalFeed = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const activities = await ctx.db
      .query("activities")
      .withIndex("by_created")
      .order("desc")
      .take(limit);

    // Batch user lookups
    const userMap = await resolveUsers(
      ctx,
      activities.map((a) => a.userId),
    );

    return activities.map((activity) => {
      const user = userMap.get(activity.userId);
      return {
        _id: activity._id,
        type: activity.type,
        targetType: activity.targetType,
        targetId: activity.targetId,
        targetName: activity.targetName,
        createdAt: activity.createdAt,
        userName: user?.name ?? "Someone",
        userAvatar: user?.avatarUrl,
      };
    });
  },
});

// Activity feed for a specific user
export const getUserFeed = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 30;

    const activities = await ctx.db
      .query("activities")
      .withIndex("by_user_created", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);

    const user = await ctx.db.get(args.userId);

    return activities.map((activity) => ({
      _id: activity._id,
      type: activity.type,
      targetType: activity.targetType,
      targetId: activity.targetId,
      targetName: activity.targetName,
      createdAt: activity.createdAt,
      userName: user?.name ?? "Someone",
      userAvatar: user?.avatarUrl,
    }));
  },
});

// Feed of activities from users you follow + your own (auth-gated)
export const getFollowingFeed = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return [];

    // Get who this user follows
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", user._id))
      .collect();

    const followingIds = new Set([
      user._id as string,
      ...follows.map((f) => f.followingId as string),
    ]);

    // Scan recent activities, proportional to follower count but hard-capped
    // TODO: consider fan-out-on-write for better scaling at high follow counts
    const scanLimit = Math.min(Math.max(followingIds.size * 10, 200), 500);

    const allRecent = await ctx.db
      .query("activities")
      .withIndex("by_created")
      .order("desc")
      .take(scanLimit);

    const relevant = allRecent
      .filter((a) => followingIds.has(a.userId as string))
      .slice(0, limit);

    // Batch user lookups
    const userMap = await resolveUsers(
      ctx,
      relevant.map((a) => a.userId),
    );

    return relevant.map((activity) => {
      const activityUser = userMap.get(activity.userId);
      return {
        _id: activity._id,
        type: activity.type,
        targetType: activity.targetType,
        targetId: activity.targetId,
        targetName: activity.targetName,
        createdAt: activity.createdAt,
        userName: activityUser?.name ?? "Someone",
        userAvatar: activityUser?.avatarUrl,
      };
    });
  },
});
