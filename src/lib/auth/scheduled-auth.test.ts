import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./access', () => ({ accessConfigured: vi.fn(() => false), requireAccessIdentity: vi.fn() }))

vi.mock('./session', () => ({
  verifySession: vi.fn(),
}))

import { accessConfigured, requireAccessIdentity } from './access'
import { verifySession } from './session'
import { getRequestSource, requireScheduledAuth, UnauthorizedError } from './scheduled-auth'

function cookies(token?: string) {
  return {
    get: vi.fn(() => token ? { value: token } : undefined),
  }
}

function request(secret?: string): Request {
  return new Request('https://example.test', {
    headers: secret ? { 'X-Crawl-Secret': secret } : {},
  })
}

describe('scheduled auth', () => {
  beforeEach(() => {
    vi.mocked(verifySession).mockReset()
    vi.mocked(accessConfigured).mockReturnValue(false)
    vi.mocked(requireAccessIdentity).mockReset()
  })

  it('returns admin for valid session', async () => {
    vi.mocked(verifySession).mockResolvedValue(true)
    await expect(getRequestSource(cookies('token'), request('wrong'), { CRAWL_SECRET: 'secret' })).resolves.toBe('admin')
  })

  it('returns cron for valid crawl secret', async () => {
    vi.mocked(verifySession).mockResolvedValue(false)
    await expect(getRequestSource(cookies(), request('secret'), { CRAWL_SECRET: 'secret' })).resolves.toBe('cron')
  })

  it('returns undefined for missing auth', async () => {
    await expect(getRequestSource(cookies(), request('wrong'), { CRAWL_SECRET: 'secret' })).resolves.toBeUndefined()
  })

  it('throws in requireScheduledAuth when unauthenticated', async () => {
    await expect(requireScheduledAuth(cookies(), request(), {})).rejects.toBeInstanceOf(UnauthorizedError)
  })
  it('rejects legacy human sessions once Access is configured', async () => {
    vi.mocked(accessConfigured).mockReturnValue(true);
    vi.mocked(verifySession).mockResolvedValue(true);
    vi.mocked(requireAccessIdentity).mockRejectedValue(new Response('denied', {status:403}));
    await expect(getRequestSource(cookies('old-session'), request(), {})).resolves.toBeUndefined();
    expect(verifySession).not.toHaveBeenCalled();
  });
  it('keeps scheduled machine secrets independent of Access human login', async () => {
    vi.mocked(accessConfigured).mockReturnValue(true);
    vi.mocked(requireAccessIdentity).mockRejectedValue(new Response('login required', {status:401}));
    await expect(getRequestSource(cookies(), request('secret'), {CRAWL_SECRET:'secret'})).resolves.toBe('cron');
  });
  it('accepts the verified Access owner as admin', async () => {
    vi.mocked(accessConfigured).mockReturnValue(true);
    vi.mocked(requireAccessIdentity).mockResolvedValue({sub:'owner',email:'owner@example.test'});
    await expect(getRequestSource(cookies(), request(), {})).resolves.toBe('admin');
  });

  it.each([undefined, 'https://attacker.example'])('rejects cookie-authenticated POST with absent or foreign Origin %s', async origin => {
    vi.mocked(accessConfigured).mockReturnValue(true);
    vi.mocked(requireAccessIdentity).mockResolvedValue({sub:'owner',email:'owner@example.test'});
    const headers: Record<string,string> = origin ? { Origin: origin } : {};
    await expect(getRequestSource(cookies(), new Request('https://example.test/api/admin/sessions/scheduled', {method:'POST',headers}), {})).resolves.toBeUndefined();
  });
  it('accepts same-origin browser POST and preserves secret-authenticated cron POST without Origin', async () => {
    vi.mocked(accessConfigured).mockReturnValue(true);
    vi.mocked(requireAccessIdentity).mockResolvedValue({sub:'owner',email:'owner@example.test'});
    await expect(getRequestSource(cookies(), new Request('https://example.test/run', {method:'POST',headers:{Origin:'https://example.test'}}), {})).resolves.toBe('admin');
    await expect(getRequestSource(cookies(), new Request('https://example.test/run', {method:'POST',headers:{'X-Crawl-Secret':'secret'}}), {CRAWL_SECRET:'secret'})).resolves.toBe('cron');
  });
  it('rejects contradictory cross-site metadata even with matching Origin', async () => {
    vi.mocked(accessConfigured).mockReturnValue(true);
    vi.mocked(requireAccessIdentity).mockResolvedValue({sub:'owner',email:'owner@example.test'});
    await expect(getRequestSource(cookies(), new Request('https://example.test/run', {method:'POST',headers:{Origin:'https://example.test','Sec-Fetch-Site':'cross-site'}}), {})).resolves.toBeUndefined();
  });

})
