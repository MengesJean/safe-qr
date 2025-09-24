import { AuthError } from "@/types";

export const getAuthRedirectUrl = (): string => {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return origin ? `${origin}/auth/callback` : "";
};

export const formatAuthError = (error: unknown): AuthError => {
  const message = error instanceof Error ? error.message : "Erreur d'authentification";
  return { message };
};

export const getUserDisplayName = (user: { user_metadata?: Record<string, unknown>; email?: string }): string => {
  return (user.user_metadata?.full_name as string) || 
         user.email || 
         "Compte Google";
};

export const getUserInitials = (displayName: string): string => {
  return displayName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};