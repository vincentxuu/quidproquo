import type { ProviderCredential } from '../../types'
import type { ProviderCredentialStoreBackend } from '../types'

interface CredentialRow {
  credential_id: string
  provider_id: string
  agent_id: string | null
  credential_type: string
  value_encrypted: string
  scope_json: string
  expires_at: number | null
  created_at: number
  updated_at: number
}

function rowToCredential(row: CredentialRow): ProviderCredential {
  return {
    credentialId: row.credential_id,
    providerId: row.provider_id,
    agentId: row.agent_id,
    credentialType: row.credential_type,
    valueEncrypted: row.value_encrypted,
    scopeJson: JSON.parse(row.scope_json) as string[],
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export class D1ProviderCredentialStore implements ProviderCredentialStoreBackend {
  constructor(private readonly db: D1Database) {}

  async insert(opts: {
    credentialId: string
    providerId: string
    agentId: string | null
    credentialType: string
    valueEncrypted: string
    scopeJson: string[]
    expiresAt: number | null
    createdAt: number
    updatedAt: number
  }): Promise<string> {
    await this.db
      .prepare(
        `INSERT INTO provider_credentials
         (credential_id, provider_id, agent_id, credential_type, value_encrypted, scope_json, expires_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        opts.credentialId,
        opts.providerId,
        opts.agentId,
        opts.credentialType,
        opts.valueEncrypted,
        JSON.stringify(opts.scopeJson),
        opts.expiresAt,
        opts.createdAt,
        opts.updatedAt,
      )
      .run()
    return opts.credentialId
  }

  async getForProvider(providerId: string, agentId?: string): Promise<ProviderCredential | null> {
    // Check agent-scoped first
    if (agentId) {
      const agentRow = await this.db
        .prepare(
          `SELECT * FROM provider_credentials WHERE provider_id = ? AND agent_id = ? LIMIT 1`,
        )
        .bind(providerId, agentId)
        .first<CredentialRow>()
      if (agentRow) return rowToCredential(agentRow)
    }

    // Fall back to org-wide (agent_id IS NULL)
    const orgRow = await this.db
      .prepare(
        `SELECT * FROM provider_credentials WHERE provider_id = ? AND agent_id IS NULL LIMIT 1`,
      )
      .bind(providerId)
      .first<CredentialRow>()
    return orgRow ? rowToCredential(orgRow) : null
  }

  async delete(credentialId: string): Promise<void> {
    await this.db
      .prepare(`DELETE FROM provider_credentials WHERE credential_id = ?`)
      .bind(credentialId)
      .run()
  }
}
