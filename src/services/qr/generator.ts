import { formatTimestamp } from "@/utils";
import { DOWNLOAD_DELAY } from "@/config";

export const downloadQrCode = async (
  canvasRef: React.RefObject<HTMLDivElement | null>
): Promise<void> => {
  const canvas = canvasRef.current?.querySelector("canvas");
  if (!canvas) {
    throw new Error("Canvas QR non trouvé");
  }

  // Petite pause pour l'UX
  await new Promise(resolve => setTimeout(resolve, DOWNLOAD_DELAY));

  const dataUrl = canvas.toDataURL("image/png");
  const timestamp = formatTimestamp();
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `qr-code-${timestamp}.png`;
  
  // Déclencher le téléchargement
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};