-- Fix d1Keyword search-freshness timeouts: searchMetadataPosts() was doing
-- LIKE '%token%' full-table scans across posts.title/description/tldr/tags
-- (no index can serve a leading-wildcard LIKE), sequentially before the
-- already-FTS-backed BM25 chunk search, inside a single 500ms source budget.
-- This mirrors the trigram FTS5 approach already used for chunks_fts
-- (see 0025_search_cjk_trigram.sql) so metadata search also gets O(log n)
-- lookups instead of an O(n) scan as the post count grows.

CREATE VIRTUAL TABLE posts_fts USING fts5(
  title,
  description,
  tldr,
  tags,
  post_id UNINDEXED,
  tokenize='trigram'
);

INSERT INTO posts_fts(title, description, tldr, tags, post_id)
  SELECT title, COALESCE(description, ''), COALESCE(tldr, ''), COALESCE(tags, ''), id
  FROM posts;
