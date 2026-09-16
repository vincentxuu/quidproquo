// src/utils/youtube.ts

const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com']);

/** Extracts the video ID from common YouTube URL shapes (watch, youtu.be, embed, shorts). */
export function getYouTubeEmbedId(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    if (!YOUTUBE_HOSTS.has(parsed.hostname)) return undefined;
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1) || undefined;
    if (parsed.pathname === '/watch') return parsed.searchParams.get('v') ?? undefined;
    const match = parsed.pathname.match(/^\/(embed|shorts)\/([^/]+)/);
    return match?.[2];
  } catch {
    return undefined;
  }
}
