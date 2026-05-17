import type { CancelSignalBackend } from '../types'

const CANCEL_TTL_SECONDS = 600

export class KvCancelSignalBackend implements CancelSignalBackend {
  constructor(private readonly kv: KVNamespace) {}

  async signal(runId: string): Promise<void> {
    await this.kv.put(keyForRun(runId), '1', { expirationTtl: CANCEL_TTL_SECONDS })
  }

  async isSignaled(runId: string): Promise<boolean> {
    return await this.kv.get(keyForRun(runId)) === '1'
  }

  async clear(runId: string): Promise<void> {
    await this.kv.delete(keyForRun(runId))
  }
}

export function keyForRun(runId: string): string {
  return `agent:cancel:${runId}`
}
