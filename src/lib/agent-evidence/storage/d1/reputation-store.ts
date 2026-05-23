import type { ReputationBackend, ReputationRecord } from '../types'

function rowToRecord(row: Record<string, unknown>): ReputationRecord {
  return {
    domain: row.domain as string,
    score: row.score as number,
    positiveSignals: row.positive_signals as number,
    negativeSignals: row.negative_signals as number,
    lastUpdated: row.last_updated as number,
  }
}

export class D1ReputationBackend implements ReputationBackend {
  constructor(private readonly db: D1Database) {}

  async get(domain: string): Promise<ReputationRecord | null> {
    const row = await this.db
      .prepare(
        'SELECT domain, score, positive_signals, negative_signals, last_updated FROM evidence_source_reputation WHERE domain = ?',
      )
      .bind(domain)
      .first<Record<string, unknown>>()
    return row ? rowToRecord(row) : null
  }

  async upsert(
    domain: string,
    delta: { scoreDelta: number; signalKind: 'positive' | 'negative' },
  ): Promise<void> {
    const now = Date.now()
    const positiveInc = delta.signalKind === 'positive' ? 1 : 0
    const negativeInc = delta.signalKind === 'negative' ? 1 : 0
    await this.db
      .prepare(
        `
      INSERT INTO evidence_source_reputation (domain, score, positive_signals, negative_signals, last_updated)
      VALUES (?, MAX(0.0, MIN(1.0, 0.5 + ?)), ?, ?, ?)
      ON CONFLICT(domain) DO UPDATE SET
        score = MAX(0.0, MIN(1.0, score + excluded.score - 0.5)),
        positive_signals = positive_signals + ?,
        negative_signals = negative_signals + ?,
        last_updated = ?
    `,
      )
      .bind(domain, delta.scoreDelta, positiveInc, negativeInc, now, positiveInc, negativeInc, now)
      .run()
  }

  async listTop(n: number): Promise<ReputationRecord[]> {
    const result = await this.db
      .prepare(
        'SELECT domain, score, positive_signals, negative_signals, last_updated FROM evidence_source_reputation ORDER BY score DESC LIMIT ?',
      )
      .bind(n)
      .all<Record<string, unknown>>()
    return result.results.map(rowToRecord)
  }
}
