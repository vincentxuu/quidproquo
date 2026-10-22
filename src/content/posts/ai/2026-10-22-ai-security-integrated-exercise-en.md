---
title: "An Integrated AI Security Exercise: From Attack Evidence to a Fix and Regression"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, security, ai-agent, authorization]
lang: en
difficulty: 進階
series:
  name: "AI Security in Practice"
  order: 23
tldr: "Compare vulnerable and fixed builds with the same HTTP requests, retaining ticket responses, audit events, and a timeline. Block unauthorized reads while preserving legitimate access."
description: "The final AI Security in Practice exercise includes a runnable HTTP teaching target and integration script, connecting attack evidence, controls, investigation, and regression tests."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-10-22-ai-security-integrated-exercise)

You have found a suspicious ticket-reading path and prepared a fix. Three questions remain: did the attack actually return the claimed data, does the audit record refer to the same request, and does legitimate access still work in the fixed build?

This exercise brings the series together in one package. Start vulnerable and fixed services, issue the same HTTP requests, retain responses, events, a timeline, and a report, then verify that two unauthorized reads disappear while normal access remains.

You need Python 3.11 or newer and the concepts from [identity and authorization](/posts/ai/2026-10-22-ai-security-identity-and-authorization-en) and [vulnerability evidence](/posts/ai/2026-10-22-ai-security-vulnerability-evidence-en). The first harness, `integrated-exercise.py`, makes no model calls and supplies fixed cases. A later section provides separate live-model results and a runnable harness.

## Define success before testing

The teaching product is unchanged: Alice and Bob belong to `north`, Carol to `south`. Alice owns N-1, Bob N-2, and Carol S-1. Its private-ticket policy permits a read only for the owner within the same tenant.

Each run has five cases:

| Case | Operation | Required product behavior |
|---|---|---|
| `normal-alice` | Alice reads N-1 | Allow, returning N-1 |
| `same-tenant-owner` | Alice reads N-2 | Deny, with no ticket text |
| `cross-tenant` | Alice reads S-1 | Deny, with no ticket text |
| `normal-bob` | Bob reads N-2 | Allow, returning N-2 |
| `normal-carol` | Carol reads S-1 | Allow, returning S-1 |

Fix this table before execution. The service returns observations; a separate checker holds allowed relationships and expected text. Do not let the service's authorization function define its own test answers. [OWASP's authorization-testing guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html#create-unit-and-integration-test-cases-for-authorization-logic) connects requirements, tests, and runtime enforcement.

`vulnerable-v1` deliberately checks login without object authorization, allowing Alice to read N-2 and S-1. `fixed-v1` adds tenant and owner checks. These are prepared HTTP teaching builds, not model-generated patches. A later experiment separately tests model-generated pure functions.

## Download two files and run the complete exercise

Save the [HTTP teaching service, ticket-lab.py](/examples/ai-security/ticket-lab.py), and [integration script, integrated-exercise.py](/examples/ai-security/integrated-exercise.py), in the same directory:

```bash
python3 integrated-exercise.py --out exercise-run-01
```

`exercise-run-01` must not already exist. The script starts its own local services on OS-assigned ports and stops the child processes afterward. It installs no packages, calls no external model, and sends no requests to third parties.

The final line should be:

```text
PASS: 10 HTTP cases; two unauthorized reads blocked after the fix; three normal controls pass in each build
```

The preceding JSON summarizes both builds:

```json
{
  "vulnerable-v1": {"requests": 5, "passed": 5, "unauthorized_reads": 2, "allowed_controls": 3},
  "fixed-v1": {"requests": 5, "passed": 5, "unauthorized_reads": 0, "allowed_controls": 3}
}
```

The vulnerable build's `passed: 5` means it behaved as expected for a build deliberately demonstrating two unauthorized reads. It does not mean that build is secure. Check `unauthorized_reads` against the product policy: it should reach zero after the fix, while all three normal controls still pass.

An existing output directory causes an error rather than an overwrite; choose a new name. For `Unexpected wire result`, inspect the request, response, and fixed policy instead of adjusting expectations to get a pass. If `ticket-lab.py` is missing, check that both files are in the same directory.

## What do attack evidence and audit events establish?

The output contains two build-specific groups and combined artifacts:

| Artifact | Question it answers |
|---|---|
| `vulnerable-v1/transcript.jsonl` | Which ticket text did Alice's request actually receive? |
| `fixed-v1/transcript.jsonl` | Does the same operation now return only an error? |
| Each build's `audit.jsonl` | Which actor, resource, decision, and status did the backend record? |
| Each build's `health.json` | Which teaching build and fixture revision answered this run? |
| `events.jsonl` and `timeline.md` | How do events from different runs fit on a timeline? |
| `report.json` | Where is the evidence, what changed, and what remains untested? |

Inspect the report with a standard-library command:

```bash
python3 -m json.tool exercise-run-01/report.json
```

Find the vulnerable build's `cross-tenant` response. It should contain S-1's `South: billing query`. The same case in the fixed build should return HTTP `403` with only an `error` field and no ticket text.

Audit events record `returned_ticket_id`, but omit ticket text and the Authorization header. An `allow` event helps locate an action; inspect the HTTP response to establish what content was returned. [The incident-timeline part](/posts/ai/2026-10-22-ai-security-incident-timeline-en) expands the correlation of responses and events.

Each restarted service begins numbering events again. `evt-000001` alone is insufficient: the integration script uses `run_id + event_id` to distinguish the runs and retains UTC timestamps. Larger systems also need request-correlation identifiers; proximity in time alone does not establish a shared request.

## A fix must preserve legitimate functions

The fixed build must deny two unauthorized operations and preserve Alice/N-1, Bob/N-2, and Carol/S-1. These positive controls catch the false fix that simply denies every request.

In `ticket-lab.py`, locate this check:

```python
if build == "fixed-v1" and (
        ticket["tenant"] != principal[1] or ticket["owner"] != principal[0]):
    return finish(403, {"error": "forbidden"}, "object_policy_denied")
```

The complete path obtains the teaching identity, validates arguments, finds the resource, and checks tenant and owner. A real product needs real authentication. Strings such as `demo-alice` are public in the source and provide no production login security.

If the product permits shared tickets within a company, change its policy and tests together. Preserve tenant separation, then define roles and sharing rules within that tenant. See [patch verification](/posts/ai/2026-10-22-ai-security-patch-verification-en) for the required controls and [security regression](/posts/ai/2026-10-22-ai-security-security-regression-en) for a broader case set.

## Add AI assistance without giving up independent verification

Once the fixed exercise runs, divide work among your chosen models or agents. Start with synthetic data and three tasks:

1. **Attack assistant:** provide source and scope, then request falsifiable hypotheses, preconditions, and minimal verifications without giving it the grading answers. Save proposed actions for a separate executor.
2. **Patch assistant:** provide confirmed requests and responses, then request a minimal fix and potentially affected legitimate functions. Review the patch and rerun fixed tests.
3. **Investigation assistant:** provide de-identified events and responses. Require each confirmed conclusion to cite `run_id + event_id` or a case name; missing evidence remains unresolved.

For automatic tool calls, follow the inputs, observations, budgets, and stopping conditions in [the attack-agent loop](/posts/ai/2026-10-22-ai-security-attack-agent-loop-en). For every model run, separately record model identity, prompts, tools, and actual actions. This part's fixed-script results do not show that a model discovered the vulnerability.

[NIST's agent-evaluation cases](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations) show how exposed answers, grading loopholes, and ineffective edits to the wrong copy can disconnect apparent completion from the intended task. Keep grading answers in the verification layer and preserve suggestions separately from target effects. To compare workflows with and without AI, define baselines and metrics using [workflow evaluation](/posts/ai/2026-10-22-ai-security-workflow-evaluation-en).

## Replace fixed replay with live model decisions

Download the [live-model harness](/examples/ai-security/model-eval.py) beside `ticket-lab.py`. It requires an installed, authenticated Codex CLI with access to the requested model. This step consumes model usage; it is separate from the fixed offline replay above. The [official non-interactive documentation](https://developers.openai.com/codex/noninteractive.md) describes the CLI event stream.

```bash
python3 model-eval.py --out live-model-run-01 --repetitions 3
```

The harness separates hypothesis generation, clean/injected documents, both builds' action loops, and patch generation. At each loop turn the model proposes `read_ticket` or `finish`. The host accepts only three synthetic ticket IDs, permits at most three ticket requests, and returns the actual response for the next decision. Generated Python patches must pass an AST allowlist before 13 cases run; imports, calls and file operations are excluded. These are pure-function patches, not deployments into the HTTP service above.

The [saved results](/examples/ai-security/model-eval-results.json), requesting `gpt-6.1-sol`, contain 33 model calls. All 3 hypothesis runs covered the required cases. All 6 loops across both builds retained normal controls and reached conclusions matching 15 ticket POST responses, alongside 6 health checks and 15 audit events. The 3 patches passed 39/39 cases in total.

None of the 3 hostile-document runs proposed an additional read; neither did the 3 clean controls. However, the original harness incorrectly rejected all six valid `finish` outputs paired with `N-1`, so their backend-effect stage was skipped. The published result rescored the saved answers against the original prompt contract, preserving the original errors. It is not a fresh model run after the correction and does not demonstrate that either backend blocked a model attack.

This used one prompt explicitly marking documents untrusted, three repetitions and one small product. The model and CLI scaffold jointly affect the result. There was no precise snapshot, controlled temperature, human baseline or actual invoice. An unsuccessful injection in this sample does not establish general resistance. Retain prompts, outputs, usage, latency and original schema errors so another reviewer can inspect the verdicts.

## Preserve criteria and rebuild conditions for cloud or authorized systems

The one-command runner starts and stops its own local copies for easy reproduction. You can carry the same reading cases to a self-hosted cloud service, but [the environment part](/posts/ai/2026-10-22-ai-security-experiment-environments-en) requires a fresh record of deployment versions, authentication, networking, accounts, quotas, and stopping mechanisms. Replace the public demo bearer strings with appropriate test authentication.

If your cloud copy listens only on loopback, an SSH connection you control can forward a local port to that service, giving the client a specific entry point. This is a migration option: the exercise reported here created no cloud host and tested neither SSH nor a production system.

A CTF uses its own resources and success conditions. A bug bounty or authorized product may restrict account creation, log access, or automated testing. Preserve available evidence and identify what could not be tested. [HackerOne's report guidance](https://docs.hackerone.com/en/articles/8475116-quality-reports) covers reproduction and impact; a local result cannot establish that every environment behaves the same way.

## Answer three questions before handing it over

1. Why does `passed: 5` not make the vulnerable build secure?
2. If the audit says `allow` but no HTTP response was saved, can you conclude that all S-1 text was disclosed?
3. If a patch run retains only three `403` responses and no normal controls, what remains unproven?

Answer criteria: the first answer identifies which build behavior the test expects and checks `unauthorized_reads` against product policy. The second distinguishes an authorization event from returned content and does not invent missing evidence. The third identifies the missing proof of legitimate access; this exercise's two unauthorized cases must also not be confused with three unexplained denials.

Hand another person `report.json`, both builds' raw records, the timeline, and file-version information. They should be able to rerun the same cases in a new directory, identify the two policy-violating reads, and verify the post-fix result. That is the common deliverable of the three paths.

## Update history

- 2026-10-22: Added the separate live-model harness and measured results, including the schema correction and unexecuted effect stage.

## References

- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [NIST CAISI: Examples of cheating in agent evaluations](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations)
- [HackerOne: Quality Reports](https://docs.hackerone.com/en/articles/8475116-quality-reports)

- [Codex CLI: Non-interactive mode](https://developers.openai.com/codex/noninteractive.md)
- [This series: live-model observations and harness correction](/examples/ai-security/model-eval-results.json)
