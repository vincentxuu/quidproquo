# Attack line writing gate

Authorization: user requested all remaining series articles; write orders 4–9 with bilingual parity. Do not change other workers' files or publish.

Reader: a developer who can send HTTP requests, completed orders 0–3, and wants to understand how AI helps attack analysis and why tool output needs an independent verdict.

| Order | Reader question and concrete decision | Outline / artifact |
|---|---|---|
| 4 | Which observed surface deserves the next request? | source-tagged surface map, role/resource edges, minimal observations, reject unsupported claims |
| 5 | Which model hypothesis can be disproved? | three authorization hypotheses, variable control, own/other-owner/other-tenant tests, hypotheses JSON |
| 6 | Did the intended exploit actually happen? | server identity/content, baseline/attack/patched comparisons, exact content assertions, finding |
| 7 | When does hostile document text become a harmful action? | document → candidate tool call → backend → effect, replay vs live model distinction, lab migration |
| 8 | How do observations decide another action or a stop? | planner/executor/verifier state, limits before execution, trace and stop tests |
| 9 | Which links of a chain have evidence? | HTTP chain, breakpoints, CTF contamination, first-party public incident and visibility limits |

Metadata: ai, guide, zh-TW/en, date 2026-10-22, draft true, ai-security tag, exact orders 4–9, Chinese series AI 資安實戰 / English AI Security in Practice. No personal experience invented. Prerequisites and boundaries lead each piece; each supplies exercise answers and failure cases. Final visual decision after reading diagram skill: compact tables suffice. Order 7 uses a four-handoff table (user/attachment/model/tool-backend), order 8 a response-dependent state-transition table, and order 9 a stage/precondition/evidence table. Each explicitly teaches the relevant relationship; no SVG/diagram was produced and no visual-preview completion is claimed.

Research questions: how to observe an attack surface without assuming access; how to turn a suspicion into a falsifiable test; how to separate tool completion from target effect; how indirect injection crosses trust; how orchestration and human decisions differ; what public incident evidence can support.

Groundlane callable inventory searched fully: no Groundlane tools mounted. Exa MCP search/fetch fallback used for public pages only. One incorrect PortSwigger URL returned CRAWL_NOT_FOUND; official search found correct URL, then full fetch succeeded. No private data, secrets, deprecated fetch tools, or third-party testing. Sources are persisted in raw and sources.jsonl. Complete extracted text, not media, was read; no efficacy figures cited. The Anthropic full report was read from start/changelog through six phases and implications. Its claims remain attributed vendor observations.
