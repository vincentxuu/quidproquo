-- Routines (CCR parity): scheduled agent definitions
CREATE TABLE IF NOT EXISTS routines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  instructions TEXT NOT NULL DEFAULT '',
  trigger_type TEXT NOT NULL DEFAULT 'schedule', -- schedule | github | api
  cron TEXT, -- e.g. '0 2 * * *' or one-time ISO
  repo TEXT, -- e.g. 'vincentxuu/quidproquo'
  enabled INTEGER NOT NULL DEFAULT 1,
  connectors TEXT, -- JSON array of provider ids
  model TEXT, -- e.g. 'sonnet-5' or 'groq/llama-3.3-70b-versatile'
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_routines_enabled ON routines(enabled);
CREATE INDEX IF NOT EXISTS idx_routines_trigger ON routines(trigger_type);

-- Routine runs history (already have agent_sessions, this is alias for UI parity)
-- reuse agent_sessions with routine_id FK for lookup
CREATE INDEX IF NOT EXISTS idx_agent_sessions_routine ON agent_sessions(agent_id);
