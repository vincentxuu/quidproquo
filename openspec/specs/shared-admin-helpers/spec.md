# Shared Admin Helpers

## Purpose

Defines centralized admin authentication, scheduled authentication, and JSON response helpers.

## Requirements

### Requirement: requireAdmin session check

`src/lib/auth/admin.ts` SHALL export `requireAdmin(cookies: AstroCookies): Promise<RequireAdminResult>` where `RequireAdminResult` is the discriminated union `{ ok: true } | { ok: false; response: Response }`. On a valid `session` cookie verified via `verifySession`, the function SHALL resolve to `{ ok: true }`. On a missing, malformed, or invalid cookie, it SHALL resolve to `{ ok: false, response }` where `response` is an HTTP 401 JSON response with body `{ error: 'unauthorized' }`.

All admin endpoints MUST replace inline `isAdmin` helpers with `requireAdmin`; no endpoint SHALL declare its own duplicate.

#### Scenario: Valid session cookie

- **WHEN** `requireAdmin(cookies)` is called with a `session` cookie whose value passes `verifySession`
- **THEN** the function SHALL return `{ ok: true }`

#### Scenario: Missing cookie returns 401

- **WHEN** `requireAdmin(cookies)` is called with no `session` cookie present
- **THEN** the function SHALL return `{ ok: false, response }` where `response.status === 401` and the body parses to `{ error: 'unauthorized' }`

#### Scenario: Invalid cookie returns 401

- **WHEN** `requireAdmin(cookies)` is called with a `session` cookie that fails `verifySession`
- **THEN** the function SHALL return `{ ok: false, response }` with `response.status === 401`

### Requirement: Scheduled (cron) dual-auth helper

`src/lib/auth/scheduled-auth.ts` SHALL export `getRequestSource(cookies: AstroCookies, request: Request, env: Env): Promise<PipelineRequestSource | null>` returning the literal union `'admin' | 'cron' | null` (matching the existing `PipelineRequestSource` type used in `src/pages/api/admin/pipelines/scheduled.ts`).

The helper SHALL first try session cookie verification — on success it returns `'admin'`. Otherwise it SHALL check the `X-Crawl-Secret` request header against `env.CRAWL_SECRET`; on match it returns `'cron'`. If `env.CRAWL_SECRET` is unset OR the header is missing OR the header value does not match, it SHALL return `null`.

#### Scenario: Valid admin cookie returns admin

- **WHEN** `getRequestSource(cookies, request, env)` is called with a valid session cookie
- **THEN** the function SHALL return `'admin'` and SHALL NOT inspect the `X-Crawl-Secret` header

#### Scenario: Valid crawl secret returns cron

- **WHEN** the session cookie is absent or invalid AND the request carries `X-Crawl-Secret` matching `env.CRAWL_SECRET`
- **THEN** the function SHALL return `'cron'`

#### Scenario: Mismatched secret returns null

- **WHEN** the session cookie is absent or invalid AND `X-Crawl-Secret` does not match `env.CRAWL_SECRET`
- **THEN** the function SHALL return `null`

#### Scenario: Missing CRAWL_SECRET env returns null

- **WHEN** `env.CRAWL_SECRET` is `undefined` and no valid session cookie is present
- **THEN** the function SHALL return `null` regardless of the request header value

### Requirement: JSON response helpers

`src/lib/api/response.ts` SHALL export the following helpers, each returning a standard `Response` with `Content-Type: application/json`:

- `json(data: unknown, status?: number): Response` — defaults to status `200`; body is `JSON.stringify(data)`
- `unauthorized(): Response` — status `401`, body `{ error: 'unauthorized' }`
- `forbidden(): Response` — status `403`, body `{ error: 'forbidden' }`
- `badRequest(message: string): Response` — status `400`, body `{ ok: false, error: message }`

All admin endpoints MUST consume these helpers; no endpoint SHALL declare its own duplicate `json`, `unauthorized`, `forbidden`, or `badRequest` function.

#### Scenario: json wraps data and sets header

- **WHEN** `json({ a: 1 })` is called
- **THEN** the returned `Response` SHALL have `status === 200`, header `Content-Type: application/json`, and body that parses to `{ a: 1 }`

#### Scenario: json with explicit status

- **WHEN** `json({ ok: false, error: 'boom' }, 500)` is called
- **THEN** the returned `Response` SHALL have `status === 500` and body that parses to `{ ok: false, error: 'boom' }`

#### Scenario: unauthorized shorthand

- **WHEN** `unauthorized()` is called
- **THEN** the returned `Response` SHALL have `status === 401`, header `Content-Type: application/json`, and body that parses to `{ error: 'unauthorized' }`

#### Scenario: badRequest carries message

- **WHEN** `badRequest('pipelineId is required')` is called
- **THEN** the returned `Response` SHALL have `status === 400` and body that parses to `{ ok: false, error: 'pipelineId is required' }`
