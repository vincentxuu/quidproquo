import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { requireAccessIdentity } from '../../../lib/auth/access';
import { chatThreadIdSchema, cloudChatSchema, PersonalChatRepository } from '../../../lib/personal/chat';

export const prerender = false;
const MAX_BODY = 300_000;
const response = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store', Vary: 'Cookie, Cf-Access-Jwt-Assertion' } });
async function repository(request: Request) {
  const identity = await requireAccessIdentity(request);
  const db = (env as unknown as { DB?: D1Database }).DB;
  if (!db) throw new Response('Storage unavailable', { status: 503 });
  return { repo: new PersonalChatRepository(db, identity.sub), ownerId: identity.sub };
}
function failure(error: unknown) {
  const status = error instanceof Response ? error.status : 503;
  return response({ error: status === 409 ? '對話已在其他裝置更新，請先重新載入；目前內容仍保留在本機。' : status === 401 ? '請先登入。' : status === 404 ? '找不到此對話。' : '無法存取雲端對話。', loginUrl: '/auth/login' }, status);
}
export const GET: APIRoute = async ({ request }) => {
  try {
    const { repo, ownerId } = await repository(request);
    const threadId = new URL(request.url).searchParams.get('thread');
    if (threadId === null) return response({ threads: await repo.list(), ownerId });
    if (!chatThreadIdSchema.safeParse(threadId).success) return response({ error: '無效的對話 ID。' }, 400);
    return response({ transcript: await repo.get(threadId), ownerId });
  } catch (error) { return failure(error); }
};
export const POST: APIRoute = async ({ request }) => {
  try {
    const { repo, ownerId } = await repository(request);
    if (request.headers.get('origin') !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') return response({ error: '不允許跨網站修改。' }, 403);
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return response({ error: '請使用 JSON。' }, 415);
    const reader = request.body?.getReader();
    if (!reader) return response({ error: '無效的資料。' }, 400);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > MAX_BODY) { await reader.cancel(); return response({ error: '資料過大。' }, 413); } chunks.push(value); }
    let body: unknown;
    try { const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; } body = JSON.parse(new TextDecoder().decode(bytes)); } catch { return response({ error: '無效的 JSON。' }, 400); }
    if (!body || typeof body !== 'object' || !('ownerId' in body) || body.ownerId !== ownerId) return response({ error: '登入帳號已變更，請重新載入雲端清單；本機對話仍保留。' }, 409);
    if (body && typeof body === 'object' && 'action' in body && body.action === 'delete') {
      const value = body as { threadId?: unknown; revision?: unknown };
      if (!chatThreadIdSchema.safeParse(value.threadId).success || !Number.isSafeInteger(value.revision) || Number(value.revision) < 1) return response({ error: '無效的資料。' }, 400);
      await repo.delete(value.threadId as string, value.revision as number);
      return response({ deleted: true, ownerId });
    }
    const parsed = cloudChatSchema.safeParse(body);
    if (!parsed.success) return response({ error: '對話格式不正確或超過保存上限。' }, 400);
    return response({ transcript: await repo.save(parsed.data), ownerId });
  } catch (error) { return failure(error); }
};
