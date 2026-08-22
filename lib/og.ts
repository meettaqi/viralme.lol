/** Decode common HTML entities */
function decode(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function extractMeta(html: string, ...attrs: string[]): string {
  for (const attr of attrs) {
    // property="og:xxx" content="..." or name="description" content="..."
    const m =
      html.match(
        new RegExp(
          `<meta[^>]+(?:property|name)=["']${attr}["'][^>]+content=["']([^"']*)["']`,
          "i"
        )
      ) ||
      html.match(
        new RegExp(
          `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${attr}["']`,
          "i"
        )
      );
    if (m?.[1]) return decode(m[1]);
  }
  return "";
}

export interface OGData {
  title: string;
  description: string;
}

export async function fetchOG(rawUrl: string): Promise<OGData> {
  try {
    const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: AbortSignal.timeout(6000),
      redirect: "follow",
    });

    if (!res.ok) return { title: "", description: "" };

    const html = await res.text();

    const title =
      extractMeta(html, "og:title") ||
      html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ||
      "";

    const description =
      extractMeta(html, "og:description") ||
      extractMeta(html, "description") ||
      "";

    return { title: decode(title), description: decode(description) };
  } catch {
    return { title: "", description: "" };
  }
}

/** Extract a clean hostname from a URL or @handle */
export function displayIdentity(identity: string): string {
  if (identity.startsWith("@")) return identity;
  try {
    const url = /^https?:\/\//i.test(identity)
      ? identity
      : `https://${identity}`;
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return identity;
  }
}
