---
title: "From Search Results to Reliable Citations: URL Deduplication, Source Tiers, and Claim-Source Mapping"
date: 2026-08-22
category: ai
type: deep-dive
tags: [web-search, citations, retrieval, ai-agent, data-provenance, reproducibility]
lang: en
tldr: "Reliable citation is not appending URLs to an answer. Separate URLs, content copies, and source independence, then connect atomic claims to quote spans and snapshots through a rerunnable claim-source matrix."
description: "An auditable pipeline from search results to citations: URL normalization, canonical URLs, content fingerprints, source tiers, claim-source mapping, web snapshots, and CI checks."
draft: false
series:
  name: "Search and Scraping in Practice"
  order: 11
---

> 🌏 [中文版](/posts/ai/2026-08-22-search-results-reliable-citations)

Ten URLs from a search API do not give you ten sources. One article may appear three times with different tracking parameters, then be syndicated by a portal and copied by three content farms. Seven URLs can still be one story. Worse, genuinely different URLs do not necessarily support the sentence beside which they are cited.

A reliable citation pipeline should not store “answer -> URL.” It should store “**smallest verifiable claim -> source version retrieved at the time -> exact source span that supports it**.” This article stays at that engineering layer: URL and content deduplication, source tiers, claim-source mapping, snapshots, and rerunnable checks. For research planning and conflict arbitration, see the site's [Deep Research Agent architecture](/posts/ai/2026-06-04-autonomous-deep-research-agent-en).

## Start with the data contract: URLs, documents, claims, and evidence are different objects

The common search-result model contains only `url`, `title`, and `snippet`. That is enough to display results, not to substantiate an answer. Split the system into at least four records:

```text
SearchHit --many-to-one--> SourceDocument --one-to-many--> Snapshot
                                                |
Claim --many-to-many------------------------- EvidenceLink
```

- `SearchHit`: which query, provider, and rank discovered a URL. It is retrieval history, not evidence.
- `SourceDocument`: normalized URL, author or publisher, source tier, and duplicate cluster.
- `Snapshot`: bytes, extracted text, HTTP metadata, and hashes captured at a point in time.
- `Claim`: one indivisible assertion in the report.
- `EvidenceLink`: which span in which snapshot supports or contradicts which claim, and to what degree.

The following JSON shape is sufficient to start. `quote_start` and `quote_end` point into **stored normalized text**, never into a live page that may change later:

```json
{
  "claim": {
    "id": "c-017",
    "text": "Service X is available in Taiwan.",
    "importance": "critical",
    "status": "supported"
  },
  "evidence": [{
    "source_id": "src-004",
    "snapshot_id": "snap-004-20260822T031500Z",
    "support": "full",
    "quote": "Service X is available in Taiwan.",
    "quote_start": 8134,
    "quote_end": 8167,
    "locator": "regions#taiwan",
    "independence_group": "service-x-status",
    "checked_at": "2026-08-22T03:19:00Z",
    "checker_version": "citation-check-v1"
  }]
}
```

This separation has an immediate benefit. When a page changes, create another snapshot instead of overwriting the old evidence. When one source supports three claims, create three `EvidenceLink` records instead of copying the document.

## First deduplication layer: normalize URLs without guessing site semantics

[RFC 3986's URI comparison section](https://www.rfc-editor.org/rfc/rfc3986.html#section-6) describes syntax-based normalization including scheme and host case, percent encoding, and dot segments. A cross-domain implementation should begin with conservative rules:

1. Lowercase the scheme and hostname.
2. Remove default ports, credentials, and the fragment; retain the fragment separately as a citation locator.
3. Remove only tracking parameters named by policy, such as `utm_*`, `gclid`, and `fbclid`.
4. Preserve the path and every other query parameter because `page=2`, `lang=en`, or `id=123` may change the resource.

The implementation below intentionally leaves the path untouched. If you normalize percent encodings or `.` and `..`, use a complete RFC implementation and add domain-specific equivalence tests instead of a few string replacements:

```python
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

DROP_KEYS = {"gclid", "fbclid", "mc_cid", "mc_eid"}

def normalize_url(raw: str) -> tuple[str, str]:
    u = urlsplit(raw.strip())
    scheme = u.scheme.lower()
    host = (u.hostname or "").lower()
    port = u.port
    if port and not ((scheme == "http" and port == 80) or
                     (scheme == "https" and port == 443)):
        host = f"{host}:{port}"

    kept = []
    for key, value in parse_qsl(u.query, keep_blank_values=True):
        if key.lower().startswith("utm_") or key.lower() in DROP_KEYS:
            continue
        kept.append((key, value))

    path = u.path or "/"
    normalized = urlunsplit((scheme, host, path, urlencode(kept), ""))
    return normalized, u.fragment
```

Do not globally discard query strings, force-remove trailing slashes, or sort all parameters and declare the result equivalent. Those transformations require a domain-specific policy backed by tests showing that the before and after URLs return the same resource.

### `rel=canonical` is a hint, not a merge verdict

The [HTML Living Standard](https://html.spec.whatwg.org/multipage/links.html#link-type-canonical) defines `rel="canonical"` as the preferred URL for the current document. A fetcher should preserve `requested_url`, redirect-resolved `final_url`, `declared_canonical`, and its own `normalized_url`, rather than retaining only the last one.

Before merging a canonical target into an existing document, confirm that the target is retrievable, does not jump to an unrelated domain, and has an identical or highly similar content fingerprint. Misconfiguration, template-wide canonical tags, and malicious pages can all point elsewhere.

## Second deduplication layer: fingerprint content to find syndication and mirrors

URL equality finds only URL duplicates. To identify syndicated articles and mirrors, retain three fingerprints:

| Field | Input | Purpose |
|---|---|---|
| `raw_sha256` | Raw response bytes | Prove the stored payload has not changed |
| `text_sha256` | Normalized text from a pinned extractor | Find exact body-text copies |
| `near_dup_hash` | Tokenized SimHash or MinHash | Find copies with changed headlines, ads, or small edits |

[RFC 9530](https://www.rfc-editor.org/rfc/rfc9530.html) distinguishes `Content-Digest` over HTTP message content from `Repr-Digest` over a selected representation. Your database should likewise identify exactly what was hashed. A single field named `hash` does not reveal whether its input was compressed bytes, decoded HTML, or extracted body text.

Version the text transformation as well, for example `extractor=crawl4ai@x.y` and `normalizer=text-v3`. When the extractor changes, add another fingerprint instead of silently replacing the old value. A similarity hash produces suspected duplicate candidates; merging still requires checking title, publication time, author, body overlap, and outbound links.

Choose a `representative_source_id` for each duplicate cluster, but retain every URL. The representative for a specification claim is usually the official document. The earliest timestamp may matter more when tracing how a story spread. Deduplication must not erase provenance.

## Separate source authority from source independence

Source tiers are not a universal credibility score. Start with explainable categories:

| Tier | Definition | Claims it is suited to support |
|---|---|---|
| `official` | Standards body, government, or product documentation | Specifications, policy, features, pricing |
| `primary` | Original paper, author data, statutory text, or first-party event record | Methods, results, firsthand statements |
| `secondary` | Analysis or reporting with named authors and editorial accountability | Context and cross-checking |
| `aggregator` | Search snippet, roundup, or unattributed copy | Leads, not critical-claim support |

Evaluate the tier together with the claim type. A vendor page can establish what the vendor says a feature does; it cannot independently prove that the product is better than a competitor. A third-party review likewise does not replace official API documentation for a parameter definition.

Use a separate `independence_group` field to prevent syndicated copies from counting as corroboration. Start with the content-duplicate cluster, then manually group a wire-service story and its republications, rewrites of one press release, or several pages from the same research team. Different domains do not guarantee independent evidence.

## Split prose into atomic claims, then build a claim-source matrix

“Tool A launched in 2026, is free, is the fastest option, and complies with a standard” contains at least four independently falsifiable claims. Attaching one URL to that sentence hides which part the source supports. Split it into atomic claims: one subject relationship, one testable outcome, and any necessary time or comparison condition.

Then build the claim-source matrix:

| Claim | Source A | Source B | Decision |
|---|---|---|---|
| `c-01` The specification defines field X | `full` (official spec §3) | `partial` (implementation docs) | supported |
| `c-02` The service is available in Taiwan | `no_support` | `full` (region list) | single-source |
| `c-03` p95 latency is lower | `contradicts` | `full` (same-run benchmark) | conflicted |

Use at least `full`, `partial`, `no_support`, and `contradicts` for `support`. A `partial` edge must not become full support during rendering, and a contradiction must not disappear because of retrieval ranking. When a critical claim requires two sources, count distinct `independence_group` values, not URLs.

### Quote spans are the smallest auditable citation unit

Each evidence edge stores a short quotation, start and end offsets into the snapshot's normalized text, and a human-readable `locator` such as a section, page, or paragraph ID. Offsets make the check rerunnable; locators make review practical.

Do not store only the search snippet. A snippet may omit a negation, combine distant passages, or change across queries. Citation checks must return to the fetched full text. If copyright or data policy prevents storing a complete copy, retain a permitted short quotation, its digest, capture time, and enough location data to retrieve it again.

## Pages change: preserve snapshots instead of assuming a URL means one text forever

Every snapshot used as evidence should retain at least:

```yaml
snapshot_id: snap-004-20260822T031500Z
requested_url: https://example.org/doc?utm_source=x
final_url: https://example.org/doc
retrieved_at: 2026-08-22T03:15:00Z
http_status: 200
content_type: text/html; charset=utf-8
etag: '"abc123"'
last_modified: Thu, 20 Aug 2026 09:00:00 GMT
raw_sha256: 8d969eef6ecad3c29a3a629280e686cff8ca...
text_sha256: 2bb80d537b1da3e38bd30361aa855686bde0...
extractor: readability@0.6.0
normalizer: text-v3
text_path: snapshots/snap-004-20260822T031500Z.txt
archive_url: https://archive.example/snap-004
```

At larger scale, use [WARC 1.1](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/), which defines separate request, response, metadata, conversion, and revisit record types as well as a payload-digest field. [RFC 7089 Memento](https://www.rfc-editor.org/rfc/rfc7089.html) defines `Memento-Datetime` and the `original` link relation so that an archived state remains associated with both its original resource and capture time.

A third-party archive URL is an additional copy, not a substitute for your local snapshot. Archiving can fail because of robots rules or takedown policy, and it can omit content rendered by JavaScript. High-risk material also needs licensing, privacy, access-control, and retention rules. Reproducibility is not permission to copy without limits.

## Turn citation validation into a rerunnable gate

Do not finish generation by asking an LLM whether the citations look correct. Run deterministic checks first, then send semantic support decisions to a human or a pinned evaluator. This minimal validator assumes a `bundle.json` containing `claims`, `evidence`, and `snapshots`:

```python
import hashlib
import json
import sys
from pathlib import Path

bundle = json.loads(Path(sys.argv[1]).read_text())
snapshots = {x["id"]: x for x in bundle["snapshots"]}
evidence_by_claim = {}
errors = []

for edge in bundle["evidence"]:
    evidence_by_claim.setdefault(edge["claim_id"], []).append(edge)
    snap = snapshots.get(edge["snapshot_id"])
    if not snap:
        errors.append(f'{edge["claim_id"]}: missing snapshot')
        continue
    text = Path(snap["text_path"]).read_text()
    start, end = edge["quote_start"], edge["quote_end"]
    if text[start:end] != edge["quote"]:
        errors.append(f'{edge["claim_id"]}: quote span drifted')
    digest = hashlib.sha256(text.encode()).hexdigest()
    if digest != snap["text_sha256"]:
        errors.append(f'{edge["claim_id"]}: snapshot digest mismatch')

for claim in bundle["claims"]:
    full = [e for e in evidence_by_claim.get(claim["id"], [])
            if e["support"] == "full"]
    groups = {e["independence_group"] for e in full}
    required = 2 if claim["importance"] == "critical" else 1
    if len(groups) < required:
        errors.append(f'{claim["id"]}: {len(groups)}/{required} independent sources')

if errors:
    raise SystemExit("\n".join(errors))
print("citation bundle: ok")
```

The semantic pass should append `checker_version`, rationale, and one of `full/partial/no_support/contradicts`, not overwrite a boolean. If an LLM evaluates support, pin its model, prompt, and temperature, and retain a human-audited sample. Rerun the same bundle after model upgrades so you can distinguish changed evidence from a changed evaluator.

The CI gate can now be explicit: every critical claim has a snapshot, a replayable quote span, a matching content digest, and full support from at least two independent sources; ordinary claims require one. Report citation coverage separately, but never let “95% average coverage” hide the unsupported central conclusion.

## A practical processing order

```text
search hits
  -> URL normalization (retain raw / final / canonical)
  -> fetch + snapshot (bytes, text, headers, timestamp, hash)
  -> exact / near-duplicate clustering
  -> source tier + independence group
  -> split draft into atomic claims
  -> evidence retrieval + quote spans
  -> claim-source matrix
  -> deterministic gate
  -> semantic / human review
  -> render citations
```

This pipeline deliberately separates “found,” “fetched,” “trusted,” and “supports this sentence.” A search provider's score can decide which result to read first. It cannot decide canonical identity, source independence, quote spans, or snapshots for you.

The tradeoff is straightforward. Extra metadata and snapshots increase storage, rights-management, and implementation costs. In return, the system can answer four questions: what exactly was claimed, which source supported it, what the source said at the time, and whether the evidence still passes when checked again. If one answer is missing, you have a link, not a reliable citation.

## References

- [RFC 3986 — URL normalization and URI comparison](https://www.rfc-editor.org/rfc/rfc3986.html)
- [WHATWG HTML — Canonical URL link type](https://html.spec.whatwg.org/multipage/links.html#link-type-canonical)
- [RFC 9530 — Content fingerprints and HTTP Digest Fields](https://www.rfc-editor.org/rfc/rfc9530.html)
- [WARC Format 1.1 — Web snapshot format (IIPC)](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)
- [RFC 7089 — Archive snapshot time and original resources](https://www.rfc-editor.org/rfc/rfc7089.html)
- [How to Build a Deep Research Agent](/posts/ai/2026-06-04-autonomous-deep-research-agent-en)
