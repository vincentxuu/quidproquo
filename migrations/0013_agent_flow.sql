-- Agent flow execution: definitions, versions, presets, runs, steps, and run state

CREATE TABLE IF NOT EXISTS flow_definitions (
  flow_id TEXT PRIMARY KEY, -- canonical flow identifier, e.g. 'deep-research'
  display_name TEXT NOT NULL,
  description TEXT,
  current_version INTEGER NOT NULL DEFAULT 1,
  is_enabled INTEGER NOT NULL DEFAULT 1,
  definition_yaml TEXT NOT NULL, -- latest version YAML snapshot
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS flow_versions (
  version_id INTEGER PRIMARY KEY AUTOINCREMENT,
  flow_id TEXT NOT NULL REFERENCES flow_definitions(flow_id),
  version INTEGER NOT NULL,
  definition_yaml TEXT NOT NULL, -- verbatim YAML for audit
  compiled_json TEXT, -- compiled JSON snapshot
  published_by TEXT,
  published_at INTEGER NOT NULL,
  UNIQUE(flow_id, version)
);

CREATE TABLE IF NOT EXISTS flow_presets (
  preset_id TEXT PRIMARY KEY,
  flow_id TEXT NOT NULL REFERENCES flow_definitions(flow_id),
  display_name TEXT NOT NULL,
  overrides_json TEXT, -- JSON-encoded FlowPresetOverrides
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS flow_runs (
  flow_run_id TEXT PRIMARY KEY,
  flow_id TEXT NOT NULL REFERENCES flow_definitions(flow_id),
  preset_id TEXT REFERENCES flow_presets(preset_id),
  status TEXT NOT NULL DEFAULT 'queued', -- queued|running|done|failed|cancelled
  input_json TEXT NOT NULL DEFAULT '{}',
  output_json TEXT,
  error_json TEXT,
  started_at INTEGER NOT NULL,
  finished_at INTEGER,
  latency_ms INTEGER,
  tokens_in INTEGER NOT NULL DEFAULT 0,
  tokens_out INTEGER NOT NULL DEFAULT 0,
  cost_usd REAL NOT NULL DEFAULT 0,
  parent_flow_run_id TEXT REFERENCES flow_runs(flow_run_id), -- for sub-flows
  parent_step_run_id TEXT REFERENCES flow_step_runs(step_run_id),
  parent_kind TEXT, -- 'pipeline' for migrated admin_jobs
  parent_external_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS flow_step_runs (
  step_run_id TEXT PRIMARY KEY,
  flow_run_id TEXT NOT NULL REFERENCES flow_runs(flow_run_id),
  parent_step_run_id TEXT REFERENCES flow_step_runs(step_run_id), -- for parallel branches
  step_id TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  step_type TEXT NOT NULL, -- agent|tool_group|transform|verifier|artifact|human_approval|sub_flow|parallel|loop
  iteration INTEGER NOT NULL DEFAULT 0, -- loop iteration counter
  status TEXT NOT NULL DEFAULT 'pending', -- pending|running|done|failed|cancelled|skipped
  attempt INTEGER NOT NULL DEFAULT 1,
  inputs_json TEXT,
  outputs_json TEXT,
  error_json TEXT,
  agent_run_id TEXT REFERENCES agent_runs(run_id), -- for agent steps
  started_at INTEGER NOT NULL,
  finished_at INTEGER,
  latency_ms INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS flow_run_state (
  flow_run_id TEXT PRIMARY KEY REFERENCES flow_runs(flow_run_id),
  state_json TEXT NOT NULL DEFAULT '{}', -- mutable KV store for inter-step data
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_flow_runs_status ON flow_runs(status, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_flow_runs_flow_id ON flow_runs(flow_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_flow_step_runs_flow_run ON flow_step_runs(flow_run_id, step_order);
CREATE INDEX IF NOT EXISTS idx_flow_definitions_flow_id ON flow_definitions(flow_id);
CREATE INDEX IF NOT EXISTS idx_flow_versions_flow_id ON flow_versions(flow_id, version DESC);
CREATE INDEX IF NOT EXISTS idx_flow_presets_flow_id ON flow_presets(flow_id);

-- Add flow_run_id to agent_runs for cross-table cost rollup and provenance queries.
-- Idempotent: ALTER TABLE ADD COLUMN is safe to re-run if column already exists.
ALTER TABLE agent_runs ADD COLUMN flow_run_id TEXT REFERENCES flow_runs(flow_run_id);
