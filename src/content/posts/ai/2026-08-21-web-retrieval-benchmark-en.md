---
title: "How to Evaluate Agent Search Quality: Building a Web Retrieval Benchmark"
date: 2026-08-21
category: ai
type: deep-dive
tags: [web-search, web-scraping, ai-agent, retrieval, benchmark]
lang: en
series:
  name: "Search and Scraping in Practice"
  order: 8
tldr: "A web retrieval benchmark must evaluate complete tasks, not HTTP 200s: 30 fixed cases across five failure strata and three live channels, measuring answers, citations, freshness, latency, cost, and unnecessary escalation. This article delivers the harness and gates, but no fabricated ranking while the three live channels remain unconfigured."
description: "Build a Web Retrieval Benchmark from a 30-case corpus: ground truth, freshness windows, outcome labels, content and citation grading, latency/cost/escalation metrics, deterministic fixtures, live probes, failure injection, and regression gates."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-web-retrieval-benchmark)

> **Unpublished benchmark specification.** The 30 fixed cases and harness are defined, but this environment lacks the endpoints and credentials required for three live channels. This article reports no success rates, latency, cost, or provider rankings and remains `draft: true` until raw runs are archived.

[The previous article](/posts/ai/2026-08-21-web-retrieval-fallback-routing-en) defines when to switch between Search, Fetch, Crawlers, Browsers, and a controlled stealth path. The next question is not another routing diagram. It is: **how do you prove that the router finds the right material, reads it correctly, cites it accurately, and does not burn the entire budget on one page?**

The unit of a web retrieval benchmark should be a complete task. An HTTP `200` proves only that one request received a response. It does not prove that the body was useful, the answer matched the question, the citation supported the claim, the representation remained within its freshness window, or the router avoided unnecessary escalation.

## Define passing before running anything

Every task must answer five separate questions:

1. **Outcome:** complete, partial, correct refusal, error, or timeout?
2. **Content:** how many required key facts were found?
3. **Citation:** is the URL traceable, and does its content support the claim?
4. **Freshness:** was the representation valid for this task's time window?
5. **Efficiency:** how much time, money, requests, and escalation did it consume?

Do not compress these into one score. A composite lets “citations were entirely wrong, but the run was fast” cancel out “the answer was correct, but slightly slower.” CI should block hard failures first, then compare acceptable tradeoffs through separate metrics.

## A 30-task corpus: six cases in five strata

The corpus cannot consist entirely of easy public static pages. The minimum shape is five strata: known URLs, search discovery, dynamic pages, authenticated state, and blocking or network failures. Six tasks per stratum gives 30 fixed cases. Task text stays fixed; live runs update only observation time and explicitly mutable ground truth.

The YAML below is the fixture spec. A local test server resolves `fixture://` URLs. In the live lane, the same case maps `live_channel` to an automation-friendly public URL or dedicated test site. Auth and blocking probes must never target unauthorized third-party accounts or origins.

```yaml
version: web-retrieval-v1
live_channels:
  - { id: direct-fetch, adapter: fetch, required: true }
  - { id: search-api, adapter: search, required: true }
  - { id: browser, adapter: browser, required: true }
cases:
  - { id: K01, stratum: known-url, query: "Extract the published date", fixture: "fixture://known/static", live_channel: direct-fetch, expect: success }
  - { id: K02, stratum: known-url, query: "Follow the permanent redirect and cite the canonical page", fixture: "fixture://known/redirect", live_channel: direct-fetch, expect: success }
  - { id: K03, stratum: known-url, query: "Read the linked PDF and identify its title", fixture: "fixture://known/document.pdf", live_channel: direct-fetch, expect: success }
  - { id: K04, stratum: known-url, query: "Return the current version using cache validation", fixture: "fixture://known/etag", live_channel: direct-fetch, expect: success }
  - { id: K05, stratum: known-url, query: "Find the replacement for this removed page", fixture: "fixture://known/gone", live_channel: search-api, expect: success }
  - { id: K06, stratum: known-url, query: "Explain why this unsupported media cannot be read", fixture: "fixture://known/binary", live_channel: direct-fetch, expect: correct-refusal }
  - { id: S01, stratum: search, query: "Find the official HTTP caching specification", fixture: "fixture://search/exact", live_channel: search-api, expect: success }
  - { id: S02, stratum: search, query: "找出台灣官方的颱風警報來源", fixture: "fixture://search/zh-tw", live_channel: search-api, expect: success }
  - { id: S03, stratum: search, query: "Find today's release note for the fixture product", fixture: "fixture://search/fresh", live_channel: search-api, expect: success }
  - { id: S04, stratum: search, query: "Find two independent primary sources for the fixture claim", fixture: "fixture://search/diverse", live_channel: search-api, expect: success }
  - { id: S05, stratum: search, query: "Find the nonexistent RFC 99999", fixture: "fixture://search/no-result", live_channel: search-api, expect: correct-refusal }
  - { id: S06, stratum: search, query: "Deduplicate the syndicated copies and cite the origin", fixture: "fixture://search/duplicates", live_channel: search-api, expect: success }
  - { id: D01, stratum: dynamic, query: "Read content rendered after JavaScript starts", fixture: "fixture://dynamic/js-shell", live_channel: browser, expect: success }
  - { id: D02, stratum: dynamic, query: "Wait for the delayed API result", fixture: "fixture://dynamic/delayed", live_channel: browser, expect: success }
  - { id: D03, stratum: dynamic, query: "Collect all six items from infinite scroll", fixture: "fixture://dynamic/scroll", live_channel: browser, expect: success }
  - { id: D04, stratum: dynamic, query: "Dismiss consent and read the visible article", fixture: "fixture://dynamic/consent", live_channel: browser, expect: success }
  - { id: D05, stratum: dynamic, query: "Reject the 200 response that renders a soft 404", fixture: "fixture://dynamic/soft-404", live_channel: browser, expect: correct-refusal }
  - { id: D06, stratum: dynamic, query: "Extract the price despite randomized DOM ids", fixture: "fixture://dynamic/unstable-dom", live_channel: browser, expect: success }
  - { id: A01, stratum: auth, query: "Read the authorized account fixture", fixture: "fixture://auth/valid", live_channel: browser, expect: success }
  - { id: A02, stratum: auth, query: "Detect the expired session without looping", fixture: "fixture://auth/expired", live_channel: browser, expect: correct-refusal }
  - { id: A03, stratum: auth, query: "Report that the current role lacks access", fixture: "fixture://auth/forbidden", live_channel: browser, expect: correct-refusal }
  - { id: A04, stratum: auth, query: "Detect a login form returned with HTTP 200", fixture: "fixture://auth/login-200", live_channel: browser, expect: correct-refusal }
  - { id: A05, stratum: auth, query: "Keep user A content out of user B cache", fixture: "fixture://auth/cache-isolation", live_channel: browser, expect: success }
  - { id: A06, stratum: auth, query: "Read the form but do not submit the destructive action", fixture: "fixture://auth/no-write", live_channel: browser, expect: success }
  - { id: B01, stratum: blocking, query: "Respect Retry-After and retrieve the page", fixture: "fixture://blocking/429", live_channel: direct-fetch, expect: success }
  - { id: B02, stratum: blocking, query: "Recover from one temporary 503", fixture: "fixture://blocking/503", live_channel: direct-fetch, expect: success }
  - { id: B03, stratum: blocking, query: "Identify the challenge page without citing it", fixture: "fixture://blocking/challenge", live_channel: browser, expect: correct-refusal }
  - { id: B04, stratum: blocking, query: "Stop after a policy-denied 403", fixture: "fixture://blocking/403", live_channel: direct-fetch, expect: correct-refusal }
  - { id: B05, stratum: blocking, query: "Recover after a connection reset", fixture: "fixture://blocking/reset", live_channel: direct-fetch, expect: success }
  - { id: B06, stratum: blocking, query: "Report the legal restriction without bypassing it", fixture: "fixture://blocking/451", live_channel: direct-fetch, expect: correct-refusal }
```

The production fixture adds `expected_facts`, `allowed_sources`, `forbidden_actions`, `freshness_window_s`, and `max_budget` to every case. The manifest above first locks the identity of all 30 tasks so a later version cannot swap questions and pretend its scores remain comparable.

## Ground truth is not a permanent answer sheet

A static fixture can pin ground truth to a content hash; a live page cannot. Each truth record needs:

```yaml
case_id: S03
valid_at: 2026-08-21T00:00:00Z
freshness_window_s: 86400
expected_facts:
  - { id: release-version, value: "v3.2", match: exact }
allowed_sources:
  - "https://vendor.example/releases/*"
forbidden_actions: [use-stale-cache, cite-search-snippet]
adjudicated_by: human
```

`valid_at` records when a human confirmed the truth. `freshness_window_s` defines how old this task permits a representation to be; it is not a global TTL. Version documentation might tolerate days, while a “today” announcement cannot.

[RFC 9111](https://www.rfc-editor.org/rfc/rfc9111.html) separates fresh, stale, and validation states. Once response age exceeds freshness lifetime, reuse normally requires validation. A benchmark can borrow this model, but the product still owns each task's freshness SLA. When a source provides `ETag` or `Last-Modified`, raw traces must retain the conditional request and `304`; otherwise, reviewers cannot distinguish revalidation from blindly serving old cache.

Ground-truth updates require review. Preserve the previous version, change reason, and evidence URL. Never rewrite truth merely because the system produced a different answer.

## Make outcome labels exclusive and failure tags plural

Each task gets exactly one `primary_label`:

| Label | Meaning |
|---|---|
| `success` | Required facts, citations, freshness, and policy all pass |
| `partial` | Useful content exists, but a required fact or citation is missing |
| `correct_refusal` | Correctly stops for access, policy, absence, or unsupported content |
| `incorrect` | Conflicts with truth or treats an error page as an answer |
| `stale` | Once-correct answer exceeds its freshness window without validation |
| `policy_violation` | Performs a forbidden action, crosses auth scope, or bypasses improperly |
| `timeout` | Exceeds the task deadline |
| `budget_exhausted` | Exhausts cost, request, or escalation budget before deadline |
| `infra_error` | The benchmark broke; this is not a system-under-test failure |

Attach multiple `failure_tags`, such as `empty-body`, `citation-mismatch`, `unnecessary-browser`, `auth-loop`, or `cache-leak`. The primary label drives gates; tags drive root-cause analysis. Exception messages should not become labels, or one defect will explode into hundreds of strings.

## Score answers and citations separately

Content quality needs at least three values:

- `fact_coverage = matched_required_facts / required_facts`
- `citation_coverage = facts_with_a_citation / matched_facts`
- `citation_support = supported_cited_claims / checked_cited_claims`

The citation checker first retrieves the cited URL's representation at `retrieved_at`, then asks whether it supports the neighboring claim. Checking only whether a URL opens will accept an official homepage that never states the claim. Conversely, a mirror may support the claim but still fail a provenance allowlist.

The W3C [PROV-O Recommendation](https://www.w3.org/TR/prov-o/) represents provenance through Entity, Activity, and Agent. The harness does not need RDF, but it should preserve the same relationships: which retrieval run (Activity), through which adapter or provider (Agent), generated which representation and claim (Entity), and how they were derived.

If an LLM judges citation support, pin prompt and model version, then manually adjudicate a sample after every change. Model grading is not a reason to discard source text. Archive the representation, claim span, and grading rationale.

## Metrics: averages are not enough

Persist the full attempt trace for every task, then aggregate:

| Dimension | Metrics |
|---|---|
| Outcome | success and correct-refusal rate, grouped by stratum |
| Quality | fact coverage, citation coverage, citation support, freshness pass rate |
| Latency | end-to-end p50/p95, adapter duration, time to first usable source |
| Cost | provider charge, request count, browser seconds, cost per successful task |
| Routing | escalation rate and depth, unnecessary escalation rate, cache hit/revalidate rate |

OpenTelemetry's [HTTP metrics semantic conventions](https://opentelemetry.io/docs/specs/semconv/http/http-metrics/) define `http.client.request.duration` in seconds, with status when a response arrives and a predictable low-cardinality `error.type` on failure. Reusing those names prevents fetch, search SDKs, and browser network logs from inventing incompatible schemas.

Fixtures define `unnecessary_escalation`: if a cheaper adapter already produced a truth-satisfying representation and the system still launched a browser, record one. A live lane cannot always know whether skipping escalation would have worked, so it should report observed escalation without automatically condemning it.

## You need both deterministic and live lanes

The **deterministic lane** runs all 30 tasks on every PR. A local fixture server pins status, headers, body, redirects, cookies, and clock. Browser cases use interception or HAR replay. Playwright's [Mock APIs documentation](https://playwright.dev/docs/mock) describes HAR capture of requests, responses, cookies, content, and timings, followed by `routeFromHAR()` replay. Matching uses URL and method, plus payload for POST.

This catches routing regressions but cannot prove that today's search index, DOM, or blocking behavior still matches the fixture.

The **live lane** enables at least three channels: direct HTTP fetch, search API, and browser automation. Pin region, user agent, provider configuration, and corpus version, then run repeatedly on a schedule. Every run appends `observed_at` rather than overwriting history. Auth uses dedicated test accounts; blocking probes target only origins that explicitly permit automation.

Classify live failures as `system_failure` or `probe_invalid` first. If the target page disappeared and truth was not updated, the probe is invalid; adjudicate it before declaring a router regression.

## Inject failures at both transport and content layers

Mocking statuses alone is insufficient. The fixture server owns semantic failures:

- `200` with an empty body, soft 404, login form, or challenge body
- redirect loop, cross-origin redirect, stale `ETag`
- `401`, `403`, `404`, `429` plus `Retry-After`, `503`, and `451`
- expired sessions, insufficient roles, and auth cache isolation

Use [Toxiproxy](https://github.com/Shopify/toxiproxy) for transport failures. Its official repository provides latency, timeout, `reset_peer`, bandwidth, and packet-loss controls, letting CI reproduce slow, dropped, and reset connections without waiting for the real network to misbehave.

Every injected failure verifies two things: the final outcome and whether the attempt trace stayed within limits. A run that eventually succeeds after twenty hidden requests is still a regression.

## Harness pseudocode

This control flow can move directly into a TypeScript runner. The system under test receives task and channel configuration. The grader does not trust the system's internal verdict, so “the system says success” cannot become the assertion.

```ts
for (const lane of ["fixture", "live"] as const) {
  assert(lane !== "live" || configuredLiveChannels().length >= 3);

  for (const task of corpus.cases) {
    const truth = truthStore.resolve(task.id, clock.now());
    const trace = await recorder.capture(() =>
      system.retrieve({ task, lane, deadline: task.max_deadline_ms })
    );

    const representation = await archive.finalRepresentation(trace);
    const facts = gradeFacts(representation, truth.expected_facts);
    const citations = await gradeCitations({
      answer: trace.answer,
      archivedSources: trace.sources,
      allowedSources: truth.allowed_sources,
    });
    const freshness = gradeFreshness(trace, truth.valid_at, truth.freshness_window_s);
    const policy = gradeForbiddenActions(trace, truth.forbidden_actions);

    const result = classifyPrimaryOutcome({ trace, facts, citations, freshness, policy });
    await writeJsonl("raw/results.jsonl", {
      corpus_version: corpus.version,
      lane,
      task_id: task.id,
      observed_at: clock.now().toISOString(),
      result,
      metrics: aggregateTrace(trace),
      provenance: archive.manifest(trace),
    });
  }
}

const report = aggregateByStratum(readJsonl("raw/results.jsonl"));
applyRegressionGates(report, loadBaseline("baseline.json"));
```

The output directory retains at least `results.jsonl`, per-page representation hashes, citation snapshots, attempt spans, corpus version, runner commit, region, and a provider-configuration fingerprint. Store only references to secret keys, never the keys themselves.

## Regression gates: hard invariants plus a rolling baseline

Before the first live run, thresholds are examples, not calibrated facts. Split gates into two layers.

**Deterministic hard gate:**

- `policy_violation`, auth cache leaks, and destructive actions must remain at zero.
- No fixture task may end in `infra_error`.
- Every primary label must match the manifest's `expect`.
- Retry, deadline, crawl-depth, and escalation caps must hold.

**Live rolling gate:**

- Accumulate multiple baseline runs before comparing identical corpus, region, and configuration.
- Gate success, citation support, p95 latency, and cost separately.
- Quarantine one invalid probe instead of immediately changing the baseline.
- Lower cost cannot cancel lower quality; success rate cannot cancel a policy violation.

An example policy might review a five-percentage-point success drop, a 20% p95 increase, or a 15% cost-per-success increase. Those are not measured findings from this article. Replace them after live raw results establish the product's SLA and normal variance.

## Interpret tradeoffs instead of forcing a winner

Read reports by stratum first. One configuration may dominate known URLs but time out on dynamic pages. Another may succeed more often by launching a browser for every task. A global average erases both differences.

Plot three Pareto relationships: quality versus latency, quality versus cost, and success versus escalation. Configuration A is dominated only when B is no worse on every relevant axis. Everything else is a product tradeoff, not a universal champion.

Finally, inspect failure tags case by case. The benchmark's job is not to manufacture a pretty score. It should tell you which layer, page type, and failure signal regressed. The 30 tasks and harness are now specified; this article can leave draft only after three live channels run and their raw artifacts are archived.

## References

- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html)
- [OpenTelemetry: HTTP metrics semantic conventions](https://opentelemetry.io/docs/specs/semconv/http/http-metrics/)
- [Playwright: Mock APIs and HAR replay](https://playwright.dev/docs/mock)
- [Shopify Toxiproxy](https://github.com/Shopify/toxiproxy)
- [W3C PROV-O](https://www.w3.org/TR/prov-o/)
- [On this site: Web retrieval fallback routing for AI agents](/posts/ai/2026-08-21-web-retrieval-fallback-routing-en)
