import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./session', () => ({
  verifySession: vi.fn(),
}))

vi.mock('./access', () => ({ accessConfigured: vi.fn(() => false), requireAccessIdentity: vi.fn() }))

import { accessConfigured, requireAccessIdentity } from './access'
import { verifySession } from './session'
import { requireAdmin, adminReturnTo } from './admin'

function cookies(token?: string) {
  return {
    get: vi.fn(() => token ? { value: token } : undefined),
  }
}

describe('requireAdmin', () => {
  beforeEach(() => {
    vi.mocked(verifySession).mockReset()
    vi.mocked(accessConfigured).mockReturnValue(false)
    vi.mocked(requireAccessIdentity).mockReset()
  })

  it('returns unauthorized when session cookie is missing', async () => {
    const result = await requireAdmin(cookies())
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.response.status).toBe(401)
      expect(await result.response.json()).toEqual({ error: 'unauthorized' })
    }
    expect(verifySession).not.toHaveBeenCalled()
  })

  it('returns unauthorized when token is invalid', async () => {
    vi.mocked(verifySession).mockResolvedValue(false)
    const result = await requireAdmin(cookies('bad'))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.response.status).toBe(401)
  })

  it('returns ok when token is valid', async () => {
    vi.mocked(verifySession).mockResolvedValue(true)
    await expect(requireAdmin(cookies('good'))).resolves.toEqual({ ok: true })
  })
})

describe('Access-only administration', () => {
  beforeEach(() => { vi.mocked(accessConfigured).mockReturnValue(true); vi.mocked(requireAccessIdentity).mockReset(); vi.mocked(verifySession).mockReset(); });
  it('forwards the real assertion-bearing request for owner verification', async () => {
    const request = new Request('https://quidproquo.cc/api/admin/settings', { headers: { 'Cf-Access-Jwt-Assertion': 'signed' } });
    vi.mocked(requireAccessIdentity).mockResolvedValue({ sub: 'owner', email: 'owner@example.test' });
    expect(await requireAdmin(cookies('legacy'), request)).toEqual({ ok: true });
    expect(requireAccessIdentity).toHaveBeenCalledWith(request);
    expect(verifySession).not.toHaveBeenCalled();
  });
  it('verifies the signed Access cookie for existing cookies-only callers', async () => {
    vi.mocked(requireAccessIdentity).mockResolvedValue({ sub: 'owner', email: 'owner@example.test' });
    await requireAdmin({ get: name => name === 'CF_Authorization' ? { value: 'signed-access-token' } : undefined });
    const request = vi.mocked(requireAccessIdentity).mock.calls[0][0];
    expect(request.headers.get('Cookie')).toBe('CF_Authorization=signed-access-token');
  });
  it('never accepts a valid legacy session after Access is configured', async () => {
    vi.mocked(verifySession).mockResolvedValue(true);
    vi.mocked(requireAccessIdentity).mockRejectedValue(new Response('Forbidden', { status: 403 }));
    const result = await requireAdmin(cookies('legacy'));
    expect(result.ok).toBe(false); if (!result.ok) expect(result.response.status).toBe(403);
    expect(verifySession).not.toHaveBeenCalled();
  });
  it('fails closed on partial configuration or verification outage', async () => {
    vi.mocked(requireAccessIdentity).mockRejectedValue(new Error('bad configuration'));
    const result = await requireAdmin(cookies('legacy'));
    expect(result.ok).toBe(false); if (!result.ok) expect(result.response.status).toBe(503);
  });
  it('keeps admin return targets same-site and avoids login loops', () => {
    expect(adminReturnTo('/admin/settings?tab=one')).toBe('/admin/settings?tab=one');
    for (const value of [null, 'https://evil.test', '//evil.test', '/%2f/evil', '/login', '/auth/login', '/api/auth/login', '/\\evil.test']) expect(adminReturnTo(value)).toBe('/admin');
  });
});
