# Shared Tools

## Purpose

Defines shared tool registry types, registry behavior, and compatibility adapters.

## Requirements

### Requirement: Central tool registry surface

`src/lib/tools/registry.ts` SHALL expose four functions: `register(definition: ToolDefinition): void`, `get(name: string): ToolDefinition | undefined`, `list(): ToolDefinition[]`, and `validateAllowlist(names: string[]): { ok: boolean; missing: string[] }`. Registration MUST be keyed by `definition.name`; a duplicate registration with the same name SHALL throw `ToolRegistrationError`.

#### Scenario: Register returns and is retrievable

- **WHEN** a caller invokes `register({ name: 'demo', description: 'd', inputSchema: {...}, outputSchema: {...}, handler: fn })`
- **THEN** a subsequent `get('demo')` SHALL return the same definition object reference and `list()` SHALL include it

#### Scenario: List returns all registered tools

- **WHEN** `N` distinct definitions have been registered
- **THEN** `list()` SHALL return an array of length `N` containing every registered definition

#### Scenario: validateAllowlist reports missing names

- **WHEN** `validateAllowlist(['known', 'unknown'])` is called and only `'known'` is registered
- **THEN** the result SHALL be `{ ok: false, missing: ['unknown'] }`

#### Scenario: Duplicate registration rejected

- **WHEN** two `register` calls are made with the same `name`
- **THEN** the second call SHALL throw `ToolRegistrationError` and the registry state SHALL remain as it was after the first call

### Requirement: MCP-compatible ToolDefinition shape

`src/lib/tools/types.ts` SHALL declare a `ToolDefinition` interface with the following required fields — `name: string`, `description: string`, `inputSchema: JSONSchema7`, `outputSchema: JSONSchema7`, `handler: (input: unknown, ctx: ToolContext) => Promise<unknown>` — and the following optional fields — `costModel?: CostModel`, `requiresApproval?: boolean`. The shape MUST be MCP-compatible: serializing `{ name, description, inputSchema }` SHALL produce a valid MCP tool descriptor without further transformation.

#### Scenario: Required fields enforced by the type system

- **WHEN** a caller attempts to construct a `ToolDefinition` literal missing `inputSchema` or `outputSchema`
- **THEN** the TypeScript compiler SHALL emit an error at the call site

#### Scenario: MCP descriptor projection

- **WHEN** a caller projects `{ name, description, inputSchema }` from a registered definition
- **THEN** the projection SHALL satisfy the MCP `Tool` shape and be JSON-serializable without loss

### Requirement: CostModel discriminated union

`src/lib/tools/cost.ts` SHALL export a `CostModel` discriminated union with exactly three variants keyed by `kind`:

- `{ kind: 'token'; inputPerKToken: number; outputPerKToken: number }`
- `{ kind: 'request'; perCallUsd: number }`
- `{ kind: 'custom'; estimate: (input: unknown) => number }`

Consumers MUST narrow on `kind` before reading variant-specific fields.

#### Scenario: Token variant carries per-K-token prices

- **WHEN** a definition declares `costModel: { kind: 'token', inputPerKToken: 0.003, outputPerKToken: 0.015 }`
- **THEN** a consumer narrowed to `kind === 'token'` SHALL read both fields with `number` type and SHALL NOT access `perCallUsd` or `estimate`

#### Scenario: Custom variant exposes estimator

- **WHEN** a definition declares `costModel: { kind: 'custom', estimate: fn }`
- **THEN** a consumer narrowed to `kind === 'custom'` SHALL call `estimate(input)` and receive a `number`

### Requirement: Pipeline tool-registry adapter preserves legacy shape

`src/lib/pipelines/tool-registry.ts` SHALL continue to expose `listTools()`, `getToolDefinition(id)`, and `validateToolAllowlist(definition)` returning the legacy shape `{ id, title, kind, runtime, description, writesMarkdown?, requiresExternalAccess? }`. The module SHALL derive these entries from central registry entries (or a local mapping table that itself references central names) so that pipelines compiled against the legacy shape continue to function with zero behavior change.

#### Scenario: Adapter returns legacy shape

- **WHEN** an existing caller invokes `listTools()` from `src/lib/pipelines/tool-registry.ts`
- **THEN** every returned entry SHALL contain `id`, `title`, `kind`, `runtime`, and `description` fields with the same values as before the refactor

#### Scenario: Allowlist validation unchanged

- **WHEN** an existing pipeline definition is validated via `validateToolAllowlist(definition)` after the refactor
- **THEN** the array of `GuardResult` items SHALL contain the same ids, statuses, and messages as before the refactor for the same input

### Requirement: First batch of moved tool definitions

`external-search` and `get-post-detail` SHALL live at `src/lib/tools/definitions/external-search.ts` and `src/lib/tools/definitions/get-post-detail.ts` respectively. Their original import paths under `src/lib/rag/tools/` SHALL continue to resolve via re-export shims, so existing imports work without modification during the transition.

#### Scenario: Importable from new path

- **WHEN** a module writes `import { searchExternalTools } from '@/lib/tools/definitions/external-search'`
- **THEN** the import SHALL resolve and the exported function SHALL accept the same `ExternalSearchInput` shape as the original

#### Scenario: Legacy path still resolves

- **WHEN** an existing module writes `import { searchExternalTools } from '@/lib/rag/tools/external-search'`
- **THEN** the import SHALL still resolve (via re-export) and return the same function as the new path

#### Scenario: RAG-specific tools NOT moved

- **WHEN** a grep for `hybrid-search`, `search-abstract-index`, `search-docs`, `pageindex`, or `search-posts` is run
- **THEN** these files SHALL remain under `src/lib/rag/tools/` and SHALL NOT be relocated by this change
