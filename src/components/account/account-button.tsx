"use client";

import { useMemo, useState } from "react";
import { LogIn, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSupabaseSession } from "@/hooks/use-supabase-session";
import { getSupabaseClient } from "@/lib/supabase-client";

export function AccountButton() {
  const { session, isLoading } = useSupabaseSession();
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [isPending, setIsPending] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setIsPending(true);
      setAuthError(null);

      const origin = typeof window !== "undefined" ? window.location.origin : undefined;
      const redirectTo = origin ? `${origin}/auth/callback` : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur de connexion";
      setAuthError(errorMessage);
      console.error("Sign-in failed", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsPending(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur de déconnexion";
      setAuthError(errorMessage);
      console.error("Sign-out failed", error);
    } finally {
      setIsPending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-9 w-9 animate-pulse rounded-full border border-border bg-muted/60" aria-hidden />
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-2 rounded-full border border-border bg-background/80 shadow-sm hover:bg-accent"
          onClick={handleSignIn}
          disabled={isPending}
        >
          <LogIn className="h-4 w-4" />
          {isPending ? "Connexion..." : "Connexion"}
        </Button>
        {authError && (
          <p className="text-xs text-rose-500 max-w-48 text-right">{authError}</p>
        )}
      </div>
    );
  }

  const displayName =
    (session.user.user_metadata?.full_name as string | undefined) || session.user.email || "Compte Google";
  const avatarSrc = session.user.user_metadata?.avatar_url as string | undefined;
  const initials = displayName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col items-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatarSrc} alt={displayName} referrerPolicy="no-referrer" />
              <AvatarFallback className="bg-muted text-foreground">
                {initials || <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{displayName}</span>
            {session.user.email ? (
              <span className="text-xs text-muted-foreground">{session.user.email}</span>
            ) : null}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 text-rose-500 focus:text-rose-500"
            onClick={handleSignOut}
            disabled={isPending}
          >
            <LogOut className="h-4 w-4" />
            {isPending ? "Déconnexion..." : "Se déconnecter"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {authError && (
        <p className="text-xs text-rose-500 max-w-48 text-right">{authError}</p>
      )}
    </div>
  );
}
