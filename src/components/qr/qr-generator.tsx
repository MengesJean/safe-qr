"use client";

import { CardContent, CardFooter } from "@/components/ui/card";
import { useQrGenerator } from "@/hooks/qr/use-qr-generator";
import { getValidationClasses } from "@/utils";
import type { QrGeneratorProps } from "@/types";

import { QrForm } from "./qr-form";
import { QrPreview } from "./qr-preview";

export const QrGenerator = ({ onLog }: QrGeneratorProps) => {
  const {
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
  } = useQrGenerator(onLog);

  const isSubmitDisabled = isLocked ? false : !normalizedUrl;
  const hasLiveError = Boolean(trimmedUrl) && !normalizedUrl;
  const isInvalid = !isLocked && (hasLiveError || Boolean(submissionError));
  const isValid = !isLocked && Boolean(normalizedUrl) && !submissionError;
  const inputValidationClasses = getValidationClasses(isValid, isInvalid);

  return (
    <>
      <CardContent>
        <QrForm
          url={url}
          isLocked={isLocked}
          inputValidationClasses={inputValidationClasses}
          isSubmitDisabled={isSubmitDisabled}
          onSubmit={handleGenerate}
          onUrlChange={handleUrlChange}
          onDownload={handleDownload}
          showDownloadButton={Boolean(qrValue)}
          isDownloading={isDownloading}
        />
      </CardContent>
      <CardFooter className="flex w-full flex-col items-center gap-6">
        <QrPreview Canvas={Canvas} canvasContainerRef={canvasContainerRef} qrValue={qrValue} />
      </CardFooter>
    </>
  );
};
