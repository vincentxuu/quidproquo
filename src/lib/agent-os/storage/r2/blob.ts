import { MemoryBodyTooLarge } from '../../errors'
import type { BlobBackend } from '../types'

export interface R2BlobBackendOptions {
  enabled: boolean
  inlineMaxBytes?: number
}

export class R2BlobBackend implements BlobBackend {
  private readonly inlineMaxBytes: number

  constructor(
    private readonly bucket: R2Bucket | undefined,
    private readonly options: R2BlobBackendOptions,
  ) {
    this.inlineMaxBytes = options.inlineMaxBytes ?? 256 * 1024
  }

  async put(scopeKey: string, itemId: string, body: string): Promise<{ key: string }> {
    if (!this.options.enabled || !this.bucket) {
      throw new MemoryBodyTooLarge(this.inlineMaxBytes)
    }
    const key = blobKey(scopeKey, itemId)
    await this.bucket.put(key, body)
    return { key }
  }

  async get(key: string): Promise<string | null> {
    if (!this.options.enabled || !this.bucket) {
      return null
    }
    const object = await this.bucket.get(key)
    return object ? await object.text() : null
  }
}

export function blobKey(scopeKey: string, itemId: string): string {
  return `memory/${scopeKey}/${itemId}`
}
