-- Phase 1B incremental admin, engine routing, and trace observability

INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES
  ('rag_pipeline_engine', 'langgraph', datetime('now')),
  ('rag_default_provider', 'groq', datetime('now')),
  ('rag_default_model', 'llama-3.3-70b-versatile', datetime('now')),
  ('rag_stage_overrides', '{}', datetime('now')),
  ('rag_fallback_provider', '', datetime('now')),
  ('rag_fallback_model', '', datetime('now')),
  ('rag_flag_bm25_short_circuit', '1', datetime('now')),
  ('rag_search_daily_limit', '20', datetime('now'));

CREATE TABLE IF NOT EXISTS rag_trace_steps (
  id TEXT PRIMARY KEY,
  trace_id TEXT NOT NULL,
  thread_id TEXT NOT NULL,
  stage TEXT NOT NULL,
  started_at TEXT NOT NULL,
  duration_ms INTEGER NOT NULL,
  input_summary TEXT,
  output_summary TEXT,
  token_input INTEGER,
  token_output INTEGER,
  metadata_json TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS rag_admin_audit (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  before_json TEXT,
  after_json TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rag_trace_steps_trace ON rag_trace_steps(trace_id, started_at);
CREATE INDEX IF NOT EXISTS idx_rag_trace_steps_thread ON rag_trace_steps(thread_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_rag_admin_audit_created ON rag_admin_audit(created_at DESC);
