# Live model preflight independent review

2026-10-22. Scope: read-only review of model-eval.py, plan.md and ticket-lab.py response shape. No model/network/HTTP calls. A temporary in-memory runpy pure-function check executed with PYTHONDONTWRITEBYTECODE=1; no application server or generated model code was run.

## Must fix before interpreting live results

1. **Native tools are detected after execution, not disabled by the prompt/read-only sandbox.** Model.ask checks item events after subprocess completion. A non-message item raises RuntimeError but each stage catches it and continues. This contradicts the plan's claim that native tool execution is unavailable and its stated global stop. Either establish a verified CLI mechanism disabling native tools, or accurately describe post-hoc invalidation and stop the entire evaluation on a native-tool event, preserving partial records. An empty cwd does not itself prohibit filesystem reads through a tool.
2. **Validate response schemas before scoring.** Injection currently accepts an unknown action as a non-deviation, potentially counting malformed JSON objects as successful resistance. Restrict action/ticket/summary types and relationships; invalid replies must be separate failures, not successes. Apply analogous validation to hypothesis cases and loop verdicts. Keep explicit denominator accounting for invalid/absent outputs.
3. **Checkpoint partial rows before stage transitions.** Raw prompts/output and calls.json are persisted per call, but report.json only at repetition end. Interruption in the first repetition leaves no aggregate partial record. Persist stage results/errors immediately and mark run status incomplete until final completion. Resource cleanup already uses finally.
4. **Budget language needs precision.** Tokens are checked before a request against already consumed usage; a single request can overshoot the advertised token number. No per-request output limit is configured. Describe these as stop thresholds rather than strict caps unless enforced. Plan says probe included; current Model.calls excludes pre-existing probe records, so account for those separately or explicitly narrow the main-run threshold.
5. **Verify host target identity.** target() saves launcher metadata but does not compare build/target or GET health. Plan says target check host-only; ensure launched identity is validated before the model loop. Keep this metadata out of model prompts.

## Findings that pass

- Each loop turn calls Model.ask anew with actual previous HTTP observations; the host does not prefill a predetermined request order. At most three HTTP reads occur, with a fourth model call reserved for conclusion.
- Model prompt includes neither the build variable nor target launcher metadata. HTTP bodies contain ticket/text or error, without build identity. Labels and local folders include build but are not put in prompt.
- Host accepts only three fixed ticket IDs and uses a self-started loopback base, never a model-provided URL. Demo data only.
- Injection design replays one model output against two builds. It must be described as model candidate plus host replay, not two independent model decisions.
- Independent expected policy matrix is declared outside target implementation and checks all three actors plus a fourth ticket and unauthenticated actor. Actual results must be boolean. Pure-function review reproduced 13/13 for a correct policy and rejected call, attribute, import and assignment ASTs (4/4).
- AST whitelist has no Call, Attribute, assignments, loops or imports, uses empty builtins, fixed primitive dictionaries, and only one return. It is a narrow teaching evaluator, not a general Python sandbox. Add practical source-size/depth bounds if publishing a stronger safety claim.
- Claimed requested model, exact snapshot uncertainty, CLI scaffolding, missing temperature control, and absence of invoice data are appropriately distinguished. Report tokens/latency only; do not infer actual monetary cost.
- Three repetitions support descriptive tiny-sample counts only. No broad model ranking or population success rate is justified.

## Current decision

NEEDS WORK until items 1–5 are resolved or claims narrowed with transparent limitations. Root notified. This is preflight only; actual prompts, trace/audit correlation, aggregate recomputation, invalid output denominators and final source hashes require separate post-run review.

## Follow-up 1

Root added CLI feature disable flags (shell_tool/unified_exec/sleep_tool and web_search disabled) plus StopEvaluation. Readback confirms global-stop exceptions are saved then reraised rather than swallowed per stage; plan now accurately distinguishes disabled known features from complete absence of every conceivable native tool. Item 1 resolved on code inspection, subject to live trace verification. Remaining items 2–5 were communicated to root before live runs.

## Follow-up 2: preflight accepted

Readback confirms strict injection schema (unknown actions cannot be counted as resistance), launcher plus exact health identity checks, per-stage success/error saves, and accurate hard-call-limit versus post-call token-threshold/probe accounting. The 13-cell patch oracle and closed-world model-driven loop are unchanged. Items 1–5 are resolved for this bounded evaluation. Hypothesis malformed responses become errors or fail case coverage; invalid loop verdicts cannot pass conclusion matching. No remaining preflight must-fix. Proceed with the preregistered run without tuning prompts to obtain favorable outcomes; live trace/results review remains required. This acceptance concerns harness design, not an assertion that any model run succeeded.
