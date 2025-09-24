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

  const handleSignIn = async () => {
    setIsPending(true);

    const origin = typeof window !== "undefined" ? window.location.origin : undefined;
    const redirectTo = origin ? `${origin}/auth/callback` : undefined;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      console.error("Sign-in failed", error);
      setIsPending(false);
    }
  };

  const handleSignOut = async () => {
    setIsPending(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign-out failed", error);
    }

    setIsPending(false);
  };

  if (isLoading) {
    return (
      <div className="h-9 w-9 animate-pulse rounded-full border border-border bg-muted/60" aria-hidden />
    );
  }

  if (!session) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-9 gap-2 rounded-full border border-border bg-background/80 shadow-sm hover:bg-accent"
        onClick={handleSignIn}
        disabled={isPending}
      >
        <LogIn className="h-4 w-4" />
        Connexion
      </Button>
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
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
