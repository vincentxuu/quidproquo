import type { PermissionRecord, PermissionsBackend } from '../types'
import { encodeJson, permissionFromRow } from './utils'

export class D1PermissionsBackend implements PermissionsBackend {
  constructor(private readonly db: D1Database) {}

  async upsert(permission: PermissionRecord): Promise<void> {
    await this.db.prepare(`
      INSERT INTO agent_permissions (
        agent_id, version, grants_hash, syscalls_json, memory_scopes_json,
        secrets_json, outbound_domains_json, irreversible_actions_require_approval, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(agent_id) DO UPDATE SET
        version = excluded.version,
        grants_hash = excluded.grants_hash,
        syscalls_json = excluded.syscalls_json,
        memory_scopes_json = excluded.memory_scopes_json,
        secrets_json = excluded.secrets_json,
        outbound_domains_json = excluded.outbound_domains_json,
        irreversible_actions_require_approval = excluded.irreversible_actions_require_approval,
        updated_at = excluded.updated_at
    `).bind(
      permission.agentId,
      permission.version,
      permission.grantsHash,
      encodeJson(permission.syscalls),
      encodeJson(permission.memoryScopes),
      encodeJson(permission.secrets),
      encodeJson(permission.outboundDomains),
      permission.irreversibleActionsRequireApproval ? 1 : 0,
      permission.updatedAt,
    ).run()
  }

  async get(agentId: string): Promise<PermissionRecord | null> {
    const row = await this.db.prepare('SELECT * FROM agent_permissions WHERE agent_id = ?').bind(agentId).first<Record<string, unknown>>()
    return row ? permissionFromRow(row) : null
  }
}
