## ADDED Requirements

### Requirement: Migration copies admin_jobs into flow_runs

A D1 migration SHALL copy every row from `admin_jobs` into `flow_runs` with `parent_kind='pipeline'`, `parent_external_id=admin_jobs.id`, and `flow_id='pipeline-' || admin_jobs.pipeline_id`. The migration MUST preserve all source columns including the original id, timestamps (`created_at`, `updated_at`, `started_at`, `completed_at`), `status`, `input_json`, `error_json`, artifact references, and any pipeline-specific metadata. The migration MUST be idempotent: re-running it on an already-migrated database SHALL be a no-op.

#### Scenario: Migration preserves row count

- **WHEN** the operator runs `SELECT COUNT(*) FROM admin_jobs` before the migration and `SELECT COUNT(*) FROM flow_runs WHERE parent_kind = 'pipeline'` after
- **THEN** the two counts SHALL be equal

#### Scenario: Migration preserves columns

- **WHEN** the operator picks any 100-row sample from `admin_jobs` and joins the corresponding `flow_runs` rows via `flow_runs.parent_external_id = admin_jobs.id`
- **THEN** every preserved column SHALL match byte-for-byte (timestamps, status, input_json, error_json, artifact ids)

#### Scenario: Migration is idempotent

- **WHEN** the migration is executed a second time against the same database
- **THEN** no new rows SHALL be inserted, no existing rows SHALL be modified, and the migration SHALL exit with success

### Requirement: New runs write only to flow_runs

After the migration completes, the runtime SHALL insert new pipeline-invocation rows exclusively into `flow_runs`. `admin_jobs` SHALL become read-only — the runtime MUST NOT perform any `INSERT`, `UPDATE`, or `DELETE` against `admin_jobs` after the cutover.

#### Scenario: New run writes only to flow_runs

- **WHEN** a pipeline is invoked after the migration and the cutover flag is on
- **THEN** exactly one new row SHALL appear in `flow_runs` with `parent_kind='pipeline'`, `flow_id` prefixed by `pipeline-`, and zero new rows SHALL appear in `admin_jobs`

#### Scenario: Write to admin_jobs is blocked

- **WHEN** any code path attempts an `INSERT` or `UPDATE` against `admin_jobs` after the cutover
- **THEN** the request SHALL fail at the data-access layer (or be caught by an integration test) before reaching D1

### Requirement: Admin job-list endpoint unions both tables

During the read-only window (from cutover until the drop migration), the admin job-list endpoint SHALL return a unioned view of historical `admin_jobs` rows and new `flow_runs WHERE parent_kind='pipeline'` rows. The unioned shape MUST match the existing admin UI's expected schema; ordering MUST be stable (`ORDER BY created_at DESC`); pagination MUST work across the union.

#### Scenario: Endpoint returns both legacy and new rows

- **WHEN** an admin lists jobs spanning the cutover boundary
- **THEN** the response SHALL include rows from both `admin_jobs` (pre-cutover) and `flow_runs WHERE parent_kind='pipeline'` (post-cutover), ordered by `created_at DESC`, with no duplicates

#### Scenario: Pagination crosses the union boundary

- **WHEN** an admin pages past the cutover row using the existing pagination cursor
- **THEN** the next page SHALL continue with the older source without skipping or repeating rows

### Requirement: Drop migration gated on zero-write proof

A follow-up migration `DROP TABLE admin_jobs` SHALL be authored but MUST NOT execute until 90 consecutive days of zero `admin_jobs` writes have been observed in production. The drop migration MUST include a pre-flight check that queries a write-monitor metric (or audit log) and aborts if any write occurred within the 90-day window.

#### Scenario: Drop blocked by recent write

- **WHEN** the drop migration runs and the write-monitor reports at least one `admin_jobs` write within the past 90 days
- **THEN** the migration SHALL exit with `aborted: recent admin_jobs write detected` and SHALL NOT drop the table

#### Scenario: Drop succeeds after 90-day quiet window

- **WHEN** the drop migration runs after 90 consecutive days of zero `admin_jobs` writes
- **THEN** the migration SHALL execute `DROP TABLE admin_jobs`, log the cutover-to-drop duration, and exit successfully
