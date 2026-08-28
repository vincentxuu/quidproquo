import { describe, it, expect } from 'vitest'
import { generateChunkId } from './chunk-id'

describe('generateChunkId', () => {
  it('generates 16-char hex for post', async () => {
    const id = await generateChunkId('post', 'ai/2024-01-01-rag', 0)
    expect(id).toHaveLength(16)
    expect(id).toMatch(/^[0-9a-f]+$/)
  })

  it('generates different IDs for different sources', async () => {
    const a = await generateChunkId('post', 'slug-a', 0)
    const b = await generateChunkId('post', 'slug-b', 0)
    expect(a).not.toBe(b)
  })

  it('generates different IDs for different chunk indexes', async () => {
    const a = await generateChunkId('post', 'same-slug', 0)
    const b = await generateChunkId('post', 'same-slug', 1)
    expect(a).not.toBe(b)
  })

  it('generates stable IDs (same input = same output)', async () => {
    const a = await generateChunkId('doc', 'https://example.com', 3)
    const b = await generateChunkId('doc', 'https://example.com', 3)
    expect(a).toBe(b)
  })
})
