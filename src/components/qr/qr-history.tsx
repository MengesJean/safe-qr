"use client";

import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQRCode } from "next-qrcode";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getSupabaseClient } from "@/lib/supabase-client";
import { useToastContext } from "@/components/toast-provider";
import Link from "next/link";

type HistoryEntry = {
  id: string;
  url: string;
  title: string | null;
  image_url: string | null;
  generated_at: string;
};

type QrHistoryProps = {
  userId: string;
};

export function QrHistory({ userId }: QrHistoryProps) {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleDelete = useCallback(async (id: string) => {
    const { error } = await supabase.from("qr_generations").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    setEntries((previous) => previous.filter((entry) => entry.id !== id));
  }, [supabase]);

  const fetchHistory = useCallback(async (offset = 0, append = false) => {
    const ITEMS_PER_PAGE = 20;
    
    if (!append) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      const { data, error: fetchError, count } = await supabase
        .from("qr_generations")
        .select("id, url, title, image_url, generated_at", { count: 'exact' })
        .eq("user_id", userId)
        .order("generated_at", { ascending: false })
        .range(offset, offset + ITEMS_PER_PAGE - 1);

      if (fetchError) {
        throw fetchError;
      }

      const newEntries = data ?? [];
      
      if (append) {
        setEntries(prev => [...prev, ...newEntries]);
      } else {
        setEntries(newEntries);
      }

      // Vérifier s'il y a plus d'éléments
      setHasMore(newEntries.length === ITEMS_PER_PAGE && (count ?? 0) > offset + ITEMS_PER_PAGE);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Erreur de chargement");
      if (!append) {
        setEntries([]);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [supabase, userId]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      void fetchHistory(entries.length, true);
    }
  }, [fetchHistory, entries.length, isLoadingMore, hasMore]);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-200/80 bg-white/70 p-6 text-sm text-slate-500 dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-slate-400">
        Chargement de vos QR codes...
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Erreur</CardTitle>
          <CardDescription>Impossible de récupérer vos QR codes enregistrés.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-rose-500">{error}</p>
          <Button variant="outline" onClick={() => void fetchHistory()}>
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/80 px-6 py-8 text-center text-sm text-slate-500 dark:border-slate-700/60 dark:bg-slate-950/40 dark:text-slate-400">
        Aucun QR code enregistré pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-2">
        {entries.map((entry) => (
          <QrHistoryItem key={entry.id} entry={entry} onDelete={handleDelete} />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoadingMore}
            className="min-w-32"
          >
            {isLoadingMore ? "Chargement..." : "Charger plus"}
          </Button>
        </div>
      )}
    </div>
  );
}

type QrHistoryItemProps = {
  entry: HistoryEntry;
  onDelete: (id: string) => Promise<void>;
};

const QrHistoryItem = memo(function QrHistoryItem({ entry, onDelete }: QrHistoryItemProps) {
  const { Canvas } = useQRCode();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const { success, error } = useToastContext();

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      const canvas = canvasContainerRef.current?.querySelector("canvas");
      if (!canvas) {
        throw new Error("Canvas QR non trouvé");
      }

      // Petite pause pour l'UX
      await new Promise(resolve => setTimeout(resolve, 300));

      const dataUrl = canvas.toDataURL("image/png");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `qr-code-${timestamp}.png`;
      
      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      success("QR code téléchargé avec succès !");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du téléchargement";
      error(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Card className="border-slate-200/70 dark:border-slate-800/60">
        <CardHeader className="space-y-1">
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {entry.title || entry.url}
          </CardTitle>
          <CardDescription className="break-words text-xs text-slate-500 dark:text-slate-400">
            {new Date(entry.generated_at).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
            {entry.image_url ? (
                <div className="relative h-40 overflow-hidden rounded-md border border-slate-200/70 bg-white/70 dark:border-slate-800/60 dark:bg-slate-900/60">
                  <Image
                    src={entry.image_url}
                    alt={entry.title || entry.url}
                    fill
                    sizes="(min-width: 768px) 384px, 100vw"
                    className="object-cover"
                    loading="lazy"
                    unoptimized
                    referrerPolicy="no-referrer"
                  />
                </div>
            ) : <div className="hidden md:block relative h-40 overflow-hidden rounded-md border border-slate-200/70 bg-white/70 dark:border-slate-800/60 dark:bg-slate-900/60"></div>}
          <div className="flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
            <span className="truncate" title={entry.url}>
              {entry.url}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "h-8 px-3 text-xs")}
                onClick={() => setIsDialogOpen(true)}
              >
                Voir le QR
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md space-y-4">
          <DialogHeader>
            <DialogTitle>{entry.title || "QR Code"}</DialogTitle>
            <DialogDescription className="break-words">{entry.url}</DialogDescription>
          </DialogHeader>
          <div
            ref={canvasContainerRef}
            className="grid place-items-center rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-6 dark:border-slate-700 dark:bg-slate-900/60"
          >
            <Canvas
              text={entry.url}
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
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col items-stretch gap-2 sm:flex-row sm:justify-start">
              <Button 
                onClick={handleDownload} 
                disabled={isDeleting || isDownloading}
              >
                {isDownloading ? "Téléchargement..." : "Télécharger"}
              </Button>
              <Link
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-10 px-4")}
                href={entry.url}
                target="_blank"
                rel="noreferrer"
              >
                Ouvrir
              </Link>
            </div>
            <Button
              variant="outline"
              className="border-rose-500 text-rose-500 hover:bg-rose-500/10"
              onClick={() => {
                setDeleteError(null);
                setIsDeleteConfirmOpen(true);
              }}
              disabled={isDeleting || isDownloading}
            >
              Supprimer
            </Button>
          </DialogFooter>
          {deleteError ? (
            <p className="text-sm text-rose-500">{deleteError}</p>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-sm space-y-4">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Voulez-vous vraiment supprimer ce QR code ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {deleteError ? (
            <p className="text-sm text-rose-500">{deleteError}</p>
          ) : null}
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button
              variant="outline"
              className="border-rose-500 text-rose-500 hover:bg-rose-500/10"
              onClick={async () => {
                setDeleteError(null);
                setIsDeleting(true);
                try {
                  await onDelete(entry.id);
                  setIsDeleteConfirmOpen(false);
                  setIsDialogOpen(false);
                  success("QR code supprimé avec succès");
                } catch (deleteError) {
                  const errorMessage = deleteError instanceof Error ? deleteError.message : "Une erreur est survenue.";
                  setDeleteError(errorMessage);
                  error(`Erreur de suppression: ${errorMessage}`);
                } finally {
                  setIsDeleting(false);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});
