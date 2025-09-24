export const normalizeUrl = (input: string): string | null => {
  const trimmedValue = input.trim();

  if (!trimmedValue) {
    return null;
  }

  const prepareCandidate = (candidate: string) => {
    try {
      const url = new URL(candidate);
      const protocol = url.protocol.replace(":", "");
      const hostname = url.hostname;
      const isLocalhost = hostname === "localhost";
      const hasDomain = hostname.includes(".");

      if (!hostname || !["http", "https"].includes(protocol)) {
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
