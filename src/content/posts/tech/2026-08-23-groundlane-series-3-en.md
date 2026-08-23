---
title: "Groundlane Series Part 3: Comparing with Traditional Approaches — WebFetch, stealth_fetch, puppeteer, and requests"
date: 2026-08-23
category: tech
type: deep-dive
tags: [groundlane, mcp, web-fetch, web-search, stealth-fetch, puppeteer, web-scraping, ssrf, deterministic-extraction]
lang: en
tldr: "A four-dimension comparison (determinism, replaceability, identity boundary, operational cost) between Groundlane's controlled remote MCP contract and traditional local approaches (WebFetch, stealth_fetch, puppeteer, requests), with verifiable scenario recommendations."
description: "Part 3 is the comparison layer: where Groundlane's remote contract differs from in-site local tools, not as a replacement verdict but as a verifiable boundary and responsibility mapping (all against v0.1.0 observable behavior)."
draft: false
glossary:
  - term: "webfetch"
    definition: "In-site built-in web retrieval tool (not Groundlane's web_fetch); differs in lacking a unified MCP contract, dual-auth boundary, and provider-replacement mechanism."
  - term: "stealth_fetch"
    definition: "In-site stealth retrieval tool; lacks structured selector extraction and deterministic provenance fields (engine/backend) compared to Groundlane."
---

> 🌏 [繁體中文版](/posts/tech/2026-08-23-groundlane-series-3)

This article's purpose is not to declare "Groundlane is better than traditional approaches." Its purpose is to map differences onto verifiable dimensions — determinism, replaceability, identity boundary, and operational cost — so that the choice between a remote controlled MCP layer and local scripts (WebFetch, stealth_fetch, puppeteer, requests) becomes an observable decision rather than a preference judgment. Every claim traces back to `v0.1.0` observable behavior; no future improvement is assumed.

## The four comparison dimensions (defined first, compared second)

To make the comparison reproducible, the four dimensions are defined in terms of observable operational behavior, not abstract theory:

- **Determinism**: Can every output result be explained by pointing to a verifiable input and processing step? High determinism means results map to explicit selectors or fixed parsing logic; low determinism means results rely on implicit model inference or dynamic rendering that varies with environment.
- **Replaceability**: How much of the agent-side code must change when the retrieval or extraction source changes? High replaceability means the same contract applies regardless of provider; low replaceability means each source requires a different parsing and error-handling logic.
- **Identity boundary**: Where do authentication credentials, resource limits, and error-handling responsibilities reside? A clear boundary means the remote layer holds the secrets and enforces limits; a blurred boundary means the agent script holds provider keys and manages limits itself.
- **Operational cost (agent-side)**: How many steps does the agent script manage per execution? Lower agent-side cost often comes with a corresponding remote-layer deployment and maintenance responsibility — this is a cost shift, not elimination.

These dimensions are not mutually exclusive scores; they are trade-off points. A small internal script with a fixed source may not need high replaceability, but it does need low agent-side cost. A long-running multi-source verification workflow needs high determinism and clear identity boundaries, which justifies a remote-layer deployment.

## What traditional approaches actually do (verified from in-site tools)

The in-site tools (`WebFetch`, `stealth_fetch`, `puppeteer`-related flows, direct `requests` calls) each have well-defined behavior patterns that can be mapped directly against Groundlane's three-tool contract:

- **`WebFetch`**: An in-site retrieval tool that returns content summaries and some structured information. Its strength is tight integration with the site workflow; its limitations are the absence of a unified MCP contract (parameters and response formats may shift with versions), no dual-auth boundary (secrets and limits are embedded in the site flow), and no provider-replacement mechanism (switching sources typically requires changing the call logic or adding extra steps).
- **`stealth_fetch`**: A stealth retrieval approach for pages with simple anti-bot measures. Its strength is concealment; its limitations are the absence of structured selector extraction (no `fields` mechanism equivalent to `web_extract`), no deterministic provenance fields (`engine`/`backend`), and the same blurred identity boundary as `WebFetch`.
- **Direct `puppeteer` control**: Full browser interaction (clicks, scrolls, form submissions). Its strength is complete interaction coverage; its limitations are high agent-side operational cost (browser startup, resource management, rendering-time variability, error retries), lower determinism (results vary with browser version, network latency, and dynamic page behavior), and no unified contract (each script manages its own parameters and parsing).
- **Direct `requests` calls**: The simplest HTTP client approach for static pages. Its strength is simplicity and low overhead; its limitations are no structured extraction (requires manual HTML parsing), no provenance fields, no identity boundary separation, and low replaceability (each source requires its own parsing logic).

These descriptions are not criticisms — they describe what each tool is designed for. The point is that each traditional approach excels in a specific scenario (small scale, fixed source, low frequency, or full interaction) but exposes growing maintenance and determinism risk as the workflow scales in duration, source variety, or audit requirements.

## What Groundlane actually does (`v0.1.0` verifiable scope)

Groundlane's three tools (`web_search`, `web_fetch`, `web_extract`) provide a single remote MCP contract. This translates into observable differences on the four dimensions:

- **Higher determinism**: `web_extract` uses CSS selectors as the sole extraction mechanism — every result maps to a selector node, explainable line-by-line, with no hidden model-inference step. `web_fetch` reports provenance fields (`engine`, `backend`, `finalUrl`) that verify the retrieval path. `web_search` retains per-provider original ranks plus the RRF-merged final order, making the merge process auditable.
- **Higher replaceability**: All search sources share the same `web_search` contract; switching providers requires only parameter changes (provider list or automatic mode), not rewriting parsing logic. `web_fetch` and `web_extract` apply the same contract to any directly reachable URL.
- **Clearer identity boundary**: The remote layer holds the dual-auth secrets (`GROUNDLANE_AUTH_TOKEN`, `OAUTH_OWNER_PASSPHRASE`) and enforces default limits (URL policy, DNS/redirect checks, single deadline, byte/output caps, concurrency limits, budget safeguards). The agent script does not hold individual provider keys.
- **Lower agent-side operational cost, with remote-layer responsibility shift**: The agent script only needs to know how to call the three tools; browser startup, provider routing, error retries, and result normalization are handled remotely. However, this lower agent-side cost is accompanied by a remote-layer deployment and maintenance responsibility (local Node, Docker, or Cloudflare). It is a cost shift, not elimination.

These advantages exist only within the verifiable `v0.1.0` scope. For example: automatic search selects up to two providers based on availability and routing logic, so the exact provider pair is not guaranteed to be identical across runs; browser rendering (`render: auto/always`) introduces environment-dependent variability (browser version, page dynamics); and the default limits are fixed security boundaries, not tunable performance parameters. The comparison is therefore conditional: these differences hold for the currently observable behavior, and should be re-verified when the version or deployment configuration changes.

## Four-dimension mapping (summary, not a scorecard)

The table below summarizes observable differences without assigning absolute ratings. The "Notes" column names the verifiable constraints that prevent overgeneralization.

| Dimension | Traditional local approaches (WebFetch / stealth_fetch / puppeteer / requests) | Groundlane (`v0.1.0`) | Notes (verifiable constraints) |
| --- | --- | --- | --- |
| Determinism | Low to medium (depends on parsing logic, rendering variability, no unified provenance fields) | High (`web_extract` selector-driven; `web_fetch` provenance fields; `web_search` original + merged rank evidence) | High determinism does not mean "always correct" — it means "explainable". If the target DOM changes, selector results change; that is a stability issue, not a determinism failure. |
| Replaceability | Low (each source typically requires separate parsing and error-handling logic) | High (same MCP contract for all providers; parameter-only changes when switching) | High replaceability does not eliminate the need to verify response structures after a provider change; provenance fields (`engine`, `backend`) should be checked. |
| Identity boundary | Blurred (agent script holds provider credentials; limits managed locally or not at all) | Clear (remote layer holds dual auth and enforces default limits) | A clear boundary is not risk-free — the remote layer itself must be deployed and monitored correctly (local, Docker, Cloudflare); otherwise the boundary becomes a single-point risk. |
| Agent-side operational cost | Medium to high (browser startup, proxy rotation, retry logic, result validation) | Low (agent calls three tools; remote layer handles routing, rendering, retries) | Low agent-side cost accompanies remote-layer deployment and maintenance cost. This is a responsibility shift, not removal. |

The purpose of this table is not to assign a "winner" but to make the trade-off observable: a small, fixed-source internal script may not benefit from high replaceability; a long-running multi-source verification workflow benefits from high determinism and a clear identity boundary, which justifies the remote-layer deployment.

## Scenario recommendations (observable, not speculative)

These recommendations are based on the currently verifiable behavior of both the in-site tools and Groundlane `v0.1.0`, not on anticipated future capabilities:

- **`WebFetch` fits well** for low-frequency, tightly integrated in-site retrieval tasks where a unified MCP contract, multi-provider comparison, or deterministic provenance fields are not required. **It fits poorly** for long-running workflows that need multi-source verification, clear identity boundaries, or reproducible audit trails — because authentication and limits remain embedded in the site flow, and there is no structured selector mechanism.
- **`stealth_fetch` fits well** for simple concealment needs on pages that do not require structured extraction or provenance tracking. **It fits poorly** for workflows requiring deterministic `fields`-based extraction (there is no equivalent mechanism), verifiable `engine`/`backend` provenance, or long-term reproducibility.
- **Direct `puppeteer` control fits well** for full interaction workflows (clicks, scrolls, form submissions) with low execution frequency and acceptable high maintenance overhead. **It fits poorly** for workflows requiring low agent-side cost, high determinism, or a unified contract — because each execution requires browser management, results vary with environment, and parsing logic is script-specific.
- **Direct `requests` calls fit well** for simple static pages with fixed parsing logic, single sources, and low frequency. **They fit poorly** for multi-source comparison, structured selector extraction, or workflows where authentication and limits must be clearly separated from the agent script.
- **Groundlane fits well** for workflows that require a unified MCP contract, verifiable provenance (`engine`/`backend`/`finalUrl`), structured selector extraction (`fields`), provider replaceability (parameter-only changes), and a clearly separated identity boundary. **It fits poorly** for workflows requiring full browser interaction (clicks, form submissions — `web_fetch` rendering is read-only, not interactive) or for situations where remote-layer deployment and maintenance responsibility is unacceptable.

These recommendations should be treated as conditional on the `v0.1.0` observable scope. If a future version adds interactive rendering, changes the default limit semantics, or modifies the contract behavior, these scenario recommendations should be re-verified against the updated source and docs.

## Overall decision framework (executable, not abstract)

A reproducible selection process based on the verifiable facts in this and the previous parts:

1. **Identify the workflow requirements**: Is it small-scale with a fixed source (traditional approaches sufficient), or long-running with multi-source verification, audit, and clear identity separation needs (Groundlane more appropriate)?
2. **Verify feature availability**: Confirm that the required capabilities (structured selector extraction, multi-provider merge, provenance fields, fixed security boundaries) exist in the `v0.1.0` observable scope, and that the corresponding constraints (DOM stability dependence for selectors, environment variability for rendering, fixed non-tunable limits) are acceptable.
3. **Assign maintenance responsibility**: If Groundlane is selected, confirm that remote-layer deployment (local, Docker, or Cloudflare) and monitoring responsibilities are clearly assigned. If a traditional approach is selected, confirm that agent-side parsing, authentication, and retry management responsibilities are acceptable.
4. **Run a small verification**: For either choice, run a limited test (only the key parameters and expected response fields), preserve the parameter set and results, and verify determinism and reproducibility before scaling to the full workflow.

This framework does not rely on unverified future improvements. It relies only on currently observable contracts, verified response structures, and explicitly named constraints — making it executable now and verifiable against future updates.

## References

- [Groundlane GitHub source (`v0.1.0` self-description and docs)](https://github.com/vincentxuu/groundlane) — three-tool contracts, adapter list, dual-auth mechanism, default limits and budget semantics
- [.claude/skills/groundlane skill (in-site MCP tool routes)](.claude/skills/)
- In-site tool behavior (`WebFetch`, `stealth_fetch`, `puppeteer`-related flows, direct `requests` usage) — verified from existing skills and site articles, not inferred
- [Groundlane security notes (`SECURITY.md`)](https://github.com/vincentxuu/groundlane/blob/main/SECURITY.md) — SSRF threat model, identity boundary design, default security limits
