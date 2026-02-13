import { QueryCtx, MutationCtx } from "../_generated/server";

/**
 * Get the authenticated user from the Convex context.
 * Throws if the request is unauthenticated or the user doc doesn't exist.
 */
export async function getAuthUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier),
    )
    .unique();

  if (!user) throw new Error("User not found");
  return user;
}

/**
 * Get the authenticated user, returning null instead of throwing
 * if not authenticated or user doc doesn't exist yet.
 */
export async function getAuthUserOrNull(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier),
    )
    .unique();
}
