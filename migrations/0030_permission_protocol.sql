-- Phase 4: Mode + permission protocol

-- agent_runs already has mode column from migration 0028; add to approval requests
ALTER TABLE agent_approval_requests ADD COLUMN subtype TEXT DEFAULT 'can_use_tool';
ALTER TABLE agent_approval_requests ADD COLUMN display_name TEXT;
ALTER TABLE agent_approval_requests ADD COLUMN input_json TEXT;
ALTER TABLE agent_approval_requests ADD COLUMN risk_score REAL;
ALTER TABLE agent_approval_requests ADD COLUMN response_behavior TEXT;
ALTER TABLE agent_approval_requests ADD COLUMN updated_input_json TEXT;

-- Per-session tool permission overrides
CREATE TABLE IF NOT EXISTS agent_permission_policies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  policy TEXT NOT NULL DEFAULT 'ask',
  created_at INTEGER NOT NULL,
  UNIQUE(session_id, tool_name)
);
