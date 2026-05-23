export interface SectionProvenance {
  section: { heading: string | null; body: string | null }
  flowStep: { step_id: string; step_kind: string; started_at: number } | null
  agentRun: { run_id: string; agent_id: string } | null
  claims: Array<{
    claim_id: number
    claim_text: string
    confidence: number
    citations: Array<{ excerpt: string; source: string }>
  }>
}

interface SectionRow {
  section_id: string
  heading: string | null
  body_text: string | null
  claim_ids_json: string | null
  step_id: string | null
  step_kind: string | null
  started_at: number | null
  run_id: string | null
  agent_id: string | null
}

interface ClaimCitationRow {
  claim_id: number
  claim_text: string
  confidence: number
  excerpt: string | null
  source: string | null
}

export class ArtifactTraceability {
  constructor(private readonly db: D1Database) {}

  async reconstructSectionProvenance(sectionId: string): Promise<SectionProvenance | null> {
    const [sectionBatch] = await this.db.batch([
      this.db.prepare(`
        SELECT
          s.section_id,
          s.heading,
          s.body_text,
          s.claim_ids_json,
          fsr.step_id,
          fsr.step_type AS step_kind,
          fsr.started_at,
          ar.run_id,
          ar.agent_id
        FROM artifact_sections s
        LEFT JOIN flow_step_runs fsr ON s.flow_step_run_id = fsr.step_run_id
        LEFT JOIN agent_runs ar ON fsr.agent_run_id = ar.run_id
        WHERE s.section_id = ?
      `).bind(sectionId),
    ])

    const row = sectionBatch.results[0] as SectionRow | undefined
    if (!row) return null

    const claimIds: number[] = row.claim_ids_json
      ? (JSON.parse(row.claim_ids_json) as number[])
      : []

    let claims: SectionProvenance['claims'] = []
    if (claimIds.length > 0) {
      const placeholders = claimIds.map(() => '?').join(', ')
      const [claimBatch] = await this.db.batch([
        this.db.prepare(`
          SELECT
            ec.claim_id,
            ec.claim_text,
            ec.confidence,
            ee.text AS excerpt,
            es.url AS source
          FROM evidence_claims ec
          LEFT JOIN evidence_citations ecit ON ec.claim_id = ecit.claim_id
          LEFT JOIN evidence_excerpts ee ON ecit.excerpt_id = ee.excerpt_id
          LEFT JOIN evidence_sources es ON ee.source_id = es.source_id
          WHERE ec.claim_id IN (${placeholders})
          ORDER BY ec.claim_id
        `).bind(...claimIds),
      ])

      const claimMap = new Map<number, SectionProvenance['claims'][number]>()
      for (const cr of claimBatch.results as ClaimCitationRow[]) {
        const entry = claimMap.get(cr.claim_id)
        const citation =
          cr.excerpt || cr.source
            ? { excerpt: cr.excerpt ?? '', source: cr.source ?? '' }
            : null
        if (entry) {
          if (citation) entry.citations.push(citation)
        } else {
          claimMap.set(cr.claim_id, {
            claim_id: cr.claim_id,
            claim_text: cr.claim_text,
            confidence: cr.confidence,
            citations: citation ? [citation] : [],
          })
        }
      }
      claims = Array.from(claimMap.values())
    }

    return {
      section: { heading: row.heading ?? null, body: row.body_text ?? null },
      flowStep: row.step_id
        ? { step_id: row.step_id, step_kind: row.step_kind ?? '', started_at: row.started_at ?? 0 }
        : null,
      agentRun: row.run_id ? { run_id: row.run_id, agent_id: row.agent_id ?? '' } : null,
      claims,
    }
  }
}
