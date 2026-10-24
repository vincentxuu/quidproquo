import type { APIRoute } from 'astro'
import { accessConfigured } from '../../../lib/auth/access'
import { deleteSession } from '../../../lib/auth/session'

export const POST: APIRoute = async ({ cookies }) => {
  const token = cookies.get('session')?.value
  if (token) await deleteSession(token)
  return new Response(null, {
    status: 303,
    headers: {
      Location: accessConfigured() ? '/cdn-cgi/access/logout' : '/login',
      'Set-Cookie': 'session=; Path=/; Max-Age=0',
    },
  })
}
