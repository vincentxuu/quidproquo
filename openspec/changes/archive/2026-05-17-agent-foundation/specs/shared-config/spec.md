## ADDED Requirements

### Requirement: Single canonical Env type

The Worker SHALL expose a single `Env` interface from `src/lib/config/env.ts` that declares every Cloudflare binding the project uses. All other modules MUST import `Env` from this module; no module SHALL redeclare its own `Env` interface or cast `cloudflare:workers` env to a locally redeclared shape.

The `Env` type SHALL include at minimum: `DB: D1Database`, `SESSION: KVNamespace`, `RATE: KVNamespace`, `DEEP_RESEARCH_KV: KVNamespace`, `VECTORIZE_INDEX: VectorizeIndex`, `AI: Ai`, `R2_IMAGES: R2Bucket`, optional `CRAWL_SECRET: string`, and reserved optional `AGENT_QUEUE: Queue` and `R2_AGENT_MEMORY: R2Bucket` placeholders for `agent-os`.

#### Scenario: Import resolves

- **WHEN** a module writes `import type { Env } from '@/lib/config/env'`
- **THEN** the TypeScript compiler SHALL resolve `Env` to the interface declared in `src/lib/config/env.ts` with all required bindings present

#### Scenario: Redeclaration removed

- **WHEN** a grep for `interface Env` is run across `src/`
- **THEN** exactly one declaration SHALL be found, in `src/lib/config/env.ts`

#### Scenario: Reserved bindings typed as optional

- **WHEN** a consumer reads `env.AGENT_QUEUE` before `agent-os` ships
- **THEN** the type SHALL be `Queue | undefined` and consumers MUST handle the undefined case without compilation error

### Requirement: Feature-flag reader with safe defaults

`src/lib/config/flags.ts` SHALL export a typed reader `flags.agentOs.<key>(env: Env): boolean` (and analogous namespaces for future categories). Each flag reader SHALL read a Wrangler env var; an unset, empty, or whitespace-only value SHALL resolve to `false`. The string literal `'true'` (case-insensitive after trimming) SHALL parse to `true`; every other value SHALL parse to `false`.

Flag definitions MUST live alongside the reader so that adding a new flag is a single-file change.

#### Scenario: Default value when env unset

- **WHEN** a flag reader is called on an `env` object whose corresponding env var is `undefined`
- **THEN** the reader SHALL return `false` without throwing

#### Scenario: True string parses to true

- **WHEN** the env var value is the literal string `'true'`
- **THEN** the reader SHALL return `true`

#### Scenario: Unrecognized value parses to default

- **WHEN** the env var value is `'1'`, `'yes'`, `'TRUE '` with stray whitespace beyond trimming, or any non-`'true'` string
- **THEN** the reader SHALL return `false`

#### Scenario: Foundation ships zero flags

- **WHEN** `agent-foundation` lands alone (without `agent-os`)
- **THEN** `flags.agentOs` SHALL be an empty namespace object that compiles cleanly; the first concrete flag entries are added by `agent-os`

### Requirement: Centralized settings key constants

`src/lib/config/settings-keys.ts` SHALL export the string constants `CATALOG_KEY`, `PROVIDER_KEY_PREFIX`, `AGENT_SKILLS_LIBRARY_KEY`, and `RETENTION_KEYS` used to address rows in the canonical `admin_settings` table. No other module SHALL define its own copy of these keys; producers and consumers SHALL import the constants from this module.

#### Scenario: Constant import returns expected string

- **WHEN** a module imports `CATALOG_KEY` from `src/lib/config/settings-keys.ts`
- **THEN** the imported value SHALL be a non-empty string identical to the value previously hard-coded in the providers and agent-skills modules

#### Scenario: Provider key prefix composability

- **WHEN** a caller composes a provider settings key via `` `${PROVIDER_KEY_PREFIX}${providerId}` ``
- **THEN** the resulting key SHALL match the row key format already stored in `admin_settings` for that provider, preserving existing data

#### Scenario: Single source of truth

- **WHEN** a grep for `CATALOG_KEY =`, `PROVIDER_KEY_PREFIX =`, `AGENT_SKILLS_LIBRARY_KEY =`, or `RETENTION_KEYS =` is run across `src/`
- **THEN** exactly one definition SHALL be found per constant, in `src/lib/config/settings-keys.ts`
