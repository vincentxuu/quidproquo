-- Drop legacy settings table after the 0010 soak gate.
--
-- APPLY ONLY AFTER:
-- - .omc/research/0010_legacy_settings_soak.md documents one week of zero
--   { tableName: 'settings' } call sites.
-- - The same soak record documents zero legacy settings writes in production.
-- - Operators have confirmed admin_settings contains the expected migrated rows.

DROP TABLE IF EXISTS settings;
