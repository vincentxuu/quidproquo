import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { z } from 'zod';
import { requireAccessIdentity } from '../../lib/auth/access';
import { VocabularyRepository, vocabularySourceSchema, validateImportedCards } from '../../lib/vocabularyRepository';
import { lexiconEntrySchema } from '../../lib/vocabularyLexicon';

export const prerender = false;
const MAX_BODY = 2_000_000;
const id = z.string().min(1).max(200);
const actionSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('save'), entry: lexiconEntrySchema, source: vocabularySourceSchema }),
  z.object({ action: z.literal('import'), cards: z.array(z.unknown()).max(1000) }),
  z.object({ action: z.literal('entry'), id, entry: lexiconEntrySchema }),
  z.object({ action: z.literal('review'), id, rating: z.enum(['again', 'hard', 'good', 'easy']) }),
  z.object({ action: z.literal('delete'), id }),
]);
function response(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store', Vary: 'Cookie' } });
}
async function repository(request: Request) {
  const identity = await requireAccessIdentity(request);
  const db = (env as unknown as { DB?: D1Database }).DB;
  if (!db) throw response({ error: '單字庫暫時無法使用。' }, 503);
  return new VocabularyRepository(db, identity.sub);
}
function failure(error: unknown) {
  if (error instanceof Response) return response({ error: error.status === 401 ? '請先登入單字庫。' : error.status === 404 ? '找不到此單字。' : error.status === 409 ? '資料已更新，請重試。' : '單字庫暫時無法使用。' }, error.status);
  return response({ error: '單字庫暫時無法使用，資料尚未儲存。' }, 503);
}
export const GET: APIRoute = async ({ request }) => {
  try { return response({ cards: await (await repository(request)).list() }); } catch (error) { return failure(error); }
};
export const POST: APIRoute = async ({ request }) => {
  try {
    const repo = await repository(request);
    if (request.headers.get('origin') !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') return response({ error: '不允許跨網站修改單字庫。' }, 403);
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return response({ error: '請使用 JSON。' }, 415);
    if (Number(request.headers.get('content-length')) > MAX_BODY) return response({ error: '匯入資料過大。' }, 413);
    const reader = request.body?.getReader();
    if (!reader) return response({ error: '無效的資料。' }, 400);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > MAX_BODY) { await reader.cancel(); return response({ error: '匯入資料過大。' }, 413); } chunks.push(value); }
    let body: unknown;
    try { const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; } body = JSON.parse(new TextDecoder().decode(bytes)); } catch { return response({ error: '無效的 JSON。' }, 400); }
    const parsed = actionSchema.safeParse(body);
    if (!parsed.success) return response({ error: '單字資料格式不正確。' }, 400);
    const action = parsed.data; let alreadySaved: boolean | undefined;
    switch (action.action) {
      case 'save': alreadySaved = await repo.save(action.entry, action.source); break;
      case 'import': { let cards; try { cards = validateImportedCards(action.cards); } catch { return response({ error: '匯入資料格式不正確。' }, 400); } await repo.import(cards); break; }
      case 'entry': await repo.attachEntry(action.id, action.entry); break;
      case 'review': await repo.review(action.id, action.rating); break;
      case 'delete': await repo.delete(action.id); break;
    }
    return response({ cards: await repo.list(), ...(alreadySaved === undefined ? {} : { alreadySaved }) });
  } catch (error) { return failure(error); }
};
