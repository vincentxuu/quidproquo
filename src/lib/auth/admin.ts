import { verifySession } from './session'
import { unauthorized } from '../api/response'

export interface CookieReader {
  get(name: string): { value?: string } | undefined
}

export type RequireAdminResult = { ok: true } | { ok: false; response: Response }

export async function requireAdmin(cookies: CookieReader): Promise<RequireAdminResult> {
  const token = cookies.get('session')?.value
  if (token && await verifySession(token)) {
    return { ok: true }
  }
  return { ok: false, response: unauthorized() }
}
