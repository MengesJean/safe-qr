import { FormEvent } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { QrActions } from "./qr-actions";

type QrFormProps = {
  url: string;
  isLocked: boolean;
  inputValidationClasses: string;
  isSubmitDisabled: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUrlChange: (nextValue: string) => void;
  onDownload: () => void;
  showDownloadButton: boolean;
  isDownloading?: boolean;
};

export function QrForm({
  url,
  isLocked,
  inputValidationClasses,
  isSubmitDisabled,
  onSubmit,
  onUrlChange,
  onDownload,
  showDownloadButton,
  isDownloading = false,
}: QrFormProps) {
  return (
    <form className="space-y-4 pt-4" onSubmit={onSubmit}>
      <div className={`space-y-2${isLocked ? " hidden" : ""}`}>
        <Label htmlFor="target-url" className="text-slate-700 dark:text-slate-200">
          URL à convertir
        </Label>
        <Input
          id="target-url"
          type="text"
          placeholder="https://exemple.com"
          value={url}
          onChange={(event) => onUrlChange(event.target.value)}
          className={inputValidationClasses}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          disabled={isLocked}
        />
      </div>
      <QrActions
        isLocked={isLocked}
        isSubmitDisabled={isSubmitDisabled}
        onDownload={onDownload}
        showDownloadButton={showDownloadButton}
        isDownloading={isDownloading}
      />
    </form>
  );
}
