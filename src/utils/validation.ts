import { ALLOWED_PROTOCOLS } from "@/config";

export const normalizeUrl = (input: string): string | null => {
  const trimmedValue = input.trim();

  if (!trimmedValue) {
    return null;
  }

  const prepareCandidate = (candidate: string) => {
    try {
      const url = new URL(candidate);
      const hostname = url.hostname;
      const isLocalhost = hostname === "localhost";
      const hasDomain = hostname.includes(".");

      if (!hostname || !ALLOWED_PROTOCOLS.includes(url.protocol)) {
        return null;
      }

      if (!isLocalhost && !hasDomain) {
        return null;
      }

      return url.toString();
    } catch {
      return null;
    }
  };

  return (
    prepareCandidate(trimmedValue) ??
    prepareCandidate(`https://${trimmedValue.replace(/^\/+/, "")}`)
  );
};

export const isValidUrl = (url: string): boolean => {
  return normalizeUrl(url) !== null;
};

export const validateProtocol = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return ALLOWED_PROTOCOLS.includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};