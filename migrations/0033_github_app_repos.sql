-- GitHub App installations and repository registry for admin agent sessions

CREATE TABLE IF NOT EXISTS github_app_installations (
  installation_id TEXT PRIMARY KEY,
  account_login TEXT NOT NULL,
  account_type TEXT,
  target_type TEXT,
  repository_selection TEXT,
  permissions_json TEXT NOT NULL DEFAULT '{}',
  suspended_at TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS github_repositories (
  repository_id TEXT PRIMARY KEY,
  installation_id TEXT NOT NULL REFERENCES github_app_installations(installation_id) ON DELETE CASCADE,
  full_name TEXT NOT NULL UNIQUE,
  private INTEGER NOT NULL DEFAULT 0,
  default_branch TEXT,
  html_url TEXT,
  clone_url TEXT,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_github_repositories_installation
  ON github_repositories(installation_id);

CREATE INDEX IF NOT EXISTS idx_github_repositories_full_name
  ON github_repositories(full_name);
