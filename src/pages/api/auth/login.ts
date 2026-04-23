import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { createSession } from '../../../lib/auth/session'

export const POST: APIRoute = async ({ request }) => {
  const body = await request.formData()
  const password = body.get('password')?.toString() ?? ''
  const adminPassword = (env as unknown as { ADMIN_PASSWORD: string }).ADMIN_PASSWORD

  if (!adminPassword || password !== adminPassword) {
    return new Response(null, {
      status: 303,
      headers: { Location: '/login?error=1' },
    })
  }

  const token = await createSession()
  return new Response(null, {
    status: 303,
    headers: {
      Location: '/chat',
      'Set-Cookie': `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
    },
  })
}
