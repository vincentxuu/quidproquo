-- Source reputation scores learned from approval decisions.
-- score is in [0.0, 1.0]; unknown domains default to 0.5 at query time.
CREATE TABLE IF NOT EXISTS evidence_source_reputation (
  domain TEXT PRIMARY KEY,
  score REAL NOT NULL DEFAULT 0.5,
  positive_signals INTEGER NOT NULL DEFAULT 0,
  negative_signals INTEGER NOT NULL DEFAULT 0,
  last_updated INTEGER NOT NULL
);
