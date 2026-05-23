import type { EvidenceBackends } from './storage/types'
import { domainOf } from './extraction/domain'

export class SourceReputation {
  constructor(private readonly backends: EvidenceBackends) {}

  async getScore(domain: string): Promise<number> {
    if (!this.backends.reputation) return 0.5
    const record = await this.backends.reputation.get(domain)
    return record ? Math.min(1, Math.max(0, record.score)) : 0.5
  }

  async updateFromSignal(domain: string, signal: 'approve' | 'reject', strength = 1): Promise<void> {
    if (!this.backends.reputation) return
    const delta = signal === 'approve' ? 0.05 * strength : -0.05 * strength
    await this.backends.reputation.upsert(domain, {
      scoreDelta: delta,
      signalKind: signal === 'approve' ? 'positive' : 'negative',
    })
  }

  async updateFromUrl(url: string, signal: 'approve' | 'reject', strength = 1): Promise<void> {
    const domain = domainOf(url)
    await this.updateFromSignal(domain, signal, strength)
  }
}
