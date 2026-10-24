---
title: "AI Code Review: Turn Suspicious Code into a Testable Finding"
date: "2026-10-22"
type: "guide"
category: "ai"
tags: ["ai-security", "security", "ai-agent", "authorization"]
lang: "en"
description: "Trace a ticket read from identity to response, test partial authorization fixes against an independent policy matrix, and produce a reproducible F-17 finding."
tldr: "Trace identity, object selection, and the return path before testing allowed and forbidden pairs. Review comments propose hypotheses; an independent policy and observed output establish the finding."
difficulty: "進階"
draft: false
series:
  name: "AI Security in Practice"
  order: 17
---

> 🌏 [中文版](/posts/ai/2026-10-22-ai-security-code-review)

You ask an AI reviewer to inspect a ticket API. It reports a possible authorization issue. After you add a tenant check, it says the issue is resolved. Yet Alice can still read Bob’s ticket within their shared company. The review missed the application’s actual policy.

This guide turns a review comment into a testable finding. You need basic Python and the policy from [identity and authorization](/posts/ai/2026-10-22-ai-security-identity-and-authorization-en): Alice and Bob belong to north; Carol belongs to south. They own N-1, N-2, and S-1 respectively. Reading requires both the correct tenant and ownership. Your deliverable is F-17, with a code location, counterexamples, and execution evidence.

## Separate reviewing, scanning, and verification

An AI review interprets the code and context it receives. Static analysis searches for patterns using queries and a model of the program. Dynamic verification executes inputs against an implementation. Keep their inputs and outputs separate.

[GitHub’s Autofix documentation](https://docs.github.com/en/code-security/code-scanning/managing-code-scanning-alerts/about-autofix-for-codeql-code-scanning) describes suggestions based on CodeQL alerts and selected code context. This differs from asking a model to infer the requirements of an entire product. The documentation identifies incomplete context, semantic errors, and partial fixes as limitations. These vendor disclosures do not establish a detection rate for our ticket policy.

The AI comments here are teaching examples; no model is called. The companion actually executes Python functions and a policy matrix. It also contains a deliberately weak syntactic baseline: does the function contain an `if` statement? This exposes the danger of a proxy metric. It is neither CodeQL nor a representation of commercial static analysis capabilities.

## Follow a read through the code

Download the [companion program](/examples/ai-security/analyst-demo.py) and [fixed truth file](/examples/ai-security/analyst-truth.json) into the same directory. Use Python 3.10 or later; there are no dependencies. Run the following in that directory. From this repository’s root, first run `cd public/examples/ai-security`.

```bash
python3 analyst-demo.py review
python3 analyst-demo.py matrix --implementation tenant-patch
```

Open `vulnerable`. Identify where `user` comes from, who controls `ticket_id`, where the object is retrieved, and where its data leaves the function. The teaching function assumes a trusted authentication layer establishes the user. In a real service, follow the call into that layer: a user copied from the request body would invalidate the assumption.

Then inspect `tenant_patch`. After fetching the ticket, it compares the user’s tenant with the ticket’s tenant. Alice is blocked from S-1. For N-2, both tenants are north, so Bob’s data is returned. The missing condition belongs between object retrieval and disclosure.

```python
if USERS[user][0] != ticket['tenant']:
    return 403, {}
return 200, ticket.copy()
```

Give a reviewer the policy and a concrete assignment:

```text
Policy: only the owner in the same tenant may read a ticket.
Trace the trusted origin of user, control of ticket_id, and checks before return.
For each finding give function/line, a reachable input, a forbidden pair,
and an allowed counterexample. Mark unknown authentication middleware
as a question to investigate rather than a confirmed vulnerability.
```

A requirement such as “people in the same company can view tickets” is ambiguous. Clarify whether that means all company tickets or only personal tickets before accepting a fix. A model-invented business rule sends both implementation and tests in the wrong direction.

## Challenge “a check exists, therefore it is safe”

Three users each try three tickets and one missing ID: twelve cells. `EXPECTED_ALLOW` fixes the allowed pairs independently of the implementation under test. Each test checks both the status and body, including that a denial does not disclose data.

| Implementation | Policy-conforming cells | Finding |
|---|---:|---|
| vulnerable | 6/12 | All six non-owner pairs disclose data |
| tenant-patch | 10/12 | Cross-tenant reads stop; two same-tenant unauthorized reads remain |
| owner-patch | 12/12 | These three tickets and missing IDs meet the policy |
| deny-all | 9/12 | Unauthorized reads stop, but three legitimate reads break |

`review` reports that tenant-patch contains an `if`, while its matrix still fails. Conversely, deny-all can look excellent if you test only forbidden access. Together these counterexamples show why you must test the semantics of the policy rather than the presence of a keyword.

A passing matrix covers these synchronous functions. It does not test HTTP authentication, caches, concurrent revocation, or database queries. In an authorized application, retain the same identity/object pairs, replace function calls with API requests, and record the target build and raw responses. A self-hosted cloud copy or an authorized product with test accounts works; the policy does not need to change to fit the environment.

## Leave a finding another person can reproduce

Save `definition_line` from `review` with the failing rows from `matrix`. The program reads current source positions; regenerate them after edits rather than copying a stale line number.

```text
finding_id: F-17
location: analyst-demo.py / tenant_patch / line reported by review
hypothesis: a non-owner in the same tenant can read a ticket
precondition: Alice is authenticated; owner-only policy is confirmed
reproduction: Alice / N-2 returns 200 with Bob's synthetic ticket body
controls: Bob / N-2 returns 200; Alice / S-1 returns 403 with no body
impact: same-tenant ticket confidentiality in this fixture
unexamined: other datasets and write privileges
next step: run the full owner-patch regression matrix
```

Keep observed output separate from inferred impact. If a model also proposes SQL injection, this program has no query statement supporting that claim. Ask which input, code path, and evidence are missing before adding another vulnerability category.

## Self-check: is a detailed comment enough?

The reviewer noticed a tenant check but missed ownership. Is its review complete? Under this confirmed policy, a required condition is still missing; the issue remains open.

Owner-patch passes all twelve cells. Is the product free of authorization issues? The result establishes only that this fixture’s matrix passes. The next article adds attack regression, legitimate functionality, and verification of the actual target build.

## References

- [GitHub: Responsible use of Copilot Autofix](https://docs.github.com/en/code-security/code-scanning/managing-code-scanning-alerts/about-autofix-for-codeql-code-scanning): suggestion inputs and semantic/partial-fix limitations.
- [Series: What Evidence Does an AI Vulnerability Claim Need?](/posts/ai/2026-10-22-ai-security-vulnerability-evidence-en): controls, raw output, and independent criteria.
- [Next: What Must You Verify After an AI Patch?](/posts/ai/2026-10-22-ai-security-patch-verification-en).
