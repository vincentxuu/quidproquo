-- migrations/0001_initial.sql

-- 文章主表
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'zh-TW',
  description TEXT,
  tldr TEXT,
  content TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_lang ON posts(lang);
CREATE INDEX idx_posts_created ON posts(created_at);

-- Post chunk 表（Phase 4 RAG 使用）
CREATE TABLE post_chunks (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  token_count INTEGER,
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE INDEX idx_chunks_post ON post_chunks(post_id);

-- 外部文件 chunk 表（Phase 3 爬蟲使用）
CREATE TABLE doc_chunks (
  id TEXT PRIMARY KEY,
  source_url TEXT NOT NULL,
  source_name TEXT,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_doc_source ON doc_chunks(source_url);
