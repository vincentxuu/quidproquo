-- Phase 6: MCP tool permissions + default toolset + marketplace

ALTER TABLE mcp_servers ADD COLUMN tool_permissions TEXT;

CREATE TABLE IF NOT EXISTS default_toolset (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  server_ids TEXT NOT NULL,
  tool_overrides TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

ALTER TABLE plugins ADD COLUMN manifest_url TEXT;
ALTER TABLE plugins ADD COLUMN last_checked_at INTEGER;
ALTER TABLE plugins ADD COLUMN update_available INTEGER DEFAULT 0;
ALTER TABLE plugins ADD COLUMN marketplace_source_id TEXT;

CREATE TABLE IF NOT EXISTS marketplace_sources (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  name TEXT,
  description TEXT,
  last_fetched_at INTEGER,
  created_at INTEGER NOT NULL
);
