import type { PolicyBody } from '../schema/body'

export const RESEARCH_STANDARD: PolicyBody = {
  budget: { max_cost_usd: 1.00, max_iterations: 10, max_runtime_seconds: 600, max_parallel_units: 3 },
  provider: {
    allowlist: ['openai', 'anthropic', 'cloudflare', 'workersai'],
    fallback_chain: ['anthropic', 'openai', 'workersai'],
  },
  quality: {
    citation_required: true,
    min_sources: 3,
    stale_source_max_days: 365,
    conflict_check: true,
    enforcement: 'warn',
  },
  security: {
    sensitive_data_redaction: {
      patterns: [{ kind: 'email' }, { kind: 'api-key' }],
      action: 'redact',
    },
  },
  human: {
    approval_required_before_external_write: true,
    risk_threshold: 0.8,
    mode: 'per_step',
    ttl_seconds: 86400,
  },
  retry: { max_attempts: 3, backoff: 'exponential', backoff_base_ms: 500, on_exhaustion: 'fail' },
}
