"use client";

import { ReactNode, useEffect, useState } from "react";
import { updateUserProfile } from "@/lib/persistence";

// Clerk is loaded dynamically to avoid bundling Server Actions,
// which are incompatible with Next.js static export (output: 'export').

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/* eslint-disable @typescript-eslint/no-explicit-any */
type ClerkModule = {
  ClerkProvider: any;
  useUser: any;
  SignInButton: any;
  SignUpButton: any;
  UserButton: any;
};

// Stubs used when Clerk is not loaded (accept any props for type compat)
const stubUseUser = () => ({
  user: null,
  isLoaded: true,
  isSignedIn: false,
});
/* eslint-disable @typescript-eslint/no-unused-vars */
const StubComponent = ({
  children,
  ...rest
}: { children?: ReactNode } & Record<string, unknown>) => <>{children}</>;
const StubEmpty = ({ ...rest }: Record<string, unknown>) => null;
/* eslint-enable @typescript-eslint/no-unused-vars */

// Singleton: resolved Clerk module (populated after dynamic import)
let clerkModule: ClerkModule | null = null;
let clerkPromise: Promise<ClerkModule> | null = null;

function loadClerk(): Promise<ClerkModule> {
  if (clerkModule) return Promise.resolve(clerkModule);
  if (!clerkPromise) {
    // Use a computed string to prevent the bundler from statically analyzing
    // this import — @clerk/nextjs contains Server Actions that are incompatible
    // with output: 'export'. The module is only loaded at runtime in the browser.
    const pkg = ["@clerk", "nextjs"].join("/");
    clerkPromise = import(/* webpackIgnore: true */ pkg).then((mod) => {
      clerkModule = mod as unknown as ClerkModule;
      return clerkModule;
    });
  }
  return clerkPromise;
}

function ClerkProfileSync({ children }: { children: ReactNode }) {
  const { user, isLoaded } = clerkModule!.useUser();

  useEffect(() => {
    if (isLoaded && user) {
      updateUserProfile({
        displayName:
          (user as any).fullName || (user as any).firstName || "Reader",
        avatarSeed: (user as any).id,
      });
    }
  }, [isLoaded, user]);

  return <>{children}</>;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [clerk, setClerk] = useState<ClerkModule | null>(clerkModule);

  useEffect(() => {
    if (!clerkKey) return;
    loadClerk().then(setClerk);
  }, []);

  if (!clerkKey || !clerk) return <>{children}</>;

  const { ClerkProvider } = clerk;

  return (
    <ClerkProvider
      publishableKey={clerkKey}
      appearance={{
        variables: {
          colorPrimary: "#f59e0b",
          colorBackground: "#18181b",
          colorInputBackground: "#27272a",
          colorInputText: "#fafafa",
          colorText: "#fafafa",
        },
        elements: {
          card: "bg-zinc-900 border border-zinc-800",
          headerTitle: "text-zinc-100",
          headerSubtitle: "text-zinc-400",
          formButtonPrimary: "bg-amber-500 hover:bg-amber-400 text-zinc-900",
        },
      }}
    >
      <ClerkProfileSync>{children}</ClerkProfileSync>
    </ClerkProvider>
  );
}

// Re-export stubs — consumers use these; they work without Clerk loaded.
// AuthButton already guards with useAuthAvailable() so these are safe no-ops.
export const SignInButton = StubComponent;
export const SignUpButton = StubComponent;
export const UserButton = StubEmpty;
export const useUser = stubUseUser;

// Hook to check if auth is available
export function useAuthAvailable(): boolean {
  return !!clerkKey;
}
