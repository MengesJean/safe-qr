"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/auth/use-auth";

export const AuthPrompt = () => {
  const { handleSignIn, isPending, authError } = useAuth();

  return (
    <CardContent className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-medium text-slate-900 dark:text-white">Connexion requise</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Connectez-vous avec votre compte Google pour enregistrer vos QR codes en toute sécurité.
        </p>
      </div>
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Vous pouvez également utiliser le bouton en haut à droite.
      </div>
      <Button onClick={handleSignIn} disabled={isPending} className="w-full sm:w-auto">
        Continuer avec Google
      </Button>
      {authError ? (
        <p className="text-sm text-rose-500">{authError.message}</p>
      ) : null}
    </CardContent>
  );
};