-- Explicitly saved chat transcripts; Access JWT subject is the ownership key.
CREATE TABLE IF NOT EXISTS personal_chat_threads (
  owner_id TEXT NOT NULL,
  thread_id TEXT NOT NULL,
  title TEXT NOT NULL,
  transcript_json TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (owner_id, thread_id)
);
CREATE INDEX IF NOT EXISTS idx_personal_chat_owner_updated ON personal_chat_threads(owner_id, updated_at DESC);
