-- Phase 3: Data reconciliation — migrate admin_jobs rows into flow_runs
-- Creates one flow_runs row per admin_jobs row with parent_kind='pipeline'
-- so the admin UI history view shows uninterrupted lineage.
--
-- The flow_runs table already has parent_kind and parent_external_id columns
-- (added in migration 0013_agent_flow.sql). No ALTER TABLE needed.
--
-- Idempotency: INSERT OR IGNORE + WHERE NOT EXISTS guard ensures re-running
-- this migration is a safe no-op (keyed on parent_kind + parent_external_id).
--
-- Status mapping:
--   admin_jobs.status → flow_runs.status
--   'pending'         → 'queued'
--   'queued'          → 'queued'
--   'running'         → 'running'
--   'waiting_review'  → 'running'   (closest active state; no flow equivalent)
--   'succeeded'       → 'done'
--   'failed'          → 'failed'
--   'cancelled'       → 'cancelled'
--   'dead_letter'     → 'failed'    (terminal failure)
--
-- flow_run_id shape: 'pipeline-legacy-' || admin_jobs.id
-- flow_id shape:     'pipeline-' || admin_jobs.pipeline_id
-- These synthetic ids match the D6-synthetic-flow-id convention from Phase 4
-- (redirector.ts) so legacy ids never collide with real flow ids.
--
-- Columns in admin_jobs NOT present in flow_runs (dropped/not mapped):
--   risk, requested_by, output_summary, error_summary, failure_reason,
--   retry_count, dead_letter_at, token_input, token_output, provider, model
--   → these are surfaced via parent_external_id round-trip to admin_jobs
--
-- Columns in flow_runs NOT present in admin_jobs (set to NULL or default):
--   preset_id, tokens_in, tokens_out, cost_usd,
--   parent_flow_run_id, parent_step_run_id, updated_at
--
-- ASSERT: SELECT COUNT(*) FROM admin_jobs;
-- ASSERT: SELECT COUNT(*) FROM flow_runs WHERE parent_kind='pipeline';

INSERT OR IGNORE INTO flow_runs (
  flow_run_id,
  flow_id,
  preset_id,
  status,
  input_json,
  output_json,
  error_json,
  started_at,
  finished_at,
  latency_ms,
  tokens_in,
  tokens_out,
  cost_usd,
  parent_flow_run_id,
  parent_step_run_id,
  parent_kind,
  parent_external_id,
  created_at,
  updated_at
)
SELECT
  'pipeline-legacy-' || id                    AS flow_run_id,
  'pipeline-' || pipeline_id                  AS flow_id,
  NULL                                        AS preset_id,
  CASE status
    WHEN 'pending'        THEN 'queued'
    WHEN 'queued'         THEN 'queued'
    WHEN 'running'        THEN 'running'
    WHEN 'waiting_review' THEN 'running'
    WHEN 'succeeded'      THEN 'done'
    WHEN 'failed'         THEN 'failed'
    WHEN 'cancelled'      THEN 'cancelled'
    WHEN 'dead_letter'    THEN 'failed'
    ELSE                       'failed'
  END                                         AS status,
  COALESCE(input_json, '{}')                  AS input_json,
  CASE
    WHEN output_summary IS NOT NULL
    THEN json_object('summary', output_summary)
    ELSE NULL
  END                                         AS output_json,
  CASE
    WHEN error_summary IS NOT NULL OR failure_reason IS NOT NULL
    THEN json_object(
           'summary', COALESCE(error_summary, ''),
           'reason',  COALESCE(failure_reason, '')
         )
    ELSE NULL
  END                                         AS error_json,
  COALESCE(
    CAST(strftime('%s', started_at) AS INTEGER) * 1000,
    CAST(strftime('%s', created_at) AS INTEGER) * 1000
  )                                           AS started_at,
  CASE
    WHEN finished_at IS NOT NULL
    THEN CAST(strftime('%s', finished_at) AS INTEGER) * 1000
    ELSE NULL
  END                                         AS finished_at,
  CASE
    WHEN started_at IS NOT NULL AND finished_at IS NOT NULL
    THEN CAST(
           (strftime('%s', finished_at) - strftime('%s', started_at)) * 1000
           AS INTEGER
         )
    ELSE NULL
  END                                         AS latency_ms,
  COALESCE(token_input, 0)                    AS tokens_in,
  COALESCE(token_output, 0)                   AS tokens_out,
  0.0                                         AS cost_usd,
  NULL                                        AS parent_flow_run_id,
  NULL                                        AS parent_step_run_id,
  'pipeline'                                  AS parent_kind,
  CAST(id AS TEXT)                            AS parent_external_id,
  CAST(strftime('%s', created_at) AS INTEGER) * 1000  AS created_at,
  CAST(strftime('%s', COALESCE(finished_at, created_at)) AS INTEGER) * 1000  AS updated_at
FROM admin_jobs
WHERE NOT EXISTS (
  SELECT 1
  FROM   flow_runs fr
  WHERE  fr.parent_kind        = 'pipeline'
  AND    fr.parent_external_id = CAST(admin_jobs.id AS TEXT)
);

-- DOWN migration recipe (do not execute as part of this migration):
-- DELETE FROM flow_step_runs
--   WHERE flow_run_id IN (
--     SELECT flow_run_id FROM flow_runs WHERE parent_kind = 'pipeline'
--   );
-- DELETE FROM flow_runs
--   WHERE parent_kind = 'pipeline'
--   AND   parent_external_id IS NOT NULL;
-- Note: admin_jobs rows are NOT deleted by the up migration.
-- The down recipe removes only the imported flow_runs (and any associated
-- flow_step_runs), restoring the pre-migration state of flow_runs without
-- touching the original admin_jobs table.
