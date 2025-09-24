"use server";

import { headers } from "next/headers";

// Timeout pour les requêtes metadata (5 secondes)
const METADATA_FETCH_TIMEOUT = 5000;

// Rate limiting simple en mémoire (basé sur IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requêtes par minute par IP

// Types pour les retours
export type MetadataResult = {
  success: true;
  data: {
    title: string | null;
    imageUrl: string | null;
  };
} | {
  success: false;
  error: string;
};

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

const META_IMAGE_KEYS = [
  "og:image",
  "og:image:secure_url",
  "twitter:image",
  "twitter:image:src",
];

function escapeRegExp(value: string) {
  return value.replace(/[\-\/\^$*+?.()|[\]{}]/g, "\\$&");
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (match) {
    return match[1].trim();
  }

  for (const pattern of [
    /<meta[^>]+name=["']title["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  ]) {
    const metaMatch = html.match(pattern);
    if (metaMatch) {
      return metaMatch[1].trim();
    }
  }

  return null;
}

function extractImage(html: string, baseUrl: string): string | null {
  for (const key of META_IMAGE_KEYS) {
    const regex = new RegExp(
      `<meta[^>]+(?:property|name)=["']${escapeRegExp(key)}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      "i",
    );
    const match = html.match(regex);
    if (match) {
      return resolveUrl(match[1].trim(), baseUrl);
    }
  }

  const linkMatch = html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["'][^>]*>/i);
  if (linkMatch) {
    return resolveUrl(linkMatch[1].trim(), baseUrl);
  }

  return null;
}

function resolveUrl(candidate: string, baseUrl: string): string | null {
  try {
    return new URL(candidate, baseUrl).toString();
  } catch {
    return null;
  }
}

export async function fetchUrlMetadata(url: string): Promise<MetadataResult> {
  try {
    // Rate limiting par IP
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || 
               headersList.get("x-real-ip") || 
               "unknown";
    
    if (!checkRateLimit(ip)) {
      return {
        success: false,
        error: "Trop de requêtes. Veuillez réessayer dans 1 minute."
      };
    }

    // Validation de l'URL
    if (!url || typeof url !== 'string') {
      return {
        success: false,
        error: "URL manquante ou invalide"
      };
    }

    let target: URL;
    try {
      target = new URL(url);
    } catch {
      return {
        success: false,
        error: "Format d'URL invalide"
      };
    }

    // Validation des protocoles autorisés
    if (!["http:", "https:"].includes(target.protocol)) {
      return {
        success: false,
        error: "Protocole non autorisé"
      };
    }

    // Configuration du timeout avec AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), METADATA_FETCH_TIMEOUT);

    const response = await fetch(target.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
        "User-Agent": "SafeQR/1.0 (+https://safe-qr.app/bot) Mozilla/5.0 (compatible; SafeQRBot/1.0)",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `Impossible de récupérer la page (status: ${response.status})`
      };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return {
        success: true,
        data: { title: null, imageUrl: null }
      };
    }

    // Vérification de la taille du contenu
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 2 * 1024 * 1024) { // 2MB max
      return {
        success: false,
        error: "Contenu trop volumineux"
      };
    }

    const html = await response.text();
    const title = extractTitle(html);
    const imageUrl = extractImage(html, target.toString());

    return {
      success: true,
      data: { title, imageUrl }
    };

  } catch (error) {
    console.error("Failed to retrieve metadata", error);
    
    // Gestion spécifique des erreurs de timeout
    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        error: "Timeout lors de la récupération des métadonnées"
      };
    }
    
    return {
      success: false,
      error: "Erreur lors de la récupération des métadonnées"
    };
  }
}