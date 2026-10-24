import { describe, it, expect, vi } from 'vitest';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { cloudChatSchema, cloudChatResponseSchema, PersonalChatRepository, resolveChatScope } from '../chat';

function database() {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('../../../../migrations/0039_personal_chat.sql', import.meta.url), 'utf8'));
  return { prepare(sql: string) { const statement = sqlite.prepare(sql); return { bind(...args: unknown[]) { return {
    async first() { return statement.get(...args as never[]) ?? null; },
    async all() { return { results: statement.all(...args as never[]) }; },
    async run() { const result = statement.run(...args as never[]); return { meta: { changes: Number(result.changes) } }; },
  }; } }; } } as unknown as D1Database;
}
const transcript = { threadId: 'same-client-thread', revision: 0, messages: [{ id: 'q', role: 'user' as const, content: 'Private question' }] };

describe('chat privacy boundaries', () => {
  it('validates unknown cloud responses before the widget reads identity or transcripts', () => {
    expect(cloudChatResponseSchema.safeParse({}).success).toBe(false);
    expect(cloudChatResponseSchema.safeParse({ ownerId: 'alice', threads: [{ threadId: 'x', title: 'Title', revision: 1, updatedAt: 100 }] }).success).toBe(true);
    expect(cloudChatResponseSchema.safeParse({ ownerId: 'alice', transcript: { forged: true } }).success).toBe(false);
    expect(cloudChatResponseSchema.parse({ ownerId: 'alice', deleted: true })).toEqual({ ownerId: 'alice', deleted: true });
  });
  it('namespaces checkpoint IDs by verified subject, never email/header values or raw chosen ID', async () => {
    const request = new Request('https://quidproquo.cc/api/chat', { headers: { 'Cf-Access-Jwt-Assertion': 'signed-token' } });
    const resolve = (sub: string) => resolveChatScope(request, transcript.threadId, { configured: true, authenticate: async () => ({ sub, email: 'owner@example.com' }) });
    const alice = await resolve('alice');
    expect(alice.threadId).toMatch(/^access:[a-f0-9]{64}$/);
    expect((await resolve('alice')).threadId).toBe(alice.threadId);
    expect((await resolve('bob')).threadId).not.toBe(alice.threadId);
    expect(alice.threadId).not.toContain(transcript.threadId);
  });
  it('gives guests fresh scopes even for guessed victim client IDs and never invokes authentication', async () => {
    const authenticate = vi.fn();
    const request = new Request('https://quidproquo.cc/api/chat');
    const a = await resolveChatScope(request, transcript.threadId, { configured: true, authenticate });
    const b = await resolveChatScope(request, transcript.threadId, { configured: true, authenticate });
    expect(a.threadId).toMatch(/^guest:/); expect(a.ownerId).toBeUndefined(); expect(a.threadId).not.toBe(b.threadId); expect(authenticate).not.toHaveBeenCalled();
  });
  it('rejects forged/expired assertions and invalid thread identifiers instead of falling back', async () => {
    const request = new Request('https://quidproquo.cc/api/chat', { headers: { Cookie: 'CF_Authorization=forged' } });
    await expect(resolveChatScope(request, 'valid', { configured: true, authenticate: async () => { throw new Response('', { status: 401 }); } })).rejects.toMatchObject({ status: 401 });
    await expect(resolveChatScope(request, 'access:guessed', { configured: false, authenticate: vi.fn() })).rejects.toMatchObject({ status: 400 });
  });
  it('isolates list/get/update/delete with real SQL for identical client thread IDs', async () => {
    const db = database(); const alice = new PersonalChatRepository(db, 'alice'); const bob = new PersonalChatRepository(db, 'bob');
    const first = await alice.save(transcript); expect(first.revision).toBe(1);
    expect(await bob.list()).toEqual([]);
    await expect(bob.get(transcript.threadId)).rejects.toMatchObject({ status: 404 });
    await expect(bob.delete(transcript.threadId, 1)).rejects.toMatchObject({ status: 409 });
    await bob.save({ ...transcript, messages: [{ id: 'q', role: 'user', content: 'Bob private' }] });
    expect((await alice.get(transcript.threadId)).messages[0].content).toBe('Private question');
    await alice.save({ ...first, messages: [{ id: 'q', role: 'user', content: 'Alice updated' }] });
    expect((await bob.get(transcript.threadId)).messages[0].content).toBe('Bob private');
    await alice.delete(transcript.threadId, 2);
    expect(await alice.list()).toEqual([]); expect(await bob.list()).toHaveLength(1);
  });
  it('rejects stale saves/deletes and duplicate imports without overwriting cloud data', async () => {
    const repo = new PersonalChatRepository(database(), 'alice');
    await repo.save(transcript);
    await expect(repo.save(transcript)).rejects.toMatchObject({ status: 409 });
    const loaded = await repo.get(transcript.threadId);
    await repo.save({ ...loaded, messages: [{ id: 'q', role: 'user', content: 'New version' }] });
    await expect(repo.save(loaded)).rejects.toMatchObject({ status: 409 });
    await expect(repo.delete(transcript.threadId, 1)).rejects.toMatchObject({ status: 409 });
    expect((await repo.get(transcript.threadId)).messages[0].content).toBe('New version');
  });
  it('bounds stored transcript and strips untrusted UI/identity metadata', () => {
    expect(cloudChatSchema.safeParse({ ...transcript, messages: Array(41).fill(transcript.messages[0]) }).success).toBe(false);
    expect(cloudChatSchema.safeParse({ ...transcript, messages: [{ ...transcript.messages[0], content: 'x'.repeat(32769) }] }).success).toBe(false);
    const result = cloudChatSchema.parse({ ...transcript, ownerId: 'forged', messages: [{ ...transcript.messages[0], streaming: true, ownerId: 'forged' }] });
    expect(result).not.toHaveProperty('ownerId'); expect(result.messages[0]).not.toHaveProperty('streaming');
  });
});

describe('authenticated public chat CSRF', () => {
  it('rejects cross-site Access-cookie POST before private history or admin quota is accessed', async () => {
    const authenticate = vi.fn();
    const request = new Request('https://quidproquo.cc/api/chat', { method: 'POST', headers: { Cookie: 'CF_Authorization=signed', Origin: 'https://evil.example' } });
    await expect(resolveChatScope(request, 'thread', { configured: true, authenticate })).rejects.toMatchObject({ status: 403 });
    expect(authenticate).not.toHaveBeenCalled();
  });
  it('retains verified identity on same-site POST and guest access without cookies', async () => {
    const authenticate = vi.fn().mockResolvedValue({ sub: 'owner', email: 'reader@example.com' });
    const request = new Request('https://quidproquo.cc/api/chat', { method: 'POST', headers: { Cookie: 'CF_Authorization=signed', Origin: 'https://quidproquo.cc' } });
    expect((await resolveChatScope(request, 'thread', { configured: true, authenticate })).ownerId).toBe('owner');
    const guest = new Request('https://quidproquo.cc/api/chat', { method: 'POST' });
    expect((await resolveChatScope(guest, 'thread', { configured: true, authenticate })).ownerId).toBeUndefined();
  });
});
