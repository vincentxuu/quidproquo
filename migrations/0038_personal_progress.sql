CREATE TABLE IF NOT EXISTS personal_progress (
  owner_sub TEXT NOT NULL,
  domain TEXT NOT NULL CHECK (domain IN ('speaking', 'interview')),
  item_key TEXT NOT NULL,
  value_json TEXT NOT NULL CHECK (json_valid(value_json)),
  PRIMARY KEY (owner_sub, domain, item_key)
);
