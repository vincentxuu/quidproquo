import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const sqlPath = join(__dirname, '../../../../migrations/0013_agent_flow.sql')

describe('migration 0013 schema', () => {
  it('contains flow_definitions table', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('flow_definitions')
  })

  it('contains flow_versions table', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('flow_versions')
  })

  it('contains flow_presets table', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('flow_presets')
  })

  it('contains flow_runs table', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('flow_runs')
  })

  it('contains flow_step_runs table', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('flow_step_runs')
  })

  it('contains flow_run_state table', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('flow_run_state')
  })

  it('contains attempt column in flow_step_runs', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('attempt')
  })

  it('contains iteration column for loop support in flow_step_runs', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('iteration')
  })

  it('flow_step_runs references flow_runs via foreign key', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('REFERENCES flow_runs')
  })

  it('flow_runs supports sub-flow nesting via parent_flow_run_id', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('parent_flow_run_id')
  })

  it('has index on flow_runs status', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('idx_flow_runs_status')
  })

  it('has index on flow_step_runs flow_run', () => {
    const sql = readFileSync(sqlPath, 'utf8')
    expect(sql).toContain('idx_flow_step_runs_flow_run')
  })
})
