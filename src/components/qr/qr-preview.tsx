import { ComponentType, MutableRefObject } from "react";

type CanvasComponent = ComponentType<{
  text: string;
  options?: Record<string, unknown>;
}>;

type QrPreviewProps = {
  Canvas: CanvasComponent;
  canvasContainerRef: MutableRefObject<HTMLDivElement | null>;
  qrValue: string | null;
};

export const QrPreview = ({ Canvas, canvasContainerRef, qrValue }: QrPreviewProps) => {
  return (
    <>
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
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Votre QR code apparaîtra ici après génération.
          </p>
        )}
      </div>
      {qrValue ? (
        <p className="w-full break-words text-center text-xs text-slate-500 dark:text-slate-400">
          {qrValue}
        </p>
      ) : null}
    </>
  );
};
