import type { Env } from '../config/env'
import { verifySession } from './session'
import type { CookieReader } from './admin'

export type PipelineRequestSource = 'admin' | 'cron'
export const CRAWL_SECRET_HEADER = 'X-Crawl-Secret'

export class UnauthorizedError extends Error {
  constructor() {
    super('unauthorized')
    this.name = 'UnauthorizedError'
  }
}

export async function getRequestSource(
  cookies: CookieReader,
  request: Request,
  env: Pick<Env, 'CRAWL_SECRET'>
): Promise<PipelineRequestSource | undefined> {
  const token = cookies.get('session')?.value
  if (token && await verifySession(token)) {
    return 'admin'
  }

  const secret = env.CRAWL_SECRET
  if (!secret) return undefined

  return request.headers.get(CRAWL_SECRET_HEADER) === secret ? 'cron' : undefined
}

export async function requireScheduledAuth(
  cookies: CookieReader,
  request: Request,
  env: Pick<Env, 'CRAWL_SECRET'>
): Promise<PipelineRequestSource> {
  const source = await getRequestSource(cookies, request, env)
  if (!source) throw new UnauthorizedError()
  return source
}
