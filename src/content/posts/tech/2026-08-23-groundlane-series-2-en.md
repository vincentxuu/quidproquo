---
title: "Groundlane Series Part 2: Actual Calls, Response Structures, and Error Boundaries for the Three MCP Tools"
date: 2026-08-23
category: tech
type: deep-dive
tags: [groundlane, mcp, web-search, web-fetch, web-extract, ai-agent, cloudflare-workers, web-scraping, safe-retrieval, selector, css-selector, rrf]
lang: en
tldr: "Hands-on parameter choices and response structures for web_search (ten adapters, RRF merge, dual-provider default), web_fetch (format/render strategies, finalUrl provenance), and web_extract (CSS selector determinism, no implicit LLM step), with verifiable error boundaries."
description: "Part 2 is the practical layer: how each tool behaves under different parameter combinations, what fields prove retrieval provenance, and which limits are fixed security boundaries rather than tunable options (all verified against Groundlane v0.1.0 docs)."
draft: false
glossary:
  rrf: "Reciprocal Rank Fusion; the ranking merge method Groundlane uses for automatic search across multiple providers, retaining per-source rank provenance."
  selector: "CSS selector structure for deterministic web_extract; each result maps to a node and can be explained line-by-line without hidden model inference."
---

> 🌏 [繁體中文版](/posts/tech/2026-08-23-groundlane-series-2)

This part does not repeat the architecture explanation from Part 1 (why a controlled web access layer is needed, the three tools' responsibilities). It moves directly to the practical layer: which parameter combinations produce which response structures, which fields serve as verifiable provenance, and which boundaries are fixed security limits rather than tunable performance knobs. All descriptions trace back to the `v0.1.0` self-description and docs; no unimplemented feature is assumed.

## Tool contracts at a glance (for quick reference)

| Tool | Required input | Behavior-defining optional params | Primary determinism source |
| --- | --- | --- | --- |
| `web_search` | Query string | Provider (optional, can be multiple or automatic), time range, result count limits | Per-adapter original responses + local RRF merge logic |
| `web_fetch` | URL | `format` (markdown / text / html), `render` (auto / never / always), byte/output caps | Local HTTP + Readability (`engine`, `backend` mark source); Jina / Browserless only when enabled |
| `web_extract` | URL + `fields` (CSS selector structure) | `render`, `waitFor`, timeout, selector mode (text / html / attribute) | Deterministic DOM extraction; no implicit LLM inference; each node maps to one selector result |

Key prerequisite (reiterated from Part 1): `web_search` requires at least one enabled search-provider key (ten adapters are all optional); `web_fetch` and `web_extract` work without any search-provider key, as long as the target URL is directly reachable.

## `web_search`: parameter combinations and response interpretation

The self-description states the automatic search default: at most two complementary providers, canonical-URL deduplication, RRF merge, with per-provider original rank provenance retained. This means even without an explicit provider parameter, the system selects up to two enabled providers, merges results, and reports which sources contributed.

In practice, the parameter combinations affect behavior as follows:

- **No provider specified (automatic)**: The local router picks up to two complementary providers from the enabled set, applies RRF, and returns results with both original per-provider ranks and the merged final order. This is the most practical starting point for confirming whether sufficient sources exist for a topic, because you do not need to know in advance which provider performs best for that query.
- **Single provider pinned (e.g. `tavily`)**: Results come from a single source; no RRF merge occurs, and the response structure is simpler (no multi-source rank comparison). This is appropriate when you need precise traceability for a specific provider's behavior, or when you want to avoid merge-logic interference.
- **Explicit provider list**: The merge applies only to your specified set, giving you control over the complement range (e.g. merge only `tavily` and `exa`, excluding others). This is useful when you have operational knowledge about which provider pairs work well together for your domain.

Key verifiable fields in the response (per the docs, not inferred):

- `finalUrl`, `title`, `snippet` (or corresponding content summary): normalized from the provider's original response.
- `engine`, `backend`: provenance markers identifying the retrieval path (e.g. direct HTTP, browser rendering, hosted fallback). These fields are audit evidence: you can verify whether a result came from the expected path.
- Per-provider `rank` and the final merged rank: for automatic or multi-provider queries, the response includes each source's original ranking plus the RRF-merged final order. For single-provider queries, only that source's rank is present.
- Canonical deduplication evidence: automatic search performs canonical-URL deduplication by default, so duplicate content across providers is collapsed to one representative entry, with the evidence noted in the response.

Practical recommendation (based on currently verifiable behavior, not a future promise): start with automatic mode, observe which providers are selected and what provenance fields (`engine`, `backend`, original ranks) are returned; then fix to a single provider when you need precise traceability, or to an explicit multi-provider list when you want controlled complementarity. Do not assume the automatic selection will always pick the same provider pair — provider availability and routing behavior can vary with configuration and network conditions.

## `web_fetch`: format and render strategy differences

The `format` parameter controls output format; the `render` parameter controls whether browser rendering is invoked. Their combinations determine both the content structure and the provenance evidence:

- `format: markdown` + `render: never`: Normalized Markdown from the local Readability pipeline; source is direct HTTP (`engine: http`, `backend: direct`); no browser or hosted fallback is invoked. Best for fast content verification and reference validation, because the provenance is unambiguous.
- `format: html` + `render: never`: Raw HTML (not normalized through Readability), preserving the full DOM structure. Useful when you plan a subsequent `web_extract` call with CSS selectors that depend on exact DOM semantics.
- `format: markdown` + `render: always` (or `auto` when rendering is required): The system invokes a browser backend (local Playwright or enabled Browserless). The provenance fields change accordingly (`backend` reflects the rendering path), and the response may include rendering-time and resource-usage indicators. This is necessary for pages that require JavaScript execution to reveal content, but it introduces additional operational cost and determinism risk (rendered results depend on browser version, network latency, and dynamic page behavior).
- `format: text`: A simplified plain-text form of the Markdown output; appropriate for quick preview without full formatting.

Verifiable provenance fields in the response:

- `finalUrl`: the resolved URL after redirects (may differ from the input URL).
- `title`: the page title, extracted either by Readability (direct) or by the rendering pipeline.
- `content`: the normalized content, bounded by byte and output caps.
- `truncated`: a boolean indicating whether the content was cut off due to the cap. When `true`, the result is partial, not complete — treat it as a truncated sample rather than a full retrieval.
- `engine`, `backend`, `finalUrl`: together these form the retrieval provenance chain. They allow you to confirm whether a result came from direct HTTP (`engine: http`, `backend: direct`) or from a browser/rendering path, which is critical for reproducibility and audit.

Practical recommendation: start with `render: never`; confirm that the content is directly retrievable and that the provenance fields show `engine: http` and `backend: direct`. Only switch to `render: auto` or `always` if the direct result is incomplete or missing key content, and then observe whether `backend` changes to a rendering path and whether `truncated` becomes `true`. Do not treat browser rendering as a default — it should be an explicit fallback, because it changes both the provenance evidence and the operational cost.

## `web_extract`: selector determinism and design practice

The core principle (from the self-description and docs): no implicit LLM inference. Every extraction result maps to a CSS selector; every node value or attribute is explainable by pointing to the matching selector. This makes results reproducible across runs (assuming the target page's DOM is stable) and auditable line-by-line.

Selector design practice (operational recommendations, not speculative):

- Use standard CSS selector syntax (`.article h2`, `article > h2`, `#main .content p`), not custom query languages or implicit pattern matching.
- When extracting attribute values (e.g. `href`, `src`, `data-*` attributes), specify the attribute explicitly (`a[href]` for links, `img[src]` for image sources), rather than relying on content inference.
- When building structured results from multiple nodes, design selectors so each node corresponds to a specific structural field (e.g. `title` maps to `h1`, `summary` maps to `.abstract p`), rather than letting the system infer which nodes belong together.

Response determinism:

- Each selector result maps to a matched node; the value is either the node's text content or the specified attribute value.
- If a selector matches nothing, the result is empty — there is no implicit fill or model-based guess. This lets you distinguish clearly between "the field does not exist on this page" and "the system failed to find it."
- The response contains no hidden model-inference intermediate results (e.g. "I believe this is the title"); only the selector-matched values are present. This makes line-by-line verification possible.

Practical recommendation: before running large-scale extractions, perform a small-scope test (only the key selectors) on the target page, verify that the response structure matches expectations, that selectors match the intended nodes, and that no unexpected nodes are included (e.g. navigation elements, advertisements). If the test results are inconsistent with expectations, adjust the selectors — do not assume the system will auto-correct. Deterministic extraction's reliability depends on selector-DOM consistency, not on the system's fault tolerance.

## Error boundaries and operational limits (verifiable, not tunable)

The self-description and docs list default limits that serve as fixed security and resource boundaries, not as configurable performance parameters:

- **URL policy and DNS/redirect checks**: All input URLs are treated as untrusted; redirects and DNS answers are inspected. This reduces SSRF risk, but also means some redirect chains may be truncated if they exceed default limits or are flagged as suspicious.
- **Single deadline and byte/output caps**: Each tool call has a time and size limit. When content exceeds the cap, `truncated` is set to `true`, and the result is partial, not complete. This is a safety design — it should not be treated as a tunable parameter.
- **Concurrency limits**: Default concurrency controls prevent resource exhaustion, which means large batch operations must be staged rather than fully parallel.
- **Search budget safeguards**: Automatic search applies a conservative monthly attempt budget per instance. This is a safeguard, not a billing truth, and should not be used to predict provider billing.

Practical recommendation: design automation workflows that treat these limits as non-negotiable boundary conditions. For example, if `truncated: true` appears, the workflow should trigger an additional step (e.g. a more precise selector, a segmented retrieval, or a manual review) rather than assuming the cap can be removed. Similarly, for large-scale search needs, design the workflow to switch to a single-provider mode or reduce query frequency when the budget approaches its limit, rather than assuming the budget is infinitely expandable.

## A practical combined workflow (verifiable, not speculative)

Based on the three tools' verified contracts and fixed boundaries, a reproducible workflow (not the only possible one, but one that relies only on currently observable behavior):

1. **Initial verification**: Call `web_search` in automatic mode to confirm sufficient sources exist for the topic; observe the selected providers, provenance fields (`engine`, `backend`), and original/merged ranks.
2. **Content retrieval**: Call `web_fetch` (`format: markdown`, `render: never`) on confirmed URLs; verify that `engine: http` and `backend: direct` appear, confirming a direct retrieval path.
3. **Structured extraction**: Call `web_extract` with explicitly designed CSS selectors on the verified content; confirm that each field maps correctly, that results contain no unexpected nodes, and that `truncated` is `false` (indicating a complete extraction within the cap).
4. **Audit and reproducibility**: Preserve the parameter combinations and response structures (especially `engine`, `backend`, `finalUrl`, `truncated`, original ranks, and RRF merge evidence) for each operation. This makes later verification and reproduction executable steps, not memory-dependent guesses.

This workflow does not assume future capabilities (e.g. automatic crawling, cache-aware routing, or unlimited budgets). It relies solely on the three verified tool contracts and the fixed security boundaries, making it executable under `v0.1.0` and verifiable against future updates by comparing preserved parameters and responses.

## References

- [Groundlane GitHub source (v0.1.0)](https://github.com/vincentxuu/groundlane) — self-described contracts for `web_search` (two-provider automatic merge, RRF, canonical dedup), `web_fetch` (format/render options, provenance fields), `web_extract` (CSS selector determinism, no implicit LLM step)
- [Groundlane product description and docs](https://github.com/vincentxuu/groundlane) — adapter list, deployment steps, dual-auth mechanism, default limits and budget semantics
- [.claude/skills/groundlane skill (in-site MCP tool routes)](.claude/skills/)
- [Groundlane security notes (SECURITY.md)](https://github.com/vincentxuu/groundlane/blob/main/SECURITY.md) — SSRF threat model, default security limits, private vulnerability reporting
