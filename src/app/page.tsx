"use client";

import { FormEvent, useRef, useState } from "react";
import { useQRCode } from "next-qrcode";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [url, setUrl] = useState("");
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { Canvas } = useQRCode();
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  const handleGenerate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLocked) {
      setUrl("");
      setQrValue(null);
      setError(null);
      setIsLocked(false);
      return;
    }

    const trimmed = url.trim();

    if (!trimmed) {
      setError("Veuillez renseigner une URL.");
      setQrValue(null);
      return;
    }

    try {
      // Valide directement l'URL si elle contient un schéma.
      new URL(trimmed);
      setQrValue(trimmed);
      setError(null);
      setIsLocked(true);
    } catch {
      try {
        // Tente d'ajouter https:// pour renforcer la tolérance de saisie.
        const prefixed = `https://${trimmed}`;
        new URL(prefixed);
        setQrValue(prefixed);
        setError(null);
        setIsLocked(true);
      } catch {
        setError("L'URL saisie n'est pas valide.");
        setQrValue(null);
        setIsLocked(false);
      }
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-xl border-slate-800/60 bg-slate-900/70 backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold text-white">
            Générateur de QR code
          </CardTitle>
          <CardDescription className="text-slate-300">
            Convertissez instantanément une URL en QR code prêt à partager.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleGenerate}>
            <div className={`space-y-2${isLocked ? " hidden" : ""}`}>
              <Label htmlFor="target-url" className="text-slate-200">
                URL à convertir
              </Label>
              <Input
                id="target-url"
                type="url"
                placeholder="https://exemple.com"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                className="bg-slate-950/60 border-slate-800 text-slate-50 placeholder:text-slate-500"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                disabled={isLocked}
              />
              {error ? (
                <p className="text-sm text-rose-400">{error}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" className="flex-1">
                {isLocked ? "Générer un autre QR Code" : "Générer"}
              </Button>
              {qrValue ? (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800/80"
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
            className="grid w-full place-items-center rounded-lg border border-dashed border-slate-700/70 bg-slate-950/50 px-10 py-8"
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
              <p className="text-sm text-slate-400 text-center">
                Votre QR code apparaîtra ici après génération.
              </p>
            )}
          </div>
          {qrValue ? (
            <p className="w-full break-words text-center text-xs text-slate-400">
              {qrValue}
            </p>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}
