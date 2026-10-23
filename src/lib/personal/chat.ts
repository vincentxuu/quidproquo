import { z } from 'zod';
import type { AccessIdentity } from '../auth/access';

export const chatThreadIdSchema = z.string().regex(/^[A-Za-z0-9_-]{1,128}$/);
export const cloudChatMessageSchema = z.object({
  id: z.string().min(1).max(128), role: z.enum(['user', 'assistant']), content: z.string().min(1).max(32_768),
});
export const cloudChatSchema = z.object({
  threadId: chatThreadIdSchema,
  messages: z.array(cloudChatMessageSchema).min(1).max(40),
  revision: z.number().int().nonnegative(),
}).refine(value => JSON.stringify(value.messages).length <= 65_536, 'Transcript too large');
export type CloudChat = z.infer<typeof cloudChatSchema>;
export type CloudChatSummary = { threadId: string; title: string; revision: number; updatedAt: number };
export const cloudChatResponseSchema = z.object({
  ownerId: z.string().min(1).max(256),
  threads: z.array(z.object({ threadId: chatThreadIdSchema, title: z.string().max(120), revision: z.number().int().positive(), updatedAt: z.number().finite() })).max(50).optional(),
  transcript: cloudChatSchema.optional(),
  deleted: z.boolean().optional(),
});

/** User-chosen IDs never directly address checkpoints, logs, or semantic-cache records. */
export async function resolveChatScope(request: Request, clientThread: unknown, options: {
  configured: boolean;
  authenticate: (request: Request) => Promise<AccessIdentity>;
}): Promise<{ threadId: string; ownerId?: string }> {
  if (!chatThreadIdSchema.safeParse(clientThread).success) throw new Response('Invalid thread ID', { status: 400 });
  const hasAssertion = request.headers.has('Cf-Access-Jwt-Assertion') || /(?:^|;)\s*CF_Authorization=/.test(request.headers.get('Cookie') ?? '');
  if (!options.configured || !hasAssertion) return { threadId: `guest:${crypto.randomUUID()}` };
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method.toUpperCase())
    && (request.headers.get('Origin') !== new URL(request.url).origin || request.headers.get('Sec-Fetch-Site') === 'cross-site')) {
    throw new Response('Cross-site authenticated chat is not allowed.', { status: 403 });
  }
  const identity = await options.authenticate(request);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify([identity.sub, clientThread])));
  return { threadId: `access:${Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')}`, ownerId: identity.sub };
}

export class PersonalChatRepository {
  constructor(private readonly db: D1Database, private readonly owner: string) {}
  async list(): Promise<CloudChatSummary[]> {
    const result = await this.db.prepare('SELECT thread_id, title, revision, updated_at FROM personal_chat_threads WHERE owner_id = ? ORDER BY updated_at DESC LIMIT 50').bind(this.owner).all<{ thread_id: string; title: string; revision: number; updated_at: number }>();
    return result.results.map(row => ({ threadId: row.thread_id, title: row.title, revision: row.revision, updatedAt: row.updated_at }));
  }
  async get(threadId: string): Promise<CloudChat> {
    const row = await this.db.prepare('SELECT transcript_json, revision FROM personal_chat_threads WHERE owner_id = ? AND thread_id = ?').bind(this.owner, threadId).first<{ transcript_json: string; revision: number }>();
    if (!row) throw new Response('Not found', { status: 404 });
    return cloudChatSchema.parse({ threadId, messages: JSON.parse(row.transcript_json), revision: row.revision });
  }
  async save(input: CloudChat): Promise<CloudChat> {
    const data = cloudChatSchema.parse(input);
    const title = (data.messages.find(message => message.role === 'user')?.content ?? 'Conversation').slice(0, 120);
    const result = data.revision === 0
      ? await this.db.prepare('INSERT INTO personal_chat_threads (owner_id, thread_id, title, transcript_json, revision, updated_at) VALUES (?, ?, ?, ?, 1, ?) ON CONFLICT(owner_id, thread_id) DO NOTHING').bind(this.owner, data.threadId, title, JSON.stringify(data.messages), Date.now()).run()
      : await this.db.prepare('UPDATE personal_chat_threads SET title = ?, transcript_json = ?, revision = revision + 1, updated_at = ? WHERE owner_id = ? AND thread_id = ? AND revision = ?').bind(title, JSON.stringify(data.messages), Date.now(), this.owner, data.threadId, data.revision).run();
    if (!result.meta.changes) throw new Response('Conflict', { status: 409 });
    return { ...data, revision: data.revision + 1 };
  }
  async delete(threadId: string, revision: number): Promise<void> {
    const result = await this.db.prepare('DELETE FROM personal_chat_threads WHERE owner_id = ? AND thread_id = ? AND revision = ?').bind(this.owner, threadId, revision).run();
    if (!result.meta.changes) throw new Response('Conflict', { status: 409 });
  }
}
