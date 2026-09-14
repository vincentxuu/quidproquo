-- Skill content moves to R2; D1 keeps metadata + r2_key pointer.
-- Existing rows with content in D1 continue to work (fallback).

ALTER TABLE user_skills ADD COLUMN r2_key TEXT;

CREATE INDEX IF NOT EXISTS idx_user_skills_r2_key
  ON user_skills(r2_key);
