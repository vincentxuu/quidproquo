export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { listAll } from '@/lib/agent-providers/registry'
import { getHealth } from '@/lib/agent-providers/health'
import { createInMemoryProviderBackends } from '@/lib/agent-providers/storage/test/in-memory'
import { D1ProviderHealthStore } from '@/lib/agent-providers/storage/d1/health-store'
import type { ProviderBackends } from '@/lib/agent-providers/storage/types'
import { ensureProvidersEnabled } from './_guard'

export const GET: APIRoute = async ({ cookies, url }) => {
  const guard = ensureProvidersEnabled()
  if (guard) return guard

  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const providerId = url.searchParams.get('providerId')

  try {
    const db = (env as unknown as Env).DB
    const backends: ProviderBackends = {
      ...createInMemoryProviderBackends(),
      health: new D1ProviderHealthStore(db),
    }

    if (providerId) {
      const healthData = await getHealth({ providerId, backends })
      return json({ health: { [providerId]: healthData } })
    }

    // Return health for all registered providers
    const providers = listAll()
    const health: Record<string, unknown> = {}

    for (const provider of providers) {
      health[provider.providerId] = await getHealth({
        providerId: provider.providerId,
        backends,
      })
    }

    return json({ health })
  } catch {
    return json({ health: {} })
  }
}
