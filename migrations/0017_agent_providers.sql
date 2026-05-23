-- Agent provider definitions, credentials, and health snapshot tables.

-- Provider catalog: one row per registered provider. category: 'llm'|'search'|'reader'|'knowledge'|'action'
CREATE TABLE IF NOT EXISTS provider_definitions (
  provider_id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  display_name TEXT NOT NULL,
  capability_json TEXT NOT NULL,
  cost_model_json TEXT NOT NULL,
  outbound_domains_json TEXT NOT NULL DEFAULT '[]',
  is_enabled INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_provider_definitions_category
  ON provider_definitions(category);

-- Provider credentials. agent_id NULL means org-wide. credential_type: 'api_key'|'oauth'|'service_account'
CREATE TABLE IF NOT EXISTS provider_credentials (
  credential_id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL,
  agent_id TEXT,
  credential_type TEXT NOT NULL,
  value_encrypted TEXT NOT NULL,
  scope_json TEXT NOT NULL DEFAULT '[]',
  expires_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_provider_credentials_provider_id
  ON provider_credentials(provider_id);

CREATE INDEX IF NOT EXISTS idx_provider_credentials_agent_id_partial
  ON provider_credentials(agent_id)
  WHERE agent_id IS NOT NULL;

-- Rolling health snapshots per provider. is_healthy: 0|1
CREATE TABLE IF NOT EXISTS provider_health_snapshots (
  snapshot_id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL,
  observed_at INTEGER NOT NULL,
  is_healthy INTEGER NOT NULL,
  p50_latency_ms INTEGER,
  p95_latency_ms INTEGER,
  success_rate_pct REAL,
  sample_size INTEGER NOT NULL DEFAULT 0,
  error_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_provider_health_snapshots_provider_observed
  ON provider_health_snapshots(provider_id, observed_at DESC);
