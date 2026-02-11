'use client';

// Hooks that try Convex first, fall back to static data from lib/data.ts.
// When NEXT_PUBLIC_CONVEX_URL is not set, these return static data immediately.

import { creators as staticCreators, getCreatorById as staticGetCreator } from './data';
import type { Creator } from './data';

const hasConvex = typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_CONVEX_URL;

export function useCreators(): Creator[] {
  // Future: if hasConvex, use useQuery(api.creators.listCreators)
  // and adapt with convex-adapter. For now, always use static data.
  return staticCreators;
}

export function useCreator(slug: string): Creator | undefined {
  // Future: if hasConvex, use useQuery(api.creators.getCreator, { slug })
  return staticGetCreator(slug);
}

export function useIsConvexAvailable(): boolean {
  return hasConvex;
}
