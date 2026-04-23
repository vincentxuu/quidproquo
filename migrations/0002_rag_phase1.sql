-- Phase 1 RAG migration

-- Additions to existing chunk tables
ALTER TABLE post_chunks ADD COLUMN image_description TEXT;
ALTER TABLE post_chunks ADD COLUMN sentence_window TEXT;
ALTER TABLE doc_chunks ADD COLUMN image_description TEXT;
ALTER TABLE doc_chunks ADD COLUMN sentence_window TEXT;

-- FTS5 for hybrid search (BM25)
CREATE VIRTUAL TABLE chunks_fts USING fts5(
  content,
  chunk_id UNINDEXED,
  source_type UNINDEXED
);

INSERT INTO chunks_fts(content, chunk_id, source_type)
  SELECT content, id, 'post' FROM post_chunks;
INSERT INTO chunks_fts(content, chunk_id, source_type)
  SELECT content, id, 'doc' FROM doc_chunks;

-- Conversation logs
CREATE TABLE IF NOT EXISTS chat_logs (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL,
  ip TEXT,
  is_admin INTEGER DEFAULT 0,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  confidence REAL,
  langfuse_trace_id TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_chat_logs_thread ON chat_logs(thread_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_ip ON chat_logs(ip);

-- User feedback
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  chat_log_id TEXT NOT NULL,
  rating INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (chat_log_id) REFERENCES chat_logs(id)
);

-- System settings
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO settings VALUES
  ('visitor_daily_limit', '5', datetime('now')),
  ('chunk_size', '2000', datetime('now')),
  ('chunk_overlap', '200', datetime('now')),
  ('chunk_strategy', 'by_heading', datetime('now')),
  ('image_description', 'true', datetime('now')),
  ('critic_max_retry', '2', datetime('now')),
  ('semantic_cache_threshold', '0.92', datetime('now')),
  ('crag_quality_threshold', '0.4', datetime('now')),
  ('agent_max_iterations', '5', datetime('now'));
