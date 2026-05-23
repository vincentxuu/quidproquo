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

-- Seed full permissions for admin role
INSERT OR IGNORE INTO console_permissions (role_id, resource_kind, resource_id, action)
SELECT r.role_id, ck.resource_kind, NULL, a.action
FROM console_roles r
CROSS JOIN (VALUES ('flow'),('policy'),('provider'),('run'),('approval'),('artifact'),('cost'),('rbac')) AS ck(resource_kind)
CROSS JOIN (VALUES ('view'),('invoke'),('edit'),('delete'),('approve'),('reject'),('cancel'),('export')) AS a(action)
WHERE r.name = 'admin';

-- Operator: view+invoke+cancel on flows/runs/approvals
INSERT OR IGNORE INTO console_permissions (role_id, resource_kind, resource_id, action)
SELECT r.role_id, ck.resource_kind, NULL, a.action
FROM console_roles r
CROSS JOIN (VALUES ('flow'),('run'),('approval')) AS ck(resource_kind)
CROSS JOIN (VALUES ('view'),('invoke'),('cancel')) AS a(action)
WHERE r.name = 'operator';

-- Approver: view+approve+reject on approvals only
INSERT OR IGNORE INTO console_permissions (role_id, resource_kind, resource_id, action)
SELECT r.role_id, 'approval', NULL, a.action
FROM console_roles r
CROSS JOIN (VALUES ('view'),('approve'),('reject')) AS a(action)
WHERE r.name = 'approver';

-- Viewer: view-only on all resources
INSERT OR IGNORE INTO console_permissions (role_id, resource_kind, resource_id, action)
SELECT r.role_id, ck.resource_kind, NULL, 'view'
FROM console_roles r
CROSS JOIN (VALUES ('flow'),('policy'),('provider'),('run'),('approval'),('artifact'),('cost')) AS ck(resource_kind)
WHERE r.name = 'viewer';
