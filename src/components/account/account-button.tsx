"use client";

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
import { useAuth } from "@/hooks/auth/use-auth";
import { getUserDisplayName, getUserInitials } from "@/utils";

export const AccountButton = () => {
  const { session, isLoading } = useSupabaseSession();
  const { handleSignIn, handleSignOut, authError, isPending } = useAuth();

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
          <p className="text-xs text-rose-500 max-w-48 text-right">{authError.message}</p>
        )}
      </div>
    );
  }

  const displayName = getUserDisplayName(session.user);
  const avatarSrc = session.user.user_metadata?.avatar_url as string | undefined;
  const initials = getUserInitials(displayName);

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
        <p className="text-xs text-rose-500 max-w-48 text-right">{authError.message}</p>
      )}
    </div>
  );
};
