import type { PolicyBody } from '../../schema/body'
import { scan, redact } from './scanner'
import { intersectGrants } from './tool-allowlist'

export interface SecurityWire {
  checkBeforeCall(syscallName: string, input: unknown, agentSyscalls?: string[]): { allowed: boolean; redactedInput?: unknown; violations: string[] }
  checkAfterCall(syscallName: string, output: unknown): { redactedOutput?: unknown; violations: string[] }
}

export function wireSecurityEnforcement(policy: PolicyBody['security']): SecurityWire {
  return {
    checkBeforeCall(syscallName, _input, agentSyscalls = []) {
      const violations: string[] = []
      if (policy?.tool_allowlist?.length) {
        const { denied } = intersectGrants(agentSyscalls, policy.tool_allowlist)
        if (denied.includes(syscallName)) {
          violations.push(`syscall '${syscallName}' not in tool_allowlist`)
        }
      }
      return { allowed: violations.length === 0, violations }
    },
    checkAfterCall(_syscallName, output) {
      if (!policy?.sensitive_data_redaction?.patterns?.length) return { violations: [] }
      const text = typeof output === 'string' ? output : JSON.stringify(output)
      const kinds = policy.sensitive_data_redaction.patterns
        .filter((p): p is { kind: string } => typeof p.kind === 'string')
        .map((p) => p.kind as import('./scanner').PatternKind)
      const matches = scan(text, kinds)
      if (!matches.length) return { violations: [] }
      const { redacted } = redact(text, matches)
      const violations = matches.map(m => `${m.kind} detected`)
      if (typeof output === 'string') return { redactedOutput: redacted, violations }
      try { return { redactedOutput: JSON.parse(redacted), violations } } catch { return { redactedOutput: redacted, violations } }
    },
  }
}
