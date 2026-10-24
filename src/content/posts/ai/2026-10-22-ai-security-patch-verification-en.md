---
title: "What Must You Verify After an AI Patch?"
date: "2026-10-22"
type: "guide"
category: "ai"
tags: ["ai-security", "security", "ai-agent", "authorization"]
lang: "en"
description: "Compare tenant-only, owner-aware, and deny-all fixes for one ticket vulnerability, then separate attack regression, functional tests, scanning, and target-build verification."
tldr: "A patch must block unauthorized access, preserve legitimate behavior, and pass against the actual target. A cleared alert and a passing local copy each establish only part of that result."
difficulty: "進階"
draft: false
series:
  name: "AI Security in Practice"
  order: 18
---

> 🌏 [中文版](/posts/ai/2026-10-22-ai-security-patch-verification)

An AI suggestion adds a tenant check for F-17. The cross-company test is blocked, so the fix appears complete. Alice can still read Bob’s N-2. Another suggestion returns 403 for every request. Exploitation stops, and so does the support team’s work.

Following the [code review guide](/posts/ai/2026-10-22-ai-security-code-review-en), this article builds a patch acceptance record: before/after matrices, untested areas, and target identity. You should be comfortable running Python tests. The initial four candidates are illustrative implementations executed by `analyst-demo.py`; the later live-model section separately generates and tests patches.

## Ask four separate acceptance questions

Does the attack stop? Does legitimate behavior survive? Does the original scanner agree, without new warnings? Does the actual deliverable behave that way? Each question supplies evidence the others cannot.

[GitHub’s Autofix documentation](https://docs.github.com/en/code-security/code-scanning/managing-code-scanning-alerts/about-autofix-for-codeql-code-scanning) separately checks the original alert, new alerts, syntax issues, and existing test results. It also warns of partial fixes and changed semantics. Our matrix adds the application-specific owner-only rule, which a general scanner cannot infer from an ambiguous sharing requirement.

| Acceptance layer | Evidence required | What a passing result alone can miss |
|---|---|---|
| Attack regression | Alice/N-2 and Alice/S-1 deny access without data | All requests might be denied |
| Legitimate functionality | Every owner can read their own ticket | Other users might also read it |
| Scanning and program checks | Original alert, new alerts, syntax results | Business rules outside the analyzer’s model |
| Actual target | Build, fixture, HTTP responses | Other nodes, stale caches, untested entry points |

This article executes the function matrix, not CodeQL or another full static scanner. Scanner results and final-deliverable checks in the table are evidence to collect during product acceptance.

## Run four candidates against one fixture

Download [analyst-demo.py](/examples/ai-security/analyst-demo.py) and [analyst-truth.json](/examples/ai-security/analyst-truth.json) into the same directory. Use Python 3.10 or later with no additional packages. Run these commands there; within the repository, the directory is `public/examples/ai-security`.

```bash
python3 analyst-demo.py matrix --implementation vulnerable > before.json
python3 analyst-demo.py matrix --implementation tenant-patch > partial.json
python3 analyst-demo.py matrix --implementation owner-patch > after.json
python3 analyst-demo.py matrix --implementation deny-all > broken-feature.json
python3 analyst-demo.py selftest
```

The `passed` values should be 6, 10, 12, and 9 respectively, out of 12. These count policy-conforming cells in a small fixture. They are neither detection rates nor AI patch success rates.

Inspect the rows rather than only totals. In partial.json, Alice/N-2 and Bob/N-1 expect 403 but receive 200 and a ticket body. Cross-tenant protection left a same-tenant authorization gap.

In broken-feature.json, the three owner pairs expect 200 and receive 403. A test suite containing only six forbidden pairs would approve that implementation while breaking normal work.

## Keep the oracle independent of the patch

The complete candidate, `owner_patch`, compares both tenant and owner before returning data. The `or` rejects a request when either requirement fails.

```python
if USERS[user][0] != ticket['tenant'] or user != ticket['owner']:
    return 403, {}
return 200, ticket.copy()
```

The expected allowlist is fixed separately: Alice/N-1, Bob/N-2, and Carol/S-1. Do not calculate expected results by calling the new policy function and then test that same function against those results. One mistake would change both the implementation and its answer key.

Check content as well. An allowed response must equal the prepared synthetic ticket. A denial must not contain ticket data. Missing IDs return 404 in this lesson. If a real product intentionally returns 404 to conceal object existence, specify that contract before changing expectations. A status difference alone does not decide security.

If supervisors may read other employees’ tickets, expand the policy matrix explicitly: supervisor identity, granted pairs, and revoked pairs. Do not redefine sharing after a failure merely to obtain a green result.

## Verify the code that will actually execute

The function matrix establishes behavior for this file. After shipping to a cloud test environment, separately record the target URL, health-reported build, fixture revision, test time, requests, and responses. Build identity helps locate the target; observed reads still establish behavior.

You can run the series’ [HTTP ticket service](/examples/ai-security/ticket-lab.py) in your own cloud test environment, or exercise the same matrix against an authorized product with three test accounts. A real product must establish identities through its actual authentication mechanism; `demo-alice` is only a lesson credential.

If the source is fixed but HTTP still discloses data, investigate the deployed artifact, process restart, routing, caches, and alternate read paths. Keep the failing response alongside the local result. A WAF blocking one string also does not establish repaired backend authorization; retry a different prepared object under the same policy.

## Turn untested risk into the next test

These twelve cells do not model concurrent revocation, ownership changes, or caches. A useful next test for a real service is: Alice successfully reads N-1; a trusted administrative API transfers ownership to Bob; Alice’s next read is denied and Bob’s succeeds. Specify when revocation must take effect and measure any asynchronous-cache window.

That extension is not implemented by this companion and has not passed here. It shows how to turn a limitation into actionable work instead of ending the report with a generic risk statement.

A patch handoff should retain F-17, before/after versions, the four matrices, scanner/configuration details, and untested entry points. Another reviewer should be able to rerun the evidence and identify which result would falsify your conclusion.

## Self-check: one-line fixes, different failures

What happens if `or` becomes `and`? With the same tenant but a different owner, the tenant-mismatch expression is false, so the combined denial condition fails. Alice/N-2 detects the regression.

Can a deny-all patch merge when every attack test passes? No. All three legitimate owner tests fail. Acceptance must examine allowed and forbidden behavior together.

The next article reconstructs a timeline from this ticket workflow. A fixed deployment stops future reads under tested conditions; it does not erase a disclosure that occurred before the patch.

## Live-model small sample: thirteen checks after generation

On 2026-10-22, three independent Codex CLI calls requested `gpt-6.1-sol` to repair the login-only `can_read` function. The prompt supplied the policy and function restrictions. The [three generated patches](/examples/ai-security/model-eval-results.json) were identical, checking a non-null actor, tenant equality, and ownership.

The host first applied an AST allowlist restricting output to one pure Boolean function, rejecting imports, calls, attribute access, and loops. It then used a separately declared answer table. Each patch passed 13/13 checks: three actors across four tickets, plus an unauthenticated case, totaling 39/39. N-3 belongs to another north user, testing whether same-tenant membership was mistaken for authorization.

These are limited function checks on model-generated code, separate from the earlier four human-authored candidates and twelve-cell matrix. The generated function was not deployed into the HTTP application or tested with a commercial scanner, concurrent revocation, or a real product. The AST restriction is not a general secure execution sandbox.

To rerun, download [model-eval.py](/examples/ai-security/model-eval.py) and [ticket-lab.py](/examples/ai-security/ticket-lab.py) into one directory, with Python 3.11 or later and an authenticated Codex CLI:

```bash
python3 model-eval.py --out live-run-01 --repetitions 3
```

The output directory must be new. This makes actual model calls and retains prompts, answers, usage, and HTTP records. The [Codex noninteractive documentation](https://developers.openai.com/codex/noninteractive.md) explains CLI and JSONL usage. The downloadable harness corrects the injection-stage output contract; a rerun produces new observations rather than a bitwise reproduction of these results.

This is a three-repetition small sample. The CLI accepted the requested model ID but returned no verifiable exact weight snapshot, and temperature was uncontrolled. CLI system instructions and scaffolding affect the observations. There is no per-call actual invoice and no model ranking.

## Update history

- 2026-10-22: Added the live-model small sample, runnable harness, and results while preserving the fixed cases and their separate limits.

## References

- [GitHub: Responsible use of Copilot Autofix](https://docs.github.com/en/code-security/code-scanning/managing-code-scanning-alerts/about-autofix-for-codeql-code-scanning): validation layers and misleading-fix limitations.
- [Series: Security Regression and Operational Monitoring](/posts/ai/2026-10-22-ai-security-security-regression-en).
- [Next: Build an Evidence-Linked Incident Timeline](/posts/ai/2026-10-22-ai-security-incident-timeline-en).
