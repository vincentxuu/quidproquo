import { beforeEach, describe, expect, it, vi } from 'vitest'
import { env } from 'cloudflare:workers'
import { runEmbedPipeline } from '../../../lib/indexing/pipeline'
import { POST } from './sync'

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
})
