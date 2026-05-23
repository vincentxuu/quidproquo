-- Agent artifact definitions, version chain, section traceability, and exports

-- One row per logical artifact (e.g. "Q1 research report"). Owns the version chain.
-- kind: markdown_report|evidence_bundle|json_payload|csv_spreadsheet|pdf_report|pptx_deck
-- owner_scope: 'flow_run'|'agent_run'|'manual'
CREATE TABLE IF NOT EXISTS artifact_definitions (
  definition_id TEXT PRIMARY KEY,
  flow_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  owner_scope TEXT NOT NULL,
  label TEXT NOT NULL,
  logical_name TEXT NOT NULL,
  inputs_hash TEXT,
  flow_run_id TEXT REFERENCES flow_runs(flow_run_id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- One row per version in the artifact's history. Parent-linked chain.
-- status: draft|approved|rejected|published
CREATE TABLE IF NOT EXISTS artifact_versions (
  version_id TEXT PRIMARY KEY,
  definition_id TEXT NOT NULL REFERENCES artifact_definitions(definition_id),
  version_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft|approved|rejected|published
  payload_json TEXT NOT NULL DEFAULT '{}',
  body_text TEXT, -- inline serialized body (<= 256KB)
  body_ref_json TEXT, -- R2 offload reference when body > 256KB
  parent_version_id TEXT REFERENCES artifact_versions(version_id),
  flow_run_id TEXT REFERENCES flow_runs(flow_run_id),
  flow_step_run_id TEXT REFERENCES flow_step_runs(step_run_id),
  resolved_by TEXT,
  created_at INTEGER NOT NULL
);

-- Section-level traceability: one row per addressable section of a version.
CREATE TABLE IF NOT EXISTS artifact_sections (
  section_id TEXT PRIMARY KEY,
  version_id TEXT NOT NULL REFERENCES artifact_versions(version_id),
  artifact_id TEXT NOT NULL REFERENCES artifact_definitions(definition_id),
  org_id TEXT NOT NULL DEFAULT 'default',
  section_key TEXT NOT NULL,
  ordinal INTEGER NOT NULL,
  heading TEXT,
  body_text TEXT NOT NULL DEFAULT '',
  body_json TEXT,
  claim_ids_json TEXT DEFAULT '[]', -- JSON array of evidence_claims.claim_id values
  source_ids_json TEXT,
  flow_step_run_id TEXT REFERENCES flow_step_runs(step_run_id),
  approval_status TEXT NOT NULL DEFAULT 'draft', -- draft|approved|rejected
  resolved_by TEXT,
  resolved_at INTEGER,
  created_at INTEGER NOT NULL
);

-- Export audit trail: one row per export attempt.
-- destination: file|notion|github|gdrive|slack|email
-- status: pending|done|failed
CREATE TABLE IF NOT EXISTS artifact_exports (
  export_id TEXT PRIMARY KEY,
  version_id TEXT NOT NULL REFERENCES artifact_versions(version_id),
  destination TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending|done|failed
  export_metadata_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_artifact_versions_definition ON artifact_versions(definition_id, version_number DESC);
CREATE INDEX IF NOT EXISTS idx_artifact_versions_flow_run ON artifact_versions(flow_run_id);
CREATE INDEX IF NOT EXISTS idx_artifact_sections_version ON artifact_sections(version_id, ordinal);
CREATE INDEX IF NOT EXISTS idx_artifact_exports_version ON artifact_exports(version_id);
CREATE INDEX IF NOT EXISTS idx_artifact_definitions_flow_run ON artifact_definitions(flow_run_id);
CREATE INDEX IF NOT EXISTS idx_artifact_definitions_flow_kind ON artifact_definitions(flow_id, kind);
