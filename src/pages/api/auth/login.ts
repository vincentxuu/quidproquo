import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { accessConfigured } from '../../../lib/auth/access'
import { adminReturnTo } from '../../../lib/auth/admin'
import { createSession } from '../../../lib/auth/session'

export const POST: APIRoute = async ({ request, redirect }) => {
  const body = await request.formData()
  const next = adminReturnTo(body.get('next')?.toString() ?? null)
  if (accessConfigured()) return redirect(`/auth/login?returnTo=${encodeURIComponent(next)}`, 303)
  const password = body.get('password')?.toString() ?? ''
  const adminPassword = (env as unknown as { ADMIN_PASSWORD: string }).ADMIN_PASSWORD

  if (!adminPassword || password !== adminPassword) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('error', '1')
    if (next) loginUrl.searchParams.set('next', next)
    return redirect(loginUrl.pathname + loginUrl.search, 303)
  }

  const token = await createSession()
  return new Response(null, {
    status: 303,
    headers: {
      Location: next,
      'Set-Cookie': `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
    },
  })
}
