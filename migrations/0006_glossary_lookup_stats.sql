CREATE TABLE IF NOT EXISTS glossary_lookup_stats (
  term TEXT NOT NULL,
  slug TEXT NOT NULL DEFAULT '',
  level TEXT NOT NULL DEFAULT 'beginner',
  lookup_count INTEGER NOT NULL DEFAULT 0,
  last_context TEXT,
  first_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (term, slug, level)
);
