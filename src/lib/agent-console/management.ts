// Console-owned read aggregation for the Phase 4 management pages. Talks to the
// existing admin JSON endpoints over same-origin fetch (forwarding the session
// cookie) rather than importing agent-flow / agent-providers / agent-policy
// internals — keeps the console decoupled from those modules' churn. Mapping is
// split into pure functions so it can be unit-tested without fetch.

export interface FlowRow {
  id: string
  name: string
  version: number
  description: string
}

export interface ProviderRow {
  id: string
  category: string
  displayName: string
  version: string
  enabled: boolean
  status: string
}

export interface PolicyRow {
  policyKey: string
  label: string
  version: number
  category: string
  updatedAt: number
}

export interface ManagementResult<T> {
  ok: boolean
  rows: T[]
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function num(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export function mapFlowRows(json: unknown): FlowRow[] {
  const flows = asArray((json as { flows?: unknown })?.flows)
  return flows.map((raw) => {
    const flow = raw as Record<string, unknown>
    return {
      id: str(flow.id),
      name: str(flow.name, str(flow.id)),
      version: num(flow.version, 1),
      description: str(flow.description),
    }
  })
}

export function mapProviderRows(registryJson: unknown, healthJson: unknown): ProviderRow[] {
  const providers = asArray((registryJson as { providers?: unknown })?.providers)
  const healthRecords = asArray((healthJson as { health?: unknown })?.health)
  const statusById = new Map<string, string>()
  for (const raw of healthRecords) {
    const record = raw as Record<string, unknown>
    const id = str(record.providerId ?? record.id)
    const status = str(record.status)
    if (id && status) statusById.set(id, status)
  }
  return providers.map((raw) => {
    const provider = raw as Record<string, unknown>
    const id = str(provider.id)
    return {
      id,
      category: str(provider.category),
      displayName: str(provider.displayName, id),
      version: str(provider.version, '1.0.0'),
      enabled: provider.isEnabled !== false,
      status: statusById.get(id) ?? 'unknown',
    }
  })
}

export function mapPolicyRows(json: unknown): PolicyRow[] {
  const policies = asArray((json as { policies?: unknown })?.policies)
  return policies.map((raw) => {
    const policy = raw as Record<string, unknown>
    const body = (policy.body ?? {}) as Record<string, unknown>
    return {
      policyKey: str(policy.policyKey),
      label: str(policy.label, str(policy.policyKey)),
      version: num(policy.version, 1),
      category: str(body.category ?? body.kind, '—'),
      updatedAt: num(policy.updatedAt),
    }
  })
}

async function fetchJson(path: string, request: Request): Promise<{ ok: boolean; data: unknown }> {
  try {
    const res = await fetch(new URL(path, request.url), {
      headers: { cookie: request.headers.get('cookie') ?? '' },
    })
    if (!res.ok) return { ok: false, data: null }
    return { ok: true, data: await res.json() }
  } catch {
    return { ok: false, data: null }
  }
}

export async function fetchFlowRows(request: Request): Promise<ManagementResult<FlowRow>> {
  const { ok, data } = await fetchJson('/api/admin/flows', request)
  return { ok, rows: ok ? mapFlowRows(data) : [] }
}

export async function fetchProviderRows(request: Request): Promise<ManagementResult<ProviderRow>> {
  const [registry, health] = await Promise.all([
    fetchJson('/api/admin/providers/registry', request),
    fetchJson('/api/admin/providers/health', request),
  ])
  return { ok: registry.ok, rows: registry.ok ? mapProviderRows(registry.data, health.data) : [] }
}

export async function fetchPolicyRows(request: Request): Promise<ManagementResult<PolicyRow>> {
  const { ok, data } = await fetchJson('/api/admin/policies', request)
  return { ok, rows: ok ? mapPolicyRows(data) : [] }
}

export interface PolicyDetail {
  policyKey: string
  label: string
  version: number
  category: string
  body: string
  createdAt: number
  updatedAt: number
}

export interface PolicyAssignmentRow {
  bindingId: number
  scope: string
  target: string
}

export function mapPolicyDetail(json: unknown): PolicyDetail | null {
  const policy = (json as { policy?: unknown })?.policy
  if (!policy || typeof policy !== 'object') return null
  const record = policy as Record<string, unknown>
  const body = (record.body ?? {}) as Record<string, unknown>
  return {
    policyKey: str(record.policyKey),
    label: str(record.label, str(record.policyKey)),
    version: num(record.version, 1),
    category: str(body.category ?? body.kind, '—'),
    body: JSON.stringify(record.body ?? {}, null, 2),
    createdAt: num(record.createdAt),
    updatedAt: num(record.updatedAt),
  }
}

export function mapPolicyAssignments(json: unknown): PolicyAssignmentRow[] {
  const bindings = asArray((json as { bindings?: unknown })?.bindings)
  return bindings.map((raw) => {
    const binding = raw as Record<string, unknown>
    const scope = str(binding.scope)
    const target =
      str(binding.flowDefinitionId) ||
      str(binding.agentId) ||
      str(binding.flowRunId) ||
      (scope === 'global' ? '(all)' : '—')
    return { bindingId: num(binding.bindingId), scope, target }
  })
}

export interface PolicyDetailResult {
  ok: boolean
  detail: PolicyDetail | null
  assignments: PolicyAssignmentRow[]
}

export async function fetchPolicyDetail(request: Request, policyKey: string): Promise<PolicyDetailResult> {
  const encoded = encodeURIComponent(policyKey)
  const [definition, bindings] = await Promise.all([
    fetchJson(`/api/admin/policies/${encoded}`, request),
    fetchJson(`/api/admin/policies/${encoded}/bindings`, request),
  ])
  return {
    ok: definition.ok,
    detail: definition.ok ? mapPolicyDetail(definition.data) : null,
    assignments: bindings.ok ? mapPolicyAssignments(bindings.data) : [],
  }
}
