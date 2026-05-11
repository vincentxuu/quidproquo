-- Phase 1B RAG observability and strategy controls

INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES
  ('rag_flag_hyde', '0', datetime('now')),
  ('rag_flag_multi_query', '0', datetime('now')),
  ('rag_flag_reranker', '0', datetime('now')),
  ('rag_flag_critic', '1', datetime('now')),
  ('rag_shadow_mode', '0', datetime('now')),
  ('semantic_cache_threshold', '0.95', datetime('now')),
  ('rag_reranker_min_keep', '3', datetime('now')),
  ('rag_mmr_lambda', '0.7', datetime('now')),
  ('rag_checkpoint_threshold_ratio', '0.7', datetime('now'));

CREATE TABLE IF NOT EXISTS semantic_cache (
  id TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  query_vector TEXT NOT NULL,
  confidence REAL DEFAULT 0,
  hit_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS checkpoints (
  thread_id TEXT NOT NULL,
  checkpoint_id TEXT NOT NULL,
  summary TEXT NOT NULL,
  turn_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (thread_id, checkpoint_id)
);

CREATE TABLE IF NOT EXISTS shadow_runs (
  id TEXT PRIMARY KEY,
  trace_id TEXT NOT NULL,
  thread_id TEXT NOT NULL,
  query TEXT NOT NULL,
  primary_response TEXT NOT NULL,
  primary_confidence REAL,
  shadow_response TEXT NOT NULL,
  shadow_confidence REAL,
  config_json TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS eval_runs (
  id TEXT PRIMARY KEY,
  dataset_name TEXT NOT NULL,
  case_id TEXT NOT NULL,
  faithfulness REAL,
  answer_relevance REAL,
  context_recall REAL,
  passed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_semantic_cache_updated_at ON semantic_cache(updated_at);
CREATE INDEX IF NOT EXISTS idx_checkpoints_thread ON checkpoints(thread_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shadow_runs_trace ON shadow_runs(trace_id);
CREATE INDEX IF NOT EXISTS idx_eval_runs_dataset ON eval_runs(dataset_name, created_at DESC);
