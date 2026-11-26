import type { APIRoute } from 'astro';
import type { Ai } from '@cloudflare/workers-types';
import { env } from 'cloudflare:workers';
import { parseVoice, speakingVoices } from '../../lib/english-speaking';
import { json } from '../../lib/api/response';

export const prerender = false;
const MODEL = '@cf/deepgram/aura-2-en';

export const POST: APIRoute = async ({ request }) => {
  let input: unknown;
  try { input = await request.json(); }
  catch { return json({ error: 'Invalid JSON.' }, 400); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return json({ error: 'Expected text and voice.' }, 400);
  const { text, voice } = input as Record<string, unknown>;
  if (typeof text !== 'string' || !text.trim() || text.trim().length > 500) return json({ error: 'Text must contain 1–500 characters.' }, 400);
  if (typeof voice !== 'string' || !speakingVoices.some(item => item.id === voice)) return json({ error: 'Select one of the four available voices.' }, 400);
  const normalizedText = text.trim();
  const speaker = parseVoice(voice);
  const ai = (env as { AI?: Ai }).AI;
  if (!ai) return json({ error: 'Pronunciation service is unavailable.' }, 503);

  let cache: Cache | undefined;
  let cacheKey: Request | undefined;
  try {
    if (typeof caches !== 'undefined') {
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify([MODEL, speaker, normalizedText])));
      const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
      cacheKey = new Request(new URL(`/api/tts/cache/${hash}`, request.url));
      cache = await caches.open('vocabulary-tts-v1');
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }
  } catch { cache = undefined; }

  try {
    // Workers AI returns the audio stream; its published type currently says string.
    const audio: unknown = await ai.run(MODEL, { text: normalizedText, speaker, encoding: 'mp3' });
    if (!(audio instanceof ReadableStream)) return json({ error: 'Pronunciation service returned invalid audio.' }, 502);
    const response = new Response(audio, { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=86400', 'X-Content-Type-Options': 'nosniff' } });
    if (cache && cacheKey) {
      try { await cache.put(cacheKey, response.clone()); }
      catch { /* Cache availability must not prevent pronunciation. */ }
    }
    return response;
  } catch (error) {
    console.error('[vocabulary-tts]', error instanceof Error ? error.message : 'Unknown inference error');
    return json({ error: 'Pronunciation could not be generated. Please try again.' }, 502);
  }
};
