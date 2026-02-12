import { v } from "convex/values";
import { internalQuery, internalMutation } from "./_generated/server";

// Internal database helpers for AI actions

export const getLineageRequest = internalQuery({
  args: { id: v.id("lineageRequests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateLineageStatus = internalMutation({
  args: {
    id: v.id("lineageRequests"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const completeLineageRequest = internalMutation({
  args: {
    id: v.id("lineageRequests"),
    result: v.object({
      identifiedInfluences: v.array(
        v.object({
          name: v.string(),
          confidence: v.number(),
          evidence: v.string(),
          type: v.optional(v.string()),
        }),
      ),
      relatedWorks: v.array(v.string()),
      lineageSummary: v.optional(v.string()),
      tokensUsed: v.number(),
    }),
    tokensUsed: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "completed",
      result: {
        identifiedInfluences: args.result.identifiedInfluences,
        relatedWorks: args.result.relatedWorks,
        lineageTree: args.result.lineageSummary,
      },
      tokensUsed: args.tokensUsed,
      completedAt: Date.now(),
    });
  },
});

export const failLineageRequest = internalMutation({
  args: {
    id: v.id("lineageRequests"),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "failed",
      error: args.error,
    });
  },
});
