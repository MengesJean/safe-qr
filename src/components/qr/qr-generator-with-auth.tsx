"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseSession } from "@/hooks/use-supabase-session";
import { getSupabaseClient } from "@/lib/supabase-client";
import { logQrGeneration } from "@/lib/qr-logging";
import { fetchUrlMetadata } from "@/lib/actions/metadata";

import { QrGenerator } from "./qr-generator";
import { QrHistory } from "./qr-history";

type AuthState = "idle" | "pending";

type AuthError = {
  message: string;
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

  const handleLogGeneration = async (resolvedUrl: string) => {
    const userId = session?.user.id;
    if (!userId) {
      return;
    }

    let title: string | null = null;
    let imageUrl: string | null = null;

    try {
      const result = await fetchUrlMetadata(resolvedUrl);
      if (result.success) {
        title = result.data.title;
        imageUrl = result.data.imageUrl;
      } else {
        console.warn('Failed to fetch metadata for QR code:', result.error);
      }
    } catch (error) {
      console.warn('Failed to fetch metadata for QR code', error);
    }

    await logQrGeneration(resolvedUrl, userId, { title, imageUrl });
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
        <div className="text-sm text-slate-500 dark:text-slate-400">Vous pouvez également utiliser le bouton en haut à droite.</div>
        <Button onClick={handleSignIn} disabled={authState === "pending"} className="w-full sm:w-auto">
          Continuer avec Google
        </Button>
        {authError ? (
          <p className="text-sm text-rose-500">{authError.message}</p>
        ) : null}
      </CardContent>
    );
  }

  return (
    <Tabs defaultValue="generate" className="w-full">
      <CardContent className="pb-0">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="generate">Générer</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
      </CardContent>
      <TabsContent value="generate">
        <QrGenerator onLog={handleLogGeneration} />
      </TabsContent>
      <TabsContent value="history">
        <CardContent className="space-y-4">
          <QrHistory userId={session.user.id} />
        </CardContent>
      </TabsContent>
    </Tabs>
  );
}
