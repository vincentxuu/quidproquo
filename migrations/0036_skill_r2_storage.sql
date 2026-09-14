-- Skill/Tool/Hook/Plugin v2: four-table component model with unified enablement.
-- Designed around two axes: who decides execution × context cost.

-----------------------------------------------------------------------
-- 1. SKILL: model-triggered, metadata always resident, body on-demand
-----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS skill (
  id                TEXT PRIMARY KEY,
  slug              TEXT NOT NULL UNIQUE,           -- immutable kebab-case, 1-64 chars
  display_name      TEXT,                           -- human-readable, mutable
  scope             TEXT NOT NULL DEFAULT 'personal', -- personal | team | org | public
  source            TEXT NOT NULL DEFAULT 'custom', -- custom | builtin | marketplace
  owner_id          TEXT,
  latest_version_id TEXT,
  created_at        INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_skill_scope ON skill(scope);

CREATE TABLE IF NOT EXISTS skill_version (
  id            TEXT PRIMARY KEY,                   -- skillver_<monotonic>
  skill_id      TEXT NOT NULL REFERENCES skill(id),
  version       INTEGER NOT NULL,                   -- monotonic counter, not semver
  name          TEXT NOT NULL,
  description   TEXT NOT NULL,                      -- trigger text, ~1024 chars max
  body          TEXT,                               -- SKILL.md body, small files inline
  body_r2_key   TEXT,                               -- large body stored in R2
  allowed_tools TEXT,                               -- JSON array of tool names
  content_hash  TEXT NOT NULL,                      -- cache key, whole-package checksum
  status        TEXT NOT NULL DEFAULT 'draft',      -- draft | published | deprecated
  metadata      TEXT,                               -- JSON: semver label, tags, etc.
  resident_tokens INTEGER,                          -- measured context cost
  published_at  INTEGER,
  created_at    INTEGER NOT NULL,
  UNIQUE (skill_id, version)
);

CREATE INDEX IF NOT EXISTS idx_skill_version_skill ON skill_version(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_version_status ON skill_version(status);

-- Attached files: pointer only, blob in R2 (content-addressed dedup)
CREATE TABLE IF NOT EXISTS skill_file (
  id          TEXT PRIMARY KEY,
  version_id  TEXT NOT NULL REFERENCES skill_version(id),
  path        TEXT NOT NULL,                        -- relative path e.g. scripts/build.sh
  blob_key    TEXT NOT NULL,                        -- R2 key, content-addressed
  size_bytes  INTEGER,
  created_at  INTEGER NOT NULL,
  UNIQUE (version_id, path)
);

CREATE INDEX IF NOT EXISTS idx_skill_file_version ON skill_file(version_id);
CREATE INDEX IF NOT EXISTS idx_skill_file_blob ON skill_file(blob_key);

-- Trigger accuracy tracking
CREATE TABLE IF NOT EXISTS skill_invocation (
  id          TEXT PRIMARY KEY,
  version_id  TEXT NOT NULL REFERENCES skill_version(id),
  session_id  TEXT,
  triggered_at INTEGER NOT NULL,
  outcome     TEXT                                  -- used | loaded_unused | error
);

CREATE INDEX IF NOT EXISTS idx_skill_invocation_version ON skill_invocation(version_id);

-----------------------------------------------------------------------
-- 2. TOOL (MCP): model-called, schema always resident (expensive),
--    source of truth is remote server, we store snapshots
-----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS mcp_server_v2 (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,                 -- namespace prefix
  transport   TEXT NOT NULL,                        -- http | sse | stdio
  url         TEXT,
  auth_type   TEXT DEFAULT 'none',                  -- oauth | api_key | none
  secret_ref  TEXT,                                 -- points to secret manager
  enabled     INTEGER DEFAULT 1,
  created_at  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tool_snapshot (
  id            TEXT PRIMARY KEY,
  server_id     TEXT NOT NULL REFERENCES mcp_server_v2(id),
  tool_name     TEXT NOT NULL,
  qualified_key TEXT NOT NULL,                      -- server_name__tool_name, stable ref
  description   TEXT NOT NULL,
  input_schema  TEXT NOT NULL,                      -- JSON
  schema_hash   TEXT NOT NULL,                      -- drift detection
  first_seen_at INTEGER,
  last_seen_at  INTEGER,
  removed_at    INTEGER,                            -- soft delete
  UNIQUE (server_id, tool_name, schema_hash)
);

CREATE INDEX IF NOT EXISTS idx_tool_snapshot_qualified ON tool_snapshot(qualified_key);
CREATE INDEX IF NOT EXISTS idx_tool_snapshot_server ON tool_snapshot(server_id);

-----------------------------------------------------------------------
-- 3. HOOK: system-event triggered, zero context cost, deterministic
-----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS hook (
  id              TEXT PRIMARY KEY,
  event           TEXT NOT NULL,                    -- PreToolUse | PostToolUse | SessionStart | Stop
  matcher         TEXT,                             -- regex/glob on tool qualified_key
  handler_type    TEXT NOT NULL,                    -- command | http | inline
  handler_ref     TEXT NOT NULL,
  priority        INTEGER NOT NULL DEFAULT 100,     -- execution order within same event
  blocking        INTEGER NOT NULL DEFAULT 0,       -- can deny/modify
  timeout_ms      INTEGER NOT NULL DEFAULT 5000,
  on_failure      TEXT NOT NULL DEFAULT 'fail_closed', -- fail_open | fail_closed
  source_plugin_id TEXT,
  enabled         INTEGER DEFAULT 1,
  created_at      INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_hook_event ON hook(event);

CREATE TABLE IF NOT EXISTS hook_execution (
  id          TEXT PRIMARY KEY,
  hook_id     TEXT NOT NULL REFERENCES hook(id),
  session_id  TEXT,
  decision    TEXT,                                 -- allow | deny | modify | noop
  duration_ms INTEGER,
  error       TEXT,
  executed_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_hook_execution_hook ON hook_execution(hook_id);

-----------------------------------------------------------------------
-- 4. PLUGIN: packaging + distribution unit, no execution
-----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS plugin_version (
  id          TEXT PRIMARY KEY,
  plugin_id   TEXT NOT NULL,
  version     INTEGER NOT NULL,                     -- monotonic
  manifest    TEXT NOT NULL,                         -- JSON: declared components
  source_type TEXT,                                  -- registry | git | local
  signature   TEXT,
  created_at  INTEGER NOT NULL,
  UNIQUE (plugin_id, version)
);

CREATE TABLE IF NOT EXISTS plugin_install (
  id                TEXT PRIMARY KEY,
  subject_type      TEXT NOT NULL,                   -- agent | workspace
  subject_id        TEXT NOT NULL,
  plugin_version_id TEXT NOT NULL REFERENCES plugin_version(id),
  installed_at      INTEGER NOT NULL
);

-----------------------------------------------------------------------
-- 5. UNIFIED ENABLEMENT: "what can this agent/user/workspace do?"
-----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS enablement (
  subject_type      TEXT NOT NULL,                   -- agent | workspace | user | session
  subject_id        TEXT NOT NULL,
  component_type    TEXT NOT NULL,                   -- skill | tool | hook | command
  component_id      TEXT NOT NULL,
  pinned_version_id TEXT,                            -- NULL = follow latest
  source_plugin_id  TEXT,                            -- for clean uninstall
  enabled           INTEGER DEFAULT 1,
  created_at        INTEGER NOT NULL,
  PRIMARY KEY (subject_type, subject_id, component_type, component_id)
);

CREATE INDEX IF NOT EXISTS idx_enablement_subject ON enablement(subject_type, subject_id);
