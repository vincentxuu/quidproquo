import { describe, expect, it } from 'vitest'
import type { Flags } from '@/lib/config/flags'
import { requireRbacMutationPermission } from './guard'

const flags = {
  agentConsole: {
    enabled: true,
    rbac: true,
  },
} as Flags

function fakeDb(count: number): D1Database {
  return {
    prepare(sql: string) {
      return {
        bind(...values: unknown[]) {
          return {
            async first() {
              return { cnt: count, sql, values }
            },
          }
        },
      }
    },
  } as unknown as D1Database
}

describe('requireRbacMutationPermission', () => {
  it('allows RBAC mutations when the actor has the requested grant', async () => {
    const response = await requireRbacMutationPermission({
      db: fakeDb(1),
      flags,
      action: 'edit',
      redirectTo: '/admin/console/rbac',
      isJson: true,
      email: 'admin',
    })

    expect(response).toBeUndefined()
  })

  it('returns a JSON 403 when the actor lacks the requested grant', async () => {
    const response = await requireRbacMutationPermission({
      db: fakeDb(0),
      flags,
      action: 'delete',
      redirectTo: '/admin/console/rbac',
      isJson: true,
      email: 'viewer@example.com',
    })

    expect(response?.status).toBe(403)
    await expect(response?.json()).resolves.toEqual({
      error: "No 'delete' permission on rbac",
    })
  })
})
