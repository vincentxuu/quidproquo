-- Reconcile legacy settings into canonical admin_settings.
--
-- This migration is intentionally forward-only and non-destructive. The legacy
-- settings table remains in place for a one-week production soak before 0010b.

CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_admin_settings_updated_at
  ON admin_settings(updated_at DESC);

-- Existing databases already have this table from 0002. Creating it here keeps
-- the migration idempotent on fresh/local databases that apply 0010 directly.
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ASSERT: capture legacy settings row count before / after copy.
SELECT COUNT(*) AS settings_count FROM settings;

-- ASSERT: capture canonical admin_settings row count after copy.
SELECT COUNT(*) AS admin_settings_count_before_copy FROM admin_settings;

INSERT OR IGNORE INTO admin_settings (key, value, updated_at)
SELECT key, value, COALESCE(updated_at, datetime('now'))
FROM settings;

-- ASSERT: admin_settings_after should equal distinct union of settings.key and
-- admin_settings.key before copy; duplicate keys preserve admin_settings values.
SELECT COUNT(*) AS admin_settings_count_after_copy FROM admin_settings;

-- DOWN:
-- 1. Prefer restoring from the pre-0010 D1 export when collision provenance is unclear.
-- 2. If the operator recorded keys known to preexist in admin_settings before 0010,
--    remove copied legacy-only keys with:
--    DELETE FROM admin_settings
--    WHERE key IN (SELECT key FROM settings)
--      AND key NOT IN (<keys-known-to-preexist-in-admin_settings>);
-- 3. The settings table is not dropped by this migration, so rollback preserves
--    the legacy source rows for the full soak window.
-- 4. The gated drop recipe lives at migrations/gated/0010b_drop_legacy_settings.sql.
--    Move it into the active migrations directory or apply it manually only after
--    .omc/research/0010_legacy_settings_soak.md documents one week of zero legacy
--    reads/writes.
