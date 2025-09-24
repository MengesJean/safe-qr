"use client";

import { FormEvent, useRef, useState } from "react";
import { useQRCode } from "next-qrcode";

import { CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { normalizeUrl } from "@/lib/normalize-url";

import { QrForm } from "./qr-form";
import { QrPreview } from "./qr-preview";

export function QrGenerator() {
  const [url, setUrl] = useState("");
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { Canvas } = useQRCode();
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  const trimmedUrl = url.trim();
  const normalizedUrl = trimmedUrl ? normalizeUrl(trimmedUrl) : null;
  const isSubmitDisabled = isLocked ? false : !normalizedUrl;
  const hasLiveError = Boolean(trimmedUrl) && !normalizedUrl;
  const isInvalid = !isLocked && (hasLiveError || Boolean(submissionError));
  const isValid = !isLocked && Boolean(normalizedUrl) && !submissionError;
  const inputValidationClasses = cn(
    "border-slate-300 bg-white/80 text-slate-900 placeholder:text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-50",
    isValid &&
      "border-emerald-500 focus-visible:ring-emerald-500/40 dark:border-emerald-400 dark:focus-visible:ring-emerald-400/40",
    isInvalid &&
      "border-rose-500 focus-visible:ring-rose-500/40 dark:border-rose-400 dark:focus-visible:ring-rose-400/40",
  );

  const handleGenerate = (event: FormEvent<HTMLFormElement>) => {
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
  };

  const handleDownload = () => {
    const canvas = canvasContainerRef.current?.querySelector("canvas");

    if (!canvas) {
      return;
    }

    const dataUrl = canvas.toDataURL("image/png");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qr-code-${timestamp}.png`;
    link.click();
  };

  return (
    <>
      <CardContent>
        <QrForm
          url={url}
          isLocked={isLocked}
          inputValidationClasses={inputValidationClasses}
          isSubmitDisabled={isSubmitDisabled}
          onSubmit={handleGenerate}
          onUrlChange={(nextValue) => {
            setUrl(nextValue);
            setSubmissionError(null);
          }}
          onDownload={handleDownload}
          showDownloadButton={Boolean(qrValue)}
        />
      </CardContent>
      <CardFooter className="flex w-full flex-col items-center gap-6">
        <QrPreview Canvas={Canvas} canvasContainerRef={canvasContainerRef} qrValue={qrValue} />
      </CardFooter>
    </>
  );
}
