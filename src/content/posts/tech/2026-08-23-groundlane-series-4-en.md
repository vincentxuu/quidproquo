---
title: "Groundlane Series Part 4: In-Site Application — Verified Workflow with Existing MCP Tools and Usage-Mode Rules"
date: 2026-08-23
category: tech
type: deep-dive
tags: [groundlane, mcp, web-fetch, web-extract, web-search, reference-verification, daily-digest, in-site-application, skill]
lang: en
tldr: "Based on the in-site groundlane skill (mcp__groundlane__*) and usage-modes rules, this part describes reproducible steps for reference verification and digest data collection — without assuming unimplemented features or using deprecated stealth_fetch."
description: "Part 4 is the in-site application layer: how to integrate the verified Groundlane contract into existing site workflows (reference verification, digest collection) using only observable skills and documented constraints."
draft: false
glossary:
  - term: "provenance"
    definition: "Retrieval provenance fields (engine, backend, finalUrl) in Groundlane responses; verifiable evidence of the retrieval path for audit and reproducibility."
  - term: "usage-modes"
    definition: "In-site groundlane skill judgment flow: check tool provenance → confirm three tools → call directly; if unavailable, use environment's actual tools and label fallback; never use deprecated stealth_fetch."
---

> 🌏 [繁體中文版](/posts/tech/2026-08-23-groundlane-series-4)

This part does not assume any unimplemented site feature. Every workflow step is based on the observable `.claude/skills/groundlane` skill (with `mcp__groundlane__*` tool routes) and its `usage-modes.md` judgment flow, which includes the explicit constraint: never use the deprecated `stealth_fetch` or `web-fetch/fetch_page`; if Groundlane tools are not available, use the environment's actual available tools and label the result as a fallback rather than pretending Groundlane was used.

## Observed in-site capabilities (verified, not inferred)

The in-site `usage-modes.md` file (part of the `.claude/skills/groundlane` skill) defines the following observable rules. Each can be traced back to the file content rather than memory:

- **Tool route check**: Before calling, verify the `tool provenance` and full schema; confirm it is Groundlane providing `web_search`, `web_fetch`, and `web_extract`. Tools with the same name from other servers do not count.
- **Direct call when available**: If the three contracts are present, call directly — no need to know whether the endpoint is `localhost:8080/mcp` or a remote deployed `https://deployment>/mcp`.
- **Fallback when unavailable**: If Groundlane is not exposed in the current session, use whatever the environment actually provides (e.g. Tavily, Exa, Firecrawl, Jina, GitHub, papers, or platform-native tools). Label the result clearly as a fallback; do not claim Groundlane was used.
- **No network tools at all**: If no retrieval tool is available, use locally authorized material and report a blocker.
- **Explicit deprecation rule**: Step 5 of the flow states: "Always do not use deprecated `stealth_fetch` or `web-fetch/fetch_page`." This is a hard boundary, not a recommendation.
- **Credential and endpoint rules**: Do not embed `GROUNDLANE_AUTH_TOKEN`, provider keys, or expanded authorization headers into skills, prompts, notes, logs, or version-controlled settings. Do not assume a fixed clone path. For web-hosted agents, register a public reachable endpoint (`https://deployment>/mcp`) with managed connector storage; do not paste bearer tokens into conversation or repository files.
- **Shareability requirement**: Use placeholders (`groundlane-clone>`, `<deployment>`) instead of personal absolute paths or private endpoints.

These rules form the boundary for any in-site application: the design must work under conditions where the Groundlane endpoint may be local or remote, the clone path is unknown, credentials are not embedded in files, deprecated paths are excluded, and the tool availability is verified at runtime rather than assumed.

## A verifiable reference-verification workflow

The site's writing guidelines (`post` skill reference section) require a `## 參考資料` (References) section at the end of each article, with at least one valid Markdown link; for technology/AI topics, references should cover official docs, papers, and authoritative technical sources. A reproducible verification workflow (using only observable capabilities) is:

1. **Extract the reference list**: From the article content, collect all external links listed in the references section. This step requires no retrieval tool — it is data preparation.
2. **Check tool availability per the usage-mode flow**: Verify whether `mcp__groundlane__*` provides `web_fetch` and `web_extract`. If yes, proceed with Groundlane; if no, record "Groundlane not available in this session — using environment's actual tool (not `stealth_fetch`)" and proceed with the fallback tool, clearly labeling the provenance difference.
3. **Retrieve with `web_fetch` (when available)**: Call `web_fetch` with `format: markdown` and `render: never` (prefer direct HTTP; use `render: auto` only when content is clearly missing). Preserve `finalUrl`, `engine`, `backend`, `truncated`, `title`, and the content summary. When `truncated` is `true`, record "partial retrieval — truncated by default cap" rather than treating it as full verification.
4. **Structured verification with `web_extract` (when precise fields are needed)**: For references that require precise field confirmation (e.g. version numbers, API names, release dates), call `web_extract` with explicit CSS selectors (`fields` structure). Preserve the selector-to-value mapping so that each verified field can be traced back to its selector node — no implicit inference.
5. **Record provenance and limitations**: For each reference, document: the URL, verification status (full / truncated / failed), the tool used (Groundlane `web_fetch`/`web_extract`, with `engine`/`backend` values, or the labeled fallback), any truncation reason (`truncated: true` due to byte/output cap), and any missing-tool fallback label. Include this audit record in the article's verification notes (e.g. "Reference verification: `finalUrl` matches input; `engine: http`; `backend: direct`; no truncation; selector-verified fields: version `.version` = `v0.1.0`").
6. **Handle failure or unavailability explicitly**: If `web_fetch` or `web_extract` is unavailable (step 2 returned no Groundlane contract), or if retrieval fails (URL unreachable, selector matches nothing, or `truncated` indicates partial content beyond what the cap allows), label the reference status accordingly: "not verified — Groundlane unavailable (fallback used: [actual tool])" or "partially verified — truncated at default cap". Never hide the limitation by listing the link without a verification note.

This workflow's key properties: it relies only on observable contracts (`mcp__groundlane__*` routes and their response fields), respects the hard exclusion of deprecated `stealth_fetch`, does not embed credentials in files or prompts, uses placeholders for deployment paths, and produces audit evidence (`finalUrl`, `engine`, `backend`, `truncated`, selector-to-value mappings) rather than summary-only claims.

## Digest data collection: observable steps, not invented automation

The site's daily digest articles (e.g. `2026-08-23-ai-agent-arxiv-digest.md`, `2026-08-23-ai-agent-github-digest.md`) collect structured signals from multiple external sources. Applying the Groundlane contract (only where it is actually available) yields the following observable steps — not a fully automated pipeline claim, but a reproducible procedure:

1. **Prepare the source list**: From the digest plan or previous `seen-signal-urls.txt` / `benchmark-snapshot.json` files, list target URLs. This is preparation, not retrieval.
2. **Confirm contract availability**: Per the usage-mode flow, check whether the current session exposes `mcp__groundlane__*`. If it does, use `web_search` (automatic mode or explicit provider list) for confirmation queries and `web_fetch`/`web_extract` for structured retrieval. If it does not, label clearly: "Groundlane not exposed in this session; using environment's actual retrieval tools (not deprecated `stealth_fetch`)" and proceed with the available tool, recording the provenance difference.
3. **Confirm source coverage with `web_search` (when appropriate)**: For new digest topics, a `web_search` call in automatic mode (up to two complementary providers, RRF merge, canonical deduplication) confirms whether sufficient verifiable sources exist. Preserve the provider provenance (original ranks, merged result, `engine`, `backend`) as evidence — not as a billing prediction, since the self-description notes the budget is a safeguard, not provider billing truth.
4. **Retrieve and verify content with `web_fetch`**: For confirmed URLs, call `web_fetch` (`format: markdown`, `render: never` preferred; `render: auto` only when direct retrieval is clearly insufficient). Record `finalUrl` (post-redirect resolution), `engine`/`backend` (direct vs. rendered path), and whether `truncated` is `true` (indicating partial retrieval due to the fixed cap). When `truncated` is `true`, note the limitation explicitly rather than treating the result as complete.
5. **Extract structured fields with `web_extract` (when precise fields are required)**: For content that requires specific structured fields (e.g. paper titles, framework version numbers, funding amounts, security alert severity levels), design selectors (`fields`) that map explicitly to those fields. Preserve the selector-to-value mapping in the audit record so that the digest's structured claims can be traced line-by-line.
6. **Handle unavailability and failure explicitly**: If the Groundlane contract is unavailable, if retrieval fails (unreachable URL, empty selector match), or if content is truncated (`truncated: true`), the digest data collection should explicitly label those records: "not retrieved — contract unavailable"; "partial retrieval — default cap applied"; or "structured field missing — selector matched zero nodes". Do not present incomplete or unverified data as fully verified.

Important limitations (explicitly stated, not hidden):

- This is not an "automatic crawl" or "cache-aware routing" claim. Those capabilities are listed as "Next" in the `v0.1.0` self-description and are not currently observable.
- Browser interaction (clicks, form submissions) is not within the current `web_fetch` contract scope; rendering (`render: auto/always`) is read-only, not interactive.
- Search budgets are safeguards, not billing predictions; they should not be used to forecast provider billing.
- The workflow does not assume future feature additions — it relies solely on the currently observable tool contracts, provenance fields, and fixed security limits.

## Integration with existing site workflows (observable contract points)

The site already has structured content workflows (post creation with frontmatter validation, reference verification requirements, glossary coverage checks, series-order validation, and language-parity checks). Integrating Groundlane means inserting verifiable retrieval and extraction steps into these workflows, not replacing them. Observable contract points for integration:

- **Post creation flow**: After drafting the references section, insert the verification step (step 1-6 above) before finalizing the article. The verification record (URL list, `finalUrl`, `engine`/`backend`, `truncated` status, extractor results with selector mappings) becomes part of the article's audit evidence, referenced in the verification notes rather than embedded as hidden metadata.
- **Digest production flow**: After collecting the source URL list (from `seen-signal-urls.txt`, `benchmark-snapshot.json`, or manual selection), run the confirmation/retrieval/extraction sequence. The audit record (provider provenance for `web_search`, retrieval provenance for `web_fetch`, selector mappings for `web_extract`, any fallback labels, any truncation notes) is preserved with the digest's intermediate data files, making the digest's claims reproducible.
- **Glossary and terminology coverage**: When `web_extract` is used to verify technical fields (API names, version numbers, framework terms), the verified terms can feed into the site's glossary maintenance process (`glossary-maintenance` skill). The selector-to-value mapping provides verifiable evidence that a term was confirmed at a specific source node, not inferred from a summary.
- **Security and compliance boundary**: The usage-mode rules (no embedded tokens, no deprecated `stealth_fetch`, no assumed clone paths, managed connector storage for web-hosted agents) apply to all integrated workflows. Any integration design that requires embedding a bearer token in a file, assuming a fixed local endpoint, or using a deprecated retrieval path violates the observable contract and must be redesigned before deployment.

## Key constraints restated (hard boundaries, not recommendations)

These constraints are drawn directly from the `usage-modes.md` and `v0.1.0` documentation; they are not advisory:

- **Never use deprecated `stealth_fetch` or `web-fetch/fetch_page`**. If a retrieval is needed and Groundlane is unavailable, use an environment-available alternative and label it as a fallback.
- **Never embed credentials** (`GROUNDLANE_AUTH_TOKEN`, provider keys, expanded authorization headers) in skills, prompts, notes, logs, or version-controlled settings.
- **Never assume a fixed clone path**; use `<groundlane-clone>` and `<deployment>` placeholders.
- **Never claim Groundlane was used without verifying the contract** (`mcp__groundlane__*` with the full three-tool schema) at runtime. Tool names from other servers do not count.
- **Treat budget safeguards as non-billing safeguards**; do not predict provider billing from them.
- **Treat `truncated: true` as a partial result**, not a complete one, and document it explicitly.
- **Treat browser rendering (`render: auto/always`) as read-only**, not interactive; it does not support clicks, form submissions, or interactive automation.
- **Treat all future capabilities (automatic crawl, cache-aware routing, expanded interaction) as unverified** until observable in source and docs.

## References

- [.claude/skills/groundlane skill and `usage-modes.md`](.claude/skills/) — judgment flow, identity boundaries, deprecated-path exclusion, credential rules, remote vs. local endpoint differences
- [Groundlane GitHub source (`v0.1.0` self-description and docs)](https://github.com/vincentxuu/groundlane) — three-tool contracts, provenance fields, default security limits, budget semantics
- [In-site `post` skill (`tech-deep-dive` template, reference verification requirements, glossary coverage)](skill://post)
- [Groundlane security notes (`SECURITY.md`)](https://github.com/vincentxuu/groundlane/blob/main/SECURITY.md) — SSRF threat model, identity boundary design, private vulnerability reporting
- Existing site digest articles (e.g. `2026-08-23-ai-agent-arxiv-digest.md`, `2026-08-23-ai-agent-github-digest.md`) — observable data-source patterns, not speculative extensions
