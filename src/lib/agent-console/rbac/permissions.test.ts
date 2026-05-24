import { describe, expect, it } from 'vitest'
import type { Flags } from '../../config/flags'
import { PermissionDenied, requirePermission } from './permissions'

type UserRow = { user_id: number; email: string; disabled_at: number | null }
type AssignmentRow = { user_id: number; role_id: number }
type PermissionRow = { role_id: number; resource_kind: string; resource_id: string | null; action: string }

function makeFlags(rbac: boolean): Flags {
  return {
    agentConsole: {
      enabled: true,
      costDashboard: true,
      flowEditor: true,
      rbac,
    },
  } as unknown as Flags
}

function makeDb(input: {
  users: UserRow[]
  assignments: AssignmentRow[]
  permissions: PermissionRow[]
  onQuery?: () => void
}): D1Database {
  return {
    prepare() {
      input.onQuery?.()
      return {
        bind(email: string, kind: string, action: string, resourceId: string | null) {
          return {
            async first<T>() {
              const user = input.users.find((row) => row.email === email && row.disabled_at === null)
              if (!user) return { cnt: 0 } as T
              const roleIds = new Set(
                input.assignments
                  .filter((row) => row.user_id === user.user_id)
                  .map((row) => row.role_id),
              )
              const cnt = input.permissions.filter((row) =>
                roleIds.has(row.role_id)
                && row.resource_kind === kind
                && row.action === action
                && (row.resource_id === null || row.resource_id === resourceId)
              ).length
              return { cnt } as T
            },
          }
        },
      }
    },
  } as unknown as D1Database
}

describe('requirePermission', () => {
  const users = [
    { user_id: 1, email: 'operator@example.com', disabled_at: null },
    { user_id: 2, email: 'disabled@example.com', disabled_at: 123 },
  ]
  const assignments = [
    { user_id: 1, role_id: 10 },
    { user_id: 2, role_id: 10 },
  ]

  it('bypasses all checks while the RBAC flag is off', async () => {
    let queries = 0
    const db = makeDb({ users: [], assignments: [], permissions: [], onQuery: () => { queries += 1 } })

    await expect(requirePermission({
      db,
      email: 'missing@example.com',
      kind: 'run',
      id: 'run-1',
      action: 'cancel',
      flags: makeFlags(false),
    })).resolves.toBeUndefined()
    expect(queries).toBe(0)
  })

  it('allows wildcard grants for matching resource kind and action', async () => {
    const db = makeDb({
      users,
      assignments,
      permissions: [{ role_id: 10, resource_kind: 'run', resource_id: null, action: 'cancel' }],
    })

    await expect(requirePermission({
      db,
      email: 'operator@example.com',
      kind: 'run',
      id: 'run-123',
      action: 'cancel',
      flags: makeFlags(true),
    })).resolves.toBeUndefined()
  })

  it('allows resource-specific grants only for the matching id', async () => {
    const db = makeDb({
      users,
      assignments,
      permissions: [{ role_id: 10, resource_kind: 'artifact', resource_id: 'version-1', action: 'export' }],
    })

    await expect(requirePermission({
      db,
      email: 'operator@example.com',
      kind: 'artifact',
      id: 'version-1',
      action: 'export',
      flags: makeFlags(true),
    })).resolves.toBeUndefined()

    await expect(requirePermission({
      db,
      email: 'operator@example.com',
      kind: 'artifact',
      id: 'version-2',
      action: 'export',
      flags: makeFlags(true),
    })).rejects.toBeInstanceOf(PermissionDenied)
  })

  it('denies disabled users and mismatched actions', async () => {
    const db = makeDb({
      users,
      assignments,
      permissions: [{ role_id: 10, resource_kind: 'run', resource_id: null, action: 'cancel' }],
    })

    await expect(requirePermission({
      db,
      email: 'disabled@example.com',
      kind: 'run',
      id: 'run-123',
      action: 'cancel',
      flags: makeFlags(true),
    })).rejects.toBeInstanceOf(PermissionDenied)

    await expect(requirePermission({
      db,
      email: 'operator@example.com',
      kind: 'run',
      id: 'run-123',
      action: 'invoke',
      flags: makeFlags(true),
    })).rejects.toBeInstanceOf(PermissionDenied)
  })
})
