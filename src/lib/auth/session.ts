import { env } from 'cloudflare:workers'

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

export async function generateToken(): Promise<string> {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function hashToken(token: string): Promise<string> {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function createSession(): Promise<string> {
  const kv = (env as unknown as { SESSION: KVNamespace }).SESSION
  const token = await generateToken()
  const hash = await hashToken(token)
  await kv.put(`session:${hash}`, '1', { expirationTtl: SESSION_TTL_SECONDS })
  return token
}

export async function verifySession(token: string): Promise<boolean> {
  const kv = (env as unknown as { SESSION: KVNamespace }).SESSION
  const hash = await hashToken(token)
  const val = await kv.get(`session:${hash}`)
  return val === '1'
}

export async function deleteSession(token: string): Promise<void> {
  const kv = (env as unknown as { SESSION: KVNamespace }).SESSION
  const hash = await hashToken(token)
  await kv.delete(`session:${hash}`)
}
