---
title: "How to verify defenses: red teaming, regression, and monitoring"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, ai-agent, access-control, security-testing]
lang: en
description: "Run an independent policy matrix against two ticket-service builds and correlate HTTP, audit, and evaluator disagreements."
tldr: "Replay an independent authorization matrix against real HTTP responses before and after a fix, correlate audit events, and report model behavior, enforcement, and production monitoring separately."
difficulty: 進階
draft: false
series:
  name: "AI Security in Practice"
  order: 16
---

> 🌏 [中文版](/posts/ai/2026-10-22-ai-security-security-regression)

After a defense change, the assistant says, “I cannot disclose someone else's ticket.” That is encouraging, but it cannot close a finding if the backend still returns S-1 or an export has already occurred.

Turn [the preceding defenses](/posts/ai/2026-10-22-ai-security-injection-defenses-en) into acceptance criteria: **do legitimate tasks work, are prohibited reads and effects blocked, and do records agree?** Start with [vulnerability evidence](/posts/ai/2026-10-22-ai-security-vulnerability-evidence-en). Python 3.11 or newer is required.

## Keep discovery, regression, and monitoring distinct

Red teaming explores unknown failures. Regression preserves known failures as repeatable cases. Monitoring observes deployed requests and outcomes. Refusal rate, unauthorized-access rate, and legitimate-task success also need separate reporting. An all-deny system can look deceptively safe.

[OWASP's authorization regression guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Regression_Testing_Cheat_Sheet.html) builds a machine-readable actor/resource/action matrix covering horizontal, vertical, and tenant boundaries. Our minimum matrix has three users and three tickets.

| Caller | N-1 | N-2 | S-1 |
|---|---|---|---|
| Alice | Allow | Deny | Deny |
| Bob | Deny | Allow | Deny |
| Carol | Deny | Deny | Allow |

The oracle comes from product policy. Importing the server's own authorization function risks reproducing its bug in the expected result.

## Replay real HTTP before and after the fix

Download [the ticket service](/examples/ai-security/ticket-lab.py) and [the HTTP regression runner](/examples/ai-security/defense-http-regression.py) into one directory:

```bash
python3 defense-http-regression.py
```

The runner starts its own loopback child services for `vulnerable-v1` and `fixed-v1`, then stops them. It accepts no external target URL and does not probe third parties. Public `demo-alice` strings are teaching identities, not production authentication.

Expected final line:

```text
PASS: 18 HTTP requests; vulnerable=3/9 policy passes; fixed=9/9; 18 audit events correlated
```

The vulnerable build satisfies only the three legitimate reads. All six prohibited reads return `200`. The fixed build satisfies all nine expectations: owner reads remain `200`, while the others return `403` with only `error: forbidden`. Assertions inspect actual HTTP status and body shape.

Every request is also correlated with an audit event's status and build. This can expose mismatched records, but service-owned logs are not fully independent evidence. Real exports need receiver-side or state-change confirmation too.

## Interpret function-level PASS correctly

Download [the defense fixture](/examples/ai-security/defense-demo.py):

```bash
python3 defense-demo.py regression
```

Expected: `PASS: 58 deterministic checks; mode=regression; no LLM or network exercised`. Cases cover unsafe proposals, retrieval ACLs, revocation and caches, approval replay, MCP definition drift, output handling, and scoped capability checks. They supplement HTTP authorization; the shared HTTP target does not implement complete RAG, MCP, or export services.

`defense-judge-disagreement` supplies a synthetic record with refusal text and `export_count: 1`. A text judge says safe; an effect judge says unsafe. Passing the test means the disagreement was demonstrated, not that the target was safe.

## Test the evaluator too

A model judge can help classify many responses but can misjudge them. [Microsoft's Foundry red-team documentation](https://learn.microsoft.com/zh-cn/azure/foundry/concepts/ai-red-teaming-agent) discusses synthetic-data and model-evaluation limitations and recommends reviewing results. Give your judge known-safe, known-unsafe, and insufficient-evidence examples.

For hard boundaries, use observable state: prohibited chunks entering model requests, data arriving at a receiver, or approval reuse. Evaluate answer quality and task adherence separately. Preserve disagreement instead of letting confidence override effects.

Actual model evaluation should include Chinese inputs, multiple turns, tool-return injection, and different tenants. Fix model, prompt, tool, and policy versions and retain inputs and outcomes. This lesson makes no model calls and reports no injection-success rate.

## Carry cases into production operations

Preserve case ID, build, initial state, action, and expected outcome for each finding. Replay original attacks and legitimate tasks after fixing. Tool additions, model changes, and policy updates should trigger relevant regressions. These downloadable scripts do not alter your CI.

Production records can include request ID, authenticated actor/tenant, resource ID, policy revision, decision reason, operation ID, and outcome. Avoid logging full prompts, ticket content, or tokens by default. [OWASP's RAG guidance](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html) favors correlation and document identifiers with restricted evidence capture when necessary.

Cloud acceptance must exercise actual authentication, caches, egress, and failover nodes. Increased denial rates can mean attacks or broken policy deployment: inspect legitimate-task outcomes and reason codes. Rehearse tool shutdown, credential revocation, cache invalidation, and recovery. An alert does not prove disclosure was prevented.

## Check your understanding

1. Is `403` in all nine cells correct?
2. A judge says safe but the receiver gets S-1. Which verdict applies?
3. Do local HTTP results establish cloud acceptance?

Answers: no, three legitimate reads must work; unauthorized effects establish failure, with judge disagreement retained; and no, the deployed route requires separate verification. Start with one independent-oracle regression case, then use code review to find paths the matrix does not cover.

Continue: [Next lesson](/posts/ai/2026-10-22-ai-security-code-review-en).

## References

- [OWASP: Authorization Regression Testing](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Regression_Testing_Cheat_Sheet.html)
- [Microsoft: AI red teaming agent (in Chinese)](https://learn.microsoft.com/zh-cn/azure/foundry/concepts/ai-red-teaming-agent)
- [OWASP: RAG Security](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html)
