import { beforeEach, describe, expect, it, vi } from 'vitest'
import { env } from 'cloudflare:workers'
import { runEmbedPipeline } from '../../../lib/indexing/pipeline'
import { POST } from './sync'

vi.mock('../../../lib/auth/access', () => ({ accessConfigured: vi.fn(() => false), requireAccessIdentity: vi.fn() }))
vi.mock('../../../lib/auth/session', () => ({ verifySession: vi.fn() }))
import { accessConfigured, requireAccessIdentity } from '../../../lib/auth/access'
import { verifySession } from '../../../lib/auth/session'

vi.mock('../../../lib/indexing/pipeline', () => ({
  runEmbedPipeline: vi.fn(async () => []),
}))

const workerEnv = env as Record<string, unknown>
const cookies = { get: () => undefined }

function request(body: unknown): Request {
  return new Request('https://quidproquo.cc/api/embed/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Index-Sync-Secret': 'test-secret',
    },
    body: JSON.stringify(body),
  })
}

describe('POST /api/embed/sync', () => {
  beforeEach(() => {
    for (const key of Object.keys(workerEnv)) delete workerEnv[key]
    workerEnv.INDEX_SYNC_SECRET = 'test-secret'
    vi.mocked(runEmbedPipeline).mockClear()
    vi.mocked(accessConfigured).mockReturnValue(false)
    vi.mocked(requireAccessIdentity).mockReset()
    vi.mocked(verifySession).mockReset()
  })

  it('rejects unbounded limits and legacy offsets', async () => {
    const highLimit = await POST({ request: request({ sources: ['posts'], limit: 501 }), cookies } as never)
    const legacyOffset = await POST({ request: request({ sources: ['posts'], offset: 80 }), cookies } as never)

    expect(highLimit.status).toBe(400)
    expect(legacyOffset.status).toBe(400)
    expect(runEmbedPipeline).not.toHaveBeenCalled()
  })

  it('passes a validated full rebuild request to the pipeline', async () => {
    const response = await POST({
      request: request({ sources: ['posts'], limit: 80, full: true }),
      cookies,
    } as never)

    expect(response.status).toBe(200)
    expect(runEmbedPipeline).toHaveBeenCalledWith(['posts'], 0, 80, true)
  })

  it('keeps shared-secret authentication mandatory', async () => {
    const response = await POST({
      request: new Request('https://quidproquo.cc/api/embed/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      }),
      cookies,
    } as never)

    expect(response.status).toBe(401)
  })
  it('rejects old human sessions when Access is configured', async () => {
    vi.mocked(accessConfigured).mockReturnValue(true);
    vi.mocked(requireAccessIdentity).mockRejectedValue(new Response('denied',{status:401}));
    vi.mocked(verifySession).mockResolvedValue(true);
    const req = request({sources:['posts']}); req.headers.delete('X-Index-Sync-Secret');
    const response = await POST({request:req,cookies:{get:()=>({value:'old-session'})}} as never);
    expect(response.status).toBe(401); expect(verifySession).not.toHaveBeenCalled();
  });
  it('keeps index machine-secret authorization after Access rollout', async () => {
    vi.mocked(accessConfigured).mockReturnValue(true);
    vi.mocked(requireAccessIdentity).mockRejectedValue(new Response('denied',{status:401}));
    const response = await POST({request:request({sources:['posts']}),cookies} as never);
    expect(response.status).toBe(200);
  });

  it.each([undefined, 'https://attacker.example'])('rejects Access-cookie POST without a matching Origin %s', async origin => {
    vi.mocked(accessConfigured).mockReturnValue(true);
    vi.mocked(requireAccessIdentity).mockResolvedValue({sub:'owner',email:'owner@example.test'});
    const req = request({sources:['posts']}); req.headers.delete('X-Index-Sync-Secret'); if(origin) req.headers.set('Origin',origin);
    expect((await POST({request:req,cookies} as never)).status).toBe(401);
    expect(runEmbedPipeline).not.toHaveBeenCalled();
  });
  it('accepts same-origin Access POST and rejects conflicting cross-site metadata', async () => {
    vi.mocked(accessConfigured).mockReturnValue(true);
    vi.mocked(requireAccessIdentity).mockResolvedValue({sub:'owner',email:'owner@example.test'});
    const req = request({sources:['posts']}); req.headers.delete('X-Index-Sync-Secret'); req.headers.set('Origin','https://quidproquo.cc');
    expect((await POST({request:req,cookies} as never)).status).toBe(200);
    req.headers.set('Sec-Fetch-Site','cross-site');
    expect((await POST({request:req,cookies} as never)).status).toBe(401);
  });

})
