// v1 heuristics — upgrade to ML scorer in a follow-up
const IRREVERSIBLE_PREFIXES = ['fs.write', 'fs.delete', 'db.write', 'db.delete', 'email.send', 'slack.post', 'github.create', 'notion.create', 'drive.write']
const OUTBOUND_PREFIXES = ['http.', 'fetch.', 'search.external', 'email.', 'slack.', 'webhook.']
const MEMORY_WRITE_PREFIXES = ['memory.write', 'memory.upsert', 'kv.put', 'r2.put']

const customRegistry = new Map<string, number>()

export function registerRiskScore(syscallName: string, score: number): void {
  customRegistry.set(syscallName, Math.min(1, Math.max(0, score)))
}

export function scoreRisk(opts: { syscallName: string; input?: unknown; agentId?: string }): number {
  if (customRegistry.has(opts.syscallName)) return customRegistry.get(opts.syscallName)!
  if (IRREVERSIBLE_PREFIXES.some(p => opts.syscallName.startsWith(p))) return 0.9
  if (OUTBOUND_PREFIXES.some(p => opts.syscallName.startsWith(p))) return 0.5
  if (MEMORY_WRITE_PREFIXES.some(p => opts.syscallName.startsWith(p))) return 0.3
  return 0.0
}
