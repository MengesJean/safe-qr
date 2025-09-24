export type QrMetadata = {
  title?: string | null;
  imageUrl?: string | null;
};

export type QrFormProps = {
  url: string;
  isLocked: boolean;
  inputValidationClasses: string;
  isSubmitDisabled: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onUrlChange: (nextValue: string) => void;
  onDownload: () => void;
  showDownloadButton: boolean;
  isDownloading?: boolean;
};

export type QrGeneratorProps = {
  onLog: (url: string) => Promise<void> | void;
};

export type QrHistoryItem = {
  id: string;
  url: string;
  title: string | null;
  image_url: string | null;
  generated_at: string;
  user_id: string;
};

export type QrPreviewProps = {
  Canvas: React.ComponentType<{ text: string; options: Record<string, unknown> }>;
  canvasContainerRef: React.RefObject<HTMLDivElement>;
  qrValue: string | null;
};