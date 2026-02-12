'use client';

import { ClerkProvider, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { ReactNode, useEffect } from 'react';
import { updateUserProfile } from '@/lib/persistence';

// Only initializes Clerk if NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set.
// Otherwise renders children directly (anonymous mode).

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function ClerkProfileSync({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      updateUserProfile({
        displayName: user.fullName || user.firstName || 'Reader',
        avatarSeed: user.id,
      });
    }
  }, [isLoaded, user]);

  return <>{children}</>;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  if (!clerkKey) return <>{children}</>;

  return (
    <ClerkProvider
      publishableKey={clerkKey}
      appearance={{
        variables: {
          colorPrimary: '#f59e0b',
          colorBackground: '#18181b',
          colorInputBackground: '#27272a',
          colorInputText: '#fafafa',
          colorText: '#fafafa',
        },
        elements: {
          card: 'bg-zinc-900 border border-zinc-800',
          headerTitle: 'text-zinc-100',
          headerSubtitle: 'text-zinc-400',
          formButtonPrimary: 'bg-amber-500 hover:bg-amber-400 text-zinc-900',
        },
      }}
    >
      <ClerkProfileSync>{children}</ClerkProfileSync>
    </ClerkProvider>
  );
}

// Re-export Clerk components for use throughout the app
export { SignInButton, SignUpButton, UserButton, useUser };

// Hook to check if auth is available
export function useAuthAvailable(): boolean {
  return !!clerkKey;
}
