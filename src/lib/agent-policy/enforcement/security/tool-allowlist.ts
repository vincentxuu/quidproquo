export function intersectGrants(
  agentSyscalls: string[],
  policyToolAllowlist: string[] | undefined,
): { effective: string[]; denied: string[] } {
  if (!policyToolAllowlist) return { effective: agentSyscalls, denied: [] }
  const allowed = new Set(policyToolAllowlist)
  const effective = agentSyscalls.filter(s => allowed.has(s))
  const denied = agentSyscalls.filter(s => !allowed.has(s))
  return { effective, denied }
}
