-- Phase 3: Routine trigger + notification extensions
ALTER TABLE routines ADD COLUMN api_token TEXT;
ALTER TABLE routines ADD COLUMN api_token_created_at INTEGER;
ALTER TABLE routines ADD COLUMN stagger_seconds INTEGER NOT NULL DEFAULT 0;
ALTER TABLE routines ADD COLUMN notification_enabled INTEGER NOT NULL DEFAULT 0;
ALTER TABLE routines ADD COLUMN notification_channels TEXT;
ALTER TABLE routines ADD COLUMN last_run_id TEXT;
ALTER TABLE routines ADD COLUMN last_run_at INTEGER;
ALTER TABLE routines ADD COLUMN last_run_status TEXT;
ALTER TABLE routines ADD COLUMN next_run_at INTEGER;
ALTER TABLE routines ADD COLUMN behavior_auto_fix_pr INTEGER NOT NULL DEFAULT 0;
ALTER TABLE routines ADD COLUMN behavior_auto_create_pr INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_routines_next_run ON routines(next_run_at) WHERE enabled = 1;

CREATE TABLE IF NOT EXISTS notification_channels (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  config TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
