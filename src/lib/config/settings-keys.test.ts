import { describe, expect, it } from 'vitest'
import {
  AGENT_SKILLS_LIBRARY_KEY,
  CATALOG_KEY,
  LEGACY_AGENT_SKILLS_LIBRARY_KEY,
  PROVIDER_KEY_PREFIX,
  RETENTION_KEYS,
  SETTINGS_DEFAULTS,
} from './settings-keys'

describe('settings keys', () => {
  it('exports existing row keys unchanged', () => {
    expect(CATALOG_KEY).toBe('provider_model_catalog')
    expect(PROVIDER_KEY_PREFIX).toBe('provider_key:')
    expect(AGENT_SKILLS_LIBRARY_KEY).toBe('agent_skills')
    expect(LEGACY_AGENT_SKILLS_LIBRARY_KEY).toBe('deep_research_agent_skills')
  })

  it('exports the retention key tuple unchanged', () => {
    expect(RETENTION_KEYS).toEqual([
      'rag_trace_retention_enabled',
      'rag_trace_retention_prod_days',
      'rag_trace_retention_admin_days',
      'rag_trace_retention_prod_native_days',
      'rag_trace_retention_admin_native_days',
      'rag_trace_retention_native_sample_bps',
      'rag_trace_retention_error_grace_days',
    ])
  })

  it('exports admin settings defaults', () => {
    expect(SETTINGS_DEFAULTS.rate_limit_per_minute).toBe('60')
  })
})
