import { getSupabaseClient } from "@/lib/supabase-client";

type QrMetadata = {
  title?: string | null;
  imageUrl?: string | null;
};

export async function logQrGeneration(url: string, userId: string, metadata?: QrMetadata): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    const { title = null, imageUrl = null } = metadata ?? {};

    const { error } = await supabase.from("qr_generations").insert({
      url,
      user_id: userId,
      title,
      image_url: imageUrl,
      generated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Failed to log QR generation", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Unexpected error while logging QR generation", error);
    return { success: false, error: errorMessage };
  }
}
