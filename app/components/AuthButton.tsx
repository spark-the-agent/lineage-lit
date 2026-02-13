"use client";

import { LogIn } from "lucide-react";
import {
  useAuthAvailable,
  SignInButton,
  UserButton,
  useUser,
} from "./AuthProvider";

export default function AuthButton() {
  const authAvailable = useAuthAvailable();

  if (!authAvailable) {
    return null;
  }

  return <AuthButtonInner />;
}

function AuthButtonInner() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />;
  }

  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />;
  }

  return (
    <SignInButton mode="modal">
      <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-zinc-900 font-medium rounded-lg hover:bg-amber-400 transition text-sm cursor-pointer whitespace-nowrap shrink-0">
        <LogIn className="w-4 h-4" />
        Sign In
      </button>
    </SignInButton>
  );
}
