-- Set defaults for trace retention controls used by /api/admin/traces/retention

INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES
  ('rag_trace_retention_prod_days', '14', datetime('now')),
  ('rag_trace_retention_admin_days', '30', datetime('now')),
  ('rag_trace_retention_prod_native_days', '7', datetime('now')),
  ('rag_trace_retention_admin_native_days', '30', datetime('now')),
  ('rag_trace_retention_native_sample_bps', '100', datetime('now')),
  ('rag_trace_retention_error_grace_days', '3', datetime('now')),
  ('rag_trace_retention_enabled', '1', datetime('now'));
