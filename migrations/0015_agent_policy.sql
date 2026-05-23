-- Agent policy definitions, bindings, and violations
CREATE TABLE IF NOT EXISTS policy_definitions (
  policy_id INTEGER PRIMARY KEY AUTOINCREMENT,
  policy_key TEXT NOT NULL UNIQUE,
  version INTEGER NOT NULL DEFAULT 1,
  label TEXT NOT NULL,
  category_json TEXT NOT NULL, -- JSON PolicyBody
  created_by TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  archived_at INTEGER
);

CREATE TABLE IF NOT EXISTS policy_bindings (
  binding_id INTEGER PRIMARY KEY AUTOINCREMENT,
  policy_id INTEGER NOT NULL REFERENCES policy_definitions(policy_id),
  flow_run_id INTEGER REFERENCES flow_runs(flow_run_id),
  flow_definition_id INTEGER REFERENCES flow_definitions(flow_definition_id),
  agent_id TEXT,
  scope TEXT NOT NULL, -- 'run'|'flow_definition'|'agent'|'global'
  frozen_effective_json TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS policy_violations (
  violation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  flow_run_id INTEGER REFERENCES flow_runs(flow_run_id),
  agent_run_id INTEGER REFERENCES agent_runs(run_id),
  policy_id INTEGER NOT NULL REFERENCES policy_definitions(policy_id),
  category TEXT NOT NULL, -- 'budget'|'provider'|'quality'|'security'|'human'|'retry'
  rule_key TEXT NOT NULL,
  severity TEXT NOT NULL, -- 'warn'|'block'|'kill'
  observed_value_json TEXT NOT NULL,
  limit_value_json TEXT NOT NULL,
  action_taken TEXT NOT NULL, -- 'logged'|'blocked'|'run_killed'|'approval_gated'|'request_retried'|'request_failed'
  partial_output_ref TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_policy_bindings_flow_run ON policy_bindings(flow_run_id);
CREATE INDEX IF NOT EXISTS idx_policy_bindings_policy ON policy_bindings(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_violations_flow_run ON policy_violations(flow_run_id);
CREATE INDEX IF NOT EXISTS idx_policy_violations_category ON policy_violations(category, created_at);
