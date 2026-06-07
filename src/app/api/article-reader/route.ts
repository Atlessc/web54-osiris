import { NextRequest, NextResponse } from "next/server";

import { getClientIp, isRateLimited, safeFetch } from "@/lib/ssrf-guard";

export const dynamic = "force-dynamic";

const MAX_RESPONSE_BYTES = 1_500_000;
const MAX_READER_CHARACTERS = 24_000;
const MIN_USEFUL_READER_CHARACTERS = 200;

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    );
}

function stripMarkup(value: string) {
  return decodeHtmlEntities(
    value
      .replace(/<(script|style|noscript|svg|form|nav|footer|header|aside)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|article|section|li|h[1-6])>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getMetaContent(html: string, property: string) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const propertyFirst = html.match(
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      "i",
    ),
  );
  const contentFirst = html.match(
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`,
      "i",
    ),
  );

  return decodeHtmlEntities(propertyFirst?.[1] || contentFirst?.[1] || "").trim();
}

function extractReadableContent(html: string) {
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1];
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1];
  return stripMarkup(article || main || body || html).slice(0, MAX_READER_CHARACTERS);
}

async function readTextLimited(response: Response) {
  if (!response.body) return "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytesRead = 0;
  let text = "";

  while (bytesRead < MAX_RESPONSE_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;

    bytesRead += value.byteLength;
    text += decoder.decode(value, { stream: true });
  }

  await reader.cancel().catch(() => undefined);
  return text + decoder.decode();
}

export async function GET(request: NextRequest) {
  if (isRateLimited(getClientIp(request), 30, 60_000)) {
    return NextResponse.json(
      { error: "Article reader rate limit reached" },
      { status: 429 },
    );
  }

  const url = request.nextUrl.searchParams.get("url")?.trim();
  if (!url) {
    return NextResponse.json({ error: "Article URL is required" }, { status: 400 });
  }

  try {
    const response = await safeFetch(url, {
      signal: AbortSignal.timeout(12_000),
      maxRedirects: 5,
      headers: {
        "User-Agent": "OSIRIS-Local-Article-Reader/1.0 (+https://osirisai.live)",
        Accept: "text/html,application/xhtml+xml;q=0.9,text/plain;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`Article returned HTTP ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      throw new Error(`Unsupported article content type: ${contentType || "unknown"}`);
    }

    const html = await readTextLimited(response);
    const title =
      getMetaContent(html, "og:title") ||
      stripMarkup(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
    const description =
      getMetaContent(html, "og:description") ||
      getMetaContent(html, "description");
    const content = extractReadableContent(html);

    if (!content) {
      throw new Error("No readable article text could be extracted");
    }
    if (
      new URL(response.url || url).hostname === "news.google.com" &&
      (title === "Google News" || content.length < MIN_USEFUL_READER_CHARACTERS)
    ) {
      throw new Error(
        "Google News did not expose the publisher article text to the local reader",
      );
    }

    return NextResponse.json({
      title,
      description,
      content,
      resolvedUrl: response.url || url,
      truncated: content.length >= MAX_READER_CHARACTERS,
      extractedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Article reader could not load this URL",
      },
      { status: 502 },
    );
  }
}
