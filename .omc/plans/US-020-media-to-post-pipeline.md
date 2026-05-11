# US-020 Media-to-Post Pipeline

**Goal:** Given a YouTube URL or podcast URL, automatically fetch the transcript, analyze the content with AI, and generate a structured zh-TW blog post draft.

**Status:** Planning (revised after Critic review)
**Date:** 2026-05-03

---

## Requirements Summary

| Item | Detail |
|------|--------|
| Input | YouTube URL or Podcast URL (RSS feed / direct episode MP3) |
| Transcript (CLI) | YouTube captions (`youtube-transcript`) → fallback to local `faster-whisper` |
| Transcript (Web) | YouTube captions only; podcast audio ≤ 50MB → CF Workers AI Whisper |
| Draft persistence | **CLI**: write `.md` to `src/content/posts/` directly; **Web**: save to D1 `media_drafts` table |
| Export from web | `pnpm media:pull` syncs D1 approved drafts → local `src/content/posts/` |
| Default Style | Deep analysis: theme sections, ASCII concept map, key quotes, editorial commentary |
| Customizable | Prompt template swappable per-run via `--style` flag |
| Execution | ① Local CLI (`pnpm media <url>`) ② Admin Web Page (`/admin/media`) |
| Language | zh-TW output; `lang` flag = Whisper **source** language hint (default: `zh`) |
| Feature Flag | `MEDIA_INGEST_ENABLED=true` env var — API returns 404 when unset |

---

## Acceptance Criteria

- [ ] `pnpm media <youtube-url>` produces a valid `.md` draft in `src/content/posts/<category>/` in < 3 minutes
- [ ] `pnpm media <podcast-rss-url>` OR `pnpm media <mp3-url>` works the same way
- [ ] `pnpm media --style summary <url>` produces a 500-word summary draft
- [ ] CLI interactive mode prompts for category (from allowlist), style, draft flag
- [ ] CLI rejects duplicate URL (same slug already exists) with clear message; `--force` overwrites
- [ ] `--category` flag validates against allowlist of existing `src/content/posts/` subdirectories
- [ ] Generated draft passes `pnpm astro check` before CLI exits (retry once on failure)
- [ ] Generated draft passes `pnpm check:references` before CLI exits
- [ ] `/admin/media` page is accessible only with valid session cookie (`verifySession`)
- [ ] Web ingest stores draft in D1 `media_drafts`; SSE stream completes with `draft_id`
- [ ] `pnpm media:pull` exports approved D1 drafts to `src/content/posts/`
- [ ] All `src/lib/media/` unit tests pass (`pnpm test`); follow pattern in `src/lib/auth/session.test.ts`

---

## Architecture

```
Input URL
    ↓
src/lib/media/detect.ts           # youtube | podcast-rss | podcast-audio
    ↓
src/lib/media/transcript/
├── youtube.ts                    # youtube-transcript (HTTP, works CLI + Workers)
│                                 # CLI fallback: yt-dlp audio → faster-whisper
├── podcast.ts                    # rss-parser → enclosure URL + metadata
└── whisper.ts                    # transcribeLocal() | transcribeWorkersAI()
    ↓
src/lib/media/analyzer.ts         # 3-pass Claude analysis
    ↓
src/lib/media/generator.ts        # Markdown + frontmatter assembly
    ↓
src/lib/media/templates/
├── deep-analysis.ts
└── summary.ts
    ↓
CLI: src/content/posts/<cat>/YYYY-MM-DD-<slug>.md
Web: D1 media_drafts table → pnpm media:pull → same path
```

### Environment Split

| Concern | CLI | Web (Workers) |
|---------|-----|---------------|
| YouTube captions | `youtube-transcript` | `youtube-transcript` |
| Audio fallback | yt-dlp + `faster-whisper` (local) | CF Workers AI `whisper-large-v3-turbo` (audio ≤ 50MB) |
| Podcast RSS | `rss-parser` | `rss-parser` |
| Claude calls | `new ChatAnthropic({ model })` direct | `new ChatAnthropic({ model })` direct |
| Auth | `X-Media-Secret` header (env `MEDIA_CLI_SECRET`) | cookie + `verifySession` (matches `src/pages/api/embed/sync.ts:5–9`) |
| Draft output | Write to `src/content/posts/` | Save to D1 `media_drafts` |

---

## Implementation Steps

### Step 1 — D1 Migration (`migrations/0003_media_drafts.sql`)

```sql
CREATE TABLE IF NOT EXISTS media_drafts (
  id TEXT PRIMARY KEY,               -- nanoid
  url TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,             -- full markdown including frontmatter
  status TEXT NOT NULL DEFAULT 'pending',  -- pending | approved | exported
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE UNIQUE INDEX idx_media_drafts_slug ON media_drafts(slug);
```

### Step 2 — Shared Types (`src/lib/media/types.ts`)

```typescript
export type MediaType = 'youtube' | 'podcast-rss' | 'podcast-audio';

export interface MediaSource {
  url: string;
  type: MediaType;
  title: string;
  description?: string;
  duration?: number;           // seconds
  publishedAt?: Date;
  author?: string;
  thumbnailUrl?: string;
  chapters?: Array<{ title: string; startTime: number }>;
}

export interface TranscriptSegment {
  text: string;
  startTime: number;           // seconds
  endTime: number;
}

export interface MediaAnalysis {
  source: MediaSource;
  transcript: TranscriptSegment[];
  themes: string[];
  keyQuotes: string[];
  conceptMap: Record<string, string[]>;
  summary: string;
}

export interface GenerateOptions {
  style?: 'deep' | 'summary';
  category?: string;            // must be in VALID_CATEGORIES allowlist
  sourceLang?: string;          // Whisper source language hint, default 'zh'
  draft?: boolean;
  forceWhisper?: boolean;
  force?: boolean;              // overwrite existing slug
}

export const VALID_CATEGORIES = ['ai', 'tech', 'product', 'life', 'travel', 'education', 'marketing'] as const;
export type Category = typeof VALID_CATEGORIES[number];
```

Note: `VALID_CATEGORIES` is read at runtime from existing `src/content/posts/` subdirectories (CLI path); the const above is the fallback default.

### Step 3 — URL Detection (`src/lib/media/detect.ts`)

- `youtube.com/watch` or `youtu.be/` → `'youtube'`
- URL ending `.mp3` / `.m4a` / `.ogg` / `.wav` → `'podcast-audio'`
- Otherwise: HEAD request → if `Content-Type: audio/*` → `'podcast-audio'`; else fetch + parse XML `<rss>` tag → `'podcast-rss'`

### Step 4 — YouTube Transcript (`src/lib/media/transcript/youtube.ts`)

1. `youtube-transcript` package → `TranscriptSegment[]`
2. On failure (no captions): if `forceWhisper` is true → call `whisper.ts`; else throw `NoTranscriptError` with message "YouTube 沒有自動字幕，請加 --force-whisper 使用本地轉錄"
3. Video metadata via YouTube oEmbed (no API key): `https://www.youtube.com/oembed?url=<url>&format=json` → `title`, `author_name`, `thumbnail_url`

### Step 5 — Podcast Transcript (`src/lib/media/transcript/podcast.ts`)

1. `rss-parser` → find first episode with `enclosure.url`; extract title, pubDate, description
2. HEAD request to audio URL → check `Content-Length` header. If missing, stream 1KB to estimate → extrapolate
3. If audio > **50MB** → throw `AudioTooLargeError` with message showing actual size + "Workers 路徑請用 CLI"
4. Download audio → temp file (CLI) or `ArrayBuffer` (Workers) → call `whisper.ts`

### Step 6 — Whisper Abstraction (`src/lib/media/transcript/whisper.ts`)

Two implementations sharing the `TranscriptSegment[]` return type:

```typescript
// CLI: spawn faster-whisper Python binary
// sourceLang = Whisper source language hint (e.g. 'en' for English podcast)
export async function transcribeLocal(
  audioPath: string,
  sourceLang = 'zh'
): Promise<TranscriptSegment[]>

// Workers: CF Workers AI whisper-large-v3-turbo
// audio = ArrayBuffer of the raw mp3/m4a file (≤ 50MB)
export async function transcribeWorkersAI(
  audio: ArrayBuffer,
  ai: Ai,
  sourceLang = 'zh'
): Promise<TranscriptSegment[]>
```

**API contracts (verified from CF docs):**
- `@cf/openai/whisper` (old): `audio: Array.from(new Uint8Array(buf))` — number[]
- `@cf/openai/whisper-large-v3-turbo` (new, use this): `audio: Buffer.from(buf).toString('base64')` — base64 string
  ```typescript
  await env.AI.run('@cf/openai/whisper-large-v3-turbo', {
    audio: Buffer.from(audioBuffer).toString('base64'),
    language: sourceLang,
  });
  ```

**CLI startup check:** If `faster-whisper` not found on PATH → print install guide and exit 1:
```
faster-whisper not found. Install with:
  pip install faster-whisper
  # or: brew install uv && uv tool install faster-whisper
```

### Step 7 — AI Analyzer (`src/lib/media/analyzer.ts`)

3-pass Claude analysis. Uses `ChatAnthropic` directly (does **not** reuse `src/lib/rag/model.ts` factory which only supports a single configured model):

```typescript
import { ChatAnthropic } from '@langchain/anthropic';
const haiku  = new ChatAnthropic({ model: 'claude-haiku-4-5-20251001',  maxTokens: 2048 });
const sonnet = new ChatAnthropic({ model: 'claude-sonnet-4-6', maxTokens: 8192 });
```

**Pass 1 — Structure extraction** (haiku, fast):
- Input: transcript text (chunked if > 8000 tokens — chunk by `chapters[]` first, then by 2000-token windows if no chapters)
- Output: `{ themes: string[], keyQuotes: string[], mainSpeakers: string[], topicBreaks: number[] }`

**Pass 2 — Deep analysis** (sonnet):
- Input: transcript + Pass 1 output + template system prompt
- Output: per-theme analysis, concept map edges, editorial commentary

**Pass 3 — Blog post generation** (sonnet):
- Input: all above + `structureHint` from template
- Output: full markdown string including YAML frontmatter block

### Step 8 — Category Allowlist (`src/lib/media/categories.ts`)

```typescript
// Read actual subdirs at runtime (CLI); fallback const for Workers
export async function getValidCategories(postsDir: string): Promise<string[]> {
  const dirs = await fs.readdir(postsDir, { withFileTypes: true });
  return dirs.filter(d => d.isDirectory()).map(d => d.name);
}
```

- CLI: call with `path.join(process.cwd(), 'src/content/posts')`
- Auto-detect from themes: map common keywords → category (e.g. `['llm','gpt','ai']` → `'ai'`)
- If auto-detect result not in allowlist → default to `'ai'` + warn user

### Step 9 — Generator (`src/lib/media/generator.ts`)

Takes `MediaAnalysis` + `GenerateOptions` → returns:
- `content: string` (full markdown with YAML frontmatter)
- `slug: string` (YYYY-MM-DD-kebab-from-title, max 60 chars)
- `filepath: string` (`src/content/posts/<category>/YYYY-MM-DD-<slug>.md`)

Duplicate slug check (CLI path):
```typescript
if (await fs.exists(filepath) && !options.force) {
  throw new DuplicateSlugError(`${filepath} 已存在，加 --force 覆寫`);
}
```

### Step 10 — Post-Generation Validation (`src/lib/media/validate.ts`)

Run after file is written (CLI) or before saving to D1 (Web):

```typescript
export async function validatePost(filepath: string): Promise<ValidationResult> {
  // 1. Parse frontmatter with gray-matter (already in devDeps)
  // 2. Verify required fields: title, date, category, tags
  // 3. Check category is in allowlist
  // 4. Run: execa('pnpm', ['astro', 'check']) — capture errors related to this file
  // 5. Run: execa('pnpm', ['check:references']) — catch broken internal links
  // Returns: { ok: boolean, errors: string[] }
}
```

On validation failure: retry Pass 3 once with errors appended to prompt ("Fix these issues: …"). If still failing, write file with `draft: true` and prepend `<!-- VALIDATION ERRORS: ... -->` comment.

### Step 11 — CLI Script (`scripts/media-to-post.ts`)

Uses `@clack/prompts` (interactive) + `ora` (spinners).

**Auth for API calls:** `X-Media-Secret` header → validates against `MEDIA_CLI_SECRET` env var (set in `.env.local`). Matches pattern in `src/pages/api/crawl/sync.ts:17`.

**Interactive flow (no flags):**
```
◆ Media URL 已偵測：YouTube — "Keith Rabois on Barrels..."
◆ 分類？  › ai ✓ / tech / product / life  (從現有資料夾讀取)
◆ 風格？  › deep（深度拆解） / summary（重點整理）
◆ 儲存為草稿？ › 是（draft: true）/ 否

⠸ 抓取 YouTube 字幕...         ✔ 完成（12,340 字）
⠸ AI 分析主題與結構...          ✔ 完成（3 主題）
⠸ 生成繁體中文深度文章...       ✔ 完成（4,200 字）
⠸ 驗證內容...                  ✔ astro check OK / check:references OK
⠸ 寫入檔案...                  ✔ 完成

────────────────────────────────
  標題   縱橫古時候與 AI 時代...
  Slug   2026-05-03-keith-rabois-barrels
  字數   4,200 字 ・ 預估閱讀 14 分鐘
  路徑   src/content/posts/ai/2026-05-03-keith-rabois-barrels.md
────────────────────────────────
  ✔ 已開啟草稿 (使用 $EDITOR / code / open)
```

**Flag mode:**
```bash
pnpm media <url> --style deep --category ai --draft --no-open --force
pnpm media:pull                      # export approved D1 drafts to local files
```

Add to `package.json`:
```json
"media": "tsx scripts/media-to-post.ts",
"media:pull": "tsx scripts/media-pull.ts"
```

Editor open priority: `$EDITOR` env → `code` (VS Code) → `open` (macOS default).

### Step 12 — Admin Web Page (`src/pages/admin/media.astro`)

Auth: validates session cookie via `verifySession` (matches `src/pages/api/embed/sync.ts:5–9`). Redirects to `/api/auth/login` if unauthenticated.

Features:
1. URL input + style/category dropdowns (category list fetched from `/api/media-categories`)
2. Submit → EventSource to `/api/media-ingest` SSE stream → real-time progress steps
3. On `complete` event: left/right split — left textarea (editable markdown), right rendered preview (use existing Astro markdown pipeline via iframe or `/api/preview`)
4. **Save Draft** button → POST `/api/media-drafts` → stores to D1 `media_drafts`
5. **Drafts list** section — shows pending/approved drafts; approve button sets `status = 'approved'`

### Step 13 — Admin API Endpoints

**`src/pages/api/media-ingest.ts`** — SSE stream
```
POST /api/media-ingest
Cookie: session=<token>            # verifySession
{ "url": "...", "style": "deep", "category": "ai", "sourceLang": "en" }

event: progress
data: {"step": "transcript", "pct": 20, "message": "抓取 YouTube 字幕中..."}

event: complete
data: {"slug": "...", "content": "<full markdown>", "frontmatter": {...}}
```

**`src/pages/api/media-drafts.ts`** — CRUD for D1 drafts
```
POST   /api/media-drafts       { content, slug, title, category } → { id }
PATCH  /api/media-drafts/:id   { content?, status? }
GET    /api/media-drafts        → [{ id, slug, title, status, created_at }]
```

**`scripts/media-pull.ts`** — CLI export
```typescript
// Fetch approved drafts from D1 (via wrangler d1 execute or API)
// Write each to src/content/posts/<category>/<slug>.md
// Mark as status='exported'
```

Feature flag: All `/api/media-*` endpoints return 404 if `MEDIA_INGEST_ENABLED` not set.

---

## Dependencies to Add

```bash
pnpm add youtube-transcript rss-parser @clack/prompts ora
# yt-dlp-wrap removed — use node:child_process directly to spawn yt-dlp binary
```

**System prerequisites (CLI only):**
```bash
brew install yt-dlp
pip install faster-whisper        # Python 3.8+; or: uv tool install faster-whisper
```

**`wrangler.jsonc` additions:**
```json
"vars": { "MEDIA_INGEST_ENABLED": "true" }
```
```bash
wrangler secret put MEDIA_CLI_SECRET
```

---

## Risks and Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| YouTube rate-limits `youtube-transcript` | Medium | Retry ×3 with 1s backoff; cache raw transcript to `/tmp/<videoId>.json` |
| `faster-whisper` not installed | Medium | CLI startup check → clear error with install guide; exit 1 |
| Audio > 50MB on Workers path | High | `Content-Length` pre-check; clear error "請用 CLI 處理大型音訊" |
| Workers CPU limit (30s free / 5min paid) | Medium | Web track: only YouTube captions + 2-pass Claude (skip Pass 3 chunking); add SSE keepalive heartbeat every 20s |
| LLM hallucination in generated post | Low-Medium | Validate with `check:references`; prepend disclaimer comment on failure; `draft: true` default |
| Duplicate slug on re-run | Low | Slug existence check; `--force` flag to overwrite |
| Category not in allowlist | Low | Auto-remap to nearest match or `'ai'`; warn in CLI output |
| `gray-matter` parse failure on generated frontmatter | Low | Validate with `gray-matter` in `validate.ts` before writing |

---

## Verification Steps

1. `pnpm media "https://www.youtube.com/watch?v=8QSNNvM7yEU"` → creates `src/content/posts/ai/2026-05-03-*.md` with valid frontmatter
2. `pnpm astro check` → exit 0
3. `pnpm check:references` → exit 0
4. `pnpm test` → all tests pass
5. `pnpm dev` → visit post URL → renders correctly, no broken links
6. Login to `/admin/media` → paste URL → SSE progress completes → draft saved to D1
7. `pnpm media:pull` → D1 approved draft appears in `src/content/posts/`

---

## Out of Scope (Phase 2)

- Transcript embedding into existing Vectorize index for RAG
- OG image generation for media-sourced posts (existing pipeline handles on next build)
- Multi-episode series posts
- Video frame / screenshot capture
- Auto-publish to social media
- RAGAS evaluation of generated content

---

## Files to Create / Modify

**New files:**
- `migrations/0003_media_drafts.sql`
- `src/lib/media/types.ts`
- `src/lib/media/detect.ts`
- `src/lib/media/categories.ts`
- `src/lib/media/validate.ts`
- `src/lib/media/transcript/youtube.ts`
- `src/lib/media/transcript/podcast.ts`
- `src/lib/media/transcript/whisper.ts`
- `src/lib/media/analyzer.ts`
- `src/lib/media/generator.ts`
- `src/lib/media/templates/deep-analysis.ts`
- `src/lib/media/templates/summary.ts`
- `scripts/media-to-post.ts`
- `scripts/media-pull.ts`
- `src/pages/admin/media.astro`
- `src/pages/api/media-ingest.ts`
- `src/pages/api/media-drafts.ts`
- `src/lib/media/detect.test.ts`
- `src/lib/media/generator.test.ts`
- `src/lib/media/transcript/youtube.test.ts`

**Modified files:**
- `package.json` — add `media`, `media:pull` scripts + new deps
- `wrangler.jsonc` — add `MEDIA_INGEST_ENABLED` var
- `migrations/` — new migration file

---

## Changelog (vs. initial draft)

- **[FIXED C1]** Whisper API format: clarified `whisper` (old) uses `number[]`, `whisper-large-v3-turbo` (new) uses base64 string; removed contradiction
- **[FIXED C2]** Workers file persistence: replaced `/api/media-save` (寫檔不會持久化到 git repo — Workers 雖支援 `node:fs` 讀取 bundle 內靜態資源，但 `src/content/posts/` 不在 Worker bundle 裡，且任何寫入在 request 結束後即消失) with D1 `media_drafts` table + `pnpm media:pull` CLI export
- **[FIXED C3]** Auth: Web uses `verifySession` cookie (matches `src/pages/api/embed/sync.ts`); CLI uses `X-Media-Secret` header (matches `src/pages/api/crawl/sync.ts` pattern)
- **[FIXED M1]** Model factory: use `ChatAnthropic` directly with explicit model strings; removed false claim of reusing `src/lib/rag/model.ts`
- **[FIXED M2]** Audio size limit: single threshold **50MB** across all paths; removed 10MB/25MB inconsistencies
- **[FIXED M3]** Category allowlist: `getValidCategories()` reads from `src/content/posts/` subdirs at runtime
- **[FIXED M4]** Post-generation validation: explicit `validate.ts` step runs `astro check` + `check:references` before CLI exits
- **[FIXED M5]** Removed `yt-dlp-wrap` dep: use `node:child_process` directly
- **[FIXED M6]** `sourceLang` clarified as Whisper **source language hint**, not output language
- **[ADDED]** Duplicate slug detection with `--force` override
- **[ADDED]** SSE keepalive heartbeat every 20s for Workers CPU limit
- **[ADDED]** `scripts/media-pull.ts` for D1 → local file export
