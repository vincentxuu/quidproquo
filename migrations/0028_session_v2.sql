-- Phase 2: Session v2 — lifecycle, runner, SSE support

-- §4.1: agent_sessions 加欄位
ALTER TABLE agent_sessions ADD COLUMN name TEXT;
ALTER TABLE agent_sessions ADD COLUMN model TEXT;
ALTER TABLE agent_sessions ADD COLUMN mode TEXT DEFAULT 'auto';
ALTER TABLE agent_sessions ADD COLUMN repo TEXT;
ALTER TABLE agent_sessions ADD COLUMN runner_provider TEXT DEFAULT 'mac';
ALTER TABLE agent_sessions ADD COLUMN pinned INTEGER DEFAULT 0;
ALTER TABLE agent_sessions ADD COLUMN archived INTEGER DEFAULT 0;
ALTER TABLE agent_sessions ADD COLUMN share_token TEXT;
ALTER TABLE agent_sessions ADD COLUMN routine_id TEXT;
ALTER TABLE agent_sessions ADD COLUMN total_tokens INTEGER DEFAULT 0;
ALTER TABLE agent_sessions ADD COLUMN total_cost_usd REAL DEFAULT 0;
ALTER TABLE agent_sessions ADD COLUMN summary_category TEXT;
ALTER TABLE agent_sessions ADD COLUMN summary_detail TEXT;
ALTER TABLE agent_sessions ADD COLUMN needs_action INTEGER DEFAULT 0;
ALTER TABLE agent_sessions ADD COLUMN finished_at INTEGER;

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_sessions_share
  ON agent_sessions(share_token) WHERE share_token IS NOT NULL;

-- §4.2: agent_events 加 event_id（SSE resume_token 用）
ALTER TABLE agent_events ADD COLUMN event_id INTEGER;
UPDATE agent_events SET event_id = rowid WHERE event_id IS NULL;

-- §4.3: runner 連線狀態
CREATE TABLE IF NOT EXISTS runner_connections (
  runner_id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  hostname TEXT,
  status TEXT NOT NULL DEFAULT 'disconnected',
  last_heartbeat INTEGER,
  created_at INTEGER NOT NULL
);
