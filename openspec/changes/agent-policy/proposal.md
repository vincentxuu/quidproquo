> **Status: Fully planned, gated change** — proposal, design, specs, and tasks are present. Implementation remains blocked until `agent-os`, `agent-flow`, `agent-providers`, and `agent-evidence` are stable enough for policy enforcement to depend on them.

## Why

A flow definition says **what** runs; a policy says **how it is allowed to run** — cost ceiling, allowed providers, minimum source count, sensitive-data handling, human-approval gates. KPMG agentic-AI risk guidance and Gateway Console plan §4.3 both insist these are separate concerns: the same `deep-research` flow should be runnable under a `quick-prototype` policy or an `enterprise-compliance` policy without forking the flow.

## What Changes

- Add a **Policy registry** keyed by `policy_id`, with six policy categories: **Budget** (max_cost_usd, max_tokens, max_iterations, max_parallel_units, max_runtime), **Provider** (allowlist, denylist, fallback chains, region/data-residency), **Quality** (min sources per subquestion, citation_required, conflict_check, stale_source_check), **Security** (sensitive-data redaction, tool permission allowlist, least-privilege scope), **Human** (approval_required_before_external_write, approval_required_before_actions, risk_threshold), **Retry** (retry count, backoff, fallback provider, skip behavior)
- **Policy is bound at run-time**, not at flow-definition time — same flow, different policies for different use cases
- Budget policy is **enforced live** by the kernel: scheduler kills the run when ceiling is reached; partial output is preserved as a failed run with reason `budget_exceeded`
- Provider policy delegates allowlist/fallback to `agent-providers`
- Quality policy delegates min-sources/citation/conflict/freshness checks to `agent-evidence`; failed quality gates fail the run with an actionable error
- Human policy hooks into `agent-os` `agent-access` approval gate (irreversible-action interception); supports per-step approval, batch approval, and edit-on-approval (reviewer modifies before continue)
- Ship reference policies: `research-quick`, `research-standard`, `research-enterprise` (matches Gateway Console §4.3 example + presets from §5.1)
- Policy inheritance and overrides — define a base policy, then per-flow overrides, then per-run overrides; resolution order is explicit

## Capabilities

### New Capabilities

- `policy-definition`: Typed policy schema across six categories; bound at run-time, not flow-definition-time
- `policy-enforcement`: Live budget enforcement (token / cost / iteration / runtime ceilings); provider allowlist enforcement; quality checks delegated to evidence layer
- `policy-approval-gates`: Wires `human` policy into kernel `agent-access` approval mechanism for irreversible actions

## Dependencies

- `agent-os` (uses scheduler signals + access manager approval gate)
- `agent-flow` (policies attach to flow runs)
- `agent-providers` (provider allowlist + fallback enforcement)
- `agent-evidence` (quality check enforcement)

## References

- `/Users/xiaoxu/Projects/reseacher/feature/agent-gateway-console-plan.md` §4.3 Policy Engine
- `/Users/xiaoxu/Projects/ai/2026-05-14_12-04_agent-workflow-trends.md` finding 6 (guardrails / policy / observability as first-class)
- KPMG agentic-AI workflow risk guidance (cited in trend research)
