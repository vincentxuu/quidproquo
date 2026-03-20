# quidproquo RAG System Design

**Date:** 2026-03-20
**Status:** Approved
**Project:** quidproquo (personal blog at quidproquo.cc)
**Stack:** LangGraph.js (`@langchain/langgraph ^0.2`) + Cloudflare Workers (nodejs_compat) + Langfuse Cloud
**LLM:** Claude claude-sonnet-4-6 via Anthropic API (all agent nodes + LLM-as-judge)
**Embedding model:** `@cf/baai/bge-large-en-v1.5` (1024 dimensions) via Workers AI
**Reranker model:** `@cf/baai/bge-reranker-base` via Workers AI
**Vision model:** `@cf/llava-hf/llava-1.5-7b-hf` via Workers AI
**Image gen model:** `@cf/black-forest-labs/flux-1-schnell` via Workers AI (async, not inline)

**Required packages:**
```
@langchain/langgraph @langchain/anthropic @anthropic-ai/sdk langfuse
```

---

## 1. Overview

Build a production-grade agentic RAG system on top of the existing quidproquo blog infrastructure. The system enables visitors and the owner to ask questions about blog content, external documentation, and custom uploaded documents. Responses include text, images, links, and Mermaid/AI-generated diagrams with full source attribution.

**Key principles (from Claude Certified Architect guide):**
- Programmatic enforcement over prompt-based compliance (auth, rate limiting, tool validation)
- Structured provenance on every retrieved chunk
- Parallel subagent execution for independent tasks
- Context compression before handoff between agents
- Dynamic task decomposition based on query complexity

---

## 2. Users & Auth

| User | Identification | Quota |
|------|---------------|-------|
| Owner | Session cookie (KV) | Unlimited |
| Visitor | IP-based | N queries/day (configurable, default 5) |

**Login flow:**
- `/login` page → verify `ADMIN_PASSWORD` secret → write session token to `SESSION` KV (TTL 7 days) → Set-Cookie

**Rate limiting:**
- Key: `rate:{ip}:{YYYY-MM-DD}` in `RATE` KV namespace
- Programmatic hook on every `/api/chat` request, before agent invocation
- 429 response includes time-until-reset
- Abuse pattern detection: rapid fire requests → IP block (stored in D1 `ip_blocks` table)

---

## 3. Knowledge Sources

| Source | Table | Vectorize type |
|--------|-------|---------------|
| Blog posts (Markdown) | `posts` → `post_chunks` | `type: 'post'` |
| External crawled docs | `doc_chunks` | `type: 'doc'` |
| Custom uploaded docs | `custom_docs` | `type: 'custom'` |

### 3.1 Custom Documents

Three ingestion methods:
- **Upload file** – PDF / Markdown / TXT → store in R2 → chunk + embed
- **Paste text** – content stored in `custom_docs.content`
- **URL** – crawl via existing browser-rendering pipeline → chunk + embed

---

## 4. Embedding Pipeline

### 4.1 Chunking

| Parameter | Default | Configurable via Admin |
|-----------|---------|----------------------|
| `chunk_size` | 2000 chars | ✅ |
| `chunk_overlap` | 200 chars | ✅ |
| `chunk_strategy` | `by_heading` | ✅ (`by_heading` / `sliding_window` / `fixed_size`) |

**Contextual Retrieval (Anthropic technique):**
Before embedding, prepend each chunk with a context sentence describing the parent document:
```
"This chunk is from a blog post titled '{title}' in category '{category}', published {date}. "
+ chunk_content
```
This significantly improves recall for out-of-context chunks.

**Sentence window retrieval:**
Store the chunk's surrounding context (±1 paragraph) in metadata. Return the wider window to the agent, but index only the core chunk.

### 4.2 Image Handling (text-first)

1. Scan chunk for `![alt](url)` syntax
2. Fetch image from R2 / CDN
3. Call Workers AI Vision model → generate description text
4. Append description to chunk content before embedding
5. Store `image_url` in Vectorize metadata
6. Cache description in `post_chunks.image_description` (D1) — Vision model not re-called on re-embed

**Relative URL resolution:** All image URLs normalized to absolute (`https://quidproquo.cc/...`) at chunk time.

### 4.3 Link Handling

1. Scan chunk for `[text](url)` syntax
2. Store as `links: ["{\"text\":\"...\",\"url\":\"...\"}"]` (JSON-stringified array) in Vectorize metadata
3. Links travel with the chunk — no separate embedding

### 4.4 Vectorize Metadata Schema

```ts
{
  type: 'post' | 'doc' | 'custom',
  chunk_id: string,            // sha256(source_key + chunk_index)[:16]
  chunk_index: number,
  // post-specific
  slug?: string,
  title?: string,
  category?: string,
  lang?: string,
  date?: string,               // ISO date — used for temporal reranking
  // doc/custom-specific
  source_url?: string,
  source_name?: string,
  // content enrichment
  // NOTE: Vectorize metadata only supports string|number|boolean values.
  // Arrays are stored as JSON-stringified strings and parsed at retrieval time.
  images: string,              // JSON.stringify(string[]) — absolute image URLs
  links: string,               // JSON.stringify({text,url}[]) — hyperlinks
  image_description?: string,  // Vision model output
  sentence_window?: string,    // ±1 paragraph context
}
```

### 4.5 Vectorize Update Strategy

Vectorize has no true upsert. On every sync:
1. Delete vectors by chunk_id (deterministic: sha256 of source_key + chunk_index)
2. Re-insert with fresh embeddings

**`chunk_id` formula by source type:**
- post: `sha256(slug + '::' + chunk_index)[:16]`
- doc: `sha256(source_url + '::' + chunk_index)[:16]`
- custom: `sha256(custom_doc_id + '::' + chunk_index)[:16]`

**Note on Web Crypto API:** `crypto.subtle.digest` returns `ArrayBuffer`. Convert to hex with:
```ts
const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
const hex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,'0')).join('')
return hex.slice(0, 16)
```

### 4.6 Trigger

- `pnpm sync` auto-triggers embedding after D1 sync
- Admin panel: manual re-embed (all / posts / docs / custom)
- Progress streamed via SSE

### 4.7 Abstract-first Index

Maintain a separate Vectorize namespace (`VECTORIZE_ABSTRACT`) for document summaries only.

**Population (during embedding pipeline):**
1. For posts: use `description` + `tldr` frontmatter fields as the summary. If absent, call Workers AI to generate a 2-sentence summary from the full content.
2. For doc_chunks: use the first 500 chars of the first chunk per `source_url`.
3. For custom_docs: use `name` + first 500 chars of content.
4. Embed the summary text → insert into `VECTORIZE_ABSTRACT` with same `chunk_id` + `type` metadata.

**Usage at query time:** Research first searches `VECTORIZE_ABSTRACT` → if relevant hits found, fetch full chunks from `VECTORIZE_INDEX` by those `chunk_id`s.

---

## 5. LangGraph Agentic Pipeline

### 5.1 Graph Structure

```
START
  └─→ Planner (dynamic decomposition)
        ├─→ Clarifier → [await user] → Planner (re-plan)
        └─→ [parallel] Research + (if needed) Abstract-Search
              ├─→ PostToolUse Hook: normalize + compress results
              ├─→ Summarizer         (if query = "summarize article X")
              ├─→ Code Explainer     (if query contains code)
              ├─→ Diagram Agent      (if visual explanation needed)
              └─→ Writer
                    └─→ Critic (answer grounding check)
                          ├─→ Research (retry with targeted query, max 2x)
                          └─→ Related Posts → END
```

### 5.2 Agent Definitions

#### Planner
- Analyzes query intent: factual / summary / code / comparison / exploratory
- Detects query language (respond in same language)
- Decides routing: Clarifier needed? Which specialists?
- For complex queries: generates explicit sub-tasks list
- For simple queries: routes directly to Research
- Uses step-back prompting: abstracts specific question to general before planning
- Outputs structured plan: `{intent, needs_clarification, subtasks[], specialists[]}` — writes `language` to top-level `state.language`, not into `plan`

#### Clarifier
- Only activates when Planner flags `needs_clarification: true`
- Does NOT ask if query is reasonably interpretable
- Streams question to user via SSE, then calls `interrupt()` (LangGraph human-in-the-loop)
- Graph suspends and saves state to D1 checkpointer
- SSE endpoint handles two flows:
  - (1) New message: `graph.stream({ messages: [...] }, { configurable: { thread_id } })`
  - (2) Resume after interrupt (user answered Clarifier): `graph.stream(new Command({ resume: userReply }), { configurable: { thread_id } })`
- Client stores `interrupted: true` flag in localStorage after receiving Clarifier question; next submit uses the resume flow
- Client stores `thread_id` in localStorage; after a Clarifier interrupt the UI shows the question and awaits user input (no spinner)

#### Research (parallel tool execution)
Emits multiple tool calls in a single response for independent searches:

**Tools:**
- `search_blog_posts(query, filters?)` — Vectorize, type=post, optional metadata filters (category, lang, date_range)
- `search_docs(query, filters?)` — Vectorize, type=doc|custom
- `search_abstract_index(query)` — summary-level search first
- `get_post_detail(slug)` — full post from D1
- `find_images(query)` — Vectorize metadata image search
- `extract_links(chunk_ids[])` — extract link metadata from chunks
- `web_search(query)` — CRAG fallback: if retrieved chunks quality score < threshold, search web

**Tool naming:** All tool names are explicit and domain-specific to reduce LLM tool-selection errors.

**Tool result validation:** Input validated before call (e.g., slug exists before `get_post_detail`). Invalid inputs return structured error, not exception.

**Per-session tool result caching:** Same query within session hits cache, not Vectorize.

**Max iterations:** Research agent has max 5 tool calls per invocation to prevent runaway loops.

#### PostToolUse Hook (dedicated graph node)
Implemented as a dedicated LangGraph node (`normalize_results`) placed between Research and the specialist nodes — not a LangChain callback. Wired as: `graph.addEdge('research', 'normalize_results')`.

1. Parse JSON-stringified `images` and `links` from Vectorize metadata back to typed arrays
2. Normalize formats (dates → ISO, URLs → absolute, encoding)
3. Extract `{claim, evidence_excerpt, source_url, chunk_id, date, images[], links[]}` — `claim` is the first sentence of the chunk (heuristic, no extra LLM call)
4. Score chunk relevance (0–1) using cosine similarity between query embedding and chunk text
5. Position-aware ordering: sort by relevance descending, then move top-3 to front and back of the array (lost-in-the-middle mitigation)
6. If max relevance score < 0.4 → set `state.needs_web_search = true` for CRAG trigger
7. Writes normalized results to `state.search_results` using LangGraph Annotation reducer: `{ reducer: (a, b) => [...a, ...b] }` (required for parallel Research + Abstract-Search fan-in)

#### Summarizer
- Activated for "summarize", "什麼是", "介紹" type queries
- Calls `get_post_detail` for full content
- Uses progressive summarization for long posts

#### Code Explainer
- Activated when query or retrieved chunks contain code blocks
- Detects programming language
- Explains step by step with inline references to post source

#### Diagram Agent
Two modes, decided per-query:

| Mode | Technology | Use case |
|------|-----------|---------|
| **Mermaid** | LLM generates Mermaid code → client renders | Architecture, flow, sequence diagrams |
| **AI Image** | Workers AI `flux-1-schnell` → store in R2 → return URL. **Async:** dispatched via Cloudflare Queue or background fetch; SSE sends a placeholder then a `diagram_ready` event when done. Do not block SSE stream inline. | Conceptual illustrations |

Planner decides if diagram is needed. Diagram Agent decides which type.

#### Writer
- Assembles Research results into final response
- Every claim linked to source chunk: `[claim](source_url)`
- Images embedded as Markdown: `![description](image_url)`
- Mermaid blocks wrapped in ` ```mermaid ` fences
- Detects and renders tables where appropriate
- Coverage gap annotation: explicitly notes if topic exceeds blog's coverage
- Temporal relevance: notes if primary sources are old (>1 year) for technical topics
- Responds in detected query language

#### Critic
- Evaluates Writer's draft:
  1. **Answer grounding:** every claim traceable to a chunk? (if not → flag as ungrounded)
  2. **Coverage:** does it answer the actual question?
  3. **Confidence score:** 0–1
- If confidence < 0.6 OR ungrounded claims found → retry Research with targeted follow-up query
- **`iteration` incremented by Critic** before routing back to Research
- Max 2 retries
- If still low confidence/ungrounded after retries → Writer adds explicit disclaimer
- **LLM-as-judge:** uses Claude claude-sonnet-4-6 to evaluate Claude's output with structured rubric
- Conditional edge (see Section 5.3): routes back to Research if `confidence < 0.6 OR ungrounded_claims.length > 0` AND `iteration < 2`

#### Related Posts
- Queries Vectorize with conversation summary
- Returns 2–3 related posts with title + slug + one-line description
- Appended to response as "You might also like"

### 5.3 Graph Structure (LangGraph.js wiring)

```ts
// Phase 1 graph (no abstract_search, MemorySaver)
graph.addConditionalEdges('planner', (state) =>
  state.plan.needs_clarification ? 'clarifier' : 'research'
)
graph.addEdge('research', 'normalize_results')
graph.addConditionalEdges('critic', (state) =>
  state.iteration < 2 &&
  (state.critique.confidence < 0.6 || state.critique.ungrounded_claims.length > 0)
    ? 'research' : 'related_posts'
)
const graph = builder.compile({ checkpointer: new MemorySaver() })

// Phase 2+ graph (with abstract_search + D1 checkpointer)
graph.addConditionalEdges('planner', (state) =>
  state.plan.needs_clarification ? 'clarifier' : ['research', 'abstract_search']  // fan-out
)
graph.addEdge(['research', 'abstract_search'], 'normalize_results') // fan-in join
graph.addConditionalEdges('critic', (state) =>
  state.iteration < 2 &&
  (state.critique.confidence < 0.6 || state.critique.ungrounded_claims.length > 0)
    ? 'research' : 'related_posts'
)
const graph = builder.compile({ checkpointer: d1Checkpointer })
```

**`abstract_search` node** is introduced in **Phase 2** (not Phase 3). It enables abstract-first retrieval using `VECTORIZE_ABSTRACT`.

### 5.4 LangGraph State Definition

```ts
// Use Annotation.Root — plain interface cannot be passed to the builder
import { Annotation, MessagesAnnotation } from '@langchain/langgraph'

const StateAnnotation = Annotation.Root({
  // messages with append reducer
  messages: Annotation<Message[]>({ reducer: (a, b) => [...a, ...b], default: () => [] }),
  thread_id: Annotation<string>(),
  language: Annotation<string>({ default: () => 'zh-TW' }),
  conversation_summary: Annotation<string | undefined>(),

  // planner output — last-write-wins (default reducer)
  plan: Annotation<{ intent: string; needs_clarification: boolean; subtasks: string[]; specialists: string[] }>(),
  needs_web_search: Annotation<boolean>({ default: () => false }),

  // research — append reducer for parallel fan-in from research + abstract_search
  search_results: Annotation<SearchResult[]>({ reducer: (a, b) => [...a, ...b], default: () => [] }),
  coverage_gaps: Annotation<string[]>({ default: () => [] }),

  // generation
  diagram: Annotation<{ type: 'mermaid' | 'image'; content: string } | undefined>(),
  draft: Annotation<string>(),
  critique: Annotation<{ confidence: number; ungrounded_claims: string[]; gaps: string[] }>(),
  iteration: Annotation<number>({ default: () => 0 }),

  // output
  related_posts: Annotation<{ title: string; slug: string; description: string }[]>({ default: () => [] }),
  final_response: Annotation<string>(),

  // meta
  langfuse_trace_id: Annotation<string>(),
  token_usage: Annotation<{ input: number; output: number }>(),
})
type GraphState = typeof StateAnnotation.State
```

### 5.5 Graph State (conceptual — see Section 5.4 for actual Annotation.Root definition)

```ts
// Conceptual shape only — see StateAnnotation above for LangGraph-compatible definition
interface GraphState {
  // conversation
  messages: Message[]
  thread_id: string
  language: 'zh-TW' | 'en' | string
  conversation_summary?: string  // progressive summarization for long threads

  // planner output
  plan: {
    intent: string
    needs_clarification: boolean
    subtasks: string[]
    specialists: string[]
  }
  needs_web_search: boolean  // set by normalize_results when max relevance < 0.4

  // research
  search_results: {
    claim: string
    evidence_excerpt: string
    source_url: string
    chunk_id: string
    date: string
    relevance_score: number
    images: string[]
    links: { text: string; url: string }[]
  }[]
  coverage_gaps: string[]

  // generation
  diagram?: { type: 'mermaid' | 'image'; content: string }
  draft: string
  critique: {
    confidence: number
    ungrounded_claims: string[]
    gaps: string[]
  }
  iteration: number

  // output
  related_posts: { title: string; slug: string; description: string }[]
  final_response: string

  // meta
  langfuse_trace_id: string
  token_usage: { input: number; output: number }
}
```

### 5.5 D1 Checkpointer

Custom implementation of `BaseCheckpointSaver` (not SqliteSaver — no filesystem on Workers).
Implements: `getTuple`, `list`, `put`, `putWrites`.
DDL: see Section 13 (`checkpoints` table, labelled migration 0003 Phase 2).
Supports: save, load, list checkpoints per thread, prune old checkpoints.

**Progressive summarization:** When `messages` exceeds 8000 tokens, summarize older turns into `state.conversation_summary` and drop raw messages. `conversation_summary` is prepended as a system context when resuming.

**Phase 1 note:** Phase 1 uses `MemorySaver` (in-memory, single-turn only). D1 checkpointer and `thread_id`-based multi-turn conversation moves to Phase 2. Phase 1 `thread_id` in request body is accepted but not persisted.

**Manifest-based crash recovery:** Each agent step writes a manifest entry before executing. On crash/timeout, can resume from last completed step.

---

## 6. Advanced RAG Techniques

| Technique | Implementation |
|-----------|---------------|
| **HyDE** | Planner generates hypothetical answer → embed it → use for Vectorize search |
| **Query Rewriting** | Planner rewrites colloquial query to search-optimized form |
| **Multi-query** | Research generates 3 query variants → parallel search → RRF merge |
| **Hybrid Search** | Vectorize (semantic) + D1 FTS/fts5 (BM25 keyword) → combined ranking. Requires `CREATE VIRTUAL TABLE` in Section 13. |
| **Reranker** | CF Workers AI cross-encoder reranks top-20 chunks to top-5 |
| **Semantic Cache** | Query embedding compared to cached queries (Vectorize); cosine > 0.92 → return cached response |
| **RAG Fusion / RRF** | Merge multi-query results using Reciprocal Rank Fusion |
| **Step-back Prompting** | Planner abstracts specific question before planning |
| **Temporal Reranking** | Posts with `date` closer to now ranked higher for "latest" queries |
| **CRAG** | If retrieved chunk quality < threshold → fallback to web search |
| **Adaptive RAG** | Simple queries: no retrieval (LLM answers directly). Medium: single search. Complex: full agent loop |
| **Abstract-first** | Search summary index before fetching full chunks |
| **Answer Grounding** | Critic verifies every claim has a source chunk |

---

## 7. Semantic Cache

Uses a dedicated Vectorize namespace (`VECTORIZE_CACHE`):

1. Embed incoming query
2. Search cache index (cosine similarity)
3. If top result score > 0.92 → return cached response (with cache indicator in UI)
4. Otherwise → run full agent → store `{query_embedding, response, thread_id, created_at}` in cache
5. Cache TTL: 24 hours. Store `created_at` (Unix timestamp) in Vectorize metadata. Scheduled Worker cron (reuse existing or add `0 3 * * *` daily) queries `VECTORIZE_CACHE` for vectors with `created_at < now - 86400`, then calls `vectorize.deleteByIds([...])` in batches of 100.

---

## 8. Guardrails & Safety

| Guard | Implementation |
|-------|---------------|
| **Input sanitization** | Strip prompt injection patterns before agent invocation |
| **Output PII filtering** | Scan response for email/phone patterns → redact |
| **Cost per query cap** | If token_usage > 10,000 → abort and return partial response |
| **Abuse detection** | > 20 requests/hour from same IP → block (D1 `ip_blocks`) |
| **Off-topic guard** | Planner classifies off-topic queries (e.g., weather) → polite decline without agent invocation |
| **Circuit breaker** | If Vectorize or Workers AI errors > 3 in 60s → graceful degradation mode (text-only, no retrieval) |

---

## 9. Chat API

**Endpoint:** `POST /api/chat`
**Auth middleware** runs before agent (programmatic, not prompt-based)
**Response:** SSE stream

SSE event types:
```
event: agent_step    data: {"agent": "Research", "status": "started"}
event: agent_step    data: {"agent": "Research", "status": "completed", "chunks_found": 7}
event: token         data: {"text": "..."}
event: image         data: {"url": "...", "alt": "..."}
event: diagram       data: {"type": "mermaid", "code": "..."}
event: sources       data: [{"title": "...", "url": "...", "slug": "..."}]
event: related       data: [{"title": "...", "slug": "...", "description": "..."}]
event: done          data: {"usage": {"input": 800, "output": 300}, "confidence": 0.87}
event: error         data: {"type": "rate_limit" | "circuit_open" | "low_confidence", "message": "..."}
```

**Thread management:**
- `thread_id` passed in request body (client generates UUID on first message, stores in localStorage)
- Enables multi-turn conversation via D1 checkpointer

---

## 10. Chat UI (`/chat`)

**Framework:** Astro page + React island (interactive parts)

**Layout:**
```
┌─────────────────────────────────────┐
│  navbar (shared with blog)           │
├─────────────────────────────────────┤
│  conversation area                   │
│  ┌─────────────────────────────┐    │
│  │ 🤖 welcome + suggested Qs   │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ 👤 user message              │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ 🤖 streaming response        │    │
│  │   [agent steps indicator]    │    │
│  │   text with inline links     │    │
│  │   ![image](url)              │    │
│  │   ```mermaid diagram```      │    │
│  │ 📎 Sources: [Post A] [Doc B] │    │
│  │ 📚 Related: [Post C] [Post D]│    │
│  │ 👍 👎  [confidence: 87%]     │    │
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│  [3/5 remaining ████░░]             │
│  [input box                ] [send] │
└─────────────────────────────────────┘
```

**Features:**
- Mermaid: dynamic import, client-side render in `<div class="mermaid">`
- Agent steps: live indicator while streaming ("Searching posts...", "Analyzing...")
- 👍👎 feedback: stored in D1 `feedback` table, linked to Langfuse trace
- Suggested follow-up questions: generated by Writer, shown after response
- Adaptive response length: detect from conversation history
- Export conversation: download as Markdown
- Share link: `/chat?thread={thread_id}` (public threads only, opt-in)
- Language detection: UI adapts to query language

**Entry points:**
- `/search` → "Ask AI" button → `/chat`
- Article page → "Ask AI about this post" → `/chat?context={slug}`
- Navbar link

---

## 11. Admin Pages

**Route:** `/admin` (session-protected)

### `/admin/embed`
- Vectorize index status: vector count by type, last updated
- **Chunking config:** chunk_size, chunk_overlap, chunk_strategy (read/write from D1 `settings`)
- **Embedding config:** embedding_model, image_description toggle
- **Preview:** enter slug → see how it would be chunked
- **Trigger re-embed:** all / posts / docs / custom (SSE progress)
- **Custom documents:** upload file / paste text / add URL → manage list → single-doc re-embed / delete

### `/admin/crawl`
- List crawl targets (from D1 `crawl_targets`, not config.ts)
- Add / edit / delete targets
- Trigger crawl run → SSE progress
- Last crawl stats per target

### `/admin/chat-logs`
- List visitor conversations (IP, time, query preview, confidence score)
- Langfuse trace link per conversation
- 👍👎 feedback summary
- Filter by date / IP / confidence

### `/admin/settings`
- Visitor daily query limit
- Semantic cache threshold (default 0.92)
- CRAG web search threshold
- Agent max iterations
- Critic max retries
- Adaptive RAG thresholds (simple / medium / complex)

### `/admin/agent`
- Toggle individual agents on/off (Clarifier, Diagram, Code Explainer, etc.)
- Enable/disable specific techniques (HyDE, multi-query, reranker, etc.)
- View current GraphState schema version

### `/admin/eval`
- Golden dataset: manage test Q&A pairs
- Run evaluation → RAGAS metrics (faithfulness, relevance, groundedness)
- History of eval runs with diffs
- Shadow mode: compare current vs experimental agent config

---

## 12. Langfuse Integration

**Traces per `/api/chat` call:**
```
trace (thread_id)
├── span: Planner
├── span: Clarifier (conditional)
├── span: Research
│   ├── tool_call: search_blog_posts
│   ├── tool_call: search_docs
│   └── tool_call: web_search (conditional)
├── span: PostToolUse Hook
├── span: Diagram Agent (conditional)
├── span: Writer
│   └── generation: llm_call (model, tokens, latency)
├── span: Critic
│   └── generation: llm_call
└── span: Related Posts
```

**Metadata on each trace:**
- `userId`: `owner` or hashed IP
- `confidence`: Critic score
- `cache_hit`: boolean
- `techniques_used`: array (HyDE, multi_query, reranker, etc.)
- `feedback`: 👍/👎 updated post-response

**Config (Wrangler secrets):**
```
LANGFUSE_PUBLIC_KEY
LANGFUSE_SECRET_KEY
LANGFUSE_HOST=https://cloud.langfuse.com
```

---

## 13. D1 Schema (additions to existing)

```sql
-- migration 0002 (Phase 1)
-- Additions to existing chunk tables
ALTER TABLE post_chunks ADD COLUMN image_description TEXT;
ALTER TABLE post_chunks ADD COLUMN sentence_window TEXT;
ALTER TABLE doc_chunks ADD COLUMN image_description TEXT;
ALTER TABLE doc_chunks ADD COLUMN sentence_window TEXT;
-- Note: post_chunks.id and doc_chunks.id must equal the sha256 chunk_id (see Section 4.5).
-- Verify existing data: the sync scripts already use sha256(slug+'::'+chunk_index)[:16] as id.

-- FTS5 virtual table for hybrid search (BM25 keyword search)
-- chunk_id = sha256 hash (same as post_chunks.id / doc_chunks.id — verified above)
CREATE VIRTUAL TABLE chunks_fts USING fts5(
  content,
  chunk_id UNINDEXED,   -- sha256 ID, used to join Vectorize results
  source_type UNINDEXED -- 'post' | 'doc' | 'custom'
);

-- Populate FTS from existing chunks (run after migration)
-- post_chunks.id IS the sha256 chunk_id
INSERT INTO chunks_fts(content, chunk_id, source_type)
  SELECT content, id, 'post' FROM post_chunks;
INSERT INTO chunks_fts(content, chunk_id, source_type)
  SELECT content, id, 'doc' FROM doc_chunks;
-- custom_docs chunks are inserted into chunks_fts at ingestion time (not batch-seeded)

-- migration 0003 (Phase 2) — LangGraph D1 checkpointer
CREATE TABLE checkpoints (
  thread_id TEXT NOT NULL,
  checkpoint_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (thread_id, checkpoint_id)
);

-- Conversation logs (admin view)
CREATE TABLE chat_logs (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL,
  ip TEXT,
  is_admin INTEGER DEFAULT 0,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  confidence REAL,
  langfuse_trace_id TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_chat_logs_thread ON chat_logs(thread_id);
CREATE INDEX idx_chat_logs_ip ON chat_logs(ip);

-- User feedback
CREATE TABLE feedback (
  id TEXT PRIMARY KEY,
  chat_log_id TEXT NOT NULL,
  rating INTEGER NOT NULL,   -- 1 (thumbs up) or -1 (thumbs down)
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (chat_log_id) REFERENCES chat_logs(id)
);

-- Custom documents
CREATE TABLE custom_docs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL,  -- 'file' | 'text' | 'url'
  source_ref TEXT,            -- R2 key or URL
  content TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- IP blocks (abuse detection)
CREATE TABLE ip_blocks (
  ip TEXT PRIMARY KEY,
  reason TEXT,
  blocked_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT
);

-- Golden dataset (eval)
CREATE TABLE eval_cases (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  expected_answer TEXT NOT NULL,
  expected_sources TEXT,       -- JSON array of slugs/URLs
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE eval_runs (
  id TEXT PRIMARY KEY,
  run_at TEXT DEFAULT (datetime('now')),
  config_snapshot TEXT,        -- JSON of agent settings at run time
  results TEXT NOT NULL        -- JSON: {case_id, faithfulness, relevance, groundedness}[]
);

-- Crawl targets (moved from config.ts)
CREATE TABLE crawl_targets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  include_patterns TEXT NOT NULL,  -- JSON array
  limit INTEGER DEFAULT 50,
  render INTEGER DEFAULT 0,
  enabled INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Settings (admin-configurable)
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

INSERT INTO settings VALUES
  ('visitor_daily_limit', '5', datetime('now')),
  ('chunk_size', '2000', datetime('now')),
  ('chunk_overlap', '200', datetime('now')),
  ('chunk_strategy', 'by_heading', datetime('now')),
  ('image_description', 'true', datetime('now')),
  ('critic_max_retry', '2', datetime('now')),
  ('semantic_cache_threshold', '0.92', datetime('now')),
  ('crag_quality_threshold', '0.4', datetime('now')),
  ('adaptive_rag_simple_threshold', '0.3', datetime('now')),
  ('adaptive_rag_complex_threshold', '0.7', datetime('now')),
  ('agent_max_iterations', '5', datetime('now'));  -- Research max tool calls per invocation
```

---

## 14. Cloudflare Resources

| Binding | Type | Purpose |
|---------|------|---------|
| `DB` | D1 | All persistent data |
| `VECTORIZE_INDEX` | Vectorize | Main knowledge index |
| `VECTORIZE_CACHE` | Vectorize | Semantic cache |
| `VECTORIZE_ABSTRACT` | Vectorize | Document summary index |
| `AI` | Workers AI | Embeddings, generation, reranking, Vision, image gen |
| `SESSION` | KV | Login sessions |
| `RATE` | KV | IP rate limit counters |
| `R2_IMAGES` | R2 | Blog images + AI-generated diagrams |
| `ASSETS` | Assets | Static files |
| `IMAGE_GEN_QUEUE` | Queue | Async flux-1-schnell image generation dispatch |

---

## 15. Implementation Phases

### Phase 1 — Core RAG
- D1 schema migration
- Embedding pipeline (posts + doc_chunks, with contextual retrieval)
- Basic LangGraph: Planner → Research → Writer → Critic
- `/api/chat` SSE endpoint
- Auth middleware (session + IP rate limit)
- `/chat` page (basic)
- Langfuse integration

### Phase 2 — Agentic Enhancements
- Clarifier, Summarizer, Code Explainer, Diagram Agent, Related Posts
- HyDE, multi-query, hybrid search, reranker
- Semantic cache
- PostToolUse hooks
- D1 checkpointer (multi-turn)
- Admin pages (embed, crawl, settings, agent)

### Phase 3 — Production Quality
- CRAG, adaptive RAG, abstract-first index
- Guardrails (injection, PII, cost cap, circuit breaker)
- Evaluation pipeline (golden dataset, RAGAS)
- Custom documents (upload / paste / URL)
- Shadow mode A/B
- Advanced UX (follow-up questions, export, share, adaptive length)
- GraphRAG (entities + relationships from posts)
- Long-term / episodic memory

---

## 16. Key Files to Create/Modify

```
src/
├── lib/
│   ├── rag/
│   │   ├── graph.ts              # LangGraph graph definition
│   │   ├── checkpointer.ts       # D1 checkpointer
│   │   ├── state.ts              # GraphState type
│   │   ├── agents/
│   │   │   ├── planner.ts
│   │   │   ├── clarifier.ts
│   │   │   ├── research.ts
│   │   │   ├── summarizer.ts
│   │   │   ├── code-explainer.ts
│   │   │   ├── diagram.ts
│   │   │   ├── writer.ts
│   │   │   ├── critic.ts
│   │   │   └── related-posts.ts
│   │   ├── tools/
│   │   │   ├── search-posts.ts
│   │   │   ├── search-docs.ts
│   │   │   ├── search-abstract-index.ts  # VECTORIZE_ABSTRACT search
│   │   │   ├── get-post-detail.ts
│   │   │   ├── find-images.ts
│   │   │   ├── extract-links.ts
│   │   │   └── web-search.ts
│   │   ├── hooks/
│   │   │   ├── auth.ts           # programmatic auth check
│   │   │   ├── rate-limit.ts     # IP rate limiting
│   │   │   └── normalize-results.ts  # dedicated graph node (normalize_results)
│   │   ├── techniques/
│   │   │   ├── hyde.ts
│   │   │   ├── multi-query.ts
│   │   │   ├── hybrid-search.ts
│   │   │   ├── reranker.ts
│   │   │   ├── semantic-cache.ts
│   │   │   ├── rrf.ts
│   │   │   └── adaptive-rag.ts
│   │   └── eval/
│   │       ├── ragas.ts
│   │       └── golden-dataset.ts
│   ├── embed/
│   │   ├── pipeline.ts           # orchestrates chunking + embedding
│   │   ├── contextual.ts         # contextual retrieval wrapper
│   │   └── image-description.ts  # Vision model integration
│   └── langfuse.ts               # trace helper
├── pages/
│   ├── api/
│   │   ├── chat.ts               # SSE endpoint
│   │   ├── embed/sync.ts         # trigger re-embed
│   │   └── admin/                # admin API endpoints
│   ├── chat.astro
│   ├── login.astro
│   └── admin/
│       ├── index.astro
│       ├── embed.astro
│       ├── crawl.astro
│       ├── chat-logs.astro
│       ├── settings.astro
│       ├── agent.astro
│       └── eval.astro
└── components/
    ├── Chat/
    │   ├── ChatWidget.tsx
    │   ├── MessageList.tsx
    │   ├── MessageInput.tsx
    │   ├── AgentSteps.tsx
    │   ├── MermaidDiagram.tsx
    │   └── QuotaIndicator.tsx
    └── Admin/
        ├── EmbedManager.tsx
        ├── CrawlManager.tsx
        └── EvalDashboard.tsx
```
