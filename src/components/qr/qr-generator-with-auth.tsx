"use client";

import { useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { useSupabaseSession } from "@/hooks/use-supabase-session";
import { getSupabaseClient } from "@/lib/supabase-client";
import { logQrGeneration } from "@/lib/qr-logging";

import { QrGenerator } from "./qr-generator";

type AuthState = "idle" | "pending";

type AuthError = {
  message: string;
};

const getUserLabel = (session: Session) => {
  const fullName = session.user.user_metadata?.full_name as string | undefined;
  return fullName || session.user.email || "Compte Google";
};

export function QrGeneratorWithAuth() {
  const { session, isLoading } = useSupabaseSession();
  const [authState, setAuthState] = useState<AuthState>("idle");
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const supabase = useMemo(() => getSupabaseClient(), []);

  const handleSignIn = async () => {
    setAuthError(null);
    setAuthState("pending");

    const origin = typeof window !== "undefined" ? window.location.origin : undefined;
    const redirectTo = origin ? `${origin}/auth/callback` : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setAuthError({ message: error.message });
      setAuthState("idle");
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    setAuthState("pending");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setAuthError({ message: error.message });
    }

    setAuthState("idle");
  };


  const handleLogGeneration = async (resolvedUrl: string) => {
    const userId = session?.user.id;
    if (!userId) {
      return;
    }

    await logQrGeneration(resolvedUrl, userId);
  };

  if (isLoading) {
    return (
      <CardContent className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-500 dark:text-slate-400">Chargement de votre session...</p>
      </CardContent>
    );
  }

  if (!session) {
    return (
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white">Connexion requise</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Connectez-vous avec votre compte Google pour enregistrer vos QR codes en toute sécurité.
          </p>
        </div>
        <Button onClick={handleSignIn} disabled={authState === "pending"} className="w-full sm:w-auto">
          Continuer avec Google
        </Button>
        {authError ? (
          <p className="text-sm text-rose-500">{authError.message}</p>
        ) : null}
      </CardContent>
    );
  }

  const email = session.user.email;
  const userLabel = getUserLabel(session);

  return (
    <>
      <CardContent className="flex flex-col gap-2 border-b border-slate-200/70 pb-4 text-sm dark:border-slate-800">
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-50">Connecté en tant que {userLabel}</p>
          {email ? <p className="text-xs text-slate-500 dark:text-slate-400">{email}</p> : null}
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Vos QR codes générés seront enregistrés avec la date et l&apos;heure correspondantes.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleSignOut}
            disabled={authState === "pending"}
          >
            Se déconnecter
          </Button>
        </div>
        {authError ? (
          <p className="text-sm text-rose-500">{authError.message}</p>
        ) : null}
      </CardContent>
      <QrGenerator onLog={handleLogGeneration} />
    </>
  );
}
