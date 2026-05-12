import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { createSession } from '../../../lib/auth/session'

export const POST: APIRoute = async ({ request, redirect }) => {
  const body = await request.formData()
  const password = body.get('password')?.toString() ?? ''
  const next = body.get('next')?.toString() ?? '/admin'
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
