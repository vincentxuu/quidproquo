import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('cloudflare:workers', () => ({ env: { ADMIN_PASSWORD: 'legacy-secret' } }));
vi.mock('../../../../lib/auth/access', () => ({ accessConfigured: vi.fn(() => false), requireAccessIdentity: vi.fn() }));
vi.mock('../../../../lib/auth/session', () => ({ createSession: vi.fn(), deleteSession: vi.fn(), verifySession: vi.fn() }));
import { accessConfigured } from '../../../../lib/auth/access';
import { createSession, deleteSession } from '../../../../lib/auth/session';
import { POST as login } from '../login';
import { POST as logout } from '../logout';
function context(next: string, password = 'legacy-secret') {
  return { request: new Request('https://quidproquo.cc/api/auth/login', { method: 'POST', body: new URLSearchParams({ next, password }) }), redirect: (url: string, status: number) => new Response(null, { status, headers: { Location: url } }) } as never;
}
beforeEach(() => { vi.mocked(accessConfigured).mockReturnValue(false); vi.mocked(createSession).mockReset().mockResolvedValue('session-token'); vi.mocked(deleteSession).mockReset(); });
describe('admin authentication transition', () => {
  it('does not create a legacy session when Access is configured', async () => {
    vi.mocked(accessConfigured).mockReturnValue(true);
    const response = await login(context('/admin/settings'));
    expect(response.status).toBe(303); expect(response.headers.get('Location')).toBe('/auth/login?returnTo=%2Fadmin%2Fsettings');
    expect(createSession).not.toHaveBeenCalled(); expect(response.headers.get('Set-Cookie')).toBeNull();
  });
  it('preserves password login only before Access is configured', async () => {
    const response = await login(context('/admin/settings'));
    expect(response.headers.get('Location')).toBe('/admin/settings'); expect(response.headers.get('Set-Cookie')).toContain('session=session-token;');
  });
  it('never redirects a successful password login to an external target', async () => {
    const response = await login(context('//evil.test'));
    expect(response.headers.get('Location')).toBe('/admin');
  });
  it('rejects incorrect legacy password without creating a session', async () => {
    const response = await login(context('/admin', 'wrong'));
    expect(response.headers.get('Location')).toContain('/login?error=1'); expect(createSession).not.toHaveBeenCalled();
  });
  it('logs out of Access and clears the old session cookie', async () => {
    vi.mocked(accessConfigured).mockReturnValue(true);
    const response = await logout({ cookies: { get: () => undefined } } as never);
    expect(response.headers.get('Location')).toBe('/cdn-cgi/access/logout'); expect(response.headers.get('Set-Cookie')).toContain('Max-Age=0');
  });
  it('retains legacy logout until Access rollout', async () => {
    const response = await logout({ cookies: { get: () => ({ value: 'legacy' }) } } as never);
    expect(deleteSession).toHaveBeenCalledWith('legacy'); expect(response.headers.get('Location')).toBe('/login');
  });
});
