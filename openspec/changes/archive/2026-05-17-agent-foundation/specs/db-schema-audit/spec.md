## ADDED Requirements

### Requirement: Schema audit document exists

`docs/schema-audit.md` SHALL exist after `agent-foundation` lands. The document SHALL serve as the canonical inventory of tables created via inline `CREATE TABLE IF NOT EXISTS` statements in TypeScript modules (as opposed to declared in `migrations/*.sql`).

The document MUST begin with a header section that explicitly states the audit boundary: this file documents inline-created tables for future migration planning and DOES NOT itself perform any migration of the audited tables.

#### Scenario: File exists at expected path

- **WHEN** a reader looks for `docs/schema-audit.md` in the repository root
- **THEN** the file SHALL exist and be non-empty

#### Scenario: Header declares audit-only boundary

- **WHEN** a reader opens `docs/schema-audit.md`
- **THEN** the header section SHALL contain a clear "audit only" statement indicating that no inline tables are migrated by `agent-foundation` and that migration of these tables is deferred to follow-up changes

### Requirement: Per-table entry structure

For each inline-created table, the audit SHALL provide a structured entry containing all four of the following fields:

1. **Location** — file path and starting line number where the inline `CREATE TABLE` statement lives (e.g., `src/lib/foo.ts:42`)
2. **Columns** — the actual column names and SQLite types declared in the inline statement
3. **Recommendation** — one of `migrate` (move to a proper `migrations/NNNN_*.sql` file), `keep` (leave inline as-is, e.g., for ephemeral or test-only data), or `consolidate` (fold into an existing canonical table)
4. **Blast radius** — a short note describing what other modules read or write the table and what could break if its schema changes

Each field MUST be present for every entry; an entry missing any of the four SHALL be considered a defect.

#### Scenario: Entry has all four fields

- **WHEN** a reader inspects any single table entry in `docs/schema-audit.md`
- **THEN** the entry SHALL include Location (with file:line), Columns (with types), Recommendation (one of `migrate`/`keep`/`consolidate`), and Blast radius

#### Scenario: Recommendation values are constrained

- **WHEN** a reader scans every entry's Recommendation field
- **THEN** each value SHALL be exactly one of `migrate`, `keep`, or `consolidate` — no other vocabulary SHALL appear

### Requirement: Minimum table coverage

The audit SHALL document at least the inline-created tables originating from the following modules:

- `src/lib/rag/providers.ts`
- `src/lib/rag/settings/index.ts`
- `src/lib/rag/agent-skills/index.ts`
- `src/lib/rag/deep-research/index.ts`
- `src/lib/rag/rag.ts`
- `src/lib/rag/traces/retention.ts`

A reader SHALL be able to locate an entry for each of these six modules in the audit document.

#### Scenario: Six required modules covered

- **WHEN** a reader searches `docs/schema-audit.md` for each of the six module paths above
- **THEN** at least one entry SHALL reference each path

#### Scenario: At least six distinct tables documented

- **WHEN** a reader counts the table entries in `docs/schema-audit.md`
- **THEN** the count SHALL be six or greater

### Requirement: Audit performs no migration

`agent-foundation` SHALL NOT migrate, drop, alter, or replace any table listed in `docs/schema-audit.md` (the settings consolidation migration in `shared-utils` is separately scoped and reconciles the `settings`/`admin_settings` pair, which is NOT one of the inline-audit tables). Migration of audited tables is deferred to follow-up changes so that this refactor's blast radius remains bounded.

#### Scenario: No migration of audited tables in this change

- **WHEN** a reviewer diffs the `migrations/` directory introduced by `agent-foundation`
- **THEN** the only new migration SHALL be `0010_admin_settings_consolidation.sql` and it SHALL NOT touch any table listed in `docs/schema-audit.md`

#### Scenario: Inline CREATE TABLE statements remain in place

- **WHEN** a reviewer greps for `CREATE TABLE IF NOT EXISTS` in the six audited modules after `agent-foundation` lands
- **THEN** the inline statements SHALL still be present and functionally unchanged
