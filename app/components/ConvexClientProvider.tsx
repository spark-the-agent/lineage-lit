"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

// Only initializes Convex if NEXT_PUBLIC_CONVEX_URL is set.
// Otherwise renders children directly (static data fallback).

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  const client = useMemo(() => {
    if (!convexUrl) return null;
    return new ConvexReactClient(convexUrl);
  }, [convexUrl]);

  if (!client) return <>{children}</>;

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
