// App configuration
export const APP_NAME = "Safe QR";
export const APP_VERSION = "1.0.0";
export const APP_URL = "https://safe-qr.app";

// Supported protocols
export const ALLOWED_PROTOCOLS = ["http:", "https:"];

// Auth configuration
export const AUTH_REDIRECT_PATH = "/auth/callback";

// Environment checks
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
export const IS_PRODUCTION = process.env.NODE_ENV === "production";