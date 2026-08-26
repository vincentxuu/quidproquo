-- Agent sessions for raw DO CCR console (complements agent_runs)
-- Messages/events mirror opencode packages/core/src/session/sql.ts, backed by D1

CREATE TABLE IF NOT EXISTS agent_sessions (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  trigger TEXT NOT NULL, -- cron | manual | ws
  status TEXT NOT NULL DEFAULT 'pending', -- pending | running | waiting_approval | done | failed
  git_ref TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS agent_messages (
  session_id TEXT NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
  seq INTEGER NOT NULL,
  role TEXT NOT NULL, -- user | assistant | tool_result
  content_json TEXT NOT NULL,
  tool_call_id TEXT,
  tool_name TEXT,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, seq)
);

CREATE TABLE IF NOT EXISTS agent_events (
  session_id TEXT NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
  seq INTEGER NOT NULL,
  type TEXT NOT NULL, -- assistant | tool_result | control_request | control_response | max_turns
  payload_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, seq)
);

CREATE INDEX IF NOT EXISTS idx_agent_sessions_status ON agent_sessions(status);
CREATE INDEX IF NOT EXISTS idx_agent_messages_session ON agent_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_events_session ON agent_events(session_id);
