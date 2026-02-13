"use client";

import { ReactNode, createContext, useContext, useEffect } from "react";
import { updateUserProfile } from "@/lib/persistence";
import {
  ClerkProvider,
  useUser as clerkUseUser,
  SignInButton as ClerkSignInButton,
  SignUpButton as ClerkSignUpButton,
  UserButton as ClerkUserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/* eslint-disable @typescript-eslint/no-explicit-any */
interface UserData {
  user: any;
  isLoaded: boolean;
  isSignedIn: boolean;
}

const STUB_USER_DATA: UserData = {
  user: null,
  isLoaded: true,
  isSignedIn: false,
};

const UserContext = createContext<UserData>(STUB_USER_DATA);

function ClerkUserBridge({ children }: { children: ReactNode }) {
  const userData = clerkUseUser() as UserData;

  useEffect(() => {
    if (userData.isLoaded && userData.user) {
      const user = userData.user as any;
      updateUserProfile({
        displayName: user.fullName || user.firstName || "Reader",
        avatarSeed: user.id,
      });
    }
  }, [userData.isLoaded, userData.user]);

  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  if (!clerkKey) return <>{children}</>;

  return (
    <ClerkProvider
      publishableKey={clerkKey}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#f59e0b",
          colorBackground: "#18181b",
          colorInputBackground: "#27272a",
          colorInputText: "#fafafa",
          colorText: "#fafafa",
          colorTextSecondary: "#a1a1aa",
          colorTextOnPrimaryBackground: "#18181b",
          colorNeutral: "#fafafa",
        },
        elements: {
          formButtonPrimary:
            "bg-amber-500 hover:bg-amber-400 text-zinc-900 border-none",
          footerActionLink: "text-amber-500 hover:text-amber-400",
        },
      }}
    >
      <ClerkUserBridge>{children}</ClerkUserBridge>
    </ClerkProvider>
  );
}

// --- Exported hooks ---

export function useUser(): UserData {
  return useContext(UserContext);
}

export function useAuthAvailable(): boolean {
  return !!clerkKey;
}

// --- Exported components ---

export function SignInButton({
  children,
  ...rest
}: { children?: ReactNode } & Record<string, unknown>) {
  if (!clerkKey) return <>{children}</>;
  return <ClerkSignInButton {...rest}>{children}</ClerkSignInButton>;
}

export function SignUpButton({
  children,
  ...rest
}: { children?: ReactNode } & Record<string, unknown>) {
  if (!clerkKey) return <>{children}</>;
  return <ClerkSignUpButton {...rest}>{children}</ClerkSignUpButton>;
}

export function UserButton(props: Record<string, unknown>) {
  if (!clerkKey) return null;
  return <ClerkUserButton {...props} />;
}
