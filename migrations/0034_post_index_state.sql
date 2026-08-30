-- Durable checkpoints for incremental post and Vectorize synchronization.

ALTER TABLE posts ADD COLUMN source_hash TEXT;
ALTER TABLE post_chunks ADD COLUMN desired_embedding_hash TEXT;
ALTER TABLE post_chunks ADD COLUMN embedded_hash TEXT;

-- Existing chunks need one initial embedding pass after this migration.
UPDATE post_chunks
SET desired_embedding_hash = 'migration:0034', embedded_hash = NULL;

CREATE TABLE vector_delete_queue (
  chunk_id TEXT PRIMARY KEY,
  enqueued_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_post_chunks_embedding_state
  ON post_chunks(desired_embedding_hash, embedded_hash, id);
