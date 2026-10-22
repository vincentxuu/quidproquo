---
title: "Build an AI-Assisted Incident Timeline Without Inventing Missing Events"
date: "2026-10-22"
type: "guide"
category: "ai"
tags: ["ai-security", "security", "ai-agent", "authorization"]
lang: "en"
description: "Preserve original timestamps, collection times, source identity, and event IDs while turning real HTTP audits and a separate synthetic gap fixture into traceable timelines."
tldr: "Normalize time without discarding provenance. One ticket read establishes that read; an assistant claim, missing logs, and a later denial cannot substitute for the underlying evidence."
difficulty: "進階"
draft: true
series:
  name: "AI Security in Practice"
  order: 19
---

> 🌏 [中文版](/posts/ai/2026-10-22-ai-security-incident-timeline)

The assistant says, “I exported all customer tickets.” The API audit contains one successful Alice/S-1 read. If an AI summary becomes “complete customer-data breach,” fluent writing has expanded the incident beyond its evidence.

An incident timeline puts observations from different sources in chronological context while preserving a path back to each original record. Following [patch verification](/posts/ai/2026-10-22-ai-security-patch-verification-en), you will produce a timeline with event IDs, original timezones, query scope, and open questions. You need JSON and basic Python. Start with real local HTTP audits, then use a separate synthetic fixture for collection delays and gaps. No model is called.

## Decide what each source can establish

[OWASP’s logging guidance](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) calls for when, where, who, and what, distinguishing event time from logging time. Records crossing trust boundaries may be missing, forged, altered, or replayed.

The ticket API records which object it returned. Conversation logs record what the assistant said. A collector records missing coverage. Keep these sources distinct instead of merging them into an unattributed “the system reported.”

| Field | Purpose | Example |
|---|---|---|
| target/build/event_id | Locate an event in a particular execution | IDs reset when the lesson service restarts |
| timestamp | Original event time and timezone | `09:00:01+08:00` |
| received_at | Collection time, only if available | `01:00:06Z` |
| actor/resource/action | Who did what to which object | alice / S-1 / read_ticket |
| request_id | Join events for one interaction | Synthetic R-2 |
| status/returned_ticket_id | Actual tool result | 200 / S-1 |

## Capture requests that actually cross HTTP

Download the [ticket service](/examples/ai-security/ticket-lab.py), [HTTP capture program](/examples/ai-security/analyst-http-capture.py), [analysis program](/examples/ai-security/analyst-demo.py), and [truth file](/examples/ai-security/analyst-truth.json) into one directory. Use Python 3.11 or later. Run:

```bash
python3 analyst-http-capture.py --out http-run-1
python3 analyst-demo.py timeline --input http-run-1/vulnerable-v1-audit.json > http-timeline.json
```

The capture program starts each of two local builds, sends nine actual HTTP reads to each, retrieves its audit, and stops the process. It contacts no external target. Expect `http_requests_checked: 18` and `builds: 2`. The output directory must be new; use `http-run-2` for another run to preserve earlier evidence.

Alice/S-1 returns 200 with synthetic S-1 content on vulnerable-v1, and 403 without text on fixed-v1. Each audit’s `returned_ticket_id` can be joined to its trace’s raw response. The real service does not provide request_id, received_at, or a collector-gap field. The analyzer does not invent them.

Event IDs restart with each service process. When citing across builds, retain target, build, and event_id together. `evt-000003` alone cannot distinguish an earlier read from a later denial.

## Practice delayed collection with a synthetic fixture

Without `--input`, the analyzer uses its fixed synthetic events, separate from the HTTP capture:

```bash
python3 analyst-demo.py timeline > synthetic-timeline.json
```

The input file order is deliberately scrambled. The program converts timestamps to UTC, preserves the original fields, and sorts the result. Expect E-001 through E-005.

| UTC event time | Event | Supported observation |
|---|---|---|
| 01:00:00 | E-001, API | Alice reads her own N-1 |
| 01:00:01 | E-002, API | Alice’s R-2 receives S-1 |
| 01:00:02 | E-003, assistant | R-2 claims every ticket was exported |
| 01:05:00 | E-004, API | fixed-v1 denies Alice/S-1 |
| 01:06:00 | E-005, collector | Coverage gap from 01:06 to 01:07 |

E-002’s original `09:00:01+08:00`, a common local timestamp in Taiwan, equals `01:00:01Z`. It arrives at `01:00:06Z`. Sorting by received_at would place the assistant’s statement before the read. Keeping both times exposes delayed collection.

The program rejects timestamps without a timezone instead of assuming Taipei time. For equal timestamps, ID ordering makes output stable; it does not establish causality. Clock uncertainty across sources also requires separate documentation. A one-second difference is not sufficient proof of causal order.

## Attach evidence to every sentence

A short finding can say: E-002 establishes that Alice received Carol’s S-1, contrary to the owner-only policy. E-003 establishes a broader assistant claim. With no corresponding bulk-read or download evidence, the confirmed disclosure remains one ticket.

E-004 establishes that one request was denied after the fix, not that previously disclosed data was recovered. E-005 makes later coverage incomplete. Reads from 01:06 to 01:07 remain unresolved. Next investigate original API backups, database access records, and outbound-transfer records instead of asking a model to finish the narrative.

An assistant task can require an event ID for every sentence and separate observations, inferences, and open questions. Missing evidence should name the queried source, time window, and coverage gap. A reviewer still needs to inspect original records. [SIABench](https://arxiv.org/html/2603.06422v1) analyzes wrong commands, shallow investigation, hallucination, and dependent-question failures. Its assumptions include intact and accessible artifacts; its task results do not establish reliable closure when a product’s logs are missing.

## Map product records without copying customer data

For an authorized cloud product, map `TimeGenerated` or service event_time to timestamp, collector arrival time to received_at, user object ID to actor, API trace ID to request_id, and object ID to resource. Preserve original fields and a conversion table before adding normalized ones.

Public training artifacts can use the same mapping after checking timestamp formats and capture intervals. If a PCAP lacks application identity, record the omission; an IP address alone does not establish that Alice acted. A dataset containing only summaries cannot provide the same object-read evidence.

Logs themselves are sensitive. This article uses synthetic people and tickets. Keep real originals within the organization’s approved environment and share redacted copies. Do not add credentials or complete customer content to audits merely to make AI analysis easier.

## Self-check: which missing evidence changes the conclusion?

Does E-003 alone establish a complete breach? It establishes that the assistant made the statement, not that the operation succeeded.

Can the absence of later records after E-005 establish no further attack? Coverage is incomplete for that interval. Mark it unresolved and investigate additional sources. The next guide uses this distinction to decide which alerts can close and which require escalation.

## References

- [OWASP: Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html): fields, time synchronization, integrity, and missing coverage.
- [SIABench: Before You Hand Over the Wheel](https://arxiv.org/html/2603.06422v1): 2026 evaluation; assumptions and methods in II, III, V, and Appendix C.
- [Next: Can an AI “False Positive” Decision Close an Alert?](/posts/ai/2026-10-22-ai-security-alert-triage-en).
