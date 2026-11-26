import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import {
  applyPostSyncOperations,
  listPostSyncManifest,
  parsePostSyncOperations,
} from '../../../../lib/indexing/post-sync'
import type { Env } from '../../../../lib/config/env'

export const prerender = false

const SECRET_HEADER = 'X-Index-Sync-Secret'
const MAX_BODY_BYTES = 8 * 1024 * 1024

export const GET: APIRoute = async ({ request }) => {
  const bindings = env as unknown as Env
  if (!isAuthorized(request, bindings.INDEX_SYNC_SECRET)) return unauthorized()

  const posts = await listPostSyncManifest(bindings.DB)
  return json({ posts })
}

export const POST: APIRoute = async ({ request }) => {
  const bindings = env as unknown as Env
  if (!isAuthorized(request, bindings.INDEX_SYNC_SECRET)) return unauthorized()

  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) return json({ error: 'Request body too large' }, 413)

  let operations
  try {
    operations = parsePostSyncOperations(await request.json())
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request'
    return json({ error: message }, 400)
  }

  try {
    await applyPostSyncOperations(bindings.DB, operations)
  } catch (error) {
    // D1 batch is a single transaction, so a failed batch writes nothing and the
    // caller can retry safely. Surface the cause instead of Astro's bare 500.
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[index-sync] apply failed for ${operations.length} operation(s): ${message}`)
    return json({ error: message }, 500)
  }
  return json({ ok: true, applied: operations.length })
}

function isAuthorized(request: Request, secret: string | undefined): boolean {
  return Boolean(secret) && request.headers.get(SECRET_HEADER) === secret
}

function unauthorized(): Response {
  return json({ error: 'Unauthorized' }, 401)
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
