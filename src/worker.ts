// src/worker.ts
//
// Custom Worker entrypoint for `astro dev`/`astro preview`. Without a `main`
// pointing here, the Cloudflare adapter falls back to its own default entry
// (`@astrojs/cloudflare/entrypoints/server`), which only exports Astro's
// routes — workerd then fails to start with "Class extends value undefined"
// for any Durable Object binding in wrangler.jsonc, since nothing exports the
// class. See docs/governance/escalation-queue.md Q-025.
//
// Production (`wrangler deploy`) does not use this file: `pnpm build` runs
// scripts/create-cron-entry.mjs, which generates dist/cron-entry.js as the
// deployed entry and re-points wrangler.json's `main` at it.
import { handle } from '@astrojs/cloudflare/handler'
import type { Env } from './lib/config/env'

export { AgentSessionDO } from './server/agents/session-do'
export { AgentSandbox } from './server/agents/agent-sandbox'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return handle(request, env, ctx)
  },
}
