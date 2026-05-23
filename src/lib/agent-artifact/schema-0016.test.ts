import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const sqlPath = join(__dirname, '../../../migrations/0016_agent_artifact.sql')

describe('migration 0016 schema', () => {
  it('contains artifact_definitions table', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('artifact_definitions')
  })

  it('contains artifact_versions table', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('artifact_versions')
  })

  it('contains artifact_sections table', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('artifact_sections')
  })

  it('contains artifact_exports table', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('artifact_exports')
  })

  it('artifact_versions has status column with draft default', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain("DEFAULT 'draft'")
  })

  it('artifact_versions supports R2 offload via body_ref_json', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('body_ref_json')
  })

  it('artifact_versions supports inline body via body_text', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('body_text')
  })

  it('artifact_versions supports parent-linked version chain', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('parent_version_id')
  })

  it('artifact_sections has claim_ids_json for evidence traceability', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('claim_ids_json')
  })

  it('artifact_exports references artifact_versions', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('REFERENCES artifact_versions')
  })

  it('artifact_definitions links to flow_runs', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('REFERENCES flow_runs')
  })

  it('has index on artifact_versions by definition', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('idx_artifact_versions_definition')
  })

  it('has index on artifact_exports by version', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('idx_artifact_exports_version')
  })
})
