export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../lib/auth/session'
import { getJob, listJobArtifacts, listJobSteps } from '../../../../lib/pipelines/job-store'

interface Env {
  DB: D1Database
}

export const GET: APIRoute = async ({ params, cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()
  const id = params.id
  if (!id) return json({ error: 'job id is required' }, 400)

  const db = (env as unknown as Env).DB
  const job = await getJob(db, id)
  if (!job) return json({ error: 'job not found' }, 404)

  const [steps, artifacts] = await Promise.all([
    listJobSteps(db, id),
    listJobArtifacts(db, id),
  ])
  return json({ job, steps, artifacts })
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return json({ error: 'unauthorized' }, 401)
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
