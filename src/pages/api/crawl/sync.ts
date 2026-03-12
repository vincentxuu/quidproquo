import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { runCrawlSync } from '../../../lib/crawl/sync';

export const POST: APIRoute = async ({ request }) => {
  // 驗證 secret
  const secret = (env as unknown as { CRAWL_SECRET?: string }).CRAWL_SECRET;
  if (!secret) {
    return new Response(JSON.stringify({ error: 'CRAWL_SECRET not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const provided = request.headers.get('X-Crawl-Secret');
  if (provided !== secret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const results = await runCrawlSync();
    const totalChunks = results.reduce((sum, r) => sum + r.chunks, 0);
    const errors = results.filter(r => r.error);

    return new Response(
      JSON.stringify({ ok: true, results, totalChunks, errors: errors.length }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
