"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useEffect, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function AuthDebug({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    console.log("[AuthDebug] Clerk isSignedIn:", isSignedIn);
    if (isSignedIn) {
      getToken({ template: "convex" })
        .then((token) => {
          console.log("[AuthDebug] Got Clerk token for convex template");
        })
        .catch((err) => {
          console.error("[AuthDebug] getToken error:", err);
        });
    }
  }, [isLoaded, isSignedIn, getToken]);

  return <>{children}</>;
}

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

  if (clerkKey) {
    return (
      <ConvexProviderWithClerk client={client} useAuth={useAuth}>
        <AuthDebug>{children}</AuthDebug>
      </ConvexProviderWithClerk>
    );
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
