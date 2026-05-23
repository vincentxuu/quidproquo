export interface QualityPolicy {
  citation_required?: boolean
  min_sources?: number
  stale_source_max_days?: number
  conflict_check?: boolean
  min_confidence?: number
  enforcement?: 'block' | 'warn'
}

export interface CheckResult {
  rule: string
  passed: boolean
  message?: string
  observed?: number
  threshold?: number
}

export interface VerificationResult {
  passed: boolean
  checks: CheckResult[]
  gaps: string[]
  verificationId?: number
}
