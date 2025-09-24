import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const META_IMAGE_KEYS = [
  "og:image",
  "og:image:secure_url",
  "twitter:image",
  "twitter:image:src",
];

function escapeRegExp(value: string) {
  return value.replace(/[\-\/\^$*+?.()|[\]{}]/g, "\\$&");
}

function extractTitle(html: string) {
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

function extractImage(html: string, baseUrl: string) {
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

function resolveUrl(candidate: string, baseUrl: string) {
  try {
    return new URL(candidate, baseUrl).toString();
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get("url");

  if (!urlParam) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(urlParam);
  } catch {
    return NextResponse.json({ error: "Invalid url parameter" }, { status: 400 });
  }

  try {
    const response = await fetch(target.toString(), {
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "SafeQRMetadataFetcher/1.0",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Unable to fetch metadata (status: ${response.status})` },
        { status: 502 },
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return NextResponse.json({ title: null, imageUrl: null });
    }

    const html = await response.text();
    const title = extractTitle(html);
    const imageUrl = extractImage(html, target.toString());

    return NextResponse.json({ title, imageUrl });
  } catch (error) {
    console.error("Failed to retrieve metadata", error);
    return NextResponse.json({ error: "Failed to retrieve metadata" }, { status: 502 });
  }
}
