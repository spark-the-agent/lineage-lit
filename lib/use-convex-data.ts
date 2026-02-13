"use client";

// Hooks that use Convex when available, fall back to static data from lib/data.ts.
// When NEXT_PUBLIC_CONVEX_URL is not set, these return static data immediately.

import { useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import {
  creators as staticCreators,
  getCreatorBySlug as staticGetCreator,
  getLineage as staticGetLineage,
} from "./data";
import type { Creator } from "./data";

/**
 * Whether the Convex client is configured.
 * When false, all hooks return static data.
 */
const hasConvex =
  typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_CONVEX_URL;

/**
 * Fetch all creators. Returns Convex data if available, static data otherwise.
 */
export function useCreators(): Creator[] {
  const convexCreators = useQuery(
    api.creators.listCreators,
    hasConvex ? {} : "skip",
  );

  if (!hasConvex) return staticCreators;

  // While loading, return static data to avoid flash
  if (convexCreators === undefined) return staticCreators;

  return convexCreators as unknown as Creator[];
}

/**
 * Fetch a single creator by slug. Returns Convex data if available.
 */
export function useCreator(slug: string): Creator | undefined {
  const convexCreator = useQuery(
    api.creators.getCreator,
    hasConvex ? { slug } : "skip",
  );

  if (!hasConvex) return staticGetCreator(slug);

  // While loading, return static data
  if (convexCreator === undefined) return staticGetCreator(slug);
  if (convexCreator === null) return undefined;

  return convexCreator as unknown as Creator;
}

/**
 * Returns a lookup function that finds a creator by slug from the full list.
 * Use this when you need to look up multiple creators dynamically
 * (e.g., inside .map() calls or event handlers where you can't call useCreator).
 */
export function useCreatorLookup(): (slug: string) => Creator | undefined {
  const creators = useCreators();
  return useCallback(
    (slug: string) => creators.find((c) => c.slug === slug),
    [creators],
  );
}

/**
 * Fetch lineage (ancestors + descendants) for a creator.
 */
export function useLineage(slug: string): {
  ancestors: Creator[];
  descendants: Creator[];
} {
  // For now, lineage resolution uses static data.
  // This can be upgraded to a dedicated Convex query later.
  return staticGetLineage(slug);
}

/**
 * Whether the Convex backend is available and connected.
 */
export function useIsConvexAvailable(): boolean {
  return hasConvex;
}
