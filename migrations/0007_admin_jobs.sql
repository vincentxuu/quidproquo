-- Phase 0: Admin Jobs / Job Steps / Job Artifacts tables for Content Agent Harness
-- See docs/ai-agent-content-system.md for full design

CREATE TABLE IF NOT EXISTS admin_jobs (
  id TEXT PRIMARY KEY,
  pipeline_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued', -- queued | running | waiting_review | succeeded | failed | cancelled | dead_letter
  risk TEXT NOT NULL DEFAULT 'low', -- low | medium | high
  requested_by TEXT, -- 'admin' | 'cron' | 'api'
  input_json TEXT NOT NULL,
  output_summary TEXT,
  error_summary TEXT,
  failure_reason TEXT,
  retry_count INTEGER DEFAULT 0,
  dead_letter_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  started_at TEXT,
  finished_at TEXT,
  token_input INTEGER,
  token_output INTEGER,
  provider TEXT,
  model TEXT
);

CREATE TABLE IF NOT EXISTS admin_job_steps (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  stage_id TEXT NOT NULL,
  kind TEXT NOT NULL, -- module | api | llm | human_review
  status TEXT NOT NULL DEFAULT 'pending', -- pending | running | succeeded | failed | skipped
  input_summary TEXT,
  output_summary TEXT,
  artifact_id TEXT,
  duration_ms INTEGER,
  error_summary TEXT,
  guard_results TEXT, -- JSON array of guard check results
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  started_at TEXT,
  finished_at TEXT,
  FOREIGN KEY (job_id) REFERENCES admin_jobs(id)
);

CREATE TABLE IF NOT EXISTS admin_job_artifacts (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  step_id TEXT,
  type TEXT NOT NULL, -- markdown_draft | json_report | diff_suggestion | brief | log
  name TEXT,
  path TEXT, -- file path for large artifacts
  content_json TEXT, -- inline JSON for small artifacts
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (job_id) REFERENCES admin_jobs(id)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_admin_jobs_pipeline ON admin_jobs(pipeline_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_jobs_status ON admin_jobs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_jobs_created ON admin_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_job_steps_job ON admin_job_steps(job_id, created_at);
CREATE INDEX IF NOT EXISTS idx_admin_job_artifacts_job ON admin_job_artifacts(job_id);
