-- Persistent storage for deep research results and configuration snapshots

CREATE TABLE IF NOT EXISTS deep_research_reports (
  report_id TEXT PRIMARY KEY,
  brief TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  final_report TEXT NOT NULL,
  summary TEXT,
  max_queries INTEGER,
  max_tokens INTEGER,
  max_search_calls INTEGER,
  enable_flags TEXT,
  token_profile TEXT,
  search_profile TEXT,
  source_profile TEXT,
  result_profile TEXT,
  search_tool_profile TEXT,
  search_tool_profiles TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_deep_research_reports_created_at
  ON deep_research_reports(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_deep_research_reports_provider
  ON deep_research_reports(provider, model);

CREATE INDEX IF NOT EXISTS idx_deep_research_reports_status
  ON deep_research_reports(status, created_at DESC);
