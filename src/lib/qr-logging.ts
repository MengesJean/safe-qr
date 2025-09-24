import { getSupabaseClient } from "@/lib/supabase-client";

export async function logQrGeneration(url: string, userId: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("qr_generations").insert({
    url,
    user_id: userId,
    generated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Failed to log QR generation", error);
  }
}
