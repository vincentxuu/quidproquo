export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import {
  getGitHubInstallUrl,
  isGitHubAppConfigured,
  listStoredGitHubRepositories,
} from '@/lib/github/app'

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env
  const configured = isGitHubAppConfigured(e)
  const repos = await listStoredGitHubRepositories(e.DB).catch(() => [])

  return json({
    configured,
    appSlug: e.GITHUB_APP_SLUG ?? null,
    installUrl: getGitHubInstallUrl(e),
    repositoryCount: repos.length,
  })
}
