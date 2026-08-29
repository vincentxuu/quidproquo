-- Phase 5: Sandbox runner, GitHub event trigger, notification channels, environment config

-- GitHub webhook resources
CREATE TABLE IF NOT EXISTS github_webhooks (
  webhook_id TEXT PRIMARY KEY,
  repo TEXT NOT NULL,
  secret TEXT NOT NULL,
  events TEXT NOT NULL DEFAULT '[]',
  filter_expression TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_github_webhooks_repo ON github_webhooks(repo) WHERE active = 1;

-- Environment config (key-value settings for runner/network/setup)
CREATE TABLE IF NOT EXISTS environment_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL
);

-- Environment variables (encrypted)
CREATE TABLE IF NOT EXISTS environment_variables (
  name TEXT PRIMARY KEY,
  encrypted_value TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Routine triggers: add github_event support
ALTER TABLE routines ADD COLUMN trigger_github_webhook_id TEXT;
ALTER TABLE routines ADD COLUMN trigger_github_events TEXT;
ALTER TABLE routines ADD COLUMN trigger_github_filter TEXT;
