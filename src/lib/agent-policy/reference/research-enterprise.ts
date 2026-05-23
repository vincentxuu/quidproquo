import type { PolicyBody } from '../schema/body'

export const RESEARCH_ENTERPRISE: PolicyBody = {
  budget: {
    max_cost_usd: 5.00,
    max_iterations: 20,
    max_runtime_seconds: 1800,
    max_parallel_units: 2,
  },
  provider: {
    allowlist: ['anthropic', 'openai'],
    denylist: ['workersai'],
    region: 'us-*',
    data_residency: 'us',
  },
  quality: {
    citation_required: true,
    min_sources: 5,
    stale_source_max_days: 180,
    conflict_check: true,
    min_confidence: 0.7,
    enforcement: 'block',
  },
  security: {
    sensitive_data_redaction: {
      patterns: [
        { kind: 'email' },
        { kind: 'phone' },
        { kind: 'ssn' },
        { kind: 'api-key' },
        { kind: 'credit-card' },
      ],
      action: 'block',
    },
    tool_allowlist: ['search.posts', 'search.docs', 'search.external', 'post.get-detail'],
    least_privilege_scope: true,
  },
  human: {
    approval_required_before_external_write: true,
    approval_required_before_actions: ['send_email', 'publish', 'external_post'],
    risk_threshold: 0.5,
    mode: 'edit_on_approval',
    ttl_seconds: 172800,
  },
  retry: { max_attempts: 2, backoff: 'exponential', backoff_base_ms: 1000, on_exhaustion: 'fail' },
}
