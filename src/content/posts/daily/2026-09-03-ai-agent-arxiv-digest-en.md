---
title: "AI Agent Arxiv Digest — 2026-09-03"
date: 2026-09-03
category: daily
type: digest
tags: [ai-agent, arxiv, daily, agent-memory, agent-safety]
lang: en
description: "As agents move from single assistants to fleet-scale deployment, three infrastructure problems surface at once: whether cross-episode memory caches can be trusted, when composed actions get intercepted, and how to account for a fleet's irreversible risk"
tldr: "Invalidation Contracts finds Claude Sonnet 5 applies only 11% of cache-refresh suggestions that add a new field, versus 100% for Claude Haiku 4.5; OpenAgentFlow intercepts actions before they commit, reaching 94.0% accuracy and a 95.3% attack block rate on a 300-case benchmark; The Irreversibility Budget's controlled simulation shows a fleet of individually-compliant agents can still overdraw its risk limit by up to 48x, and only a shared risk ledger keeps every run within bounds"
series:
  name: "AI Agent Arxiv Digest"
  order: 102
---

> 🌏 [中文版](/posts/daily/2026-09-03-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers point at the same underlying shift: once agents move from a single assistant to fleet-scale deployment, the old "get each step right" mindset stops being enough. Invalidation Contracts splits memory-cache trust into two independent variables, validity and compliance, and in doing so discovers that the same invalidation protocol nearly stops working on Claude Sonnet 5 — not because the protocol is wrong, but because the model itself distrusts a specific shape of fix. OpenAgentFlow shows that safety risk is often not caused by any single action but by how actions compose, so it moves the enforcement point to the moment right before an action commits. The Irreversibility Budget proves that even when every individual agent stays within its own limit, the fleet as a whole can silently overdraw its risk ceiling — and the only fix is to treat risk the way an operating system treats memory: as a shared, accounted-for resource. The three papers sit at different points on the evidence-maturity scale — one is a rigorous cross-model controlled study, one is a systems paper with real deployment numbers, one is a simulation study validated against real traces — but together they make the same point: fleet-scale problems can't be solved just by summing up each agent's local correctness.

## Terms Worth Knowing Before You Read

| Term | Plain-language explanation |
|---|---|
| Cache invalidation | Actively clearing stale, no-longer-correct cached data so a system doesn't act on outdated information |
| Agent fleet | A system made of multiple agents, planners, controllers, and execution backends that act on the same shared user or enterprise environment at once |
| Action-commit boundary | The last moment before an agent-produced action actually changes shared state (sending, writing, deleting) where it can still be intercepted |
| Value-at-Risk (VaR) | An estimate of the maximum loss a position could face at a given confidence level, commonly used in finance to measure aggregate exposure |
| Compliance | The fraction of the time an agent actually applies a fix or suggestion on its first try, distinct from validity (whether the suggestion itself is still correct) |

---

## Paper One | Invalidation Contracts: Teaching an Agent's Cross-Episode Memory When to Let Go

**Invalidation Contracts for Cross-Episode Agent Memory**
Michael Wu, Arquimedes Canedo (South Dakota State University; Siemens Digital Industries Software) · arxiv: 2609.00243

Links: [arxiv](https://arxiv.org/abs/2609.00243) · [alphaxiv](https://www.alphaxiv.org/abs/2609.00243)

### TL;DR

Across a controlled study spanning 7 models and roughly 9,400 episodes, row-level invalidation raises cache compliance by up to 66.7 percentage points — but Claude Sonnet 5 exhibits "input-schema conservatism," applying only 11% of fixes that add a new field, versus 100% for Claude Haiku 4.5.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Credibility | Pass — a controlled study across 7 models x 3 serving paths x 2 domains, a six-level protocol ablation (A0-A2DG), with negative-control and unconstrained-class comparisons |
| Evidence maturity | Preliminary — both evaluation domains are synthetic APIs hand-authored by the research team; the authors state they don't know how the contract transfers to production APIs |
| Reproducibility | Partial artifacts — the protocol levels, algorithm, and metrics are fully specified in the text, but no public code or dataset link was found in the fetched full text |
| Editorial confidence | High — "validity is protocol-determined, compliance is model-determined" is backed by multiple independent tables (per-model, per-hint-shape, per-drift-rate), not one headline number |
| Recommendation | Must-read — directly relevant to teams building Claude-based agents that call external APIs and are considering a memory cache |
| Primary limitation | Both evaluation domains are synthetic APIs; transfer to production environments with larger, organically-drifting schemas is untested |

### Field Context

LLM agents that call APIs repeatedly tend to cache the last fix that worked, to save tokens. When the server's reference data drifts, that cached fix silently becomes wrong — and re-deriving it every time gives back all the savings. HTTP solved an analogous problem decades ago with Cache-Control and ETag, but the layer where an agent caches its own recovery suggestions has never had an equivalent protocol.

### Mid-Level Walkthrough

- **The problem**: Imagine an agent calling a food-ordering API gets rejected for missing a `discount_code` field, learns to always include it, and caches that fix. Three weeks later the vendor renames the field — the agent is still stuck on the old field name, repeating the same failure. Re-deriving the fix every single time would give back all the token savings memory was supposed to buy.
- **The method**: The paper introduces invalidation contracts — a protocol layer where the server attaches two fields to every recovery suggestion (a version stamp and a cacheability hint), plus a structured diff on schema reload, so the client can evict stale entries without trial and error. The authors implement six protocol levels, from a bare version stamp up to row-level diffs and dependency-vector comparison, and measure each across 7 models, 3 serving paths, 2 domains, and roughly 9,400 episodes.
- **Why it matters**: The paper splits realized cache savings into two independently measurable factors — validity (whether the cached entry is still correct, which depends only on the protocol) and compliance (whether the model is willing to apply the fix, which depends on the model) — telling engineering teams whether a problem lives in protocol design or model behavior.

### Deeper Findings

- Row-level invalidation raises compliance on 5 of 7 models: +66.7pp on gpt-5-mini, +63.0pp on claude-sonnet-4-6, +55.6pp on claude-haiku-4-5, +48.2pp on gemini-3.5-flash, and only +11.1pp on claude-sonnet-5
- ⚠️ (author's own evaluation, 7 models x 2 synthetic domains) Claude Sonnet 5 shows "input-schema conservatism": compliance on add-a-field-style fixes is only 10%, while the same model complies with rewrite-existing-value fixes 55-60% of the time — it's not a blanket refusal of cache fixes, but a selective distrust of one specific fix shape
- Counter-case: table-level invalidation — clearing an entire table on any version bump — actively harms outcomes by evicting entries that never actually went stale; post-drift first-try success rates on 5 of 7 models drop to 0%
- Token economics: naive memory (caching with no invalidation at all) already saves 5-28% of tokens; row-level invalidation adds another 10.2-15.7 percentage points on top, but the size of that gain tracks the model's compliance, not the protocol alone
- Self-disclosed security angle: the authors explicitly point out the attack surface this mechanism creates — the very protocol levels that make the model "apply fixes verbatim without questioning them" are also a parameter-injection channel; an honest but stale cache entry and a maliciously injected fake fix look identical at the protocol layer
- Deployment threshold: the paper recommends a "compliance preflight" before production rollout — inject a handful of episodes with known-valid fixes and measure whether the model applies them, at a cost of tens of API calls, to catch models where no amount of protocol engineering will help

### Reviewer's One-Line Take

This paper cleanly splits "should an agent trust its memory cache" into validity and compliance, with a rigorous experimental design (7 models, controls, ablations) and an unusually honest self-disclosure of the mechanism's own injection risk. But both evaluation domains are synthetic APIs the team wrote themselves, and the authors admit they don't yet know whether this transfers to production environments with more complex, organically-drifting schemas.

### Take-Aways for You

- If you're building an agent on Claude models that calls external APIs and considering a memory cache: run a compliance preflight first, and specifically watch for Sonnet 5 potentially refusing most add-a-field fixes — this is not something the caching protocol alone can fix
- If you're designing an agent's cache invalidation mechanism: prefer row-level over table-level granularity — this paper's data suggests table-level invalidation can be worse than no invalidation at all

---

## Paper Two | OpenAgentFlow: Intercepting an Entire Heterogeneous Agent Fleet Before Actions Commit

**OpenAgentFlow: Enabling System-Wide Safety Boundaries for Heterogeneous AI Agent Fleets**
Dongsheng Chen, Xiangyu Zhao, Xin Yao, Xuetao Wei (City University of Hong Kong; Lingnan University; Southern University of Science and Technology) · arxiv: 2609.00015

Links: [arxiv](https://arxiv.org/abs/2609.00015) · [alphaxiv](https://www.alphaxiv.org/abs/2609.00015)

### TL;DR

By normalizing GUI actions, API calls, tool calls, and LLM-generated invocations into a single event stream and enforcing policy at one shared checkpoint right before commit, OpenAgentFlow reaches 94.0% accuracy and a 95.3% attack block rate on a 300-case benchmark, plus 90.8% raw accuracy on a real Android emulator suite.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Credibility | Pass — four independent evaluation suites cross-validate each other: a 300-case action-event benchmark, a 30-case dynamic-policy test, a 20-case provenance test, and 98 traced cases from a real Android emulator |
| Evidence maturity | Preliminary — instantiated and evaluated on a single platform (Android) only, with no strong existing-system baseline for comparison |
| Reproducibility | Not provided — no code or dataset release link found anywhere in the full text |
| Editorial confidence | Medium — "a shared enforcement point can catch composed, cross-agent risk" is supported across four evaluation angles, but limited by single-platform scope and the absence of public artifacts |
| Recommendation | Must-read — directly relevant to teams chaining multiple agents into a production pipeline that touches sensitive data |
| Primary limitation | Validated on a single platform (Android) only; provenance is enforcement-observed evidence, not cryptographically or OS-attested information flow |

### Field Context

Agent systems have moved from "a single assistant calling a tool once" to "multiple agents, planners, controllers, and execution backends acting on the same shared user or enterprise environment at once." Existing safeguards — prompt guardrails, tool allowlists, agent-local policy — each cover a local checkpoint, but the real risk is often that every individual step is legal while the composition violates policy: three individually well-behaved agents can together route payroll data, through a report, to an external customer's inbox.

### Mid-Level Walkthrough

- **The problem**: Imagine an assistant helping schedule a meeting — it reads a contact's phone number from Contacts, writes it into a Calendar note field, then later emails the meeting details. Each of the three actions looks completely normal in isolation, but together they route private contact data, through an intermediary, into an email. No single step "looks" dangerous; the risk is only visible when you zoom out over the whole session.
- **The method**: OpenAgentFlow normalizes GUI actions, API calls, tool calls, and LLM-generated invocations into a single unified "AgentEvent" representation, and routes every one through a shared Policy Enforcement Point right before it commits and changes shared state. A control plane separately maintains provenance, session state, audit records, and updatable policies, while a lightweight action plane sits on the execution path to intercept at the right moment. New rules take effect without modifying any agent, prompt, or model.
- **Why it matters**: This turns safety from "each agent policing its own single step" into a "fleet-level, auditable, live-updatable shared checkpoint" — a rare system design in this space that's actually been implemented and measured on a real platform (Android), for teams chaining multiple agents into production pipelines.

### Deeper Findings

- On a 300-case action-event benchmark: 94.0% overall accuracy and a 95.3% attack block rate, versus prompt-only advisory protection that "blocks zero attack cases"
- On a 30-case dynamic-policy suite: after new rules are installed live, 27/30 cases match expected behavior, without changing any agent, model, or execution path
- On 98 traceable cases from a real Android emulator suite: 90.8% raw accuracy, and 92.9% trace-adjusted pass rate once the agent's actually-attempted behavior is factored in
- Low latency overhead: the deterministic common-path check runs under 1ms at P99
- ⚠️ (author's own evaluation, validated on Android only) current provenance is "enforcement-observed" evidence rather than cryptographically or OS-attested information flow — if an attacker can bypass the observation point itself, the provenance chain can be corrupted
- Deployment threshold: production rollout still needs to handle cases where a user explicitly wants an exception (e.g., deliberately sharing a piece of sensitive data); the paper recommends pairing action-commit enforcement with confirmation flows, task-specific exceptions, and administrative overrides rather than blocking unconditionally

### Reviewer's One-Line Take

Moving safety from a single agent's local judgment to a shared checkpoint right before action commit is the right architectural instinct for fleet-scale agent systems, and this is one of the rare papers in the space with real numbers from an actual Android testbed. But it's only been validated on one platform so far, and provenance still relies on enforcement-observed evidence rather than a stronger cryptographic guarantee — whether it holds up against an attacker specifically trying to bypass the observation point itself remains to be tested.

### Take-Aways for You

- If you're chaining multiple agents into a production pipeline that touches sensitive data: this paper's "action-commit boundary" design — normalizing every action regardless of source agent or interface, then filtering at one shared checkpoint — is easier to audit and maintain than adding rules inside each agent separately
- If you're evaluating whether to adopt this kind of fleet-level governance layer: first confirm your risk pattern is actually "individually legal steps that compose into a violation" — if your risk mainly comes from a single malicious step, existing prompt guardrails may already be sufficient

---

## Paper Three | The Irreversibility Budget: Accounting for an Agent Fleet's Risk Like a Shared Resource

**The Irreversibility Budget: Fleet-Level Risk Accounting and Admission Control for Agent Operating Systems**
Bardia Mohammadi, Laurent Bindschaedler (Max Planck Institute for Software Systems) · arxiv: 2609.00275

Links: [arxiv](https://arxiv.org/abs/2609.00275) · [alphaxiv](https://www.alphaxiv.org/abs/2609.00275)

### TL;DR

A controlled simulation shows that 50 individually-compliant procurement agents can together overdraw the fleet's risk limit by 2.4x on average (up to 48x at 1,000 agents), while treating "irreversible risk" as a shared, accounted-for resource — the way an OS treats memory — keeps every run within the authorized limit.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Credibility | Pass — five explicit research questions, 300 seeded simulation runs per condition with confidence intervals, and the core correlation assumption validated against 38,452 real tau-bench / AgentDojo trajectories |
| Evidence maturity | Preliminary — the headline numbers come from a controlled simulation rather than a deployed agent OS, though the real-trace validation meaningfully strengthens the underlying assumption |
| Reproducibility | Full artifacts — the simulator, seeds, parameters, benchmark, and trace-analysis code are all publicly released on GitHub (mpi-dsg/irreversibility-budget) |
| Editorial confidence | High — "per-effect gates can't see fleet-level aggregate risk, but a shared ledger budget can" is backed by five separate research questions, each with its own ablation, not one simulated number |
| Recommendation | Must-read — directly relevant to teams already operating agent fleets that touch money movement, code deployment, or data deletion |
| Primary limitation | Core results come from a controlled simulation rather than a deployed agent OS; pricing can still fail under adversarial misdeclaration or correlated risk |

### Field Context

Operating systems have long accounted for, allocated, charged, and arbitrated over scarce resources like CPU, memory, and I/O bandwidth. But no runtime today manages the quantity an agent fleet actually creates in the outside world: irreversible exposure — moving money, deploying code, deleting data, disclosing information. Existing mechanisms (deferred settlement, per-task authority checks, single-action insurance pricing) each answer a local question; none maintains a running, cross-agent balance.

### Mid-Level Walkthrough

- **The problem**: Imagine fifty independent procurement agents, each capped at $50k per purchase, all watching the same supplier price-spike alert. Each one rationally decides "buy now." Every single purchase clears its own cap — no agent does anything wrong — yet the fifty purchases together can add up to a seven-figure position that no one actually approved.
- **The method**: The paper proposes the irreversibility budget — a trusted runtime that treats irreversible exposure as a first-class resource, the way an OS treats memory. Each effect (a payment, a deletion, a deployment) is priced by its residual loss after compensation and recovery, added to a running balance owned by each principal (an agent, its workflow, or its tenant), and the marginal effect is denied or escalated once that balance would exceed the authorized budget. Pricing and charging happen below the agent's own trust boundary, so a compromised model can't misdeclare an effect type or split a transaction to slip under a cap.
- **Why it matters**: This reframes fleet-level risk control from "is this one action allowed" to "how much irreversible exposure does the fleet have left" — conceptually close to how an OS already manages memory, at a time when almost every existing agent safety mechanism still only looks at one effect at a time.

### Deeper Findings

- Core comparison (300 simulation runs): local per-effect gates overdraw the risk limit in all 300 runs, averaging 2.4x tolerance; the irreversibility-budget mechanism overdraws in none of them, staying near 0.48x tolerance
- Scale effect: as the fleet grows from 10 to 1,000 agents, local-gate overdraw worsens steadily from safe to 48x tolerance, while the budget mechanism stays near 0.48x at every scale
- Fragmentation-attack test: an attacker splits a $1.5M transfer into many sub-cap orders to evade local caps, which get fully bypassed (overdrawing to 3.9x tolerance) — but the budget mechanism admits only $459k of that exposure, because it prices by exposure value, not by call count
- Safety-liveness trade-off: a budget set at half the tolerance limit still admits 93% of routine traffic; doubling the budget to 2x tolerance admits more burst traffic but reintroduces overdraw in 33% of runs — a real, tunable, but not free knob
- ⚠️ (controlled simulation + real-trace validation, not yet validated in a deployed agent OS) the authors additionally analyzed 38,452 real trajectories from the public tau-bench and AgentDojo benchmarks, confirming that the simulation's core assumption — a shared trigger causes multiple agents to make correlated irreversible effects — holds in real data: a single planted instruction propagates the same external effect across 84% of a heterogeneous fleet on average
- Pricing itself remains an open problem: when effect types are misdeclared, or a shared trigger correlates losses the ledger assumed were independent, realized loss can still exceed what the ledger believed was safe; the authors release the full simulator, seeds, parameters, and trace-analysis code (GitHub: mpi-dsg/irreversibility-budget)

### Reviewer's One-Line Take

Framing an agent fleet's irreversible risk the way an OS frames memory is a clean idea, backed by a solid set of controlled experiments (300 runs x 5 research questions, plus real-trace validation of the model's core assumption), with the full simulator and code released. But the headline numbers still come from a controlled simulation, and the authors themselves name conservative, dependency-aware pricing as the central open problem — this hasn't yet been validated in a real, deployed agent OS.

### Take-Aways for You

- If your team already operates an agent fleet touching money movement, code deployment, or data deletion: this paper's "irreversible-exposure budget" framework offers a concrete, implementable resource model worth checking against your existing per-action authorization mechanism for a missing cross-agent accumulation layer
- If you're designing evaluation scenarios for agent safety: their approach of validating "shared triggers cause correlated risk" against real tau-bench / AgentDojo traces is a method worth borrowing for grounding safety assumptions in real-world behavior

---

## What I Learned Today

I used to think "add a memory cache to an agent" or "add a safety check to an agent" was a problem you solved by getting each individual agent right. Today made it clear that once you're at fleet scale, the question shifts from "is this one step correct" to "does the sum of these steps stay correct": will the model refuse a specific shape of fix, will composed actions exceed what any single-step rule can see, will fifty individually-compliant agents together overdraw a shared risk limit. None of these three problems can be solved by "fixing each agent" — all three need a fleet-level layer of accounting and governance.

## References

- Wu & Canedo, *Invalidation Contracts for Cross-Episode Agent Memory*: [arxiv 2609.00243](https://arxiv.org/abs/2609.00243)
- Chen, Zhao, Yao & Wei, *OpenAgentFlow: Enabling System-Wide Safety Boundaries for Heterogeneous AI Agent Fleets*: [arxiv 2609.00015](https://arxiv.org/abs/2609.00015)
- Mohammadi & Bindschaedler, *The Irreversibility Budget: Fleet-Level Risk Accounting and Admission Control for Agent Operating Systems*: [arxiv 2609.00275](https://arxiv.org/abs/2609.00275), [GitHub repository](https://github.com/mpi-dsg/irreversibility-budget)
- arXiv Submission Schedule and Cutoff Time: [official announcement schedule](https://info.arxiv.org/help/availability.html)
