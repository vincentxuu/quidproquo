-- Phase 1C PageIndex controls

INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES
  ('rag_flag_pageindex', '0', datetime('now')),
  ('rag_pageindex_max_steps', '5', datetime('now'));
