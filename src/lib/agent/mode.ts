import { scoreRisk } from '@/lib/policy/enforcement/human/risk'

export type SessionMode = 'auto' | 'default' | 'plan'

const READ_ONLY_TOOLS = new Set(['Read', 'Glob', 'Grep', 'WebSearch', 'WebFetch'])
const PLAN_ALLOWED_TOOLS = new Set(['Read', 'Glob', 'Grep', 'WebSearch', 'WebFetch'])

export type ToolPermissionPolicy = 'always_allow' | 'always_ask' | 'always_deny'

export function shouldRequestApproval(
  mode: SessionMode,
  toolName: string,
  input: unknown,
  toolPolicies?: Map<string, ToolPermissionPolicy>,
): boolean {
  const policy = toolPolicies?.get(toolName)
  if (policy === 'always_allow') return false
  if (policy === 'always_ask') return true
  if (policy === 'always_deny') return true

  switch (mode) {
    case 'auto':
      return false
    case 'default':
      if (READ_ONLY_TOOLS.has(toolName)) return false
      return scoreRisk({ syscallName: toolName, input }) > 0
    case 'plan':
      return !PLAN_ALLOWED_TOOLS.has(toolName)
    default:
      return false
  }
}

export function isToolBlockedInPlanMode(toolName: string): boolean {
  return !PLAN_ALLOWED_TOOLS.has(toolName)
}

export function decisionReason(mode: SessionMode, toolName: string, input: unknown): string {
  if (mode === 'plan') return `Plan mode: ${toolName} requires approval to exit plan`
  const risk = scoreRisk({ syscallName: toolName, input })
  if (risk >= 0.9) return `${toolName} is irreversible (risk ${risk})`
  if (risk >= 0.5) return `${toolName} makes outbound calls (risk ${risk})`
  if (risk > 0) return `${toolName} modifies state (risk ${risk})`
  return `${toolName} requires approval in this mode`
}
