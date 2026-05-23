-- Agent Console RBAC: users, roles, permissions, audit log.

-- console_users: tracks known admin users by email
CREATE TABLE IF NOT EXISTS console_users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  disabled_at INTEGER
);

-- console_roles: role definitions
CREATE TABLE IF NOT EXISTS console_roles (
  role_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- console_user_roles: many-to-many user <-> role
CREATE TABLE IF NOT EXISTS console_user_roles (
  user_id INTEGER NOT NULL REFERENCES console_users(user_id),
  role_id INTEGER NOT NULL REFERENCES console_roles(role_id),
  assigned_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  assigned_by TEXT,
  PRIMARY KEY (user_id, role_id)
);

-- console_permissions: per-role permission grants
CREATE TABLE IF NOT EXISTS console_permissions (
  permission_id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id INTEGER NOT NULL REFERENCES console_roles(role_id),
  resource_kind TEXT NOT NULL CHECK (resource_kind IN ('flow','policy','provider','run','approval','artifact','cost','rbac')),
  resource_id TEXT,  -- NULL means wildcard (*)
  action TEXT NOT NULL CHECK (action IN ('view','invoke','edit','delete','approve','reject','cancel','export'))
);

-- console_audit_log: immutable audit trail
CREATE TABLE IF NOT EXISTS console_audit_log (
  audit_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES console_users(user_id),
  action TEXT NOT NULL,
  resource_kind TEXT NOT NULL,
  resource_id TEXT,
  payload_json TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

-- Seed default roles
INSERT OR IGNORE INTO console_roles (name, description) VALUES
  ('admin', 'Full access to all resources and actions'),
  ('operator', 'View, invoke, and cancel flows, runs, and approvals'),
  ('approver', 'View and approve/reject approvals only'),
  ('viewer', 'Read-only access to all resources');

-- Seed permissions through a transient table. D1 rejects VALUES-in-FROM and
-- large UNION chains in migrations, so keep this intentionally plain.
DROP TABLE IF EXISTS _rbac_seed_permissions;
CREATE TABLE _rbac_seed_permissions (
  role_name TEXT NOT NULL,
  resource_kind TEXT NOT NULL,
  action TEXT NOT NULL
);

-- Admin: all actions on all resources.
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'flow', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'flow', 'invoke');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'flow', 'edit');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'flow', 'delete');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'flow', 'approve');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'flow', 'reject');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'flow', 'cancel');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'flow', 'export');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'policy', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'policy', 'invoke');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'policy', 'edit');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'policy', 'delete');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'policy', 'approve');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'policy', 'reject');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'policy', 'cancel');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'policy', 'export');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'provider', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'provider', 'invoke');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'provider', 'edit');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'provider', 'delete');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'provider', 'approve');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'provider', 'reject');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'provider', 'cancel');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'provider', 'export');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'run', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'run', 'invoke');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'run', 'edit');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'run', 'delete');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'run', 'approve');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'run', 'reject');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'run', 'cancel');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'run', 'export');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'approval', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'approval', 'invoke');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'approval', 'edit');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'approval', 'delete');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'approval', 'approve');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'approval', 'reject');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'approval', 'cancel');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'approval', 'export');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'artifact', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'artifact', 'invoke');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'artifact', 'edit');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'artifact', 'delete');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'artifact', 'approve');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'artifact', 'reject');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'artifact', 'cancel');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'artifact', 'export');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'cost', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'cost', 'invoke');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'cost', 'edit');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'cost', 'delete');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'cost', 'approve');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'cost', 'reject');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'cost', 'cancel');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'cost', 'export');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'rbac', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'rbac', 'invoke');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'rbac', 'edit');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'rbac', 'delete');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'rbac', 'approve');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'rbac', 'reject');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'rbac', 'cancel');
INSERT INTO _rbac_seed_permissions VALUES ('admin', 'rbac', 'export');

-- Operator: view+invoke+cancel on flows/runs/approvals.
INSERT INTO _rbac_seed_permissions VALUES ('operator', 'flow', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('operator', 'flow', 'invoke');
INSERT INTO _rbac_seed_permissions VALUES ('operator', 'flow', 'cancel');
INSERT INTO _rbac_seed_permissions VALUES ('operator', 'run', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('operator', 'run', 'invoke');
INSERT INTO _rbac_seed_permissions VALUES ('operator', 'run', 'cancel');
INSERT INTO _rbac_seed_permissions VALUES ('operator', 'approval', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('operator', 'approval', 'invoke');
INSERT INTO _rbac_seed_permissions VALUES ('operator', 'approval', 'cancel');

-- Approver: view+approve+reject on approvals only.
INSERT INTO _rbac_seed_permissions VALUES ('approver', 'approval', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('approver', 'approval', 'approve');
INSERT INTO _rbac_seed_permissions VALUES ('approver', 'approval', 'reject');

-- Viewer: view-only on all non-RBAC console resources.
INSERT INTO _rbac_seed_permissions VALUES ('viewer', 'flow', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('viewer', 'policy', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('viewer', 'provider', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('viewer', 'run', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('viewer', 'approval', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('viewer', 'artifact', 'view');
INSERT INTO _rbac_seed_permissions VALUES ('viewer', 'cost', 'view');

INSERT OR IGNORE INTO console_permissions (role_id, resource_kind, resource_id, action)
SELECT r.role_id, s.resource_kind, NULL, s.action
FROM _rbac_seed_permissions s
JOIN console_roles r ON r.name = s.role_name;

DROP TABLE IF EXISTS _rbac_seed_permissions;
