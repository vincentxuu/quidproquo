-- Agent Skills management tables

-- User-created skills (from frontend/CLI)
CREATE TABLE IF NOT EXISTS user_skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT DEFAULT 'user',          -- user / project / imported
  tags TEXT,
  version INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_skills_source
  ON user_skills(source);

CREATE INDEX IF NOT EXISTS idx_user_skills_name
  ON user_skills(name);

-- MCP Server configurations
CREATE TABLE IF NOT EXISTS mcp_servers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT NOT NULL,                  -- stdio / http / sse
  command TEXT,                        -- stdio type command
  url TEXT,                            -- http/sse type URL
  env TEXT,                            -- environment variables JSON
  tools TEXT,                          -- available tools JSON array
  enabled INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mcp_servers_name
  ON mcp_servers(name);

-- Plugin packages (skills + mcp servers bundled)
CREATE TABLE IF NOT EXISTS plugins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  version TEXT,
  author TEXT,
  source_url TEXT,                     -- source URL (GitHub etc)
  skills TEXT,                         -- bundled skills JSON array
  mcp_servers TEXT,                    -- bundled MCP servers JSON array
  installed_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_plugins_name
  ON plugins(name);
