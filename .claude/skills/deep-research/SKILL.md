---
name: deep-research
description: >
  Multi-round deep research skill that uses MCP search tools (Tavily, Exa, Context7, Jina, Firecrawl)
  to gather comprehensive, auditable information on any topic and synthesize it into a structured,
  citation-verified Markdown report.

  Trigger this skill whenever the user says things like: "研究一下", "幫我研究", "deep research",
  "deepsearch", "深度研究", "調查一下", "幫我查", "查一下", "research this", "查查看",
  "我想了解", "幫我了解", "請研究", asks to expand an existing research report, compare sources,
  investigate a topic, or gather comprehensive sourced information — even if they do not explicitly use
  the word "research". Use this skill proactively whenever the user wants comprehensive, sourced,
  current, or citation-sensitive information.
argument-hint: "<topic to research>"
---

# Deep Research

You are conducting a thorough, multi-round research session on the requested topic. Your goal is
to gather high-quality information from multiple sources and synthesize a comprehensive,
well-cited, auditable Markdown report.

The core loop is **Brief → Plan → Search → Rank → Read → Verify → Synthesize**. Do not treat
search as the first step unless the request is already a complete research brief.

## Task Sizing（研究規模判斷）

Before starting, decide whether this is a **light lookup** or **substantial research**:

| Signal | Light lookup | Substantial research |
|--------|-------------|---------------------|
| Topic specificity | Very specific, near-single-answer | Multi-dimensional, contested |
| Citation requirement | Low | High — claim-by-claim |
| User expectation | Quick answer | Thorough report |
| Sub-questions needed | 1–2 | 3+ |
| Rounds needed | 1 | Multi-round |

**Light lookup**: skip working dir, answer directly in chat with inline sources.  
**Substantial research**: use working dir, spawn subagents if needed, write report file.

## Research Strategy

### Phase 0 — Intent Clarification（可選，視情況決定）

If the topic is ambiguous or broad (e.g. "研究 AI"、"幫我查競品"), ask **exactly 1 concise
focused question** before starting. Skip this phase if the topic is already specific enough.

Ask only when the answer would materially change the research direction, source type, time range,
or output format. Do not ask questions just to be polite.

Examples of when to clarify:
- "你想了解 AI 的哪個面向？（技術原理 / 市場競爭 / 應用案例）"
- "是哪個競品？想比較哪個維度？"

### Phase 0.5 — Research Brief Builder

Before searching, convert the user request into a compact research brief. If the user points to an
existing report or file, read it first and make the brief explicitly describe what is being extended,
not repeated.

The brief must cover:
- **Objective**: what the final report should answer.
- **Scope**: included topics, excluded topics, target geography/domain if relevant.
- **Source preferences**: official docs, papers, primary data, news, market reports, community signals.
- **Freshness requirement**: how recent sources must be; require current info for unstable topics.
- **Output format**: report language, category, expected depth, tables/architecture/checklists if useful.
- **Success criteria**: what must be true before stopping.
- **Budget**: max search rounds, max URLs to read, max sources per sub-question, escalation limits.

For substantial research, maintain lightweight working state under:
`.research/<YYYY-MM-DD>-<slug>/`

Recommended files:
- `brief.md` — research brief and scope decisions
- `plan.md` — sub-questions, search plan, stop conditions
- `sources.jsonl` — source registry (one JSON object per line)
- `notes/<subquestion-slug>.md` — evidence notes per sub-question (**raw content goes here, not main context**)
- `claims.tsv` — key claims, support status, and supporting URLs

Do not create a working directory for light lookups; use it only when the task is multi-round,
extends an existing report, or has high citation/quality requirements.

### Phase 1 — Query Decomposition + Rewriting

Break the topic into **3–7 sub-questions**, then rewrite each into a search-optimized query.
Don't search the original question verbatim — rewrite or decompose into multi-hop queries first.

**Step 1: Decompose** — what aspects need to be covered?  
**Step 2: Rewrite each sub-question** into a natural language search query that describes the
ideal page to find (not keywords). Think: "what would a page that answers this look like?"  
**Step 3: Assign source expectations and escalation tier** — what kind of source is authoritative,
and how deep does the search need to go?

Good example for "Claude 4.7 新功能":

| Sub-question | Search query (rewritten) | Source expectation | Escalation tier |
|---|---|---|---|
| 有哪些新功能？ | "Claude 4.7 new features capabilities announcement Anthropic 2026" | Official announcement/docs | standard |
| 與 4.6 差異？ | "comparison Claude 4.7 vs 4.6 improvements benchmark differences" | Release notes + benchmarks | standard |
| 開發者評價？ | "developers review Claude 4.7 real-world testing experience community feedback" | Community + hands-on reports | standard |
| 官方定位？ | "Anthropic Claude 4.7 use cases positioning product strategy" | Official product page/blog | standard |
| 競品比較？ | "Claude 4.7 vs GPT-5 Gemini performance comparison 2026" | Benchmarks + primary docs | deep |

**Escalation tiers** (start at lowest that can plausibly answer the sub-question):
`standard` → `deep` (exa deep, 4–12s) → `deep-reasoning` (exa deep-reasoning, 12–50s) → `research` (tavily_research, 15–250 credits).

### Phase 2 — Parallel Research

For each sub-question, run targeted searches in parallel. **Write queries as complete natural
language sentences**, not keywords — Exa uses semantic/neural search, not keyword matching.

#### Option A: Direct parallel searches（適合 2–4 個子問題）

Run all sub-question searches as parallel tool calls in a single message. Request `highlights`
only in Phase 2 to save ~10x tokens; reserve full-text reads for Phase 4.

#### Option B: Spawn parallel research subagents（適合 4+ 個獨立子問題）

When sub-questions are **truly independent** (e.g., researching separate competitors, distinct
technical areas, unrelated geographic markets), spawn parallel Agent subagents — one per cluster
of related sub-questions. This keeps main agent context clean and enables concurrent deep research.

**When to use subagents:**
- 4+ independent sub-questions with no shared intermediate state
- Each sub-question requires multiple searches + URL reads
- The research is substantial (using working dir)

**Subagent contract — each subagent must return a structured summary:**

```
Conclusion: [2–4 sentence synthesis of findings]
Key claims: [bulleted list with specific numbers/dates/names]
Supporting URLs: [list with one-line relevance note each]
Evidence notes: [written to notes/<subquestion-slug>.md]
Uncertainty: [what remains unclear, conflicting, or unverified]
```

Subagents write raw evidence to `notes/<subquestion-slug>.md` and return only the structured
summary. Main agent receives summaries — not raw page content.

**Tool selection per sub-question:**

| Sub-question type | Tool | Cost |
|-------------------|------|------|
| 一般事實、新聞、近況 | `mcp__tavily__tavily_search` | 1 credit，最省 |
| 需要語義理解的複雜問題 | `mcp__exa__web_search_exa` | 補充不同索引 |
| 複雜、多面向、需要推理的子問題 | `mcp__exa__web_search_exa` with `type: "deep"` | 4–12s |
| 極複雜、需要深度推理 | `mcp__exa__web_search_exa` with `type: "deep-reasoning"` | 12–50s，謹慎使用 |
| 整個主題都非常複雜 | `mcp__tavily__tavily_research` | 15–250 credits，最後手段 |

**Anti-loop and action-disabling rules:**
- Search returns no new URLs → **disable read/visit** for this query; rewrite query with a different angle or escalate tool tier. If rewrite also returns nothing, stop this branch.
- Two consecutive searches produce mostly duplicate URLs already in source registry → rewrite with a different angle or stop branch.
- Sub-question already meets success criteria (≥2 credible sources, no unresolved contradiction) → **stop that branch immediately**; do not keep searching it.
- Do not escalate to `deep-reasoning` or `tavily_research` unless lower tiers produced insufficient results after rewrite attempts.

### Phase 3 — Source Registry + URL Ranking

Before reading full pages, build a source registry from search results. **Rank before reading.**

Each source entry (one JSON per line in `sources.jsonl`):

```json
{"url":"","title":"","source_type":"official|paper|docs|media|blog|community|unknown","subquestion":"","freshness":"","authority_score":1,"relevance_score":1,"read_status":"queued|read|skipped","reason":""}
```

Evaluate each candidate:
- Is the source authoritative? (官方文件、知名媒體、學術論文 > 個人部落格)
- Is it directly relevant to the sub-question it came from?
- Is it recent enough? (時效性敏感的主題要注意)
- Does it add new evidence, or duplicate an already-read source?

Pick the **top 3–5 URLs per important source cluster**, not blindly across the whole task. Prefer
one primary source over multiple secondary summaries when the primary directly answers the question.

### Phase 4 — Deep Read + Evidence Notes

Read selected sources in full, prioritizing primary and high-authority sources.

- `mcp__caad4a9f__get_url_markdown` — 優先用，輸出乾淨 Markdown
- `mcp__firecrawl__firecrawl_scrape` — JS-heavy 頁面其他工具抓不到時才用（credits 有限）
- `mcp__tavily__tavily_extract` — 備援

**Context management（關鍵）**: Do NOT accumulate raw page text in main agent context. For each
source read:
1. Write key evidence, quotes, numbers, and data points to `notes/<subquestion-slug>.md`.
2. Keep only a 2–4 sentence summary + key facts in main context.
3. Mark the source `read` in `sources.jsonl`.

This prevents context window explosion as research scales. Main agent context should hold the
plan, evidence summaries, and source index — not raw web pages.

For each source read, capture concise evidence notes:
- what claim it directly supports
- important numbers/dates/names
- limitations or bias
- whether it conflicts with another source

Do not paste large raw excerpts into the final report. Summarize and cite.

### Phase 4.5 — Claim-Citation Verification

Before finalizing, verify that important claims are actually supported by the cited source.

For each key claim, map at least one supporting URL and mark support status:
- `supported` — the source directly supports the claim
- `partially_supported` — the source supports part of the claim; qualify wording
- `unsupported` — remove the claim or run a targeted search
- `stale` — source may be outdated; qualify or find a newer source

`claims.tsv` columns:

```tsv
claim	support_status	supporting_urls	notes
```

Do not keep unsupported key claims in the report. If evidence is mixed, present both sides instead
of silently choosing one.

**Per-subquestion coverage check**: Before synthesizing, build a coverage map:

```
Sub-question → [source_type: URL, ...]
```

Any sub-question with zero high-credibility sources → run a targeted gap-filling search before
synthesizing. A subquestion covered only by low-authority sources (blog, unknown) → flag it in
the report's Methodology section as a known gap.

### Phase 5 — Sufficiency Check（充分性判斷）

After deep reading and claim verification, explicitly ask yourself:
- 每個子問題都有足夠的資料支撐嗎？
- 有沒有互相矛盾的說法需要驗證？
- 有沒有重要面向完全沒有來源？
- 主要 factual claims 是否都有直接支持的 citation？
- 有無超出 budget（搜尋輪次、URL 數量、credits）？

**Per-branch stop condition**: Once a sub-question branch has ≥2 credible sources with no
unresolved contradictions, **close that branch**. Do not add more sources to a covered branch —
it wastes budget and inflates context without improving quality.

Stop the entire research when all are true:
- Every sub-question has at least **2 credible sources**, or **1 primary source** that directly answers it.
- No unresolved contradiction affects the main conclusion.
- Additional searches produce no materially new information.
- Claim-citation verification has no unsupported key claims.
- Budget (rounds, URLs, credits) has not been exceeded.

**If gaps remain**: run targeted searches with `tavily_search` or `exa_web_search_exa`
to fill them. Repeat only until the gap is covered.

This replaces fixed "N rounds" — the research continues until sub-questions are answered, not
until a round counter hits a number.

## Search Tool Selection Guide

| Situation | Tool | Cost |
|-----------|------|------|
| Broad topic overview, news, events | `mcp__735922c7__tavily_search` | 1 credit/query |
| Deep synthesized overview (complex topics only) | `mcp__735922c7__tavily_research` | 15–250 credits |
| Finding diverse web sources | `mcp__205c8b8e__web_search_exa` | ~1,000/month free |
| Reading a specific webpage (clean Markdown) | `mcp__caad4a9f__get_url_markdown` | Free |
| JS-heavy pages other tools can't render | `mcp__a4f311aa__firecrawl_scrape` | Limited credits |
| Crawling an entire website | `mcp__a4f311aa__firecrawl_crawl` | Limited credits |
| Integrated deep research (multi-step) | `mcp__735922c7__tavily_research` | 15–250 credits |
| Linkup web search | `mcp__5dc7ee32__linkup-search` | Varies |

**Escalation path**: `tavily_search` / `exa auto` → `exa deep` → `exa deep-reasoning` → `tavily_research`.
Escalate only after the lower tier fails to produce useful results after query rewriting.

**Credit conservation**: Default to `tavily_search` + `get_url_markdown` + `web_search_exa`.
Only escalate to `tavily_research`, `deep-reasoning`, or `firecrawl` when lower-cost tools fall short.

## Output Format

After completing all research rounds:

### Step 1 — Determine category and filename

Pick one category that best fits the topic:

| Category | 適用主題 |
|----------|---------|
| `ai` | 人工智慧、LLM、機器學習、AI 工具 |
| `technology` | 軟體、程式語言、框架、API、開發工具 |
| `business` | 商業、市場、公司、產業、競品 |
| `product` | 產品設計、UX、功能規劃 |
| `science` | 科學、醫療、學術研究 |
| `general` | 其他不符合以上分類的主題 |

Build the file path:
- Base dir: `.research/<category>/`
- Filename: `YYYY-MM-DD_HH-MM_<slug>.md`
  - `YYYY-MM-DD_HH-MM` = current local datetime
  - `<slug>` = topic in lowercase, spaces replaced with `-`, max 40 chars, ASCII/CJK both OK

Example: `.research/ai/2026-05-14_10-32_claude-4-7-features.md`

### Step 2 — Write the report file

Create the directory if it doesn't exist, then write the report with this structure:

```markdown
# Research Report: [Topic]

**Date:** YYYY-MM-DD HH:MM
**Category:** [category]
**Confidence:** High / Medium / Low

## Executive Summary
2–4 sentences capturing the most important finding.

## Key Findings

### [Finding 1 Title]
[2–4 sentences. Be specific — numbers, dates, names when available.]
> Sources: [linked citations]

### [Finding 2 Title]
...

*(4–8 findings for a thorough topic)*

## Controversies & Open Questions
What is disputed, unclear, or actively changing?

## Methodology
- Research brief summary
- Sub-questions searched
- Source selection criteria
- Known limitations and coverage gaps

## Further Reading
3–5 highly relevant sources with brief descriptions.
```

### Step 3 — Report to user

After saving, tell the user:
- The full file path
- Category chosen
- Confidence level
- Any important limitations or verification gaps

## Quality Standards

- Cite every factual claim — use the URL from the search result as the citation.
- Every key finding must have at least one source that directly supports it.
- Prefer primary sources (official docs, announcements, papers) over secondary summaries.
- If using secondary sources for an important claim, explain why primary evidence was unavailable.
- Note when information may be outdated (>1 year old), especially for products, APIs, pricing, and benchmarks.
- If sources conflict, present both sides rather than picking one silently.
- Track unsupported or partially supported claims and remove, qualify, or verify them before finalizing.
- Rank sources before reading — do not blindly read every URL.
- Keep a source registry for auditability on substantial research tasks.
- Keep main agent context lean: offload raw evidence to `notes/` files, keep only summaries in active context.
- Write in Traditional Chinese (繁體中文) unless the user wrote in English or another language.

## What NOT to do

- Do not stop after a single search round — always do at least two search/deep-read passes for substantial research.
- Do not fabricate citations or URLs — only link to sources you actually retrieved.
- Do not cite a source unless it supports the adjacent claim.
- Do not pad with vague statements; if you don't know something, say so explicitly.
- Do not keep looping after success criteria are met — stop once covered.
- Do not add more sources to a branch that already has sufficient coverage.
- Do not accumulate raw page text in the main context window — write it to `notes/` files.
- Do not escalate to expensive tools (`tavily_research`, `deep-reasoning`) without first trying cheaper alternatives and rewriting queries.
- Do not skip the confidence rating — it helps the reader calibrate trust.
- Do not use built-in WebFetch or Playwright — only use MCP tools (per CLAUDE.md).

## 跟其他 skill 的關係

- **deep-research → post**：研究完，把骨架丟給 post skill，套 `tech-deep-dive.md` 模板發成導讀文
- **deep-research → post-update**：原本有相關文章 → 研究完用 post-update 補進去（例如版本更新）
- **deep-research vs ai-expert**：ai-expert 是「用我會的知識回答你」；deep-research 是「先去查清楚再回」。新工具/新論文一律用 deep-research 開頭
