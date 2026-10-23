import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('astro:middleware', () => ({ defineMiddleware: (handler: unknown) => handler }));
vi.mock('./access', () => ({ accessConfigured: vi.fn(), requireAccessIdentity: vi.fn(), accessReturnTo: (path: string) => path }));
import { accessConfigured, requireAccessIdentity } from './access';
import { onRequest } from '../../middleware';
const next = vi.fn(async () => new Response('private'));
const call = async (path: string, options?: RequestInit) => {
  const url = new URL(path, 'https://quidproquo.cc');
  const response = await onRequest({ url, request: new Request(url, options) } as never, next as never);
  if (!(response instanceof Response)) throw new Error('Expected middleware to return a response.');
  return response;
};
beforeEach(() => { vi.mocked(accessConfigured).mockReturnValue(true); vi.mocked(requireAccessIdentity).mockReset().mockResolvedValue({ sub: 'owner', email: 'owner@example.com' }); next.mockClear(); });
describe('Access middleware', () => {
  it('returns a private uncached response for a verified owner', async () => { const response = await call('/account'); expect(response.headers.get('Cache-Control')).toContain('no-store'); expect(next).toHaveBeenCalledOnce(); });
  it('blocks anonymous private API access before it reaches data handlers', async () => { vi.mocked(requireAccessIdentity).mockRejectedValue(new Response('unauthorized', { status: 401 })); expect((await call('/api/personal/chat')).status).toBe(401); expect(next).not.toHaveBeenCalled(); });
  it('redirects a private page through the unified login and never loops there', async () => { vi.mocked(requireAccessIdentity).mockRejectedValue(new Response('unauthorized', { status: 401 })); const response = await call('/account'); expect(response.headers.get('Location')).toContain('/auth/login?returnTo='); expect((await call('/auth/login')).status).toBe(401); });
  it('rejects cross-site mutations even with a valid identity', async () => { expect((await call('/api/admin/settings', { method: 'POST', headers: { Origin: 'https://evil.example' } })).status).toBe(403); expect(next).not.toHaveBeenCalled(); });
  it('allows same-site mutations after verification', async () => { expect((await call('/api/admin/settings', { method: 'POST', headers: { Origin: 'https://quidproquo.cc' } })).status).toBe(200); expect(next).toHaveBeenCalledOnce(); });
  it.each(['/posts/example', '/api/admin/webhooks/github', '/api/admin/routines/x/fire'])('leaves public or machine handlers to their own authorization %s', async path => { await call(path); expect(requireAccessIdentity).not.toHaveBeenCalled(); expect(next).toHaveBeenCalledOnce(); });
  it('preserves legacy rollout behavior only when Access is not configured', async () => { vi.mocked(accessConfigured).mockReturnValue(false); await call('/admin'); expect(requireAccessIdentity).not.toHaveBeenCalled(); expect(next).toHaveBeenCalledOnce(); });
});
