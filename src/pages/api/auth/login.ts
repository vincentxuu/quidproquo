import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { createSession, hashToken } from '../../../lib/auth/session'
import { checkAndIncrementRateLimit } from '../../../lib/auth/rate-limit'

// 單一共用密碼守著整個 /admin 介面，且沒有帳號可枚舉，因此密碼潑灑的成本極低。
// 對來源 IP 設每日上限，讓自動化嘗試無法在合理時間內窮舉。
const LOGIN_DAILY_LIMIT = 20

/**
 * 比較兩個字串是否相等，且耗時不隨相同前綴長度變化。
 * 先各自取 SHA-256 再逐位元組 XOR：摘要不可預測，因此比較本身不洩漏原文資訊。
 */
async function constantTimeEquals(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([hashToken(a), hashToken(b)])
  if (ha.length !== hb.length) return false
  let diff = 0
  for (let i = 0; i < ha.length; i += 1) {
    diff |= ha.charCodeAt(i) ^ hb.charCodeAt(i)
  }
  return diff === 0
}

export const POST: APIRoute = async ({ request, redirect, clientAddress }) => {
  const body = await request.formData()
  const password = body.get('password')?.toString() ?? ''
  const next = body.get('next')?.toString() ?? '/admin'
  const adminPassword = (env as unknown as { ADMIN_PASSWORD: string }).ADMIN_PASSWORD

  const ip = clientAddress ?? request.headers.get('CF-Connecting-IP') ?? 'unknown'
  const rate = await checkAndIncrementRateLimit(`login:${ip}`, LOGIN_DAILY_LIMIT)
  if (!rate.allowed) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('error', 'rate_limit')
    if (next) loginUrl.searchParams.set('next', next)
    return redirect(loginUrl.pathname + loginUrl.search, 303)
  }

  if (!adminPassword || !(await constantTimeEquals(password, adminPassword))) {
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
