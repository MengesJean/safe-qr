"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { getSupabaseClient } from "@/services/auth/supabase";

type UseSupabaseSessionResult = {
  session: Session | null;
  isLoading: boolean;
};

export const useSupabaseSession = (): UseSupabaseSessionResult => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();
    let isMounted = true;

    // Récupération initiale de la session avec gestion du cleanup
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!isMounted) return;
        
        if (error) {
          console.error('Erreur lors de la récupération de la session:', error);
        }
        
        setSession(data.session ?? null);
        setIsLoading(false);
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error('Erreur inattendue lors de la récupération de la session:', error);
        setSession(null);
        setIsLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!isMounted) return;
      
      // Log des événements d'authentification pour le debugging
      console.debug('Auth state change:', event, nextSession?.user?.id);
      
      setSession(nextSession);
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, isLoading };
};
