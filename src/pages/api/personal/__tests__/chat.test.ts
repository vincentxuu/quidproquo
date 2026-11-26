import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocked = vi.hoisted(() => ({ identity: vi.fn(), list: vi.fn(), get: vi.fn(), save: vi.fn(), remove: vi.fn() }));
vi.mock('../../../../lib/auth/access', () => ({ requireAccessIdentity: mocked.identity }));
vi.mock('../../../../lib/personal/chat', async importOriginal => {
  const actual = await importOriginal<typeof import('../../../../lib/personal/chat')>();
  return { ...actual, PersonalChatRepository: class { list = mocked.list; get = mocked.get; save = mocked.save; delete = mocked.remove; } };
});
import { env } from 'cloudflare:workers';
import { GET, POST } from '../chat';
const data = { ownerId: 'alice', threadId: 'thread', revision: 0, messages: [{ id: 'q', role: 'user', content: 'Private' }] };
function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://quidproquo.cc/api/personal/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://quidproquo.cc', ...headers }, body: JSON.stringify(body) });
}
beforeEach(() => { vi.clearAllMocks(); Object.assign(env, { DB: {} }); mocked.identity.mockResolvedValue({ sub: 'alice', email: 'owner@example.com' }); mocked.list.mockResolvedValue([]); mocked.save.mockImplementation(async value => ({ ...value, revision: 1 })); });
describe('private chat endpoint', () => {
  it('requires verified Access before listing transcripts', async () => {
    mocked.identity.mockRejectedValue(new Response('', { status: 401 }));
    expect((await GET({ request: new Request('https://quidproquo.cc/api/personal/chat') } as never)).status).toBe(401);
    expect(mocked.list).not.toHaveBeenCalled();
  });
  it('rejects CSRF and identity changes before persisting', async () => {
    expect((await POST({ request: request(data, { Origin: 'https://evil.example' }) } as never)).status).toBe(403);
    expect((await POST({ request: request({ ...data, ownerId: 'bob' }) } as never)).status).toBe(409);
    expect(mocked.save).not.toHaveBeenCalled();
  });
  it('saves bounded messages, returns private no-store and keeps conflict errors explicit', async () => {
    const response = await POST({ request: request(data) } as never);
    expect(response.status).toBe(200); expect(response.headers.get('Cache-Control')).toBe('private, no-store');
    expect(mocked.save).toHaveBeenCalledWith({ threadId: 'thread', revision: 0, messages: data.messages });
    mocked.save.mockRejectedValue(new Response('', { status: 409 }));
    expect((await POST({ request: request(data) } as never)).status).toBe(409);
  });
  it('returns the owner on deletion so the client acknowledges a completed mutation', async () => {
    const response = await POST({ request: request({ action: 'delete', threadId: 'thread', revision: 1, ownerId: 'alice' }) } as never);
    expect(response.status).toBe(200); await expect(response.json()).resolves.toEqual({ deleted: true, ownerId: 'alice' });
    expect(mocked.remove).toHaveBeenCalledWith('thread', 1);
  });
  it('rejects malformed IDs, transcript sizes and unsupported payload types', async () => {
    expect((await GET({ request: new Request('https://quidproquo.cc/api/personal/chat?thread=bad:id') } as never)).status).toBe(400);
    expect((await POST({ request: request({ ...data, messages: Array(41).fill(data.messages[0]) }) } as never)).status).toBe(400);
    expect((await POST({ request: request(data, { 'Content-Type': 'text/plain' }) } as never)).status).toBe(415);
    expect(mocked.save).not.toHaveBeenCalled();
  });
});
