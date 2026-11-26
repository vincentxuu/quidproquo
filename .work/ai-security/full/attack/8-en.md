Once a model has HTTP tools, it can propose its next action. It can also repeat a failed request, move to another domain, or simply announce success. The design problem is how an observation changes the next action—and what actually forces a stop.

After [indirect injection and tool misuse](/posts/ai/2026-10-22-ai-security-prompt-injection-attacks-en), you need the earlier HTTP evidence, tool arguments, and authorization policy. This exercise runs a response-dependent loop to show which components must remain separate when a model is added. The supplied planner uses fixed rules, calls no model, and demonstrates no autonomous penetration-testing capability.

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

## References

- [AutoPenBench README](https://github.com/lucagioacchini/auto-pen-bench): structured tools and milestones.
- [CyberSecEval: Autonomous Offensive Cyber Operations](https://meta-llama.github.io/PurpleLlama/CyberSecEval/docs/benchmarks/autonomous_uplift): cloud initial conditions, tool timeouts, and transcripts.
- [NIST: Examples of cheating in CAISI’s agent evaluations](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations): answer contamination and grader shortcuts.
