-- Agent Console cost rollup: pre-aggregated cost by dimension for the cost dashboard.
-- dimension enum: flow_id|agent_id|policy_id|user_id|preset_id|provider_id

-- Daily rollup. Idempotent via INSERT OR REPLACE.
CREATE TABLE IF NOT EXISTS cost_rollup_daily (
  day INTEGER NOT NULL,               -- Unix day (epoch ms / 86400000)
  dimension TEXT NOT NULL,            -- flow_id|agent_id|policy_id|user_id|preset_id|provider_id
  dimension_value TEXT NOT NULL,
  tokens_in INTEGER NOT NULL DEFAULT 0,
  tokens_out INTEGER NOT NULL DEFAULT 0,
  cost_usd REAL NOT NULL DEFAULT 0,
  run_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, dimension, dimension_value)
);

-- Hourly rollup. Retained for 7 days; same shape as daily.
CREATE TABLE IF NOT EXISTS cost_rollup_hourly (
  hour INTEGER NOT NULL,              -- Unix hour (epoch ms / 3600000)
  dimension TEXT NOT NULL,
  dimension_value TEXT NOT NULL,
  tokens_in INTEGER NOT NULL DEFAULT 0,
  tokens_out INTEGER NOT NULL DEFAULT 0,
  cost_usd REAL NOT NULL DEFAULT 0,
  run_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (hour, dimension, dimension_value)
);

-- Single-row watermark tracking the last fully-built day.
CREATE TABLE IF NOT EXISTS cost_rollup_meta (
  last_built_day INTEGER NOT NULL DEFAULT 0
);

-- Seed the meta watermark row if missing.
INSERT OR IGNORE INTO cost_rollup_meta (last_built_day) VALUES (0);
