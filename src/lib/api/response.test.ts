import { describe, expect, it } from 'vitest'
import { badRequest, forbidden, json, notFound, serverError, unauthorized } from './response'

async function body(response: Response): Promise<unknown> {
  return response.json()
}

describe('response helpers', () => {
  it('wraps JSON data', async () => {
    const response = json({ a: 1 })
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/json')
    expect(await body(response)).toEqual({ a: 1 })
  })

  it('supports explicit status', async () => {
    const response = json({ ok: false }, 500)
    expect(response.status).toBe(500)
    expect(await body(response)).toEqual({ ok: false })
  })

  it('returns standard error envelopes', async () => {
    expect(unauthorized().status).toBe(401)
    expect(await body(unauthorized())).toEqual({ error: 'unauthorized' })
    expect(forbidden().status).toBe(403)
    expect(await body(forbidden())).toEqual({ error: 'forbidden' })
    expect(await body(badRequest('pipelineId is required'))).toEqual({ ok: false, error: 'pipelineId is required' })
    expect(notFound().status).toBe(404)
    expect(serverError().status).toBe(500)
  })
})
