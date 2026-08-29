export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { badRequest, json, serverError } from '@/lib/api/response'
import {
  isGitHubAppConfigured,
  listGitHubAppInstallations,
  listInstallationRepositories,
  saveGitHubInstallation,
  saveGitHubRepositories,
} from '@/lib/github/app'

export const POST: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env
  if (!isGitHubAppConfigured(e)) return badRequest('GitHub App is not configured')

  try {
    const installations = await listGitHubAppInstallations(e)
    let repositoryCount = 0
    for (const installation of installations) {
      await saveGitHubInstallation(e.DB, installation)
      if (installation.suspendedAt) continue
      const repos = await listInstallationRepositories(e, installation.installationId)
      await saveGitHubRepositories(e.DB, repos)
      repositoryCount += repos.length
    }

    return json({
      ok: true,
      installations: installations.length,
      repositories: repositoryCount,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[github-app] sync failed:', error)
    return serverError(message)
  }
}
