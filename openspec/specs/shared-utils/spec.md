# Shared Utils

## Purpose

Defines shared date utilities and settings-store behavior used across admin and RAG code.

## Requirements

### Requirement: Date and ISO8601 utilities

`src/lib/utils/dates.ts` SHALL export the following functions, all pure and deterministic given an explicit `now` argument:

- `nowMs(): number` — returns `Date.now()` (integer milliseconds since epoch)
- `nowIso(): string` — returns the current time as a full ISO8601 string (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- `toIsoDate(d: Date | number): string` — returns the full ISO8601 string for the given date/timestamp
- `toIsoDay(d: Date | number): string` — returns the `YYYY-MM-DD` calendar day portion in UTC
- `secondsUntilMidnight(now?: Date | number): number` — returns whole seconds remaining until the next UTC midnight; given a `now` argument the result MUST be deterministic

No other module SHALL re-implement these formatters or duration helpers; existing ad-hoc usages MUST migrate to import from this module.

#### Scenario: nowMs returns integer

- **WHEN** `nowMs()` is called
- **THEN** the return value SHALL be a finite integer number of milliseconds

#### Scenario: toIsoDay returns YYYY-MM-DD

- **WHEN** `toIsoDay(new Date('2026-05-16T03:14:00Z'))` is called
- **THEN** the returned string SHALL equal `'2026-05-16'`

#### Scenario: toIsoDate round-trips

- **WHEN** `toIsoDate(d)` is called with a `Date` instance
- **THEN** the returned string SHALL be parseable back into a `Date` equal in value to `d`

#### Scenario: secondsUntilMidnight is deterministic

- **WHEN** `secondsUntilMidnight(new Date('2026-05-16T23:59:00Z'))` is called twice
- **THEN** both calls SHALL return the same integer value (`60`)

### Requirement: Settings store CRUD over admin_settings

`src/lib/db/settings-store.ts` SHALL export the following functions operating on the canonical `admin_settings` table by default. During the `agent-foundation` transition only, each function MAY accept an options object `{ tableName?: 'admin_settings' | 'settings' }` so existing callers can be migrated before the physical-table reconciliation runs. New code MUST omit `tableName` and therefore use `admin_settings`.

- `getSetting<T>(db: D1Database, key: string): Promise<T | undefined>` — returns the parsed JSON value for `key`, or `undefined` if no row exists
- `putSetting<T>(db: D1Database, key: string, value: T): Promise<void>` — upserts a row keyed by `key` with `value` JSON-serialized into the `value` column; SHALL update the row's `updated_at`
- `deleteSetting(db: D1Database, key: string): Promise<void>` — removes the row with the given key; SHALL be a no-op when the row does not exist
- `listSettings(db: D1Database, prefix?: string): Promise<Array<{ key: string; value: unknown }>>` — returns all rows whose key starts with `prefix` (or all rows when `prefix` is omitted), with each `value` parsed from JSON

All values SHALL be JSON-serialized when stored in the `admin_settings.value` column; consumers MUST go through this module rather than issuing direct SQL against `admin_settings`. The three pre-existing `ensureSettingsTable()` duplicates SHALL be removed. Any temporary `{ tableName: 'settings' }` call site MUST be removed by the end of Phase 3.

#### Scenario: getSetting returns parsed JSON

- **WHEN** a row exists for key `'k'` with `value` column `'{"a":1}'` and `getSetting<{a:number}>(db, 'k')` is called
- **THEN** the function SHALL resolve to `{ a: 1 }`

#### Scenario: getSetting returns undefined when missing

- **WHEN** no row exists for key `'missing'`
- **THEN** `getSetting(db, 'missing')` SHALL resolve to `undefined`

#### Scenario: putSetting upserts

- **WHEN** `putSetting(db, 'k', { a: 1 })` is called twice with the second call passing `{ a: 2 }`
- **THEN** a single row SHALL exist for key `'k'` whose parsed value equals `{ a: 2 }` and whose `updated_at` reflects the second call

#### Scenario: deleteSetting on missing is no-op

- **WHEN** `deleteSetting(db, 'never-existed')` is called
- **THEN** the call SHALL resolve without error and the table row count SHALL be unchanged

#### Scenario: listSettings with prefix

- **WHEN** rows exist for keys `'prov:a'`, `'prov:b'`, `'other'` and `listSettings(db, 'prov:')` is called
- **THEN** the result SHALL contain exactly the entries for `'prov:a'` and `'prov:b'` with parsed values

### Requirement: Settings consolidation migration

Migration `migrations/0010_admin_settings_consolidation.sql` SHALL reconcile any divergence between the legacy `settings` table and the canonical `admin_settings` table. The migration MUST:

1. Copy any rows from `settings` that are missing in `admin_settings` (matched by key) into `admin_settings`, JSON-encoding values if needed.
2. Preserve every existing row in `admin_settings` unchanged.
3. Leave the stale `settings` table in place as read-only legacy data for a one-week production soak; a follow-up `0010b_drop_legacy_settings.sql` SHALL drop it only after zero legacy reads/writes are observed.
4. Be idempotent: running it a second time on an already-migrated database SHALL produce no changes and SHALL NOT error.

#### Scenario: Migration preserves row count

- **WHEN** the migration is applied to a database whose union of `settings.key` and `admin_settings.key` contains `N` distinct keys
- **THEN** the resulting `admin_settings` table SHALL contain exactly `N` rows and `settings` SHALL still exist unchanged for rollback during the soak window

#### Scenario: Migration applied twice is a no-op

- **WHEN** the migration runs successfully and then runs a second time
- **THEN** the second run SHALL exit cleanly without raising errors and `admin_settings` row count SHALL be unchanged from the first run

#### Scenario: Existing admin_settings rows untouched

- **WHEN** an `admin_settings` row exists for key `'k'` with value `'v1'` and a `settings` row exists for the same key with value `'v2'`
- **THEN** after migration, `admin_settings` SHALL still contain value `'v1'` for key `'k'` (existing-row precedence)
