export const formatTimestamp = (): string => {
  return new Date().toISOString().replace(/[:.]/g, "-");
};

export const formatQrFilename = (timestamp?: string): string => {
  const ts = timestamp || formatTimestamp();
  return `qr-code-${ts}.png`;
};

export const formatIsoDate = (): string => {
  return new Date().toISOString();
};

export const formatDisplayDate = (isoDate: string): string => {
  return new Date(isoDate).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',  
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const escapeRegExp = (value: string): string => {
  return value.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};