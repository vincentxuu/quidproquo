-- Per-user vocabulary. owner_sub comes exclusively from a verified Cloudflare Access JWT.
CREATE TABLE IF NOT EXISTS vocabulary_cards (
  owner_sub TEXT NOT NULL,
  card_id TEXT NOT NULL,
  card_json TEXT NOT NULL CHECK (json_valid(card_json)),
  created_at INTEGER NOT NULL,
  PRIMARY KEY (owner_sub, card_id)
);
CREATE INDEX IF NOT EXISTS vocabulary_cards_owner_created ON vocabulary_cards(owner_sub, created_at);
