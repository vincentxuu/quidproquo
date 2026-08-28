import type { PolicyBody } from '../schema/body'

export const RESEARCH_QUICK: PolicyBody = {
  budget: { max_cost_usd: 0.05, max_iterations: 3, max_runtime_seconds: 60 },
  provider: { allowlist: ['workersai', 'cloudflare'] },
  quality: { min_sources: 1, enforcement: 'warn' },
  retry: { max_attempts: 1, on_exhaustion: 'skip' },
}
