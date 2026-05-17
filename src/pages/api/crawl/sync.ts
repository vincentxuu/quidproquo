export const prerender = false;

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { runCrawlSync } from '../../../lib/crawl/sync';
import { json } from '@/lib/api/response'
import { CRAWL_SECRET_HEADER } from '@/lib/auth/scheduled-auth'

export const POST: APIRoute = async ({ request }) => {
  // 驗證 secret
  const secret = (env as unknown as { CRAWL_SECRET?: string }).CRAWL_SECRET;
  if (!secret) {
    return new Response(JSON.stringify({ error: 'CRAWL_SECRET not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const provided = request.headers.get(CRAWL_SECRET_HEADER);
  if (provided !== secret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const runId = crypto.randomUUID();
    const startedAt = Date.now();
    const options = await readSyncOptions(request);
    console.log('[crawl] Sync run started', JSON.stringify({ runId, options }));

    const results = await runCrawlSync({ ...options, secret: provided });
    const totalChunks = results.reduce((sum, r) => sum + r.chunks, 0);
    const errors = results.filter(r => r.error);
    const body = {
      ok: errors.length === 0,
      status: errors.length === 0 ? 'ok' : 'partial_error',
      runId,
      durationMs: Date.now() - startedAt,
      results,
      totalChunks,
      errors: errors.length,
      needsEmbedSync: totalChunks > 0,
    };

    console.log('[crawl] Sync run finished', JSON.stringify(body));
    return json(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (err instanceof BadRequestError) {
      return new Response(JSON.stringify({ ok: false, error: message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

async function readSyncOptions(request: Request): Promise<{ full?: boolean; modifiedSince?: number }> {
  const text = await request.text();
  if (!text.trim()) return {};

  let body: { full?: boolean; modifiedSince?: number | string | null };
  try {
    body = JSON.parse(text) as { full?: boolean; modifiedSince?: number | string | null };
  } catch {
    throw new BadRequestError('Request body must be valid JSON');
  }

  const modifiedSince = body.modifiedSince === undefined || body.modifiedSince === null
    ? undefined
    : Number(body.modifiedSince);

  if (modifiedSince !== undefined && (!Number.isInteger(modifiedSince) || modifiedSince <= 0)) {
    throw new BadRequestError('modifiedSince must be a positive Unix timestamp in seconds');
  }

  return {
    full: body.full === true,
    modifiedSince,
  };
}


class BadRequestError extends Error {}
