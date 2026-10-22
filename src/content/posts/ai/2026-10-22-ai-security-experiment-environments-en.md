---
title: "Choose an AI Security Practice Environment: Local, Cloud, CTF, or Authorized Targets"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, security, ai-agent]
lang: en
description: "Choose a local fixture, CTF instance, self-hosted cloud copy, or authorized system based on your experiment. Record versions, initial state, and outcome criteria with an offline checker."
tldr: "Use a resettable copy to examine application logic, preserve cloud conditions to examine deployment boundaries, and follow the agreed scope for real systems. Keep the question and outcome criteria when changing environments, and record what changed."
difficulty: 入門
draft: true
series:
  name: "AI Security in Practice"
  order: 3
---

> 🌏 [中文版](/posts/ai/2026-10-22-ai-security-experiment-environments)

You have tested ticket access on your own computer. Before asking AI to help find vulnerabilities, should you move to the cloud, choose a CTF challenge, or test a system your organization has authorized?

Choose based on the question. A small copy can show what happens when an owner check is missing. To investigate whether a deployed gateway supplies the wrong identity, include the relevant deployment conditions. These experiments examine different things.

This article follows [the vulnerability evidence guide](/posts/ai/2026-10-22-ai-security-vulnerability-evidence-en). You should be able to read JSON, run Python, and understand allowed and denied controls. You will produce an environment record for rerunning an experiment and can start with any environment. Local practice is one option; the offensive path also covers cloud and authorized targets, as shown in [the series overview](/posts/ai/2026-10-22-ai-security-overview-en).

## Choose the conditions before the platform

This table offers starting points, rather than a ranking. Environments closer to production usually give you less freedom to reset data, change code, or obtain complete logs.

| Environment | Best question to investigate | Differences to record |
|---|---|---|
| Your own local copy | Can a code path reproduce a flaw, and does a patch fix it? | Omitted identity gateways, network boundaries, or real models |
| Assigned CTF or training instance | Can you identify and verify a vulnerability from the challenge clues? | Challenge version, assigned instance, success condition, platform rules |
| Self-hosted cloud copy | How do deployment identities, networking, and tool permissions affect the result? | Image version, service settings, network reachability, usage, cleanup |
| Authorized system or bug bounty | Do permitted tests reveal product risk in the real configuration? | Target and action scope, test accounts, automation rules, available evidence |

[PortSwigger Web Security Academy](https://portswigger.net/web-security) provides interactive online labs. [Stanford's Cybench](https://crfm.stanford.edu/2024/08/19/cybench.html) puts CTF challenges, task goals, and subtasks into an evaluation framework. Both help you practice recognizing vulnerabilities. Neither defines who should be allowed to read each record in your ticket product. Product tests still need your product's policy.

Cloud experiments can also be resettable. [Meta's CyberSecEval cyber-range documentation](https://meta-llama.github.io/PurpleLlama/CyberSecEval/docs/benchmarks/autonomous_uplift) describes attacker–target pairs, network conditions, and starting evaluation runs from a known state. It demonstrates a defined starting point for cloud experiments; it does not turn arbitrary public hosts into practice targets.

## Move the ticket question, and record what changes

Keep the teaching fixture from earlier articles: Alice and Bob belong to `north`; Carol belongs to `south`. N-1, N-2, and S-1 belong to Alice, Bob, and Carol respectively. The policy allows reads only when both tenant and owner match. Alice reading N-1 must be allowed; Alice reading N-2 or S-1 must be denied without ticket content.

**When moving a local copy to your cloud environment, first preserve the synthetic data and these three criteria.** Record the application version, then include the actual identity gateway, service identity, and network settings. If the local copy denies N-2 but the cloud copy returns it, compare the principal and policy version that finally reached the backend. Find which added condition changed the decision before attributing the difference to the model.

For a CTF, use its resources and success condition. PortSwigger's [User ID controlled by request parameter lab](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter), for example, supplies an account and asks you to obtain the designated user's API key. It practices the question “does the backend authorize access again after a resource identifier changes?” You do not need—and generally cannot—insert Alice's entire ticket fixture into the training platform. Solving that instance does not establish cross-tenant isolation in your product.

For an authorized real product, check which account and resource comparisons the engagement permits. If you can create two test accounts of your own, use their synthetic data for the comparison. If only one account is permitted and you cannot obtain a second account's resource, record the cross-account criterion as untested. A narrower conclusion is more useful than filling the gap with “secure.”

## In-scope targets still have rules about automation

Your scope record should answer: **which target, which actions, and under which rules?** “The company approved testing” is too broad. “Compare ticket-read authorization on the designated test API using two approved accounts” can be matched to an actual action.

[HackerOne's Safe Harbor FAQ](https://docs.hackerone.com/en/articles/8494502-safe-harbor-overview-faq) explicitly separates a protection statement from target scope: adopting safe harbor does not change the assets included by a program. Having a test account also leaves the program's rules about testing methods to check.

Record AI's role. Asking a model to read code you supplied and suggest hypotheses differs from letting an agent repeatedly call a target. [HackerOne's Code of Conduct](https://www.hackerone.com/policies/code-of-conduct) requires AI-assisted activity to follow each program's scope and testing restrictions, including automation, request volume, and rate limits. A platform welcoming AI does not establish that every program accepts automated testing. Resolve unclear actions before enabling connected execution.

For a self-hosted cloud copy, distinguish your application from connected services. Being able to modify your application does not establish that its email provider, model API, or shared infrastructure is included in the same test. Start the copy with synthetic data and test doubles, then enable the integrations this experiment actually needs.

## Write a record you can run again

[Download the environment record](/examples/ai-security/experiment-manifest.json). Its five groups contain a teaching example for an owned, offline fixture, with no real credentials:

| Field | What to record | Ticket example |
|---|---|---|
| `scope` | Exact target, allowed actions, basis, automation rules | Offline ticket fixture; `read_ticket` only |
| `recipe` | Version, starting data, observation method | Owner-only policy; three users; save expected and actual decisions |
| `success` | Allowed control, denied control, finding criterion | Alice can obtain only N-1; receiving N-2 or S-1 meets this fixture's finding criterion |
| `limits` | Execution mode, request, time, and cost ceilings | Three offline cases, with no paid model calls |
| `recovery` | Stop condition and return to the starting state | Stop after three cases; rebuild discarded in-memory data |

`environment` identifies the environment type separately. Record versions precisely enough to retrieve the same code and configuration: a commit, image digest, and configuration snapshot location, for example. The sample's `ticket-fixture-v1` is only a teaching label. When using a model, add its identifier and the prompt and tool versions to the version record, and save actual inputs and outputs. Model output can vary with identical parameters; rerunning should make differences explainable.

Initial state includes traces from previous runs. Earlier reads, permission changes, or populated caches may change the next path. Reset a self-hosted copy from a snapshot or recreate its synthetic data. Follow the platform's reset method for a shared training instance. If a real product cannot be reset, record observation time and known changes rather than promising bit-for-bit reproduction.

Request and cost ceilings are boundaries you choose for the experiment; the sample numbers are not platform quotas. For cloud or model services, add billing items and monitoring locations to `observation`, and configure stop conditions that the executor follows. A budget notification reports an event. Stopping still requires interrupting work and cleaning up the relevant resources.

## Run the offline check, then read the record yourself

[Download the Python checker](/examples/ai-security/experiment-preflight.py) and place it beside the JSON file. Run it with Python 3.11 or later:

```bash
python3 experiment-preflight.py experiment-manifest.json
```

The sample prints:

```text
PASS: record checks only; authorization, safety and reproducibility are unverified.
```

The program reads local JSON only. It does not scan, connect to targets, or deploy anything. It rejects missing targets, versions, and outcome criteria, as well as contradictions such as automated execution when automation is forbidden. Blank strings, negative costs, and missing request ceilings also fail.

Try changing `scope.automation` in the JSON to `forbidden`, leaving `limits.mode` as `automated`, and run the same command again:

```text
FAIL: automated run requires explicit automation allowance
```

The program exits with code `1` to indicate a failed check. Make the execution mode match the actual rules; do not change the permission field to `allowed` just to pass.

**Passing means only that these record checks passed.** The program cannot verify genuine authorization, meaningful prose, sensible quotas, working network isolation, or an implemented stop mechanism. A version value of “latest” can still pass, so a person must ask whether another reader can retrieve the same version. Writing “AI says there is a flaw” in `finding` does not make it valid evidence.

Try this tonight: choose an environment available to you, replace the sample target and criteria, run the checker, and describe the entire experiment using only the record. Whenever you need to fill in a condition from memory, add it to the relevant field.

## Self-check: does the conclusion survive the move?

1. Local testing uses a fixed fake identity, while cloud testing takes identity from a gateway. Results differ. Can you immediately blame model instability?
2. You solved a CTF's designated-account API-key challenge. Has the ticket assistant passed tenant isolation?
3. The JSON passes, but the engagement permits manual testing only. Can you enable an agent directly?
4. Without backend logs on a real system, what evidence can you keep?

For the first question, compare identity sources and policies before mixing deployment changes into a model conclusion. The second establishes only the challenge's specified authorization case. For the third, actual execution must match engagement rules; a file check supplies no permission. For the fourth, preserve available requests, responses, times, test accounts, and expected policy. Mark the backend path you could not confirm, without expanding access merely to complete the evidence.

You now have a record identifying a target, starting conditions, and criteria. Continue with [Part 4: understanding the attack surface](/posts/ai/2026-10-22-ai-security-attack-surface-en) to turn documents and interfaces into testable hypotheses within that scope.

## Update history

- 2026-10-22: Linked the attack-surface part. This navigation update does not reverify the original external claims.

## References

- [PortSwigger: Web Security Academy](https://portswigger.net/web-security)
- [PortSwigger: User ID controlled by request parameter](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter)
- [Stanford CRFM: Cybench](https://crfm.stanford.edu/2024/08/19/cybench.html)
- [Meta: Autonomous Offensive Cyber Operations](https://meta-llama.github.io/PurpleLlama/CyberSecEval/docs/benchmarks/autonomous_uplift)
- [HackerOne: Safe Harbor Overview & FAQ](https://docs.hackerone.com/en/articles/8494502-safe-harbor-overview-faq)
- [HackerOne: Code of Conduct](https://www.hackerone.com/policies/code-of-conduct)
