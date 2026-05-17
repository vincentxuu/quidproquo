-- Agent OS kernel process, storage, tool telemetry, access, and memory tables.

-- Process registry: one row per registered agent definition. Allowed trigger schedules are cron expressions or NULL.
CREATE TABLE IF NOT EXISTS agent_processes (
  agent_id TEXT PRIMARY KEY,
  version INTEGER NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  schedule TEXT,
  tool_call_limit INTEGER NOT NULL,
  timeout_seconds INTEGER NOT NULL,
  max_concurrent INTEGER NOT NULL DEFAULT 1,
  approval_ttl_seconds INTEGER NOT NULL DEFAULT 86400,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Agent run lifecycle rows. status: pending|running|paused|done|failed|cancelled. trigger: manual|cron|queue|sub-agent.
CREATE TABLE IF NOT EXISTS agent_runs (
  run_id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agent_processes(agent_id),
  agent_version INTEGER NOT NULL,
  status TEXT NOT NULL,
  trigger TEXT NOT NULL,
  parent_run_id TEXT,
  input_json TEXT NOT NULL,
  output_json TEXT,
  error_json TEXT,
  cancel_signal INTEGER DEFAULT 0,
  started_at INTEGER NOT NULL,
  finished_at INTEGER,
  total_tokens INTEGER DEFAULT 0,
  total_cost_usd REAL DEFAULT 0,
  total_tool_calls INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_agent_runs_status
  ON agent_runs(status);

CREATE INDEX IF NOT EXISTS idx_agent_runs_agent_id_started
  ON agent_runs(agent_id, started_at DESC);

-- Structured event log for replay and observability.
CREATE TABLE IF NOT EXISTS agent_run_events (
  event_id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id TEXT NOT NULL REFERENCES agent_runs(run_id),
  kind TEXT NOT NULL,
  step_id TEXT,
  payload_json TEXT NOT NULL,
  at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_agent_run_events_run
  ON agent_run_events(run_id, event_id);

-- Syscall telemetry rows. One row per mediated tool/model call.
CREATE TABLE IF NOT EXISTS agent_tool_calls (
  call_id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id TEXT NOT NULL REFERENCES agent_runs(run_id),
  syscall_name TEXT NOT NULL,
  input_json TEXT NOT NULL,
  output_json TEXT,
  error TEXT,
  tokens_in INTEGER DEFAULT 0,
  tokens_out INTEGER DEFAULT 0,
  cost_usd REAL DEFAULT 0,
  latency_ms INTEGER NOT NULL,
  started_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_agent_tool_calls_run
  ON agent_tool_calls(run_id);

-- Live snapshot of declarative per-agent grants mirrored from code on boot.
CREATE TABLE IF NOT EXISTS agent_permissions (
  agent_id TEXT PRIMARY KEY REFERENCES agent_processes(agent_id),
  version INTEGER NOT NULL,
  grants_hash TEXT NOT NULL,
  syscalls_json TEXT NOT NULL,
  memory_scopes_json TEXT NOT NULL,
  secrets_json TEXT NOT NULL,
  outbound_domains_json TEXT NOT NULL,
  irreversible_actions_require_approval INTEGER NOT NULL DEFAULT 1,
  updated_at INTEGER NOT NULL
);

-- Human approval gate rows. status: pending|approved|rejected|expired.
CREATE TABLE IF NOT EXISTS agent_approval_requests (
  approval_id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES agent_runs(run_id),
  reason TEXT NOT NULL,
  context_json TEXT NOT NULL,
  status TEXT NOT NULL,
  resolved_by TEXT,
  resolved_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_agent_approval_requests_pending
  ON agent_approval_requests(status, created_at);

-- Memory index for BM25 and entity lookup. memory_type: working|episodic|semantic|procedural.
CREATE TABLE IF NOT EXISTS agent_memory_items (
  item_id TEXT PRIMARY KEY,
  scope_key TEXT NOT NULL,
  memory_type TEXT NOT NULL,
  body_text TEXT NOT NULL,
  body_json TEXT,
  entities_json TEXT,
  vector_id TEXT,
  importance REAL DEFAULT 0,
  written_at INTEGER NOT NULL,
  expires_at INTEGER,
  last_read_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_agent_memory_items_scope
  ON agent_memory_items(scope_key, memory_type, written_at DESC);

CREATE VIRTUAL TABLE IF NOT EXISTS agent_memory_fts USING fts5(
  body_text,
  entities,
  content='agent_memory_items',
  content_rowid='rowid'
);
