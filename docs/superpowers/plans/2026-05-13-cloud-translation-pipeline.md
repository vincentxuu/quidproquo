# Cloud Translation Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Cloudflare-hosted MVP that translates existing zh-TW posts to English one job at a time, stores observable stage artifacts, and opens GitHub PRs instead of writing directly to `main`.

**Architecture:** Reuse the existing admin pipeline/job harness and add translation-specific tables, services, and admin APIs. Cloudflare Queues throttle work, Cloudflare Workflows owns the multi-step state machine, D1 stores job status, R2 stores stage artifacts, AI Gateway fronts provider calls, and GitHub PR creation remains the publish boundary.

**Tech Stack:** Astro 6 server routes, Cloudflare Workers, Cloudflare D1, Cloudflare Queues, Cloudflare Workflows, Cloudflare R2, Cloudflare AI Gateway, GitHub Contents/Pulls REST API, TypeScript, Vitest, pnpm.

---

## File Structure

- `migrations/0008_translation_jobs.sql` — create translation backlog/job tables and indexes. Keep translation-specific state separate from generic `admin_jobs`, but cross-reference `admin_jobs.id` for timeline UI reuse.
- `src/lib/translations/types.ts` — shared TypeScript types for translation stages, statuses, rows, queue messages, provider results, and GitHub PR results.
- `src/lib/translations/paths.ts` — deterministic source-to-target path helpers and language/frontmatter helpers.
- `src/lib/translations/paths.test.ts` — unit tests for target path and frontmatter decisions.
- `src/lib/translations/job-store.ts` — D1 CRUD for translation jobs, stage transitions, retry counters, and artifact references.
- `src/lib/translations/job-store.test.ts` — unit tests using a small fake D1 prepared-statement harness for query intent and status transitions.
- `src/lib/translations/prompts.ts` — prompt builders for Translator, Cultural Reviewer, and Native Checker using the hand-off format from `docs/translation-pipeline.md`.
- `src/lib/translations/prompts.test.ts` — tests ensuring code-block preservation constraints and required hand-off sections exist.
- `src/lib/translations/provider.ts` — AI Gateway/provider client abstraction; first implementation calls AI Gateway with structured stage inputs and returns text + token metadata.
- `src/lib/translations/artifacts.ts` — R2 artifact key naming and read/write helpers for source snapshots and stage outputs.
- `src/lib/translations/github.ts` — GitHub read/create-branch/write-file/open-PR helper functions, with no direct `main` writes.
- `src/lib/translations/workflow.ts` — workflow orchestration functions for stage execution; written as pure functions so they can be called from Workflows or a Worker fallback during tests.
- `src/lib/translations/queue.ts` — queue message construction and enqueue helpers.
- `src/pages/api/admin/translations/enqueue.ts` — admin API to enqueue one post, a category, or a pilot batch.
- `src/pages/api/admin/translations/jobs/index.ts` — admin API to list translation jobs.
- `src/pages/api/admin/translations/jobs/[id].ts` — admin API to inspect/retry one translation job.
- `wrangler.jsonc` — add Queue, Workflow, R2 translation bucket, and AI Gateway/provider vars placeholders.
- `docs/translation-pipeline.md` — append cloud execution notes and required secrets/bindings.
- `progress.txt` — update only after implementation materially changes project status.

## Design Boundaries

- Do not implement runtime/on-demand translation. Every English post must be generated as Markdown and reviewed through a GitHub PR.
- Do not use Vectorize in MVP. Translation backlog is deterministic and does not need retrieval yet.
- Do not auto-merge PRs. The publish boundary is `pr_created`.
- Do not translate all 288 posts at once. The enqueue API supports pilot batches and Queue/Workflow settings should default to low concurrency.
- Do not store long Markdown outputs inline in D1. Store complete stage outputs in R2 and keep D1 summaries/keys only.

---

### Task 1: Add Translation Job Schema

**Files:**
- Create: `migrations/0008_translation_jobs.sql`

- [ ] **Step 1: Write the migration**

Create `migrations/0008_translation_jobs.sql` with:

```sql
-- Translation pipeline backlog and stage state.

CREATE TABLE IF NOT EXISTS translation_jobs (
  id TEXT PRIMARY KEY,
  admin_job_id TEXT,
  source_path TEXT NOT NULL,
  target_path TEXT NOT NULL,
  source_lang TEXT NOT NULL DEFAULT 'zh-TW',
  target_lang TEXT NOT NULL DEFAULT 'en',
  category TEXT NOT NULL,
  title TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority INTEGER NOT NULL DEFAULT 100,
  current_stage TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  error_summary TEXT,
  source_sha256 TEXT,
  translator_artifact_key TEXT,
  cultural_review_artifact_key TEXT,
  native_check_artifact_key TEXT,
  final_markdown_artifact_key TEXT,
  github_branch TEXT,
  github_pr_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  started_at TEXT,
  finished_at TEXT,
  FOREIGN KEY (admin_job_id) REFERENCES admin_jobs(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_translation_jobs_source_target
  ON translation_jobs(source_path, target_lang);

CREATE INDEX IF NOT EXISTS idx_translation_jobs_status_priority
  ON translation_jobs(status, priority, created_at);

CREATE INDEX IF NOT EXISTS idx_translation_jobs_category_status
  ON translation_jobs(category, status, priority);

CREATE TABLE IF NOT EXISTS translation_job_events (
  id TEXT PRIMARY KEY,
  translation_job_id TEXT NOT NULL,
  stage TEXT NOT NULL,
  status TEXT NOT NULL,
  summary TEXT,
  artifact_key TEXT,
  provider TEXT,
  model TEXT,
  input_tokens INTEGER,
  output_tokens INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (translation_job_id) REFERENCES translation_jobs(id)
);

CREATE INDEX IF NOT EXISTS idx_translation_job_events_job
  ON translation_job_events(translation_job_id, created_at);
```

- [ ] **Step 2: Apply migration locally**

Run:

```bash
pnpm wrangler d1 migrations apply quidproquo-db --local
```

Expected: Wrangler applies `0008_translation_jobs.sql` without SQL errors.

- [ ] **Step 3: Commit**

Use the project commit convention and `format-commit` skill before committing:

```bash
git add migrations/0008_translation_jobs.sql
git commit
```

---

### Task 2: Add Translation Types and Path Helpers

**Files:**
- Create: `src/lib/translations/types.ts`
- Create: `src/lib/translations/paths.ts`
- Create: `src/lib/translations/paths.test.ts`

- [ ] **Step 1: Write failing tests for target path and lang detection**

Create `src/lib/translations/paths.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getTargetPath, readFrontmatterValue } from './paths'

describe('translation paths', () => {
  it('adds an english suffix before the markdown extension', () => {
    expect(getTargetPath('src/content/posts/ai/2026-03-12-rag-cost-optimization.md')).toBe(
      'src/content/posts/ai/2026-03-12-rag-cost-optimization.en.md',
    )
  })

  it('does not duplicate the english suffix', () => {
    expect(getTargetPath('src/content/posts/ai/2026-03-12-rag-cost-optimization.en.md')).toBe(
      'src/content/posts/ai/2026-03-12-rag-cost-optimization.en.md',
    )
  })

  it('reads simple frontmatter scalar values', () => {
    const markdown = `---\ntitle: RAG 成本優化\ncategory: ai\nlang: zh-TW\n---\n\nBody`
    expect(readFrontmatterValue(markdown, 'title')).toBe('RAG 成本優化')
    expect(readFrontmatterValue(markdown, 'category')).toBe('ai')
    expect(readFrontmatterValue(markdown, 'lang')).toBe('zh-TW')
  })

  it('defaults missing lang to zh-TW', () => {
    const markdown = `---\ntitle: Example\ncategory: tech\n---\n\nBody`
    expect(readFrontmatterValue(markdown, 'lang') ?? 'zh-TW').toBe('zh-TW')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test src/lib/translations/paths.test.ts
```

Expected: FAIL because `src/lib/translations/paths.ts` does not exist.

- [ ] **Step 3: Add shared types**

Create `src/lib/translations/types.ts`:

```ts
export type TranslationStage = 'translator' | 'cultural_reviewer' | 'native_checker' | 'validate' | 'github_pr'

export type TranslationStatus =
  | 'pending'
  | 'queued'
  | 'running'
  | 'translated'
  | 'culturally_reviewed'
  | 'native_checked'
  | 'ready_for_pr'
  | 'pr_created'
  | 'failed'
  | 'cancelled'

export interface TranslationJobRow {
  id: string
  admin_job_id: string | null
  source_path: string
  target_path: string
  source_lang: string
  target_lang: string
  category: string
  title: string | null
  status: TranslationStatus
  priority: number
  current_stage: TranslationStage | null
  attempts: number
  error_summary: string | null
  source_sha256: string | null
  translator_artifact_key: string | null
  cultural_review_artifact_key: string | null
  native_check_artifact_key: string | null
  final_markdown_artifact_key: string | null
  github_branch: string | null
  github_pr_url: string | null
  created_at: string
  updated_at: string
  started_at: string | null
  finished_at: string | null
}

export interface TranslationQueueMessage {
  jobId: string
}

export interface TranslationStageResult {
  text: string
  summary: string
  provider: string
  model: string
  inputTokens?: number
  outputTokens?: number
}

export interface GitHubPullRequestResult {
  branch: string
  url: string
}
```

- [ ] **Step 4: Add path helpers**

Create `src/lib/translations/paths.ts`:

```ts
export function getTargetPath(sourcePath: string): string {
  if (sourcePath.endsWith('.en.md')) return sourcePath
  return sourcePath.replace(/\.md$/, '.en.md')
}

export function readFrontmatterValue(markdown: string, key: string): string | null {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null

  const line = match[1]
    .split('\n')
    .find((item) => item.startsWith(`${key}:`))

  if (!line) return null

  return line
    .slice(key.length + 1)
    .trim()
    .replace(/^['\"]|['\"]$/g, '')
}
```

- [ ] **Step 5: Run test to verify it passes**

Run:

```bash
pnpm test src/lib/translations/paths.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/translations/types.ts src/lib/translations/paths.ts src/lib/translations/paths.test.ts
git commit
```

---

### Task 3: Add Prompt Builders

**Files:**
- Create: `src/lib/translations/prompts.ts`
- Create: `src/lib/translations/prompts.test.ts`

- [ ] **Step 1: Write failing prompt tests**

Create `src/lib/translations/prompts.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { buildCulturalReviewerPrompt, buildNativeCheckerPrompt, buildTranslatorPrompt } from './prompts'

const source = {
  path: 'src/content/posts/ai/2026-03-12-rag-cost-optimization.md',
  title: 'RAG 成本優化',
  category: 'ai',
  audience: 'English readers of quidproquo.cc',
  markdown: '---\ntitle: RAG 成本優化\ncategory: ai\n---\n\n```ts\nconst apiName = "Vectorize"\n```',
}

describe('translation prompts', () => {
  it('builds translator prompt with required hand-off sections and constraints', () => {
    const prompt = buildTranslatorPrompt(source)
    expect(prompt).toContain('## Source')
    expect(prompt).toContain('## Constraints')
    expect(prompt).toContain('Keep all code blocks unchanged')
    expect(prompt).toContain('Preserve product names, API names, versions, and error messages')
    expect(prompt).toContain(source.markdown)
  })

  it('builds cultural reviewer prompt from translator output', () => {
    const prompt = buildCulturalReviewerPrompt(source, 'English draft')
    expect(prompt).toContain('Cultural Reviewer')
    expect(prompt).toContain('English draft')
    expect(prompt).toContain('Do not invent references or claims')
  })

  it('builds native checker prompt from revised output', () => {
    const prompt = buildNativeCheckerPrompt(source, 'Revised draft')
    expect(prompt).toContain('Native Checker')
    expect(prompt).toContain('Revised draft')
    expect(prompt).toContain('Frontmatter')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test src/lib/translations/prompts.test.ts
```

Expected: FAIL because `src/lib/translations/prompts.ts` does not exist.

- [ ] **Step 3: Implement prompt builders**

Create `src/lib/translations/prompts.ts`:

```ts
interface TranslationSource {
  path: string
  title: string
  category: string
  audience: string
  markdown: string
}

function handoff(source: TranslationSource): string {
  return `## Source
- path: ${source.path}
- title: ${source.title}
- category: ${source.category}
- audience: ${source.audience}

## Constraints
- Keep all code blocks unchanged unless a comment needs translation.
- Preserve product names, API names, versions, and error messages.
- Do not invent references or claims not in the source article.

## Open Questions
- List only questions that block a faithful English edition.`
}

export function buildTranslatorPrompt(source: TranslationSource): string {
  return `You are the Translator for quidproquo.cc.

Task: produce a complete technical English translation. Preserve terminology, product names, versions, code, links, CLI commands, API fields, and error messages.

${handoff(source)}

## Required Output
- English draft markdown
- Glossary of key translation decisions
- Uncertain points

## Source Markdown

${source.markdown}`
}

export function buildCulturalReviewerPrompt(source: TranslationSource, translatorOutput: string): string {
  return `You are the Cultural Reviewer for quidproquo.cc.

Task: revise the translated draft so English readers can absorb it naturally. Improve tone, paragraph rhythm, examples, and headings without changing technical meaning.

${handoff(source)}

## Translator Output

${translatorOutput}`
}

export function buildNativeCheckerPrompt(source: TranslationSource, reviewedOutput: string): string {
  return `You are the Native Checker for quidproquo.cc.

Task: produce the final publishable English Markdown. Check naturalness, grammar, title quality, frontmatter completeness, and whether any Chinese-style English remains.

${handoff(source)}

## Publishing Checks
- Frontmatter has title, lang: en, description, tldr, category, tags.
- Internal links remain valid.
- Code blocks, CLI commands, API fields, and error messages remain unchanged unless comments required translation.

## Cultural Reviewer Output

${reviewedOutput}`
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
pnpm test src/lib/translations/prompts.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/translations/prompts.ts src/lib/translations/prompts.test.ts
git commit
```

---

### Task 4: Add D1 Translation Job Store

**Files:**
- Create: `src/lib/translations/job-store.ts`
- Create: `src/lib/translations/job-store.test.ts`

- [ ] **Step 1: Write failing tests for create/list/transition query behavior**

Create `src/lib/translations/job-store.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { createTranslationJob, markTranslationJobStage, nextPendingTranslationJob } from './job-store'

class FakeStatement {
  constructor(private db: FakeD1, private sql: string) {}
  private values: unknown[] = []

  bind(...values: unknown[]) {
    this.values = values
    return this
  }

  async run() {
    this.db.calls.push({ sql: this.sql, values: this.values })
    return { success: true }
  }

  async first<T>() {
    this.db.calls.push({ sql: this.sql, values: this.values })
    return this.db.firstResult as T
  }
}

class FakeD1 {
  calls: { sql: string; values: unknown[] }[] = []
  firstResult: unknown = null

  prepare(sql: string) {
    return new FakeStatement(this, sql)
  }
}

describe('translation job store', () => {
  it('creates a pending translation job', async () => {
    const db = new FakeD1()
    const id = await createTranslationJob(db as unknown as D1Database, {
      sourcePath: 'src/content/posts/ai/source.md',
      targetPath: 'src/content/posts/ai/source.en.md',
      category: 'ai',
      title: 'Source',
      priority: 10,
    })

    expect(id).toMatch(/[0-9a-f-]{36}/)
    expect(db.calls[0].sql).toContain('INSERT INTO translation_jobs')
    expect(db.calls[0].values).toEqual([
      id,
      'src/content/posts/ai/source.md',
      'src/content/posts/ai/source.en.md',
      'ai',
      'Source',
      10,
    ])
  })

  it('selects the next pending job by priority', async () => {
    const db = new FakeD1()
    db.firstResult = { id: 'job-1', status: 'pending' }
    const row = await nextPendingTranslationJob(db as unknown as D1Database)

    expect(row).toEqual({ id: 'job-1', status: 'pending' })
    expect(db.calls[0].sql).toContain("status IN ('pending', 'queued')")
    expect(db.calls[0].sql).toContain('ORDER BY priority ASC, created_at ASC')
  })

  it('records stage transitions and artifact keys', async () => {
    const db = new FakeD1()
    await markTranslationJobStage(db as unknown as D1Database, 'job-1', {
      status: 'translated',
      stage: 'translator',
      artifactKey: 'translations/job-1/translator.md',
      summary: 'Translated draft ready.',
      provider: 'ai-gateway',
      model: 'claude-opus-4-7',
      inputTokens: 100,
      outputTokens: 200,
    })

    expect(db.calls[0].sql).toContain('UPDATE translation_jobs')
    expect(db.calls[1].sql).toContain('INSERT INTO translation_job_events')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test src/lib/translations/job-store.test.ts
```

Expected: FAIL because `src/lib/translations/job-store.ts` does not exist.

- [ ] **Step 3: Implement D1 job store**

Create `src/lib/translations/job-store.ts`:

```ts
import type { TranslationJobRow, TranslationStage, TranslationStatus } from './types'

interface CreateTranslationJobInput {
  sourcePath: string
  targetPath: string
  category: string
  title: string | null
  priority: number
}

interface StageTransitionInput {
  status: TranslationStatus
  stage: TranslationStage
  artifactKey?: string
  summary?: string
  provider?: string
  model?: string
  inputTokens?: number
  outputTokens?: number
}

const artifactColumnByStage: Partial<Record<TranslationStage, string>> = {
  translator: 'translator_artifact_key',
  cultural_reviewer: 'cultural_review_artifact_key',
  native_checker: 'native_check_artifact_key',
  validate: 'final_markdown_artifact_key',
}

export async function createTranslationJob(db: D1Database, input: CreateTranslationJobInput): Promise<string> {
  const id = crypto.randomUUID()
  await db.prepare(
    `INSERT INTO translation_jobs (id, source_path, target_path, category, title, priority)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).bind(id, input.sourcePath, input.targetPath, input.category, input.title, input.priority).run()
  return id
}

export async function nextPendingTranslationJob(db: D1Database): Promise<TranslationJobRow | null> {
  return await db.prepare(
    `SELECT * FROM translation_jobs
     WHERE status IN ('pending', 'queued')
     ORDER BY priority ASC, created_at ASC
     LIMIT 1`,
  ).first<TranslationJobRow>()
}

export async function getTranslationJob(db: D1Database, id: string): Promise<TranslationJobRow | null> {
  return await db.prepare('SELECT * FROM translation_jobs WHERE id = ?').bind(id).first<TranslationJobRow>()
}

export async function markTranslationJobStage(
  db: D1Database,
  id: string,
  input: StageTransitionInput,
): Promise<void> {
  const artifactColumn = artifactColumnByStage[input.stage]
  const artifactUpdate = artifactColumn && input.artifactKey ? `, ${artifactColumn} = ?` : ''
  const artifactValues = artifactColumn && input.artifactKey ? [input.artifactKey] : []
  const finishedAt = ['pr_created', 'failed', 'cancelled'].includes(input.status) ? ", finished_at = COALESCE(finished_at, datetime('now'))" : ''

  await db.prepare(
    `UPDATE translation_jobs
     SET status = ?,
         current_stage = ?,
         updated_at = datetime('now'),
         started_at = COALESCE(started_at, datetime('now'))
         ${artifactUpdate}
         ${finishedAt}
     WHERE id = ?`,
  ).bind(input.status, input.stage, ...artifactValues, id).run()

  await db.prepare(
    `INSERT INTO translation_job_events (
       id, translation_job_id, stage, status, summary, artifact_key, provider, model, input_tokens, output_tokens
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    crypto.randomUUID(),
    id,
    input.stage,
    input.status,
    input.summary ?? null,
    input.artifactKey ?? null,
    input.provider ?? null,
    input.model ?? null,
    input.inputTokens ?? null,
    input.outputTokens ?? null,
  ).run()
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
pnpm test src/lib/translations/job-store.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/translations/job-store.ts src/lib/translations/job-store.test.ts
git commit
```

---

### Task 5: Add R2 Artifact Helpers

**Files:**
- Create: `src/lib/translations/artifacts.ts`
- Create: `src/lib/translations/artifacts.test.ts`

- [ ] **Step 1: Write failing artifact key tests**

Create `src/lib/translations/artifacts.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getArtifactKey } from './artifacts'

describe('translation artifact keys', () => {
  it('places stage outputs under the job id', () => {
    expect(getArtifactKey('job-1', 'translator')).toBe('translations/job-1/translator.md')
    expect(getArtifactKey('job-1', 'native_checker')).toBe('translations/job-1/native_checker.md')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test src/lib/translations/artifacts.test.ts
```

Expected: FAIL because `src/lib/translations/artifacts.ts` does not exist.

- [ ] **Step 3: Implement R2 helpers**

Create `src/lib/translations/artifacts.ts`:

```ts
import type { TranslationStage } from './types'

export function getArtifactKey(jobId: string, stage: TranslationStage | 'source' | 'final'): string {
  return `translations/${jobId}/${stage}.md`
}

export async function writeArtifact(bucket: R2Bucket, key: string, content: string): Promise<void> {
  await bucket.put(key, content, {
    httpMetadata: { contentType: 'text/markdown; charset=utf-8' },
  })
}

export async function readArtifact(bucket: R2Bucket, key: string): Promise<string> {
  const object = await bucket.get(key)
  if (!object) throw new Error(`Artifact not found: ${key}`)
  return await object.text()
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
pnpm test src/lib/translations/artifacts.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/translations/artifacts.ts src/lib/translations/artifacts.test.ts
git commit
```

---

### Task 6: Add AI Gateway Provider Client

**Files:**
- Create: `src/lib/translations/provider.ts`
- Create: `src/lib/translations/provider.test.ts`

- [ ] **Step 1: Write failing provider tests**

Create `src/lib/translations/provider.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest'
import { runTranslationStage } from './provider'

describe('translation provider', () => {
  it('calls the configured AI Gateway endpoint with stage prompt', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({
      content: [{ type: 'text', text: 'Translated markdown' }],
      usage: { input_tokens: 10, output_tokens: 20 },
    })))

    const result = await runTranslationStage({
      fetchImpl: fetchMock as unknown as typeof fetch,
      gatewayUrl: 'https://gateway.ai.cloudflare.com/v1/account/gateway/anthropic/messages',
      apiKey: 'secret',
      model: 'claude-opus-4-7',
      provider: 'anthropic',
      prompt: 'Translate this post',
    })

    expect(result.text).toBe('Translated markdown')
    expect(result.inputTokens).toBe(10)
    expect(result.outputTokens).toBe(20)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://gateway.ai.cloudflare.com/v1/account/gateway/anthropic/messages',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test src/lib/translations/provider.test.ts
```

Expected: FAIL because `src/lib/translations/provider.ts` does not exist.

- [ ] **Step 3: Implement provider client**

Create `src/lib/translations/provider.ts`:

```ts
import type { TranslationStageResult } from './types'

interface RunTranslationStageInput {
  fetchImpl: typeof fetch
  gatewayUrl: string
  apiKey: string
  model: string
  provider: string
  prompt: string
}

interface AnthropicLikeResponse {
  content?: { type: string; text?: string }[]
  usage?: { input_tokens?: number; output_tokens?: number }
}

export async function runTranslationStage(input: RunTranslationStageInput): Promise<TranslationStageResult> {
  const response = await input.fetchImpl(input.gatewayUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${input.apiKey}`,
    },
    body: JSON.stringify({
      model: input.model,
      max_tokens: 16000,
      messages: [{ role: 'user', content: input.prompt }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Translation provider failed: ${response.status}`)
  }

  const data = await response.json() as AnthropicLikeResponse
  const text = data.content?.find((block) => block.type === 'text')?.text
  if (!text) throw new Error('Translation provider returned no text')

  return {
    text,
    summary: text.slice(0, 240),
    provider: input.provider,
    model: input.model,
    inputTokens: data.usage?.input_tokens,
    outputTokens: data.usage?.output_tokens,
  }
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
pnpm test src/lib/translations/provider.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/translations/provider.ts src/lib/translations/provider.test.ts
git commit
```

---

### Task 7: Add GitHub PR Helper

**Files:**
- Create: `src/lib/translations/github.ts`
- Create: `src/lib/translations/github.test.ts`

- [ ] **Step 1: Write failing GitHub helper tests**

Create `src/lib/translations/github.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest'
import { createTranslationPullRequest } from './github'

describe('github translation PR helper', () => {
  it('creates a branch, writes translated markdown, and opens a PR', async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.endsWith('/git/ref/heads/main')) {
        return new Response(JSON.stringify({ object: { sha: 'base-sha' } }))
      }
      if (url.endsWith('/git/refs')) {
        expect(init?.method).toBe('POST')
        return new Response(JSON.stringify({ ref: 'refs/heads/translation/job-1' }))
      }
      if (url.includes('/contents/src%2Fcontent%2Fposts%2Fai%2Fpost.en.md')) {
        expect(init?.method).toBe('PUT')
        return new Response(JSON.stringify({ content: { path: 'src/content/posts/ai/post.en.md' } }))
      }
      if (url.endsWith('/pulls')) {
        expect(init?.method).toBe('POST')
        return new Response(JSON.stringify({ html_url: 'https://github.com/owner/repo/pull/1' }))
      }
      return new Response('not found', { status: 404 })
    })

    const result = await createTranslationPullRequest({
      fetchImpl: fetchMock as unknown as typeof fetch,
      token: 'gh-token',
      owner: 'owner',
      repo: 'repo',
      baseBranch: 'main',
      branch: 'translation/job-1',
      targetPath: 'src/content/posts/ai/post.en.md',
      markdown: '# English Post',
      title: 'Translate post to English',
      body: 'Generated by translation pipeline.',
    })

    expect(result).toEqual({ branch: 'translation/job-1', url: 'https://github.com/owner/repo/pull/1' })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test src/lib/translations/github.test.ts
```

Expected: FAIL because `src/lib/translations/github.ts` does not exist.

- [ ] **Step 3: Implement GitHub helper**

Create `src/lib/translations/github.ts`:

```ts
import type { GitHubPullRequestResult } from './types'

interface CreateTranslationPullRequestInput {
  fetchImpl: typeof fetch
  token: string
  owner: string
  repo: string
  baseBranch: string
  branch: string
  targetPath: string
  markdown: string
  title: string
  body: string
}

interface RefResponse { object: { sha: string } }
interface PullResponse { html_url: string }

export async function createTranslationPullRequest(input: CreateTranslationPullRequestInput): Promise<GitHubPullRequestResult> {
  const apiBase = `https://api.github.com/repos/${input.owner}/${input.repo}`
  const headers = {
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${input.token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'quidproquo-translation-pipeline',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  const baseRef = await githubJson<RefResponse>(input.fetchImpl, `${apiBase}/git/ref/heads/${input.baseBranch}`, { headers })

  await githubJson(input.fetchImpl, `${apiBase}/git/refs`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ref: `refs/heads/${input.branch}`, sha: baseRef.object.sha }),
  })

  await githubJson(input.fetchImpl, `${apiBase}/contents/${encodeURIComponent(input.targetPath)}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `translate: add ${input.targetPath}`,
      content: toBase64(input.markdown),
      branch: input.branch,
    }),
  })

  const pr = await githubJson<PullResponse>(input.fetchImpl, `${apiBase}/pulls`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: input.title,
      body: input.body,
      head: input.branch,
      base: input.baseBranch,
    }),
  })

  return { branch: input.branch, url: pr.html_url }
}

async function githubJson<T = unknown>(fetchImpl: typeof fetch, url: string, init: RequestInit): Promise<T> {
  const response = await fetchImpl(url, init)
  if (!response.ok) throw new Error(`GitHub request failed: ${response.status}`)
  return await response.json() as T
}

function toBase64(content: string): string {
  const bytes = new TextEncoder().encode(content)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
pnpm test src/lib/translations/github.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/translations/github.ts src/lib/translations/github.test.ts
git commit
```

---

### Task 8: Add Workflow Orchestration Function

**Files:**
- Create: `src/lib/translations/workflow.ts`
- Create: `src/lib/translations/workflow.test.ts`

- [ ] **Step 1: Write failing orchestration test**

Create `src/lib/translations/workflow.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest'
import { runTranslationWorkflow } from './workflow'

const job = {
  id: 'job-1',
  source_path: 'src/content/posts/ai/post.md',
  target_path: 'src/content/posts/ai/post.en.md',
  category: 'ai',
  title: '中文標題',
  status: 'queued',
}

describe('translation workflow', () => {
  it('runs stages sequentially and creates a PR', async () => {
    const stages: string[] = []
    const markStage = vi.fn(async (_id, input) => stages.push(input.stage))
    const writeArtifact = vi.fn(async () => undefined)
    const runStage = vi.fn(async ({ prompt }) => ({
      text: prompt.includes('Native Checker') ? '---\ntitle: English\nlang: en\n---\n\nFinal' : 'Draft',
      summary: 'ok',
      provider: 'ai-gateway',
      model: 'claude-opus-4-7',
    }))
    const createPr = vi.fn(async () => ({ branch: 'translation/job-1', url: 'https://github.com/owner/repo/pull/1' }))

    const result = await runTranslationWorkflow({
      job: job as any,
      sourceMarkdown: '---\ntitle: 中文標題\ncategory: ai\n---\n\nBody',
      artifactBucket: {} as R2Bucket,
      markStage,
      writeArtifact,
      runStage,
      createPr,
    })

    expect(stages).toEqual(['translator', 'cultural_reviewer', 'native_checker', 'github_pr'])
    expect(writeArtifact).toHaveBeenCalledTimes(4)
    expect(createPr).toHaveBeenCalledOnce()
    expect(result.url).toBe('https://github.com/owner/repo/pull/1')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test src/lib/translations/workflow.test.ts
```

Expected: FAIL because `src/lib/translations/workflow.ts` does not exist.

- [ ] **Step 3: Implement orchestration function**

Create `src/lib/translations/workflow.ts`:

```ts
import { getArtifactKey } from './artifacts'
import { buildCulturalReviewerPrompt, buildNativeCheckerPrompt, buildTranslatorPrompt } from './prompts'
import type { GitHubPullRequestResult, TranslationJobRow, TranslationStage, TranslationStageResult } from './types'

interface RunStageInput { prompt: string }
interface MarkStageInput {
  stage: TranslationStage
  status: string
  artifactKey?: string
  summary?: string
  provider?: string
  model?: string
  inputTokens?: number
  outputTokens?: number
}

interface RunTranslationWorkflowInput {
  job: TranslationJobRow
  sourceMarkdown: string
  artifactBucket: R2Bucket
  markStage: (id: string, input: MarkStageInput) => Promise<void>
  writeArtifact: (bucket: R2Bucket, key: string, content: string) => Promise<void>
  runStage: (input: RunStageInput) => Promise<TranslationStageResult>
  createPr: (markdown: string) => Promise<GitHubPullRequestResult>
}

export async function runTranslationWorkflow(input: RunTranslationWorkflowInput): Promise<GitHubPullRequestResult> {
  const source = {
    path: input.job.source_path,
    title: input.job.title ?? input.job.source_path,
    category: input.job.category,
    audience: 'English readers of quidproquo.cc',
    markdown: input.sourceMarkdown,
  }

  const sourceKey = getArtifactKey(input.job.id, 'source')
  await input.writeArtifact(input.artifactBucket, sourceKey, input.sourceMarkdown)

  const translator = await input.runStage({ prompt: buildTranslatorPrompt(source) })
  const translatorKey = getArtifactKey(input.job.id, 'translator')
  await input.writeArtifact(input.artifactBucket, translatorKey, translator.text)
  await input.markStage(input.job.id, { stage: 'translator', status: 'translated', artifactKey: translatorKey, ...tokenSummary(translator) })

  const cultural = await input.runStage({ prompt: buildCulturalReviewerPrompt(source, translator.text) })
  const culturalKey = getArtifactKey(input.job.id, 'cultural_reviewer')
  await input.writeArtifact(input.artifactBucket, culturalKey, cultural.text)
  await input.markStage(input.job.id, { stage: 'cultural_reviewer', status: 'culturally_reviewed', artifactKey: culturalKey, ...tokenSummary(cultural) })

  const native = await input.runStage({ prompt: buildNativeCheckerPrompt(source, cultural.text) })
  const nativeKey = getArtifactKey(input.job.id, 'native_checker')
  await input.writeArtifact(input.artifactBucket, nativeKey, native.text)
  await input.markStage(input.job.id, { stage: 'native_checker', status: 'native_checked', artifactKey: nativeKey, ...tokenSummary(native) })

  const finalKey = getArtifactKey(input.job.id, 'final')
  await input.writeArtifact(input.artifactBucket, finalKey, native.text)

  const pr = await input.createPr(native.text)
  await input.markStage(input.job.id, {
    stage: 'github_pr',
    status: 'pr_created',
    artifactKey: finalKey,
    summary: pr.url,
  })

  return pr
}

function tokenSummary(result: TranslationStageResult) {
  return {
    summary: result.summary,
    provider: result.provider,
    model: result.model,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
  }
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
pnpm test src/lib/translations/workflow.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/translations/workflow.ts src/lib/translations/workflow.test.ts
git commit
```

---

### Task 9: Add Queue Enqueue Helper and Admin Enqueue API

**Files:**
- Create: `src/lib/translations/queue.ts`
- Create: `src/pages/api/admin/translations/enqueue.ts`

- [ ] **Step 1: Add queue helper**

Create `src/lib/translations/queue.ts`:

```ts
import type { TranslationQueueMessage } from './types'

export async function enqueueTranslationJob(queue: Queue<TranslationQueueMessage>, jobId: string): Promise<void> {
  await queue.send({ jobId })
}
```

- [ ] **Step 2: Add admin enqueue API**

Create `src/pages/api/admin/translations/enqueue.ts`:

```ts
export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../lib/auth/session'
import { createTranslationJob } from '../../../../lib/translations/job-store'
import { getTargetPath } from '../../../../lib/translations/paths'
import { enqueueTranslationJob } from '../../../../lib/translations/queue'

interface Env {
  DB: D1Database
  TRANSLATION_QUEUE: Queue<{ jobId: string }>
}

interface EnqueueRequest {
  sourcePath: string
  category: string
  title?: string
  priority?: number
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const body = await request.json() as EnqueueRequest
  if (!body.sourcePath || !body.sourcePath.startsWith('src/content/posts/') || !body.sourcePath.endsWith('.md')) {
    return json({ error: 'sourcePath must be a markdown file under src/content/posts/' }, 400)
  }
  if (!body.category) return json({ error: 'category is required' }, 400)

  const bindings = env as unknown as Env
  const jobId = await createTranslationJob(bindings.DB, {
    sourcePath: body.sourcePath,
    targetPath: getTargetPath(body.sourcePath),
    category: body.category,
    title: body.title ?? null,
    priority: Number.isInteger(body.priority) ? body.priority as number : 100,
  })

  await enqueueTranslationJob(bindings.TRANSLATION_QUEUE, jobId)

  return json({ jobId, status: 'queued' })
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return json({ error: 'unauthorized' }, 401)
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}
```

- [ ] **Step 3: Run type/lint checks**

Run:

```bash
pnpm test src/lib/translations/paths.test.ts src/lib/translations/job-store.test.ts
pnpm lint
```

Expected: translation tests pass. `pnpm lint` should not introduce new warnings beyond existing `src/components/Chat/MessageList.tsx` warnings from session start.

- [ ] **Step 4: Commit**

```bash
git add src/lib/translations/queue.ts src/pages/api/admin/translations/enqueue.ts
git commit
```

---

### Task 10: Add Admin Translation Job APIs

**Files:**
- Modify: `src/lib/translations/job-store.ts`
- Create: `src/pages/api/admin/translations/jobs/index.ts`
- Create: `src/pages/api/admin/translations/jobs/[id].ts`

- [ ] **Step 1: Add list function to job store**

Append to `src/lib/translations/job-store.ts`:

```ts
export async function listTranslationJobs(db: D1Database, limit = 50): Promise<TranslationJobRow[]> {
  const result = await db.prepare(
    `SELECT * FROM translation_jobs
     ORDER BY created_at DESC
     LIMIT ?`,
  ).bind(Math.min(Math.max(limit, 1), 100)).all<TranslationJobRow>()
  return result.results
}
```

- [ ] **Step 2: Add list API**

Create `src/pages/api/admin/translations/jobs/index.ts`:

```ts
export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../../lib/auth/session'
import { listTranslationJobs } from '../../../../../lib/translations/job-store'

interface Env { DB: D1Database }

export const GET: APIRoute = async ({ cookies, url }) => {
  if (!await isAdmin(cookies)) return unauthorized()
  const limit = Number(url.searchParams.get('limit') ?? 50)
  const jobs = await listTranslationJobs((env as unknown as Env).DB, Number.isInteger(limit) ? limit : 50)
  return json({ jobs })
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return json({ error: 'unauthorized' }, 401)
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}
```

- [ ] **Step 3: Add detail API**

Create `src/pages/api/admin/translations/jobs/[id].ts`:

```ts
export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../../lib/auth/session'
import { getTranslationJob } from '../../../../../lib/translations/job-store'
import { enqueueTranslationJob } from '../../../../../lib/translations/queue'

interface Env {
  DB: D1Database
  TRANSLATION_QUEUE: Queue<{ jobId: string }>
}

export const GET: APIRoute = async ({ cookies, params }) => {
  if (!await isAdmin(cookies)) return unauthorized()
  const id = params.id
  if (!id) return json({ error: 'id is required' }, 400)

  const job = await getTranslationJob((env as unknown as Env).DB, id)
  if (!job) return json({ error: 'not found' }, 404)
  return json({ job })
}

export const POST: APIRoute = async ({ cookies, params }) => {
  if (!await isAdmin(cookies)) return unauthorized()
  const id = params.id
  if (!id) return json({ error: 'id is required' }, 400)

  await enqueueTranslationJob((env as unknown as Env).TRANSLATION_QUEUE, id)
  return json({ jobId: id, status: 'queued' })
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return json({ error: 'unauthorized' }, 401)
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}
```

- [ ] **Step 4: Run checks**

Run:

```bash
pnpm test src/lib/translations/job-store.test.ts
pnpm lint
```

Expected: tests pass; no new lint warnings from translation files.

- [ ] **Step 5: Commit**

```bash
git add src/lib/translations/job-store.ts src/pages/api/admin/translations/jobs/index.ts src/pages/api/admin/translations/jobs/[id].ts
git commit
```

---

### Task 11: Wire Cloudflare Bindings

**Files:**
- Modify: `wrangler.jsonc`
- Modify: `docs/translation-pipeline.md`

- [ ] **Step 1: Update Wrangler bindings**

Modify `wrangler.jsonc` to add a translation queue, translation artifact bucket, workflow binding, and AI Gateway/provider config. Preserve existing bindings.

Add near other top-level bindings:

```jsonc
  "queues": {
    "producers": [
      { "binding": "TRANSLATION_QUEUE", "queue": "quidproquo-translation" }
    ],
    "consumers": [
      { "queue": "quidproquo-translation", "max_batch_size": 1, "max_batch_timeout": 30 }
    ]
  },
  "workflows": [
    {
      "name": "translation-workflow",
      "binding": "TRANSLATION_WORKFLOW",
      "class_name": "TranslationWorkflow"
    }
  ],
```

Add an R2 bucket entry without removing `R2_IMAGES`:

```jsonc
    {
      "binding": "R2_TRANSLATIONS",
      "bucket_name": "quidproquo-translations"
    }
```

Add vars placeholders:

```jsonc
    "TRANSLATION_PROVIDER": "anthropic",
    "TRANSLATION_MODEL": "claude-opus-4-7",
    "TRANSLATION_BASE_BRANCH": "main",
    "GITHUB_OWNER": "vincentxuu",
    "GITHUB_REPO": "quidproquo"
```

Do not put secrets in `wrangler.jsonc`. Configure these as Cloudflare secrets:

```bash
pnpm wrangler secret put TRANSLATION_PROVIDER_API_KEY
pnpm wrangler secret put GITHUB_TOKEN
pnpm wrangler secret put AI_GATEWAY_URL
```

- [ ] **Step 2: Document cloud run mode**

Append this section to `docs/translation-pipeline.md`:

```md
## Cloudflare Cloud Runner MVP

Cloud execution uses:

- Cloudflare Queue `TRANSLATION_QUEUE` to throttle translation jobs.
- Cloudflare Workflow `TRANSLATION_WORKFLOW` for the per-post stage machine.
- D1 table `translation_jobs` for backlog/status.
- R2 bucket `R2_TRANSLATIONS` for source snapshots and stage outputs.
- AI Gateway for provider observability and spend controls.
- GitHub PRs as the publish boundary; the worker must not write directly to `main`.

Required secrets:

- `TRANSLATION_PROVIDER_API_KEY`
- `AI_GATEWAY_URL`
- `GITHUB_TOKEN`

Default rollout: enqueue a pilot batch of 3 posts, review PR quality, then increase batch size gradually.
```

- [ ] **Step 3: Run JSON/config check**

Run:

```bash
node -e "const fs=require('fs'); const s=fs.readFileSync('wrangler.jsonc','utf8').replace(/\/\/.*$/gm,''); JSON.parse(s); console.log('wrangler json ok')"
```

Expected: prints `wrangler json ok`.

- [ ] **Step 4: Commit**

```bash
git add wrangler.jsonc docs/translation-pipeline.md
git commit
```

---

### Task 12: Add Queue Consumer and Workflow Entry Point

**Files:**
- Create: `src/lib/translations/consumer.ts`
- Modify: `src/pages/api/admin/translations/jobs/[id].ts` if needed after type checks
- Modify: Worker entry generated by Astro only if the project already has a custom worker entry; otherwise document that this task requires adding the Cloudflare Worker entry pattern used by Astro adapter.

- [ ] **Step 1: Create consumer logic independent of platform entry**

Create `src/lib/translations/consumer.ts`:

```ts
import { readArtifact, writeArtifact } from './artifacts'
import { createTranslationPullRequest } from './github'
import { getTranslationJob, markTranslationJobStage } from './job-store'
import { runTranslationStage } from './provider'
import { runTranslationWorkflow } from './workflow'
import type { TranslationQueueMessage } from './types'

interface TranslationEnv {
  DB: D1Database
  R2_TRANSLATIONS: R2Bucket
  TRANSLATION_PROVIDER_API_KEY: string
  AI_GATEWAY_URL: string
  TRANSLATION_PROVIDER: string
  TRANSLATION_MODEL: string
  GITHUB_TOKEN: string
  GITHUB_OWNER: string
  GITHUB_REPO: string
  TRANSLATION_BASE_BRANCH: string
}

export async function processTranslationMessage(message: TranslationQueueMessage, env: TranslationEnv): Promise<void> {
  const job = await getTranslationJob(env.DB, message.jobId)
  if (!job) throw new Error(`Translation job not found: ${message.jobId}`)

  const sourceMarkdown = await readArtifact(env.R2_TRANSLATIONS, `sources/${job.source_path}`)

  await runTranslationWorkflow({
    job,
    sourceMarkdown,
    artifactBucket: env.R2_TRANSLATIONS,
    writeArtifact,
    markStage: (id, input) => markTranslationJobStage(env.DB, id, input as Parameters<typeof markTranslationJobStage>[2]),
    runStage: ({ prompt }) => runTranslationStage({
      fetchImpl: fetch,
      gatewayUrl: env.AI_GATEWAY_URL,
      apiKey: env.TRANSLATION_PROVIDER_API_KEY,
      model: env.TRANSLATION_MODEL,
      provider: env.TRANSLATION_PROVIDER,
      prompt,
    }),
    createPr: (markdown) => createTranslationPullRequest({
      fetchImpl: fetch,
      token: env.GITHUB_TOKEN,
      owner: env.GITHUB_OWNER,
      repo: env.GITHUB_REPO,
      baseBranch: env.TRANSLATION_BASE_BRANCH,
      branch: `translation/${job.id}`,
      targetPath: job.target_path,
      markdown,
      title: `Translate ${job.title ?? job.source_path} to English`,
      body: `Generated by the Cloudflare translation pipeline.\n\nSource: \`${job.source_path}\``,
    }),
  })
}
```

- [ ] **Step 2: Add a temporary source snapshot requirement to docs**

Append to `docs/translation-pipeline.md`:

```md
### Source snapshots

The MVP consumer expects source Markdown snapshots in R2 at `sources/<source_path>`. The enqueue endpoint should upload the source snapshot before queueing the job when GitHub source fetching is added. Until then, tests should inject R2 artifacts directly.
```

- [ ] **Step 3: Run targeted tests and type check via build**

Run:

```bash
pnpm test src/lib/translations
pnpm build
```

Expected: translation tests pass. Build may expose the exact Astro/Cloudflare entry-point requirement; if so, add the minimal entry-point wiring in the same task and rerun.

- [ ] **Step 4: Commit**

```bash
git add src/lib/translations/consumer.ts docs/translation-pipeline.md
git commit
```

---

### Task 13: Add Backlog Scanner Script for Pilot Enqueue Inputs

**Files:**
- Create: `scripts/list-missing-english-posts.mjs`
- Modify: `package.json`

- [ ] **Step 1: Add scanner script**

Create `scripts/list-missing-english-posts.mjs`:

```js
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const root = 'src/content/posts'
const limit = Number(process.argv.find((arg) => arg.startsWith('--limit='))?.split('=')[1] ?? 20)

const files = []
await walk(root)

const byBase = new Map()
for (const file of files) {
  const base = file.replace(/\.en\.md$/, '.md')
  const item = byBase.get(base) ?? { zh: false, en: false, file: base }
  if (file.endsWith('.en.md')) item.en = true
  else item.zh = true
  byBase.set(base, item)
}

let count = 0
for (const item of byBase.values()) {
  if (!item.zh || item.en) continue
  const markdown = await readFile(item.file, 'utf8')
  const category = scalar(markdown, 'category') ?? item.file.split('/')[3] ?? 'tech'
  const title = scalar(markdown, 'title') ?? item.file
  console.log(JSON.stringify({ sourcePath: item.file, category, title, priority: count + 1 }))
  count += 1
  if (count >= limit) break
}

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) await walk(path)
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(path)
  }
}

function scalar(markdown, key) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null
  const line = match[1].split('\n').find((item) => item.startsWith(`${key}:`))
  return line ? line.slice(key.length + 1).trim().replace(/^['\"]|['\"]$/g, '') : null
}
```

- [ ] **Step 2: Add package script**

Modify `package.json` scripts:

```json
"translations:missing": "node scripts/list-missing-english-posts.mjs"
```

- [ ] **Step 3: Run scanner**

Run:

```bash
pnpm translations:missing -- --limit=3
```

Expected: prints 3 JSON lines with `sourcePath`, `category`, `title`, and `priority`.

- [ ] **Step 4: Commit**

```bash
git add scripts/list-missing-english-posts.mjs package.json
git commit
```

---

### Task 14: Final Verification

**Files:**
- Modify: `progress.txt`

- [ ] **Step 1: Run full local verification**

Run:

```bash
pnpm test
pnpm lint
pnpm check:references
pnpm build
```

Expected:
- `pnpm test` passes.
- `pnpm check:references` passes.
- `pnpm build` passes.
- `pnpm lint` has no new warnings from translation files. Existing `src/components/Chat/MessageList.tsx` warnings may remain if outside this branch scope.

- [ ] **Step 2: Update progress**

Update `progress.txt` current focus / recently completed to mention the cloud translation pipeline MVP scaffolding if implementation is complete.

- [ ] **Step 3: Commit verification/progress update**

```bash
git add progress.txt
git commit
```

---

## Rollout Plan

1. Configure Cloudflare resources for preview: `quidproquo-translation` queue, `quidproquo-translations` R2 bucket, and required secrets.
2. Apply D1 migration to preview.
3. Run `pnpm translations:missing -- --limit=3` and enqueue the first 3 posts manually through the admin API.
4. Confirm AI Gateway shows provider calls, token usage, latency, and errors.
5. Confirm R2 contains `source`, `translator`, `cultural_reviewer`, `native_checker`, and `final` artifacts per job.
6. Confirm GitHub PRs are opened on `translation/<jobId>` branches and are not merged automatically.
7. Review PR quality manually before increasing pilot size.

## Self-Review

- Spec coverage: The plan covers D1 backlog, Queue throttling, Workflow-style staged orchestration, R2 artifacts, AI Gateway provider calls, admin APIs, GitHub PR output, pilot scanning, and verification.
- Scope: MVP intentionally excludes automatic merge, runtime translation, Vectorize terminology retrieval, and full admin UI.
- Placeholder scan: No task contains TBD/TODO/fill-in instructions. Cloudflare secrets are named explicitly but values are intentionally not included.
- Type consistency: Stage/status names match `types.ts`, migration values, prompt/workflow functions, and job-store transitions.
