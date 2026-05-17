# Schema Audit

Generated for OpenSpec change `agent-foundation`.

Scope: every `CREATE TABLE IF NOT EXISTS` hit under `src/` and `migrations/`.
Markdown article examples are listed as docs-only so the completeness grep has no
false negatives.

## Runtime And Migration Tables

### admin_jobs

- file: `migrations/0007_admin_jobs.sql:4`

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| `id` | TEXT | no | none |
| `pipeline_id` | TEXT | no | none |
| `status` | TEXT | no | `'queued'` |
| `risk` | TEXT | no | `'low'` |
| `requested_by` | TEXT | yes | none |
| `input_json` | TEXT | no | none |
| `output_summary` | TEXT | yes | none |
| `error_summary` | TEXT | yes | none |
| `created_at` | TEXT | no | `datetime('now')` |
| `updated_at` | TEXT | no | `datetime('now')` |
| `started_at` | TEXT | yes | none |
| `finished_at` | TEXT | yes | none |
| `token_input` | INTEGER | yes | none |
| `token_output` | INTEGER | yes | none |
| `provider` | TEXT | yes | none |
| `model` | TEXT | yes | none |

#### Recommendation

`keep-inline-acceptable`: already lives in a numbered migration and is not
created by request handlers.

#### Blast radius

`medium`: admin job orchestration depends on this table, but creation is
migration-scoped and additive.

### admin_job_steps

- file: `migrations/0007_admin_jobs.sql:25`

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| `id` | TEXT | no | none |
| `job_id` | TEXT | no | none |
| `stage_id` | TEXT | no | none |
| `kind` | TEXT | no | none |
| `status` | TEXT | no | `'pending'` |
| `input_summary` | TEXT | yes | none |
| `output_summary` | TEXT | yes | none |
| `artifact_id` | TEXT | yes | none |
| `error_summary` | TEXT | yes | none |
| `guard_results` | TEXT | yes | none |
| `created_at` | TEXT | no | `datetime('now')` |
| `started_at` | TEXT | yes | none |
| `finished_at` | TEXT | yes | none |

#### Recommendation

`keep-inline-acceptable`: it is part of the `0007` migration bundle.

#### Blast radius

`medium`: incorrect shape breaks admin job timeline and retry visibility.

### admin_job_artifacts

- file: `migrations/0007_admin_jobs.sql:43`

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| `id` | TEXT | no | none |
| `job_id` | TEXT | no | none |
| `step_id` | TEXT | yes | none |
| `type` | TEXT | no | none |
| `name` | TEXT | yes | none |
| `path` | TEXT | yes | none |
| `content_json` | TEXT | yes | none |
| `created_at` | TEXT | no | `datetime('now')` |

#### Recommendation

`keep-inline-acceptable`: already migration-owned.

#### Blast radius

`medium`: artifacts are tied to admin workflows, but table creation is isolated
to migration application.

### admin_settings

- file: `migrations/0010_admin_settings_consolidation.sql:6`
- file: `src/lib/db/settings-store.ts:23` via `ensureSettingsTable()` default

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| `key` | TEXT | no | primary key |
| `value` | TEXT | no | none |
| `updated_at` | TEXT | yes | `datetime('now')` |

#### Recommendation

`keep-inline-acceptable`: canonical schema is now migration-backed by `0010`;
runtime creation remains centralized in `settings-store` for idempotent local
and legacy compatibility.

#### Blast radius

`high`: admin settings affect auth-adjacent admin endpoints, RAG defaults,
provider catalogs, retention settings, and deep research settings.

### settings

- file: `migrations/0002_rag_phase1.sql:46`
- file: `migrations/0010_admin_settings_consolidation.sql:17`
- file: `src/lib/db/settings-store.ts:23` when called with `{ tableName: 'settings' }`

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| `key` | TEXT | no | primary key |
| `value` | TEXT | no | none |
| `updated_at` | TEXT | yes | `datetime('now')` |

#### Recommendation

`consolidate-with-admin_settings`: `0010` copies legacy rows into
`admin_settings`; `migrations/gated/0010b_drop_legacy_settings.sql` may drop
this table after the soak gate confirms no legacy reads or writes remain.

#### Blast radius

`high`: this table historically backed provider secrets and RAG settings, so
dropping it before soak would be a production behavior change.

### chat_logs

- file: `migrations/0002_rag_phase1.sql:22`

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| `id` | TEXT | no | primary key |
| `thread_id` | TEXT | no | none |
| `ip` | TEXT | yes | none |
| `is_admin` | INTEGER | yes | `0` |
| `query` | TEXT | no | none |
| `response` | TEXT | no | none |
| `confidence` | REAL | yes | none |
| `langfuse_trace_id` | TEXT | yes | none |
| `created_at` | TEXT | yes | `datetime('now')` |

#### Recommendation

`keep-inline-acceptable`: migration-owned and indexed by `0002`.

#### Blast radius

`medium`: affects chat history, feedback linkage, and analytics, but not core
page rendering.

### feedback

- file: `migrations/0002_rag_phase1.sql:37`

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| `id` | TEXT | no | primary key |
| `chat_log_id` | TEXT | no | none |
| `rating` | INTEGER | no | none |
| `created_at` | TEXT | yes | `datetime('now')` |

#### Recommendation

`keep-inline-acceptable`: migration-owned and simple.

#### Blast radius

`low`: feedback capture depends on it, but it is isolated from admin settings
and content pipelines.

### semantic_cache

- file: `migrations/0003_rag_phase1b.sql:14`

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| `id` | TEXT | no | primary key |
| `query` | TEXT | no | none |
| `response` | TEXT | no | none |
| `query_vector` | TEXT | no | none |
| `confidence` | REAL | yes | `0` |
| `hit_count` | INTEGER | yes | `0` |
| `created_at` | TEXT | yes | `datetime('now')` |
| `updated_at` | TEXT | yes | `datetime('now')` |

#### Recommendation

`keep-inline-acceptable`: migration-owned; future vector storage changes should
ship as new migrations.

#### Blast radius

`medium`: cache errors can affect RAG latency and response reuse.

### checkpoints

- file: `migrations/0003_rag_phase1b.sql:25`

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| `thread_id` | TEXT | no | composite primary key |
| `checkpoint_id` | TEXT | no | composite primary key |
| `summary` | TEXT | no | none |
| `turn_count` | INTEGER | yes | `0` |
| `created_at` | TEXT | yes | `datetime('now')` |

#### Recommendation

`keep-inline-acceptable`: migration-owned.

#### Blast radius

`medium`: affects longer RAG conversations and recovery, but is not shared with
admin settings.

### shadow_runs

- file: `migrations/0003_rag_phase1b.sql:34`

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| `id` | TEXT | no | primary key |
| `trace_id` | TEXT | no | none |
| `thread_id` | TEXT | no | none |
| `query` | TEXT | no | none |
| `primary_response` | TEXT | no | none |
| `primary_confidence` | REAL | yes | none |
| `shadow_response` | TEXT | no | none |
| `shadow_confidence` | REAL | yes | none |
| `config_json` | TEXT | no | none |
| `created_at` | TEXT | yes | `datetime('now')` |

#### Recommendation

`keep-inline-acceptable`: migration-owned experiment telemetry.

#### Blast radius

`low`: shadow data is observational and should not block user-visible answers.

### eval_runs

- file: `migrations/0003_rag_phase1b.sql:47`

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| `id` | TEXT | no | primary key |
| `dataset_name` | TEXT | no | none |
| `case_id` | TEXT | no | none |
| `faithfulness` | REAL | yes | none |
| `answer_relevance` | REAL | yes | none |
| `context_recall` | REAL | yes | none |
| `passed` | INTEGER | no | `0` |
| `created_at` | TEXT | yes | `datetime('now')` |

#### Recommendation

`keep-inline-acceptable`: migration-owned evaluation data.

#### Blast radius

`low`: affects admin/eval reporting, not runtime query execution.

### rag_trace_steps

- file: `migrations/0004_rag_phase1b_admin_observability.sql:13`

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| `id` | TEXT | no | primary key |
| `trace_id` | TEXT | no | none |
| `thread_id` | TEXT | no | none |
| `stage` | TEXT | no | none |
| `started_at` | TEXT | no | none |
| `duration_ms` | INTEGER | no | none |
| `input_summary` | TEXT | yes | none |
| `output_summary` | TEXT | yes | none |
| `token_input` | INTEGER | yes | none |
| `token_output` | INTEGER | yes | none |
| `metadata_json` | TEXT | yes | none |
| `created_at` | TEXT | yes | `datetime('now')` |

#### Recommendation

`keep-inline-acceptable`: migration-owned observability schema.

#### Blast radius

`medium`: trace diagnostics depend on it, but production request success should
not require writes to succeed.

### rag_admin_audit

- file: `migrations/0004_rag_phase1b_admin_observability.sql:28`

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| `id` | TEXT | no | primary key |
| `actor` | TEXT | no | none |
| `action` | TEXT | no | none |
| `target` | TEXT | no | none |
| `before_json` | TEXT | yes | none |
| `after_json` | TEXT | yes | none |
| `created_at` | TEXT | yes | `datetime('now')` |

#### Recommendation

`keep-inline-acceptable`: migration-owned audit schema.

#### Blast radius

`medium`: audit gaps matter for admin changes, but schema creation is already
centralized in migrations.

### glossary_lookup_stats

- file: `migrations/0006_glossary_lookup_stats.sql:1`

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| `term` | TEXT | no | composite primary key |
| `slug` | TEXT | no | `''` |
| `level` | TEXT | no | `'beginner'` |
| `lookup_count` | INTEGER | no | `0` |
| `last_context` | TEXT | yes | none |
| `first_seen_at` | TEXT | no | `CURRENT_TIMESTAMP` |
| `last_seen_at` | TEXT | no | `CURRENT_TIMESTAMP` |

#### Recommendation

`keep-inline-acceptable`: migration-owned stats table.

#### Blast radius

`low`: lookup stats are advisory and can fail independently of article display.

### deep_research_reports

- file: `migrations/0009_deep_research_reports.sql:3`
- file: `src/pages/api/admin/deep-research/index.ts:262`
- file: `src/pages/api/admin/deep-research/retention.ts:162`

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| `report_id` | TEXT | no | primary key |
| `brief` | TEXT | no | none |
| `provider` | TEXT | no | none |
| `model` | TEXT | no | none |
| `status` | TEXT | no | `'completed'` |
| `final_report` | TEXT | no | none |
| `summary` | TEXT | yes | none |
| `max_queries` | INTEGER | yes | none |
| `max_tokens` | INTEGER | yes | none |
| `max_search_calls` | INTEGER | yes | none |
| `config_json` | TEXT | yes | none |
| `created_at` | TEXT | no | `datetime('now')` |

#### Recommendation

`migrate-to-proper-migration`: the migration exists, but request-handler
`ensureDeepResearchTable()` duplicates the schema. Keep the runtime guard only
if local dev genuinely needs it; otherwise replace handler creation with a
startup/admin health check that reports missing migration.

#### Blast radius

`medium`: deep research persistence and retention depend on it; duplicated
schema risks drift if a future migration changes the table.

### users

- file: `src/content/posts/tech/2026-03-27-cloudflare-d1-sqlite-database.md:94`

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| `id` | TEXT | no | primary key |
| `username` | TEXT | no | unique |
| `email` | TEXT | no | unique |
| `climber_rank` | TEXT | no | `'foothill'` |
| `ai_quota_used` | INTEGER | no | `0` |
| `ai_quota_limit` | INTEGER | no | `2` |
| `created_at` | TEXT | no | `datetime('now')` |

#### Recommendation

`keep-inline-acceptable`: docs-only example inside a blog post, not production
schema.

#### Blast radius

`low`: no runtime code creates or queries this example table.

### settings_store_dynamic

- file: `src/lib/db/settings-store.ts:23`

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| `key` | TEXT | no | primary key |
| `value` | TEXT | no | none |
| `updated_at` | TEXT | yes | `datetime('now')` |

#### Recommendation

`consolidate-with-admin_settings`: this central helper intentionally supports
both `admin_settings` and legacy `settings` during the soak. After 0010b, remove
or restrict the legacy `tableName: 'settings'` branch.

#### Blast radius

`high`: this helper is the shared CRUD path for settings endpoints and provider
configuration.

### EXISTS

- file: `src/lib/db/settings-store.ts:23`

#### Columns

| name | type | nullable | default |
| --- | --- | --- | --- |
| n/a | n/a | n/a | n/a |

#### Recommendation

`keep-inline-acceptable`: this is not a real table. It is the mechanical
completeness-grep artifact produced by the dynamic SQL string
`CREATE TABLE IF NOT EXISTS ${table(options)}`.

#### Blast radius

`low`: no runtime table named `EXISTS` is created; the real runtime targets are
documented under `admin_settings`, `settings`, and `settings_store_dynamic`.
