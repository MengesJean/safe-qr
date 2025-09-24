import type { Session } from "@supabase/supabase-js";
import { getSupabaseClient } from "./supabase";

export const getCurrentSession = async (): Promise<Session | null> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Erreur lors de la récupération de la session:', error);
    return null;
  }
  
  return data.session;
};

export const signInWithGoogle = async (redirectTo?: string) => {
  const supabase = getSupabaseClient();
  
  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
};

export const signOut = async () => {
  const supabase = getSupabaseClient();
  return await supabase.auth.signOut();
};