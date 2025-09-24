// Pagination configuration
export const ITEMS_PER_PAGE = 20;

// Toast configuration
export const TOAST_DURATION = 3000; // 3 seconds

// Download delay for UX
export const DOWNLOAD_DELAY = 300; // 300ms

// QR Code generation options
export const QR_OPTIONS = {
  errorCorrectionLevel: "M" as const,
  type: "image/png" as const,
  quality: 1,
  margin: 1,
  color: {
    dark: "#000000",
    light: "#FFFFFF"
  }
};