-- Fix CJK recall: rebuild chunks_fts with trigram tokenizer for substring matching
-- See: https://sqlite.org/fts5.html#the_trigram_tokenizer and site post
-- 2026-08-26-d1-fts5-hybrid-search-cjk-recall (unicode61 treats continuous Han as one token → 2-char queries return 0)

-- Drop and rebuild FTS5 with trigram (supports >=3 char substrings; 2-char still needs LIKE fallback in app layer)
DROP TABLE IF EXISTS chunks_fts;

CREATE VIRTUAL TABLE chunks_fts USING fts5(
  content,
  chunk_id UNINDEXED,
  source_type UNINDEXED,
  tokenize='trigram'
);

-- Repopulate from existing chunks
INSERT INTO chunks_fts(content, chunk_id, source_type)
  SELECT content, id, 'post' FROM post_chunks;
INSERT INTO chunks_fts(content, chunk_id, source_type)
  SELECT content, id, 'doc' FROM doc_chunks;
