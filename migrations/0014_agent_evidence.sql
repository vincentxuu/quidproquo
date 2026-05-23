-- Evidence Store: sources, excerpts, claims, citations, conflicts, and verifications.
-- Provides a full provenance chain from claim → citation → excerpt → source.

-- One row per fetched source document. Dedup on (url, content_hash).
-- status: active|archived
CREATE TABLE IF NOT EXISTS evidence_sources (
  source_id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  body_text TEXT,
  body_ref TEXT, -- R2 key when body offloaded (AGENT_EVIDENCE_R2_BLOBS=true)
  freshness_score REAL NOT NULL DEFAULT 0.5,
  retrieved_at INTEGER NOT NULL,
  provider_call_id TEXT, -- links to agent_tool_calls row that fetched this source
  flow_run_id TEXT REFERENCES flow_runs(flow_run_id),
  agent_run_id TEXT REFERENCES agent_runs(run_id),
  status TEXT NOT NULL DEFAULT 'active', -- active|archived
  created_at INTEGER NOT NULL,
  UNIQUE(url, content_hash)
);

CREATE INDEX IF NOT EXISTS idx_evidence_sources_url
  ON evidence_sources(url);

CREATE INDEX IF NOT EXISTS idx_evidence_sources_flow_run
  ON evidence_sources(flow_run_id);

-- Excerpt from a source at a specific position. Not deduped (position identifies it).
CREATE TABLE IF NOT EXISTS evidence_excerpts (
  excerpt_id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id INTEGER NOT NULL REFERENCES evidence_sources(source_id),
  offset INTEGER NOT NULL,
  length INTEGER NOT NULL,
  text TEXT NOT NULL,
  surrounding_context TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_evidence_excerpts_source
  ON evidence_excerpts(source_id);

-- Factual claims extracted from excerpts. Deduped per (flow_run_id, claim_hash).
-- confidence in [0.0, 1.0]
CREATE TABLE IF NOT EXISTS evidence_claims (
  claim_id INTEGER PRIMARY KEY AUTOINCREMENT,
  claim_text TEXT NOT NULL,
  claim_hash TEXT NOT NULL,
  agent_id TEXT,
  confidence REAL NOT NULL DEFAULT 0.5,
  flow_run_id TEXT REFERENCES flow_runs(flow_run_id),
  flow_step_run_id TEXT REFERENCES flow_step_runs(step_run_id),
  agent_run_id TEXT REFERENCES agent_runs(run_id),
  created_at INTEGER NOT NULL,
  UNIQUE(flow_run_id, claim_hash)
);

CREATE INDEX IF NOT EXISTS idx_evidence_claims_flow_run
  ON evidence_claims(flow_run_id);

CREATE INDEX IF NOT EXISTS idx_evidence_claims_hash
  ON evidence_claims(claim_hash);

-- Links a claim to an excerpt with a directional relation.
-- relation: supports|refutes|context
-- provenance_chain_json: denormalized audit path {flow_run_id, flow_step_run_id, agent_run_id, provider_call_id, source_id, excerpt_id}
CREATE TABLE IF NOT EXISTS evidence_citations (
  citation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  claim_id INTEGER NOT NULL REFERENCES evidence_claims(claim_id),
  excerpt_id INTEGER NOT NULL REFERENCES evidence_excerpts(excerpt_id),
  relation TEXT NOT NULL DEFAULT 'supports', -- supports|refutes|context
  provenance_chain_json TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_evidence_citations_claim
  ON evidence_citations(claim_id);

CREATE INDEX IF NOT EXISTS idx_evidence_citations_excerpt
  ON evidence_citations(excerpt_id);

-- Detected contradictions between two claims in the same flow run.
-- status: pending|approved|rejected|expired
-- detected_by: rule:numeric|rule:negation|nli (nli behind AGENT_EVIDENCE_NLI_CONFLICTS flag)
CREATE TABLE IF NOT EXISTS evidence_conflicts (
  conflict_id INTEGER PRIMARY KEY AUTOINCREMENT,
  claim_a_id INTEGER NOT NULL REFERENCES evidence_claims(claim_id),
  claim_b_id INTEGER NOT NULL REFERENCES evidence_claims(claim_id),
  confidence_delta REAL NOT NULL DEFAULT 0.0,
  detected_by TEXT NOT NULL, -- rule:numeric|rule:negation|nli
  status TEXT NOT NULL DEFAULT 'pending', -- pending|approved|rejected|expired
  approval_id TEXT, -- references agent_approval_requests(approval_id) when review is requested
  resolved_by TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_evidence_conflicts_status
  ON evidence_conflicts(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_evidence_conflicts_claims
  ON evidence_conflicts(claim_a_id, claim_b_id);

-- Verification results for a flow run against a quality policy.
-- passed: 1=passed, 0=failed
CREATE TABLE IF NOT EXISTS evidence_verifications (
  verification_id INTEGER PRIMARY KEY AUTOINCREMENT,
  flow_run_id TEXT NOT NULL REFERENCES flow_runs(flow_run_id),
  policy_json TEXT NOT NULL,
  passed INTEGER NOT NULL, -- 1=passed, 0=failed
  checks_json TEXT NOT NULL,
  gaps_json TEXT NOT NULL,
  performed_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_evidence_verifications_flow_run
  ON evidence_verifications(flow_run_id, performed_at DESC);

-- FTS5 virtual table for claim dedup within a flow run.
CREATE VIRTUAL TABLE IF NOT EXISTS evidence_claims_fts USING fts5(
  claim_text,
  content='evidence_claims',
  content_rowid='claim_id'
);

-- Sync triggers for evidence_claims_fts
CREATE TRIGGER IF NOT EXISTS evidence_claims_ai
  AFTER INSERT ON evidence_claims BEGIN
    INSERT INTO evidence_claims_fts(rowid, claim_text) VALUES (new.claim_id, new.claim_text);
  END;

CREATE TRIGGER IF NOT EXISTS evidence_claims_ad
  AFTER DELETE ON evidence_claims BEGIN
    INSERT INTO evidence_claims_fts(evidence_claims_fts, rowid, claim_text) VALUES ('delete', old.claim_id, old.claim_text);
  END;

CREATE TRIGGER IF NOT EXISTS evidence_claims_au
  AFTER UPDATE ON evidence_claims BEGIN
    INSERT INTO evidence_claims_fts(evidence_claims_fts, rowid, claim_text) VALUES ('delete', old.claim_id, old.claim_text);
    INSERT INTO evidence_claims_fts(rowid, claim_text) VALUES (new.claim_id, new.claim_text);
  END;
