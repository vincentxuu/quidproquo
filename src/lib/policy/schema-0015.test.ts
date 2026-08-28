import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const sqlPath = join(__dirname, '../../../migrations/0015_agent_policy.sql')

describe('migration 0015 schema', () => {
  it('contains policy_definitions table', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('policy_definitions')
  })

  it('contains policy_bindings table', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('policy_bindings')
  })

  it('contains policy_violations table', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('policy_violations')
  })

  it('policy_definitions has policy_key unique constraint', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('policy_key')
    expect(sql).toContain('UNIQUE')
  })

  it('policy_bindings has scope column', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('scope')
  })

  it('policy_bindings references policy_definitions', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('REFERENCES policy_definitions')
  })

  it('policy_violations has category column', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('category')
  })

  it('policy_violations has severity column', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('severity')
  })

  it('policy_violations has action_taken column', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('action_taken')
  })

  it('policy_violations references policy_definitions via FK', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('REFERENCES policy_definitions')
  })

  it('has index on policy_violations by category', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('idx_policy_violations_category')
  })

  it('has index on policy_bindings by flow_run', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('idx_policy_bindings_flow_run')
  })
})
