import { getSupabaseClient } from "@/lib/supabase-client";

type QrMetadata = {
  title?: string | null;
  imageUrl?: string | null;
};

export async function logQrGeneration(url: string, userId: string, metadata?: QrMetadata) {
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
  }
}
