"use client";

import { FormEvent, useRef, useState } from "react";
import { useQRCode } from "next-qrcode";
import { normalizeUrl } from "@/utils";
import { downloadQrCode } from "@/services/qr/generator";
import { useToastContext } from "@/components/providers";

export const useQrGenerator = (onLog: (url: string) => Promise<void> | void) => {
  const [url, setUrl] = useState("");
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { Canvas } = useQRCode();
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const { success, error } = useToastContext();

  const trimmedUrl = url.trim();
  const normalizedUrl = trimmedUrl ? normalizeUrl(trimmedUrl) : null;

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLocked) {
      setUrl("");
      setQrValue(null);
      setSubmissionError(null);
      setIsLocked(false);
      return;
    }

    if (!trimmedUrl) {
      setSubmissionError("Veuillez renseigner une URL.");
      setQrValue(null);
      return;
    }

    const resolvedUrl = normalizeUrl(trimmedUrl);

    if (!resolvedUrl) {
      setSubmissionError("L'URL saisie n'est pas valide.");
      setQrValue(null);
      setIsLocked(false);
      return;
    }

    setQrValue(resolvedUrl);
    setSubmissionError(null);
    setIsLocked(true);

    void onLog(resolvedUrl);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      await downloadQrCode(canvasContainerRef);
      success("QR code téléchargé avec succès !");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du téléchargement";
      error(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUrlChange = (nextValue: string) => {
    setUrl(nextValue);
    setSubmissionError(null);
  };

  return {
    url,
    qrValue,
    isLocked,
    submissionError,
    isDownloading,
    Canvas,
    canvasContainerRef,
    normalizedUrl,
    trimmedUrl,
    handleGenerate,
    handleDownload,
    handleUrlChange
  };
};