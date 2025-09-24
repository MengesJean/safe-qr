"use client";

import { useCallback } from "react";
import { fetchUrlMetadata } from "@/lib/actions/metadata";
import { logQrGeneration } from "@/services/qr/logger";

type QrMetadataLoggerProps = {
  userId?: string;
  children: (onLog: (resolvedUrl: string) => Promise<void>) => React.ReactNode;
};

export const QrMetadataLogger = ({ userId, children }: QrMetadataLoggerProps) => {
  const handleLogGeneration = useCallback(async (resolvedUrl: string) => {
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
  }, [userId]);

  return <>{children(handleLogGeneration)}</>;
};