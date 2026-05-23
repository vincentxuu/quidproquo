export type ProviderCategory = 'llm' | 'search' | 'reader' | 'knowledge' | 'action'

export interface ProviderDefinition {
  providerId: string
  category: ProviderCategory
  displayName: string
  capabilityJson: Record<string, unknown>
  costModelJson: Record<string, unknown>
  outboundDomains: string[]
  isEnabled: boolean
  createdAt: number
  updatedAt: number
}

export interface ProviderCredential {
  credentialId: string
  providerId: string
  agentId: string | null
  credentialType: string
  valueEncrypted: string
  scopeJson: string[]
  expiresAt: number | null
  createdAt: number
  updatedAt: number
}

export interface HealthSnapshot {
  snapshotId: string
  providerId: string
  observedAt: number
  isHealthy: boolean
  p50LatencyMs: number | null
  p95LatencyMs: number | null
  successRatePct: number | null
  sampleSize: number
  errorJson: string | null
}

export interface CredentialResolution {
  value: string
  source: 'agent_scoped' | 'org_wide' | 'env_fallback'
  expiresAt: number | null
}

export interface RoutingPolicy {
  order: string[]
  fallbackOn?: string[]
  loadBalanceWeights?: Record<string, number>
  rateLimits?: Record<string, number>
}

export type ProviderHandler<TInput, TOutput> = (
  input: TInput,
  credential: CredentialResolution,
  ctx: unknown,
) => Promise<TOutput>
