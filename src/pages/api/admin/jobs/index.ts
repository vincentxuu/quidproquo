export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { listJobs } from '../../../../lib/pipelines/job-store'
import type { PipelineStatus } from '../../../../lib/pipelines/types'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'

export const GET: APIRoute = async ({ cookies, url }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100)
  const status = normalizeStatus(url.searchParams.get('status'))
  const jobs = await listJobs(db, Number.isInteger(limit) ? limit : 20, status ?? undefined)
  return json({ jobs })
}

function normalizeStatus(status: string | null): PipelineStatus | undefined {
  if (
    status === 'queued' ||
    status === 'running' ||
    status === 'waiting_review' ||
    status === 'succeeded' ||
    status === 'failed' ||
    status === 'cancelled' ||
    status === 'dead_letter'
  ) {
    return status
  }
}



