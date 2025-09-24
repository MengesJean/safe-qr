import { Button } from "@/components/ui/button";

type QrActionsProps = {
  isLocked: boolean;
  isSubmitDisabled: boolean;
  onDownload: () => void;
  showDownloadButton: boolean;
};

export function QrActions({ isLocked, isSubmitDisabled, onDownload, showDownloadButton }: QrActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button type="submit" className="flex-1" disabled={isSubmitDisabled}>
        {isLocked ? "Générer un autre QR Code" : "Générer"}
      </Button>
      {showDownloadButton ? (
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800/80"
          onClick={onDownload}
        >
          Télécharger
        </Button>
      ) : null}
    </div>
  );
}
