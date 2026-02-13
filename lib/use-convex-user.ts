"use client";

// Hooks for user-specific Convex data (saved creators, liked works, activity).
// All queries/mutations are auth-gated on the server via JWT — no clerkId needed.
// Uses useConvexAuth() to gate on Convex-level auth (token delivered), not
// Clerk-level isSignedIn (which can be true before the token reaches Convex).

import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "../convex/_generated/api";

const hasConvex =
  typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_CONVEX_URL;

/**
 * Get the current authenticated user's Convex document.
 * Returns null if not signed in or Convex isn't configured.
 */
export function useConvexUser() {
  const { isAuthenticated } = useConvexAuth();

  const convexUser = useQuery(
    api.users.getMe,
    hasConvex && isAuthenticated ? {} : "skip",
  );

  return convexUser ?? null;
}

/**
 * Get saved creator slugs for the current user.
 */
export function useSavedCreators() {
  const { isAuthenticated } = useConvexAuth();

  const saved = useQuery(
    api.users.getSavedCreators,
    hasConvex && isAuthenticated ? {} : "skip",
  );

  return saved ?? [];
}

/**
 * Get liked work slugs for the current user.
 */
export function useLikedWorks() {
  const { isAuthenticated } = useConvexAuth();

  const liked = useQuery(
    api.users.getLikedWorks,
    hasConvex && isAuthenticated ? {} : "skip",
  );

  return liked ?? [];
}

/**
 * Mutation hooks for user actions.
 * These write to Convex and automatically record activity.
 * Auth is handled server-side via JWT — no clerkId args needed.
 */
export function useUserActions() {
  const { isAuthenticated } = useConvexAuth();

  const toggleSaveMutation = useMutation(api.userActions.toggleSaveCreator);
  const toggleLikeMutation = useMutation(api.userActions.toggleLikeWork);
  const recordViewMutation = useMutation(api.userActions.recordCreatorView);
  const unlockMutation = useMutation(api.userActions.unlockAchievement);
  const migrateMutation = useMutation(api.userActions.migrateFromLocalStorage);

  return {
    isAuthenticated: isAuthenticated && hasConvex,

    toggleSaveCreator: async (creatorSlug: string, creatorName?: string) => {
      if (!isAuthenticated) return false;
      return toggleSaveMutation({ creatorSlug, creatorName });
    },

    toggleLikeWork: async (workSlug: string, workTitle?: string) => {
      if (!isAuthenticated) return false;
      return toggleLikeMutation({ workSlug, workTitle });
    },

    recordCreatorView: async (creatorSlug: string) => {
      if (!isAuthenticated) return;
      return recordViewMutation({ creatorSlug });
    },

    unlockAchievement: async (achievementId: string) => {
      if (!isAuthenticated) return false;
      return unlockMutation({ achievementId });
    },

    migrateFromLocalStorage: async (
      savedCreators: string[],
      likedWorks: string[],
    ) => {
      if (!isAuthenticated) return;
      return migrateMutation({ savedCreators, likedWorks });
    },
  };
}

/**
 * Get the global activity feed from Convex.
 */
export function useActivityFeed(limit?: number) {
  const feed = useQuery(
    api.activity.getGlobalFeed,
    hasConvex ? { limit } : "skip",
  );

  return feed ?? [];
}

/**
 * Get the personalized feed (from users you follow).
 * Auth-gated on server — no clerkId needed.
 */
export function useFollowingFeed(limit?: number) {
  const { isAuthenticated } = useConvexAuth();

  const feed = useQuery(
    api.activity.getFollowingFeed,
    hasConvex && isAuthenticated ? { limit } : "skip",
  );

  return feed ?? [];
}
