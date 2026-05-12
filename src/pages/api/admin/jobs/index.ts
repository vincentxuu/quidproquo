export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../lib/auth/session'
import { listJobs } from '../../../../lib/pipelines/job-store'

interface Env {
  DB: D1Database
}

export const GET: APIRoute = async ({ cookies, url }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const db = (env as unknown as Env).DB
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100)
  const jobs = await listJobs(db, Number.isInteger(limit) ? limit : 20)
  return json({ jobs })
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
}

function json(data: unknown): Response {
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
}
