import { getSupabaseClient } from "@/services/auth/supabase";
import type { QrMetadata, LogQrResult } from "@/types";
import { formatIsoDate } from "@/utils";

export const logQrGeneration = async (
  url: string, 
  userId: string, 
  metadata?: QrMetadata
): Promise<LogQrResult> => {
  try {
    const supabase = getSupabaseClient();
    const { title = null, imageUrl = null } = metadata ?? {};

    const { error } = await supabase.from("qr_generations").insert({
      url,
      user_id: userId,
      title,
      image_url: imageUrl,
      generated_at: formatIsoDate(),
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
};