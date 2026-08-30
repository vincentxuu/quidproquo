---
title: "Why Did 'I Want a Beginner AI Course' Return Zero Results? Debugging Chinese Tokenization and a Broken RAG Data Path"
date: 2026-08-28
updated: 2026-08-30
category: tech
type: debug
tags: [rag, hybrid-search, fts5, bm25, vector-search, cloudflare, d1, vectorize]
lang: en
tldr: "Entering '我想找入門的ai課程' in Ask AI showed zero searched posts and triggered a refusal, while Related Reading recommended exactly the right article. The first fix addressed Chinese tokenization, the LIKE fallback, and the Vectorize data path. A second pass added short Han-and-number tokens, post metadata retrieval, and a rule that exposes sources only after both Validation and Critic pass."
description: "A detailed diagnosis of a contradictory RAG result—zero searched posts and a refusal alongside a precise Related Reading match—and the subsequent improvements to Chinese tokenization, metadata search, RRF fusion, source-display gates, and the Cloudflare AI Search shadow rollout."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-28-rag-chinese-query-empty-search-results-debug)

## TL;DR

I entered “我想找入門的ai課程” (“I want a beginner AI course”) in the blog's Ask AI. The progress bar showed `搜尋文章 0`—zero posts searched—and the model replied that the knowledge base lacked enough reliable evidence. Yet the first item under Related Reading was exactly “Which AI Courses Should You Take in 2026: From Knowing Nothing about AI and Vibe Coding to Shipping to Production.”

The contradiction—answer retrieval finds nothing while recommendations find the right article—came from three stacked failures:

1. **The FTS5 query builder did not split on Unicode Script boundaries.** Its regular expression treated the unspaced mixed string `我想找入門的ai課程` as one long token, so BM25 `MATCH` returned zero rows.
2. **The LIKE fallback queried with the entire sentence.** After full-text search failed, `pc.content LIKE '%我想找入門的ai課程%'` also returned zero because no article contained that exact conversational sentence.
3. **Vector retrieval had no filter and was tightly coupled to D1 `post_chunks`.** `searchPosts` queried vectors without limiting results to posts, then had to join each chunk through D1 `post_chunks`. A divergent chunk ID produced an empty result. Related Reading succeeded because it read Vectorize metadata directly.

The fix adds **Han/non-Han Script boundary splitting**, **sliding two-character windows for long Chinese sequences**, **multi-token OR LIKE queries that exclude single-character noise**, a `type: post` vector filter, and direct metadata fallback.

The second round of fixes on August 29 closed two more gaps. Short Han-and-number queries such as `正2系統` now preserve adjacent combinations such as `正2`. Post search also checks title, description, tldr, and tags, then fuses those results with BM25 and Vectorize through RRF. If the final answer fails either Validation or Critic, both source cards and Related Reading stay hidden, so a refusal no longer appears alongside recommendations that look verified.

---

## Context

The site's RAG question-answering system uses a multi-agent pipeline: `Planner` $\to$ `Research` $\to$ `Writer` $\to$ `Validation` $\to$ `Critic` $\to$ `Related`.

- `Research` retrieves posts and documents through hybrid BM25 search in D1 FTS5 and Qwen3 vectors in Vectorize, fused with Reciprocal Rank Fusion.
- `Writer` generates the answer. If `search_results` is zero or retrieval confidence is too low, its system prompt triggers a guardrail and explicitly says there is no reliable knowledge-base evidence rather than hallucinating.
- `Related` runs at the end and queries Vectorize for related reading based on the user's question.

During testing, I entered a natural conversational Chinese query:

> **「我想找入門的ai課程」**

The UI then showed:

- Progress: `分析問題` $\to$ `搜尋文章 0` $\to$ `生成回應` $\to$ `格式驗證` $\to$ `品質檢查`
- AI response: *“很抱歉，我的知識庫中沒有足夠的可靠證據來提供入門AI課程的建議。您可能需要嘗試其他資源或平臺來尋找合適的課程。”*
- Related Reading: `01 2026 年該上哪些 AI 課程：從不懂 AI、vibe coding，到能上 production`

The database clearly contained an exact match. Why did primary retrieval return zero while Related Reading found it precisely?

---

## Problem

Breaking the request path into layers exposed three disconnects.

### 1. BM25: Mixed Chinese and English Became One Long Token

In `buildFtsQuery` inside `src/lib/retrieval/tools/hybrid-search.ts`:

```ts
const rawTokens = normalized.match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? []
```

Unicode `\p{L}` includes both Han characters and Latin letters. When the user does not insert spaces around `的`, `ai`, and `課程`, the entire `我想找入門的ai課程` string becomes one 11-character token.

The existing CJK two-character expansion, `token.length === 2`, never runs. SQLite FTS5 receives:

```sql
SELECT ... FROM chunks_fts WHERE chunks_fts MATCH '"我想找入門的ai課程"'
```

No article chunk contains that exact conversational question, so FTS5 `MATCH` returns zero.

### 2. Lexical Fallback: Whole-sentence LIKE Also Matched Nothing

When FTS5 returned zero, the system fell back to `searchLikePosts`:

```sql
SELECT ... FROM post_chunks pc WHERE pc.content LIKE '%我想找入門的ai課程%'
```

Again, no article paragraph contains that entire string, so the fallback also returned zero.

### 3. Vectorize Search and Related Reading Used Different Data Paths

Why did vector search fail inside `searchPosts` but succeed in `relatedPosts`?

| Mechanism | Post search (`search-posts.ts`) | Related Reading (`related-posts.ts`) |
| :--- | :--- | :--- |
| **Vectorize query** | Searches the whole index with `topK: 24`, no metadata filter, so documents can displace posts | Uses `filter: { type: { $eq: 'post' } }` |
| **Data lookup** | Takes `chunk_id` into D1 `post_chunks` with `WHERE pc.id IN (...)` | Reads `metadata.slug` from Vectorize and queries the `posts` table |
| **Fault tolerance** | A divergent D1 chunk ID or SQL failure is swallowed by `.catch(() => [])`, returning empty | Does not depend on `post_chunks`; gets the article title and link directly |

---

## Attempts

### 1. Reproducing Tokenization

In Node/Vitest:

```ts
buildFtsQuery('我想找入門的ai課程')
// 原始輸出：'"我想找入門的ai課程"' （單一長詞，FTS5 必死）
```

A long all-Chinese query behaved the same way:

```ts
buildFtsQuery('推薦新手學習深度學習')
// 原始輸出：'"推薦新手學習深度學習"' （長度 10，完全無子詞展開）
```

Both mixed Chinese-English and unspaced Chinese sentences failed to produce useful retrieval terms.

### 2. Evaluating Stopwords and Their Side Effects

I briefly tried a stopword list to remove phrases such as `我想`, `找`, and `的`. Hard-coded stopwords can easily destroy domain terms. If `入門`, `課程`, or `教學` becomes a stopword, a search for “AI 課程” can lose its only meaningful term. I rejected that approach.

### 3. Choosing Script Boundaries and Sliding Bigrams

The most robust character-level solution requires no large dictionary:

- **Script boundary splitting:** split at `[\p{Script=Han}]+` and `[^\p{Script=Han}]+`, turning `我想找入門的ai課程` into the Han segment `我想找入門的`, the Latin segment `ai`, and the Han segment `課程`.
- **Sliding Han bigrams:** generate pairs such as `我想`, `想找`, `入門`, and `課程`, giving FTS5 trigram/unicode61 tokenizers searchable subterms.

---

## Solution

### 1. Improve `buildFtsQuery` with Script Boundaries and Bigrams

In `src/lib/retrieval/tools/hybrid-search.ts`:

```ts
export function buildFtsQuery(query: string): string | null {
  const normalized = query.trim().replace(/["']/g, ' ')
  if (!normalized) return null

  // 1) 先按空白/標點切出基礎 token
  const rawTokens = normalized.match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? []
  const baseTokens = Array.from(new Set(rawTokens.map(token => token.trim()).filter(token => token.length >= 2)))

  const expanded = new Set<string>()
  for (const token of baseTokens) {
    expanded.add(token)

    // 2) 按 Script 邊界拆分：漢字連續段 vs 非漢字連續段（拉丁/數字）
    const parts = token.match(/[\p{Script=Han}]+|[^\p{Script=Han}]+/gu) ?? [token]
    for (let i = 0; i < parts.length - 1; i++) {
      const pair = `${parts[i]}${parts[i + 1]}`.trim()
      if (pair.length >= 2) expanded.add(pair)
    }
    for (const part of parts) {
      const trimmed = part.trim()
      if (trimmed.length < 2) continue
      expanded.add(trimmed)

      // 3) 若是漢字連續段，產生 2-gram 滑窗與短詞拆解
      if (/^[\p{Script=Han}]+$/u.test(trimmed)) {
        for (let i = 0; i < trimmed.length - 1; i++) {
          expanded.add(trimmed.slice(i, i + 2))
        }
        if (trimmed.length <= 3) {
          for (const ch of trimmed) {
            expanded.add(ch)
          }
        }
      }
    }
  }

  if (expanded.size === 0) return null

  return [...expanded]
    .map(token => `"${token.replace(/"/g, '""')}"`)
    .join(' OR ')
}
```

### 2. Upgrade `searchLikePosts` to Token-based OR LIKE Without Single-character Noise

In `src/lib/retrieval/tools/search-posts.ts`, the LIKE fallback now uses meaningful tokens of length $\ge 2$ generated by `buildFtsQuery`:

```ts
  const tokens = extractFtsTokens(query)

  if (tokens.length === 0) return []

  const likeClauses = tokens.map(() => 'pc.content LIKE ?').join(' OR ')
  const params = tokens.flatMap(t => [`%${t}%`])

  const rows = await DB.prepare(
    `SELECT pc.id AS chunk_id, COALESCE(pc.sentence_window, pc.content) AS content, p.slug, p.title, p.category, p.lang, substr(p.created_at, 1, 10) AS date, '[]' AS images, '[]' AS links
     FROM post_chunks pc
     JOIN posts p ON p.id = pc.post_id
     WHERE (${likeClauses})
     ORDER BY p.created_at DESC
     LIMIT ?`
  ).bind(...params, Math.max(limit * 3, BM25_SHORT_CIRCUIT_THRESHOLD)).all<...>()
```

### 3. Align Vectorize Retrieval and Add a Metadata Fallback

In `searchVectorPosts`:

1. Pass `filter: { type: { $eq: 'post' } }` so other documents cannot consume the result slots.
2. If `fetchPostRowsByChunkIds` returns zero because D1 chunks diverged, fall back to `fetchPostsByMetadata`, using each Vectorize result's `metadata.slug` to read article content and summary from the primary `posts` table.

### 4. Second Pass: Preserve Short Boundary Tokens and Search Post Metadata

The first fix worked for long Chinese sentences, but one short-query trap remained. `正2系統` was split into `正`, `2`, and `系統`; the first two segments were each only one character long and were discarded by the length threshold. `buildFtsQuery` now preserves adjacent Script combinations first, retaining both `正2` and `2系統`. A test explicitly requires `正2系統` to produce `正2`.

Searching chunks alone is still insufficient. When a user asks to “find the 正2 article,” the strongest signal may be in the title, description, tldr, or tags rather than appearing verbatim in a chunk. `searchMetadataPosts` now searches those four fields with the same tokens and filters generic terms such as 「文章」, 「找文」, 「搜尋」, 「推薦」, and 「關於」. Depending on the execution path, it then fuses the results with BM25 or with both BM25 and Vectorize through RRF:

```ts
const metadataResults = await searchMetadataPosts(query, limit, category, lang)
const bm25Results = await searchBm25Posts(query, limit, category, lang)

if (shouldUseBm25ShortCircuit(query, bm25Results.length, shortCircuit)) {
  return dedupeBySlug(
    reciprocalRankFuse([metadataResults, bm25Results], limit * 3),
    limit
  )
}

const vectorResults = await searchVectorPosts(query, limit, category, lang)
return dedupeBySlug(
  reciprocalRankFuse([metadataResults, vectorResults, bm25Results], limit * 3),
  limit
)
```

This change addresses more than zero-result searches. Even when BM25 finds a few generic chunks, an explicit title or tag match can enter the fused ranking instead of losing the top positions to content that merely mentions the word “article.”

### 5. Hide Sources and Related Reading When the Answer Is Rejected

The original incident also required a presentation-layer fix. The system now shares `shouldExposeRetrievedLinks`: it exposes sources only when `search_results` is nonempty and neither Validation nor Critic has failed.

```ts
export function shouldExposeRetrievedLinks(state): boolean {
  return (
    state.search_results.length > 0 &&
    !hasValidationFailure(state.validation) &&
    !hasCriticFailure(state.critique)
  )
}
```

The `/api/chat` sources event and `relatedPostsNode` both enforce this gate. When confidence is low, citation validation fails, the answer goes off topic, or unsupported claims remain, the answer is downgraded and the UI no longer displays a row of article cards that users could mistake for evidence supporting it.

### 6. The Search Page's Next Step: Keep AI Search in Shadow Mode First

On August 30, the site's Search Page also gained a configuration-driven multi-source fan-out: D1 keyword search, the existing D1/Vectorize hybrid search, and a Cloudflare AI Search adapter. Visible sources are merged with weighted RRF; each source has its own enabled, visible, shadow, weight, and timeout settings.

This path cannot yet be described as “Ask AI has switched to Cloudflare AI Search.” The default configuration keeps AI Search at `enabled: false`, `visible: false`, and `shadow: true`. In other words, the adapter, binding, health check, and evaluation slot are in place, but AI Search does not yet affect public ranking. Before switching it to visible, we still need to compare Traditional Chinese recall, source URLs, latency, and failure degradation.

---

## Why It Happened

1. **Natural Chinese queries do not contain spaces.** English tokenization can rely on word boundaries. Traditional Chinese users naturally type strings such as `我想找入門的ai課程`, often joining Han and Latin scripts. A tokenizer relying on whitespace fails immediately.
2. **Multi-route retrieval cascaded into the safety boundary:**
   - Zero retrieval results marked the state `weak_retrieval`.
   - The `Writer` followed its prompt and refused without evidence, preventing hallucination.
   - `Related` used a different retrieval path and read metadata successfully, creating the conspicuous UI contradiction: “the answer says nothing exists, while the recommendation below proves otherwise.”
3. **Recall and presentation did not share a confidence gate.** Retrieving a post does not mean the answer has passed citation and quality checks. Tying sources and Related Reading to the same Validation/Critic result prevents candidate material from being presented as verified evidence.

---

## Lessons Learned

- **Chinese retrieval cannot assume spaces or one script.** The Han/Latin boundary is a natural token boundary and must be split explicitly with Unicode Script regular expressions.
- **The LIKE fallback must share tokenization.** Do not query `LIKE '%query%'` with the raw sentence. Use `OR LIKE` over extracted subterms, while filtering one-character high-frequency terms where $\text{len} < 2$ to protect ranking from noise.
- **Multiple retrieval nodes need the same fault-tolerance layer.** If RAG content search and Related Reading both use vectors, align their metadata filters and database fallback strategies to avoid contradictory user experiences.
- **Post search cannot look only at body chunks.** For queries that ask for a particular article, title, description, tldr, and tags often match how the user names it better than the body does. Metadata should be an independent recall source, then fused with BM25 and Vectorize.
- **Retrieved results and displayable sources are separate decisions.** The first asks which candidates exist; the second asks whether those candidates genuinely support the final answer. Both need the same Validation/Critic gate to preserve the UI's meaning of evidence.

---

## Update Log

- 2026-08-30: Synchronized the second round of search improvements from August 29–30, covering short Han-and-number tokens, post metadata retrieval, the source-display gate, and the boundary of the Cloudflare AI Search shadow rollout.

---

## References

- [Fixing Search That Returns Only 10 Results: Chinese Recall with Cloudflare D1 FTS5 and Hybrid Search](/posts/tech/2026-08-26-d1-fts5-hybrid-search-cjk-recall-en)
- [Hybrid Search: BM25 and Vector Search Cover Each Other's Blind Spots](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en)
- [SQLite FTS5 Extension Documentation](https://sqlite.org/fts5.html)
- [Cloudflare Vectorize Metadata Filtering](https://developers.cloudflare.com/vectorize/best-practices/metadata-filtering/)
- [How to Use Cloudflare AI Search: Data Sources, Hybrid Retrieval, and Workers Bindings](/posts/tech/2026-08-29-cloudflare-ai-search-guide-en)
