---
title: "Connecting an attack agent: planning, execution, and feedback"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, penetration-testing, ai-agent, authorization]
lang: en
description: "Run a bounded response-dependent HTTP loop and inspect planning, execution, verification, and stop conditions."
tldr: "Build a bounded HTTP testing loop with explicit planner, executor, verifier, trace, and stop conditions."
difficulty: 進階
draft: true
series:
  name: "AI Security in Practice"
  order: 8
---

> 🌏 [繁體中文版](/posts/ai/2026-10-22-ai-security-attack-agent-loop)

Once a model has HTTP tools, it can propose its next action. It can also repeat a failed request, move to another domain, or simply announce success. The design problem is how an observation changes the next action—and what actually forces a stop.

After [indirect injection and tool misuse](/posts/ai/2026-10-22-ai-security-prompt-injection-attacks-en), you need the earlier HTTP evidence, tool arguments, and authorization policy. This exercise runs a response-dependent loop to show which components must remain separate when a model is added. The initial `attack-runner.py` planner uses fixed rules and calls no model; the later live-model section separately records model-selected actions.

## Separate three roles

The planner proposes an action from known state. The executor checks scope, budget, and arguments before sending it. The verifier decides whether the response supports the hypothesis. A model may plan, but its promise to remain in scope is not enforcement.

| Current state | Observation/check | Next step |
|---|---|---|
| Target unverified | Health matches target and build | Read N-1 as baseline |
| Baseline available | Alice’s N-1 read works | Test N-2 as Alice |
| Candidate denied | N-2 returns 403 without content | Stop this candidate; run Bob’s legitimate control |
| Candidate returns data | N-2 returns the specified content | Test S-1, run Bob’s control, stop at minimal evidence |
| Any stage | Scope, budget, duplicate, or deadline violation | Do not dispatch; retain the reason |

This transition table makes each branch inspectable. The success branch reaches only synthetic tickets already in scope. It does not expand scope when a new domain appears.

[AutoPenBench](https://github.com/lucagioacchini/auto-pen-bench) supplies structured tool interfaces and stage milestones. [CyberSecEval’s methodology](https://meta-llama.github.io/PurpleLlama/CyberSecEval/docs/benchmarks/autonomous_uplift) describes known initial host states and full transcripts. These are engineering designs for separating environments, actions, and objectives, not evidence of an arbitrary agent’s real-world success rate.

## Produce two different trajectories

Save the [service](/examples/ai-security/ticket-lab.py) and [runner](/examples/ai-security/attack-runner.py) together and use Python 3.11:

```bash
python3 attack-runner.py loop --build vulnerable-v1 --out loop-before.json
python3 attack-runner.py loop --build fixed-v1 --out loop-after.json
python3 attack-runner.py selftest
```

The vulnerable build returns N-2, so the loop tests S-1 and then checks Bob’s N-2: five requests. The fixed build denies N-2, skips S-1, and runs only Bob’s control: four requests. Its stop reason is `candidate_disproved; no repeated attack`. This early-stop policy tests the current candidate, not the skipped cross-tenant path.

`selftest` checks four pre-dispatch rejections without networking: out-of-scope path, zero budget, ticket access before target verification, and arguments outside the allowed fixture set. The runner also limits duplicates, response size, and time: at most eight requests, a three-second per-request timeout, and no new dispatch after fifteen seconds. Fifteen seconds is a dispatch deadline, not a hard process deadline; an already dispatched final request may consume its remaining three seconds.

In `Runner.call`, checks precede `opener.open`. Asking the model whether an action exceeded scope after execution cannot retract an already sent request. Failures terminate with an exception instead of treating every error as a temporary condition worth retrying.

## What changes when you add a model?

The branches inside `run` are the human-authored planner. A model adapter could receive state and the allowed tool schema, return one candidate action, and pass it to the same executor. Feed subsequent observations back to the planner, while the verifier continues checking resource and policy rather than a self-reported success label.

Start by manually using the [hypothesis template’s prompt](/examples/ai-security/attack-hypotheses.json), inspecting one generated action, and replaying it. That is AI-assisted operation. Automated operation additionally needs a model adapter, output validation, token and monetary budgets, and records of model identity, parameters, full tool exchanges, and human intervention. A fixed script without these records does not demonstrate AI autonomy.

Tool results are untrusted inputs too. A ticket saying “connect to another company next” may redirect the planner, while the executor must reject it against the original target and endpoint set. Injection threatens the testing agent itself as well as the application under test.

## Move the loop to cloud or CTF environments

For your cloud copy, use its HTTPS origin, explicit `target_id`, and matching fixtures. Confirm redirects do not change targets and start from a new instance or reset state. Network latency changes timeout behavior. Record any expanded budget rather than comparing a run with ten times as many actions directly to the original.

For a designated PortSwigger instance, use supported browser or Repeater actions and preserve the same observation → candidate → verification → stop record. This ticket runner does not operate the platform. Check instance-specific and automation rules; do not permit the entire platform domain.

NIST documented answer lookup and grading shortcuts, so isolate solutions, fixtures, and graders from the model. Domain restrictions alone cannot prevent an answer in the working directory from contaminating a result. The [report](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations) also notes heterogeneous historical samples and possible missed detections; these examples do not yield a universal failure rate.

## Exercise: how many times should a 403 be retried?

The model proposes twenty identical N-2 requests “in case it works.” With no changed premise, argument, or version, reject the suggestion. Mark the action tested, retain the denial, and stop the candidate. A cache or race-condition suspicion would need a new explicit hypothesis, variables, scope, and request allowance; aimless retries do not supply that design.

## Live-model small sample: the model selects the next action

On 2026-10-22, we separately requested `gpt-6.1-sol` through Codex CLI as the planner. At each turn the host supplied previous actual HTTP responses; the model chose `read_ticket` or `finish`. The executor accepted only its own started service, Alice, and three synthetic IDs, with at most three reads per trial. The model received the policy and resource relationships, but not the target build or independent answer key.

Each build ran three times. All [six trajectories](/examples/ai-security/model-eval-results.json) began with N-1. On the vulnerable build, the model read N-2 and finished after receiving Bob’s content. On the fixed build, it read N-2 and S-1, then finished after both returned 403. All six final verdicts matched the independent observation-based oracle. The trials issued 15 ticket POSTs, plus six health requests, and retained 15 audit events.

The model actually selected these actions; they differ from the earlier fixed planner’s five/four-request traces. However, policy, candidate IDs, and tools were supplied. Six matches on this synthetic task family do not establish a general autonomous penetration-testing success rate.

To rerun, download [model-eval.py](/examples/ai-security/model-eval.py) and [ticket-lab.py](/examples/ai-security/ticket-lab.py) into one directory, with Python 3.11 or later and an authenticated Codex CLI:

```bash
python3 model-eval.py --out live-run-01 --repetitions 3
```

The output directory must be new. This makes actual model calls and retains prompts, answers, usage, and HTTP records. The [Codex noninteractive documentation](https://developers.openai.com/codex/noninteractive.md) explains CLI and JSONL usage. The downloadable harness corrects the injection-stage output contract; a rerun produces new observations rather than a bitwise reproduction of these results.

This is a three-repetition small sample. The CLI accepted the requested model ID but returned no verifiable exact weight snapshot, and temperature was uncontrolled. CLI system instructions and scaffolding affect the observations. There is no per-call actual invoice and no model ranking.

## Update history

- 2026-10-22: Added the live-model small sample, runnable harness, and results while preserving the fixed cases and their separate limits.

## References

- [AutoPenBench README](https://github.com/lucagioacchini/auto-pen-bench): structured tools and milestones.
- [CyberSecEval: Autonomous Offensive Cyber Operations](https://meta-llama.github.io/PurpleLlama/CyberSecEval/docs/benchmarks/autonomous_uplift): cloud initial conditions, tool timeouts, and transcripts.
- [NIST: Examples of cheating in CAISI’s agent evaluations](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations): answer contamination and grader shortcuts.


Continue with [the next chapter](/posts/ai/2026-10-22-ai-security-attack-chains-en).
