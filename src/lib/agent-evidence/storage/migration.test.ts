import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function tableSql(source: string, tableName: string): string {
  const match = source.match(new RegExp(`CREATE TABLE IF NOT EXISTS ${tableName} \\([\\s\\S]*?\\n\\);`))
  if (!match) throw new Error(`missing table ${tableName}`)
  return match[0]
}

describe('agent evidence migration 0014', () => {
  const source = readFileSync(resolve('migrations/0014_agent_evidence.sql'), 'utf8')

  it('defines all six evidence tables', () => {
    for (const table of [
      'evidence_sources',
      'evidence_excerpts',
      'evidence_claims',
      'evidence_citations',
      'evidence_conflicts',
      'evidence_verifications',
    ]) {
      expect(source).toContain(`CREATE TABLE IF NOT EXISTS ${table}`)
    }
  })

  it('defines the evidence_claims_fts virtual table', () => {
    expect(source).toContain('CREATE VIRTUAL TABLE IF NOT EXISTS evidence_claims_fts')
    expect(source).toContain("USING fts5(")
    expect(source).toContain("content='evidence_claims'")
    expect(source).toContain("content_rowid='claim_id'")
  })

  it('defines the three FTS sync triggers', () => {
    for (const trigger of ['evidence_claims_ai', 'evidence_claims_ad', 'evidence_claims_au']) {
      expect(source).toContain(`CREATE TRIGGER IF NOT EXISTS ${trigger}`)
    }
  })

  it('evidence_claims has flow_run_id, flow_step_run_id, agent_run_id columns', () => {
    const sql = tableSql(source, 'evidence_claims')
    expect(sql).toContain('flow_run_id')
    expect(sql).toContain('flow_step_run_id')
    expect(sql).toContain('agent_run_id')
  })

  it('evidence_sources deduplicates on (url, content_hash)', () => {
    const sql = tableSql(source, 'evidence_sources')
    expect(sql).toContain('UNIQUE(url, content_hash)')
  })

  it('evidence_claims deduplicates per (flow_run_id, claim_hash)', () => {
    const sql = tableSql(source, 'evidence_claims')
    expect(sql).toContain('UNIQUE(flow_run_id, claim_hash)')
  })

  it('evidence_citations links claim_id and excerpt_id with a relation column', () => {
    const sql = tableSql(source, 'evidence_citations')
    expect(sql).toContain('claim_id INTEGER NOT NULL REFERENCES evidence_claims(claim_id)')
    expect(sql).toContain('excerpt_id INTEGER NOT NULL REFERENCES evidence_excerpts(excerpt_id)')
    expect(sql).toContain('relation TEXT NOT NULL')
    expect(sql).toContain('provenance_chain_json TEXT NOT NULL')
  })

  it('evidence_conflicts has status, detected_by, approval_id, and resolved_by columns', () => {
    const sql = tableSql(source, 'evidence_conflicts')
    expect(sql).toContain('status TEXT NOT NULL')
    expect(sql).toContain('detected_by TEXT NOT NULL')
    expect(sql).toContain('approval_id TEXT')
    expect(sql).toContain('resolved_by TEXT')
  })

  it('declares the expected hot-path indexes', () => {
    for (const index of [
      'idx_evidence_sources_flow_run',
      'idx_evidence_excerpts_source',
      'idx_evidence_claims_flow_run',
      'idx_evidence_citations_claim',
      'idx_evidence_conflicts_status',
      'idx_evidence_verifications_flow_run',
    ]) {
      expect(source).toContain(index)
    }
  })
})
