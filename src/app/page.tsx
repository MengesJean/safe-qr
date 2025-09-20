"use client";

import { FormEvent, useRef, useState } from "react";
import { useQRCode } from "next-qrcode";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const normalizeUrl = (input: string): string | null => {
  const trimmedValue = input.trim();

  if (!trimmedValue) {
    return null;
  }

  const prepareCandidate = (candidate: string) => {
    try {
      const url = new URL(candidate);
      const protocol = url.protocol.replace(":", "");
      const hostname = url.hostname;
      const isLocalhost = hostname === "localhost";
      const hasDomain = hostname.includes(".");

      if (!hostname || !["http", "https"].includes(protocol)) {
        return null;
      }

      if (!isLocalhost && !hasDomain) {
        return null;
      }

      return url.toString();
    } catch {
      return null;
    }
  };

  return (
    prepareCandidate(trimmedValue) ??
    prepareCandidate(`https://${trimmedValue.replace(/^\/+/, "")}`)
  );
};

export default function Home() {
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
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-12 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-xl border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-white">
            Générateur de QR code
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            Convertissez instantanément une URL en QR code prêt à partager.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleGenerate}>
            <div className={`space-y-2${isLocked ? " hidden" : ""}`}>
              <Label htmlFor="target-url" className="text-slate-700 dark:text-slate-200">
                URL à convertir
              </Label>
              <Input
                id="target-url"
                type="text"
                placeholder="https://exemple.com"
                value={url}
                onChange={(event) => {
                  setUrl(event.target.value);
                  setSubmissionError(null);
                }}
                className={inputValidationClasses}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                disabled={isLocked}
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" className="flex-1" disabled={isSubmitDisabled}>
                {isLocked ? "Générer un autre QR Code" : "Générer"}
              </Button>
              {qrValue ? (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800/80"
                  onClick={handleDownload}
                >
                  Télécharger
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex w-full flex-col items-center gap-6">
          <div
            ref={canvasContainerRef}
            className="grid w-full place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50/80 px-10 py-8 dark:border-slate-700/70 dark:bg-slate-950/50"
          >
            {qrValue ? (
              <Canvas
                text={qrValue}
                options={{
                  type: "image/png",
                  quality: 0.92,
                  margin: 2,
                  scale: 8,
                  width: 240,
                  color: {
                    dark: "#020617",
                    light: "#f8fafc",
                  },
                }}
              />
            ) : (
              <p className="text-sm text-slate-500 text-center dark:text-slate-400">
                Votre QR code apparaîtra ici après génération.
              </p>
            )}
          </div>
          {qrValue ? (
            <p className="w-full break-words text-center text-xs text-slate-500 dark:text-slate-400">
              {qrValue}
            </p>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}
