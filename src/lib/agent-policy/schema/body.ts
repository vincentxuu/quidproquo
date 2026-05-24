export interface BudgetPolicy {
  max_cost_usd?: number
  max_tokens?: number
  max_iterations?: number
  max_parallel_units?: number
  max_runtime_seconds?: number
}

export interface ProviderPolicy {
  allowlist?: string[]
  denylist?: string[]
  fallback_chain?: string[]
  region?: string
  data_residency?: 'us' | 'eu' | 'apac' | 'any'
}

export interface QualityPolicy {
  citation_required?: boolean
  min_sources?: number
  stale_source_max_days?: number
  conflict_check?: boolean
  min_confidence?: number
  enforcement?: 'block' | 'warn'
}

export interface RedactionPattern {
  /** Short-hand kind alias resolved by the built-in scanner (e.g. 'email', 'api-key').
   *  Either `kind` or `name`+`pattern` must be provided. */
  kind?: string
  name?: string
  pattern?: string
  action?: 'redact' | 'block' | 'log'
}

export interface SecurityPolicy {
  sensitive_data_redaction?: { patterns: RedactionPattern[]; action: 'redact' | 'block' | 'log' }
  tool_allowlist?: string[]
  least_privilege_scope?: boolean
}

export interface HumanPolicy {
  approval_required_before_external_write?: boolean
  approval_required_before_actions?: string[]
  risk_threshold?: number
  mode?: 'per_step' | 'batch' | 'edit_on_approval'
  batch_window_seconds?: number
  ttl_seconds?: number
}

export interface RetryPolicy {
  max_attempts?: number
  backoff?: 'fixed' | 'exponential' | 'jitter'
  backoff_base_ms?: number
  fallback_provider?: string
  on_exhaustion?: 'skip' | 'fail'
}

export interface PolicyBody {
  budget?: BudgetPolicy
  provider?: ProviderPolicy
  quality?: QualityPolicy
  security?: SecurityPolicy
  human?: HumanPolicy
  retry?: RetryPolicy
}
