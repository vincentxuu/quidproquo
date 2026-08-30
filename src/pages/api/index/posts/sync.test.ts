import { beforeEach, describe, expect, it, vi } from 'vitest'
import { env } from 'cloudflare:workers'
import {
  applyPostSyncOperation,
  listPostSyncManifest,
} from '../../../../lib/indexing/post-sync'
import { GET, POST } from './sync'

vi.mock('../../../../lib/indexing/post-sync', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../../../lib/indexing/post-sync')>()
  return {
    ...original,
    applyPostSyncOperation: vi.fn(async () => undefined),
    listPostSyncManifest: vi.fn(async () => [{ slug: 'tech/example', sourceHash: 'hash' }]),
  }
})

const workerEnv = env as Record<string, unknown>

function request(method: 'GET' | 'POST', body?: unknown, secret = 'test-secret'): Request {
  return new Request('https://quidproquo.cc/api/index/posts/sync', {
    method,
    headers: {
      'X-Index-Sync-Secret': secret,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })
}

describe('/api/index/posts/sync', () => {
  beforeEach(() => {
    for (const key of Object.keys(workerEnv)) delete workerEnv[key]
    Object.assign(workerEnv, { DB: {}, INDEX_SYNC_SECRET: 'test-secret' })
    vi.mocked(applyPostSyncOperation).mockClear()
    vi.mocked(listPostSyncManifest).mockClear()
  })

  it('requires the index sync secret for manifest reads', async () => {
    const response = await GET({ request: request('GET', undefined, 'wrong') } as never)
    expect(response.status).toBe(401)
    expect(listPostSyncManifest).not.toHaveBeenCalled()
  })

  it('returns the remote source-hash manifest', async () => {
    const response = await GET({ request: request('GET') } as never)
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      posts: [{ slug: 'tech/example', sourceHash: 'hash' }],
    })
  })

  it('rejects malformed writes before touching D1', async () => {
    const response = await POST({ request: request('POST', { operations: [] }) } as never)
    expect(response.status).toBe(400)
    expect(applyPostSyncOperation).not.toHaveBeenCalled()
  })

  it('applies validated bounded operations', async () => {
    const operation = { type: 'delete', slug: 'tech/stale' }
    const response = await POST({
      request: request('POST', { operations: [operation] }),
    } as never)

    expect(response.status).toBe(200)
    expect(applyPostSyncOperation).toHaveBeenCalledWith(workerEnv.DB, operation)
  })
})
