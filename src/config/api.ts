// Timeout pour les requêtes metadata (5 secondes)
export const METADATA_FETCH_TIMEOUT = 5000;

// Rate limiting configuration
export const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requêtes par minute par IP

// Content size limits
export const MAX_CONTENT_SIZE = 2 * 1024 * 1024; // 2MB max

// User Agent pour les requêtes
export const USER_AGENT = "SafeQR/1.0 (+https://safe-qr.app/bot) Mozilla/5.0 (compatible; SafeQRBot/1.0)";

// Meta image keys pour extraction
export const META_IMAGE_KEYS = [
  "og:image",
  "og:image:secure_url", 
  "twitter:image",
  "twitter:image:src",
];