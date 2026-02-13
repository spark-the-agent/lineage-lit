"use client";

// Syncs the authenticated Clerk user to Convex (creates/updates user document).
// Must be rendered inside BOTH AuthProvider (for useUser) and ConvexClientProvider
// (for useMutation). Placed in layout.tsx as a child of both providers.
//
// Gates on useConvexAuth().isAuthenticated — NOT Clerk's isSignedIn — to ensure
// the JWT has actually reached Convex before calling the auth-gated mutation.

import { useEffect, useRef } from "react";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/app/components/AuthProvider";

const hasConvex =
  typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_CONVEX_URL;

export default function ConvexUserSync() {
  const { user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const getOrCreateUser = useMutation(api.users.getOrCreate);
  const syncedRef = useRef(false);

  useEffect(() => {
    console.log(
      "[ConvexUserSync] hasConvex:",
      hasConvex,
      "isAuthenticated:",
      isAuthenticated,
      "user:",
      !!user,
      "synced:",
      syncedRef.current,
    );
    if (!hasConvex) return;

    if (isAuthenticated && user) {
      if (!syncedRef.current) {
        syncedRef.current = true;
        console.log(
          "[ConvexUserSync] Calling getOrCreate for:",
          user.primaryEmailAddress?.emailAddress,
        );
        getOrCreateUser({
          email: user.primaryEmailAddress?.emailAddress ?? "",
          name: user.fullName || user.firstName,
          avatarUrl: user.imageUrl,
        })
          .then((id) => console.log("[ConvexUserSync] User synced, id:", id))
          .catch((err: unknown) => {
            console.error(
              "[ConvexUserSync] Failed to sync user to Convex:",
              err,
            );
            syncedRef.current = false;
          });
      }
    } else if (!isAuthenticated) {
      syncedRef.current = false;
    }
  }, [isAuthenticated, user, getOrCreateUser]);

  return null;
}
