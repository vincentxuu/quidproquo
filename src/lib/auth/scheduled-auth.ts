import type { Env } from '../config/env'
import { requireAdmin, type CookieReader } from './admin'

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
  const mutating = !['GET', 'HEAD', 'OPTIONS'].includes(request.method.toUpperCase())
  const sameOrigin = request.headers.get('Origin') === new URL(request.url).origin
    && request.headers.get('Sec-Fetch-Site') !== 'cross-site'
  // Machine ingress skips browser middleware: enforce CSRF on its cookie branch.
  // Explicit crawl-secret authentication below remains independent of Origin.
  if (!mutating || sameOrigin) {
    const auth = await requireAdmin(cookies, request)
    if (auth.ok) return 'admin'
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
