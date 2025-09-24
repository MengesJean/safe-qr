"use client";

import { useState } from "react";
import { signInWithGoogle, signOut } from "@/services/auth/session";
import { getAuthRedirectUrl, formatAuthError } from "@/utils";
import type { AuthState, AuthError } from "@/types";

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>("idle");
  const [authError, setAuthError] = useState<AuthError | null>(null);

  const handleSignIn = async () => {
    try {
      setAuthState("pending");
      setAuthError(null);

      const redirectTo = getAuthRedirectUrl();
      const { error } = await signInWithGoogle(redirectTo);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      setAuthError(formatAuthError(error));
      console.error("Sign-in failed", error);
      setAuthState("idle");
    }
  };

  const handleSignOut = async () => {
    try {
      setAuthState("pending");
      setAuthError(null);
      
      const { error } = await signOut();

      if (error) {
        throw new Error(error.message);
      }
      
      setAuthState("idle");
    } catch (error) {
      setAuthError(formatAuthError(error));
      console.error("Sign-out failed", error);
      setAuthState("idle");
    }
  };

  return {
    authState,
    authError,
    handleSignIn,
    handleSignOut,
    isPending: authState === "pending"
  };
};