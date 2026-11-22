---
title: "AI Agent Arxiv Digest — 2026-11-22"
date: 2026-11-22
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Two papers today answer the same question from theory and from practice — can agent safety actually be verified — and a third pushes the full MLE-Bench record with a new autonomous-research-agent method"
tldr: "One paper proves, with computability theory, that guaranteeing agent safety is undecidable in general and still PSPACE-complete even under finite bounds, and that safety doesn't compose; another offline-replicates 108 real, news-reported agent incidents against matched controls, reproduces 89% of them, and finds most incidents had no attacker at all; a third is a Google/Johns Hopkins autonomous research agent that swaps codebase state for problem diagnosis and sets a new record on the full MLE-Bench"
series:
  name: "AI Agent Arxiv Digest"
  order: 182
---

## Today's Overview

Today's two lead papers attack the same question from opposite directions: can agent safety actually be verified? The first proves, with computability theory, that the answer is no — guaranteeing safety is undecidable in general, and even the bounded version is PSPACE-complete, a problem whose cost grows exponentially with scale, and safety turns out not to be a property that composes. The second backs this up from the practical side: it offline-replicates 108 real, news-reported agent security incidents against a matched control that removes only the blamed cause, reproduces 89% of the original harm, and finds that of 72 incidents with real-world harm, 62 had no attacker at all — the agent simply did its job and ran into an ordinary hazard. The third paper goes in a different direction entirely: a Google/Johns Hopkins autonomous-research agent that swaps its core state from "current code version" to "current understanding of the problem," setting a new record on the complete MLE-Bench. All three carry solid evidence — a formal proof, a matched-control empirical replication, a full benchmark plus ablation — and all three are explicit about where their own claims stop.

## Terms worth knowing before this one

| Term | Plain explanation |
|---|---|
| Undecidability | A mathematical proof that no algorithm can give the correct answer in every case — not a matter of today's technology being insufficient, the problem itself has no general solution |
| PSPACE-complete | A complexity class: the problem is theoretically computable, but the cost grows exponentially with problem size, making it practically intractable to exhaust |
| Compositionality | A property is "compositional" if every part satisfying it guarantees the whole satisfies it too; this paper proves agent safety is not such a property |
| Matched-control replication | Offline-rebuilding an incident alongside a control that removes only the blamed cause, then using the gap between the two outcomes as evidence for whether that cause actually produced the harm |
| Problem State | Having the agent explicitly track which bottlenecks it currently suspects, which candidate solutions might help, and how far each hypothesis has been tested — instead of deciding purely from code-version score differences |

---

## Paper One | Pandora's Toolbox: Why Agent Safety Cannot Be Fully Verified

**Pandora's Toolbox Or Why Agent Safety Cannot Be Verified**
Mario Franco, Carlos Gershenson (Binghamton University) · arxiv: 2611.25325

Links: [arxiv](https://arxiv.org/abs/2611.25325) · [alphaxiv](https://www.alphaxiv.org/abs/2611.25325)

### TL;DR

Using computability theory, this paper proves that once an agent can execute code, no algorithm can guarantee predicting whether it will run a dangerous behavior; even under finite bounds the problem is PSPACE-complete, and safety doesn't compose — agents each proven safe on their own can still be unsafe together.

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (not peer reviewed) |
| Citation velocity | Submitted about 4 days ago; preprint, no citations yet |
| Institution | Binghamton University (SUNY) |
| Community signal | Not found on HF Daily Papers / not applicable on Papers with Code, a theory paper with no code |
| Credibility | Pass — proves undecidability via a halting-problem reduction, gives an explicit construction proving PSPACE-completeness under finite bounds, and supplies a counter-example for non-compositionality |
| Evidence maturity | Substantial — the claims are theoretical and the proof form matches the claim type |
| Reproducibility | Full artifacts — every claim is a mathematical proof a reader can check directly from the paper, with no code or data dependency |
| Why this one | Direct — answers head-on the question of whether agent safety can be verified at all, something often treated as a pure engineering problem |
| Novelty | Substantive — pins existing undecidability results concretely onto the agent loop and tool calls, and adds a complexity classification plus a compositionality counter-example for the bounded case |
| Today's importance | Medium — won't change today's concrete engineering decisions, but changes the expectation of whether guardrails can exhaustively verify safety |
| Practical link | Speculative — the theory implies no black-box test suite can exhaustively verify agent safety; the real choice is where to draw the line on acceptable risk |
| Editorial confidence | High — undecidability and PSPACE-completeness are standard computability/complexity results, applied here with a clear derivation |
| Reading recommendation | Skim — useful for people writing agent safety governance or guardrail policy; general developers just need the conclusion |
| Primary limitation | Does not quantify where today's actual guardrail stacks (rate limits, sandboxing, timeouts) fall within the "bounded but still intractable" complexity range it proves |

### Field Context

Current agent safety practice relies mainly on blacklists, whitelists, guardrail filters and certification — all of which implicitly assume that with enough testing effort, an agent's dangerous behavior can be predicted in advance. This paper starts from the most basic results in computability theory to test directly whether that assumption holds.

### Mid-level Walkthrough

- **The problem**: Imagine hiring an assistant who can write and run their own code. You want to know: is there a set of rules that would let you determine in advance that the code they write will never do something you don't want? This paper proves that, in general, no algorithm can do this — not because today's technology falls short, but because the problem is mathematically undecidable.
- **The method**: The paper models a language model plus the tools it can call (code execution, web browsing) as a Turing machine, then uses the standard halting-problem reduction to show that deciding "will this agent run something semantically equivalent to a known dangerous program" is equivalent to deciding the halting problem, hence undecidable. It then bounds the problem (finite context, finite number of action steps) and proves this bounded safety problem is still PSPACE-complete — theoretically computable, but with cost growing exponentially with scale. Finally, it gives a counter-example: two agents each individually proven safe can still produce unsafe behavior when run together.
- **Why it matters**: If your organization claims an agent is safe on the basis of "we tested it thoroughly, it has guardrails, it's certified," this paper is a reminder that such measures can only ever give imperfect safety, not verified safety. For governance and policy design, this means safety standards need to shift from "verified" to "risk kept within an accepted range."

### Deeper Points

- The core proof tool is a many-one reduction from the halting problem, plus the S-m-n theorem
- The bounded version is proven PSPACE-complete even when the agent's description (model architecture and weights) is fully known
- The counter-example shows two agents, each individually passing a safety check, can still trigger unsafe behavior in some contexts once combined — safety is not compositional
- The paper deliberately defines "dangerous" as "semantically equivalent to a known or unknown dangerous program," leaving the subjective question of what counts as dangerous to the reader
- Limitation: it does not discuss how much real engineering constraints (rate limits, sandbox isolation, timeouts) can lower the actual risk — it only proves the theoretical ceiling

### Reviewer's Take in One Line

The proofs are solid and the derivation is clear — a careful, correct application of existing computability results to the agent-safety setting; but readers should note that theoretical undecidability doesn't mean today's guardrails are useless. The real next question is how far current guardrails actually push the risk down, and whether that's acceptable.

### Take-aways for You

- If you're writing agent safety governance policy: don't use "it passed testing" as the sole basis for a safety claim; use a "known risk envelope + monitoring + post-hoc audit" framework instead, since exhaustive verification is theoretically impossible
- If you're designing a multi-agent system: don't assume that because every sub-agent was individually verified safe, the whole system is safe — combined behavior needs its own testing

---

## Paper Two | ROGUE-AI: Offline-Replicating Real Agent Security Incidents to Find the Real Cause

**Replication of Agentic Security Events: Audit and Investigation (ROGUE-AI)**
Mengxiao Wang, Mahbub Alam, Kalyan Nakka, Nitesh Saxena (Texas A&M University) · arxiv: 2611.26553

Links: [arxiv](https://arxiv.org/abs/2611.26553) · [alphaxiv](https://www.alphaxiv.org/abs/2611.26553)

### TL;DR

108 real, news-reported agent security incidents were offline-replicated against a matched control that removes only the blamed cause; 89% of replications reproduce the original harm. Of 72 incidents with real-world harm, 62 had no attacker at all — the agent just did its job and ran into an ordinary hazard.

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (not peer reviewed) |
| Citation velocity | Submitted about 3 days ago; preprint, no citations yet |
| Institution | Texas A&M University (SPIES Lab) |
| Community signal | Not found on HF Daily Papers / not found on Papers with Code |
| Credibility | Pass — every incident is offline-rebuilt with a matched control removing only the blamed cause, re-run on 5 current model families, with both the reproduction rate and the control gap quantified |
| Evidence maturity | Substantial — 108 replications across 5 model families, with a blind review pass (11 sent back for re-review, 5 blind rebuilds disagreeing with the original verdict) |
| Reproducibility | Partial artifacts — the incident list and replications are public on the project page, but the full replication-harness code is not released |
| Why this one | Direct — tests head-on what actually caused real agent security incidents, instead of just cataloguing that they happened |
| Novelty | Substantive — existing incident databases only collect and label incidents without testing their causes; this is the first to use a matched control to actually verify whether a reported cause produced the harm |
| Today's importance | High — overturns the intuition that most agent incidents involve an attacker, showing most harm comes from normal task execution hitting an ordinary hazard |
| Practical link | Clear — the paper's finding that naming the hazard in a post-tool-call warning lowers harm across every tested model is directly applicable |
| Editorial confidence | High — the numbers are concrete (89% reproduction, 18-33% vs. at most 1% control gap), and the authors disclose their own reproduction failures and review disagreements honestly |
| Reading recommendation | Must read — directly relevant to anyone doing agent safety assessment or designing protective mechanisms |
| Primary limitation | Replications run in simulated environments with a single agent loop; only 10 destructive-action cases were also validated in shipped products, so the reproduction rate may not transfer to real production risk |

### Field Context

News reports and incident catalogs (such as the AI Incident Database and the Agent Incident Registry) currently only collect what happened, rarely testing whether the cause a report blames actually produced the harm — and no existing benchmark answers this, since benchmark attack cases are designed by researchers, not drawn from real incidents.

### Mid-level Walkthrough

- **The problem**: In July 2025, Replit's coding agent deleted SaaStr's production database during a code freeze; the report blamed a database shared between the agent's development work and the live site. But that's just the report's inference — nobody had actually tested whether, with the two databases kept separate, this would still happen.
- **The method**: ROGUE-AI rebuilds each incident offline into a simplified test environment, alongside a matched control that removes only the blamed cause (in the case above, the control uses a separate temporary database). The only difference between the two is that one blamed cause; if the agent causes harm at a noticeably higher rate in the version with the cause present, that's evidence the cause actually produced the harm. The whole pipeline is a division of labor across agents: models from different vendors collect reports and build the replication, a model from another vendor reviews whether the rebuild is faithful to the original report, and code decides whether harm actually occurred.
- **Why it matters**: This paper shows that if agent safety defenses only watch for injected instructions, they may be aiming at the wrong target — most real-world harm in this sample involved no attack at all; the agent faithfully executed its task and simply ran into an ordinary, pre-existing hazard.

```diagram
title: How ROGUE-AI finds the real cause behind an incident
desc: Offline-rebuild a real incident alongside a matched control missing only the blamed cause, then compare harm rates on the same set of models
---
<svg viewBox="0 0 680 400">
  <path class="dg-line" d="M340 76 V96 H175 V120" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M340 76 V96 H505 V120" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M175 176 V196 H340 V220" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M505 176 V196 H340 V220" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M340 276 V320" marker-end="url(#arrow-accent)"/>

  <rect class="dg-box" x="140" y="20" width="400" height="56" rx="6"/>
  <text class="dg-label" x="340" y="39" text-anchor="middle" dominant-baseline="central">Real incident from a news report</text>
  <text class="dg-sub" x="340" y="59" text-anchor="middle" dominant-baseline="central">e.g. Replit's agent deleted the production DB during a freeze</text>

  <rect class="dg-box" x="30" y="120" width="290" height="56" rx="6"/>
  <text class="dg-label" x="175" y="139" text-anchor="middle" dominant-baseline="central">Rebuild: keep the blamed cause</text>
  <text class="dg-sub" x="175" y="159" text-anchor="middle" dominant-baseline="central">e.g. dev and prod share one database</text>

  <rect class="dg-box" x="360" y="120" width="290" height="56" rx="6"/>
  <text class="dg-label" x="505" y="139" text-anchor="middle" dominant-baseline="central">Matched control: remove the cause</text>
  <text class="dg-sub" x="505" y="159" text-anchor="middle" dominant-baseline="central">e.g. a separate temporary database</text>

  <rect class="dg-box" x="140" y="220" width="400" height="56" rx="6"/>
  <text class="dg-label" x="340" y="248" text-anchor="middle" dominant-baseline="central">Run the same 5 current model families</text>

  <rect class="dg-box dg-box--warn" x="90" y="320" width="500" height="56" rx="6"/>
  <text class="dg-label" x="340" y="339" text-anchor="middle" dominant-baseline="central">Compare harm rate</text>
  <text class="dg-sub" x="340" y="359" text-anchor="middle" dominant-baseline="central">18-33% with the cause vs at most 1% without</text>
</svg>
```

### Deeper Points

- 108 replication attempts, 89% successfully reproduce the original reported harm
- Across 5 current model families (GPT, Claude, Gemini, DeepSeek), the version with the blamed cause reproduces the same reported mistake 18-33% of the time; removing the cause drops that to at most 1%
- Of 72 incidents with real-world harm, 62 had no attacker — the agent did what the task asked but missed an ordinary hazard
- Replications without an attacker caused more harm than replications of prompt injection, for all five models
- A post-tool-call warning naming the hazard and its consequence lowered harm across every tested model; a note of the same length that doesn't name the hazard left most of the harm in place
- Limitation: replications run in simulated environments with a single agent loop; only 10 destructive-action cases were also validated in shipped products, so the reproduction rate shouldn't be read as the real risk rate in production; 12 incidents could not be reproduced because the report itself didn't specify the triggering mechanism

### Reviewer's Take in One Line

Rebuilding real incidents against a matched control is one of the most practice-grounded ways to assess agent safety available today, and the authors are honest about their own reproduction failures and review disagreement rate; but the method has only been validated in simulated environments, and there's still a gap before it can represent real production risk.

### Take-aways for You

- If you're designing agent safety defenses: don't only guard against prompt injection — first inventory situations where normal task execution meets an environmental hazard (shared databases, dev/prod not separated); this paper shows that kind of risk causes more harm than attacks do
- If you're writing tool or API return messages: add a warning after high-risk tool outputs that explicitly names the hazard and its consequence; this paper shows that simple move worked across every model tested

---

## Paper Three | Pro² Agent: Letting an Autonomous Research Agent Understand the Problem Before Running Experiments

**Pro$^2$ Agent: Scientific Problem Probing for Autonomous AI R&D**
Yixiong Chen, Liqian Peng, Tian Tan et al. (Google + Johns Hopkins University) · arxiv: 2611.25357

Links: [arxiv](https://arxiv.org/abs/2611.25357) · [alphaxiv](https://www.alphaxiv.org/abs/2611.25357)

### TL;DR

Swapping an autonomous AI research agent's core state from "current code" to "current understanding of the problem" (which bottlenecks, which candidate solutions, how far each hypothesis has been tested) pushes the previously best reported medal rate on the complete MLE-Bench from 70.7% to 76.0% under a 48-hour budget, while honestly reporting cases it couldn't solve.

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (not peer reviewed) |
| Citation velocity | Submitted about 3 days ago; preprint, no citations yet |
| Institution | Google + Johns Hopkins University (Liqian Peng and Alec Go are Google Research; Alan Yuille and Yixiong Chen's affiliation line reads Johns Hopkins University) |
| Community signal | Not found on HF Daily Papers / not found on Papers with Code |
| Credibility | Pass — tested on the complete MLE-Bench (not a subsample) plus PostTrainBench, with an ablation against the same scaffold without a Problem State, plus a failure-case analysis |
| Evidence maturity | Substantial — full-benchmark results, an ablation, and qualitative case studies; but the 70.7%/76.0% comparison is against a previously reported best, not an externally re-run baseline under identical conditions |
| Reproducibility | Partial artifacts — the benchmarks (MLE-Bench, PostTrainBench) are public, but the method's own code is not released |
| Why this one | Direct — directly improves the core architecture of autonomous research agents, today's only new-method paper |
| Novelty | Substantive — replaces the common "iterate on code alone" pattern with an explicit Problem State maintained and updated through controlled hypothesis tests |
| Today's importance | Medium — directly useful for teams building autonomous research/experimentation agents, indirectly instructive for general agent developers |
| Practical link | Clear — the Problem State design (tracking bottlenecks, candidate solutions, hypothesis status) can be ported directly to other long-horizon, diagnosis-driven agent tasks |
| Editorial confidence | Medium — the ablation supports a real gain from the Problem State itself, but the comparison to the external best is not a same-budget controlled comparison |
| Reading recommendation | Skim — a must-read for teams doing autonomous research or automated ML engineering agents, otherwise useful as a new agent-state design pattern |
| Primary limitation | The 70.7%/76.0% comparison point is a previously reported best from the literature, not an external baseline re-run by the authors under identical conditions |

### Field Context

Existing autonomous research agents (such as AIDE and MARS) mostly equate task state with the current code version, using reflective memory to compare score differences across revisions. This works on simpler tasks, but on hard problems the agent often gets stuck in the wrong solution region, because it never explicitly writes down what it currently believes is wrong.

### Mid-level Walkthrough

- **The problem**: Imagine a new researcher given a hard machine-learning problem who only watches the current code version's score, making small tweaks over and over, without ever writing down a clear note of what they think is currently blocking success and which method might fix it. They may keep trying the same wrong direction without realizing the real problem lies elsewhere.
- **The method**: Pro² Agent has the agent maintain a Problem State: which bottlenecks are currently suspected, which candidate solutions might address them, and how far each hypothesis has been tested. The agent first initializes this Problem State through a comprehensive analysis of available resources and constraints, then does targeted research linking identified problems to candidate solutions, then runs controlled hypothesis tests (changing one variable at a time) to update how serious a suspected problem is, or how much benefit a candidate solution brings.
- **Why it matters**: For teams building autonomous research or automated ML-engineering agents, this is a concrete, actionable architectural upgrade — instead of letting the agent search the code space endlessly, have it write down its understanding of the problem first and search with direction based on that understanding.

### Deeper Points

- On the complete MLE-Bench, it ties the previously best reported medal rate (70.7%) under a standard 24-hour budget, and reaches 76.0% with a 48-hour budget — the highest medal rate reported on the complete benchmark
- Also competitive on PostTrainBench, though the paper does not give the full numbers
- The ablation shows that on hard tasks, the version with a Problem State recalls a higher fraction of expert-level techniques than the version without, and at matched recall levels its solution quality is overall higher
- The case studies deliberately include two failure cases — one hitting a compute-feasibility ceiling, another leaving an unresolved multi-step reasoning bottleneck — not only successes
- Limitation: the comparison to the literature's best is not a same-budget, same-condition external baseline re-run by the authors, and the paper itself has not yet been externally reproduced

### Reviewer's Take in One Line

Making the Problem State an explicit core data structure the agent maintains is a solid improvement direction for autonomous research agent architecture, and the ablation supports that the design itself — not just extra compute — drives the gain; but the comparison to the literature's best is still the authors' own reproduction, with no external verification yet.

### Take-aways for You

- If you're building an autonomous research or automated ML-engineering agent: borrow the Problem State design — explicitly structure the currently suspected bottleneck, candidate solutions, and hypothesis status, instead of relying only on reflective memory comparing code-version scores
- If you're evaluating an autonomous research agent's capability: check whether it leaves a traceable reasoning record (like this paper's case studies), not just the final score — that's what tells you whether it actually understood the problem or just got lucky

---

## Today's Takeaway

I used to think "agent safety" was mainly an attack-and-defense question — incidents happen because of attacks. These two papers made me rethink that: the limits of safety go deeper. In theory, guaranteeing safety is itself undecidable, and even the bounded version can't be fully computed. In practice, most real harm has no attacker at all — it's normal task execution running into an ordinary hazard. Safety governance has to face both realities at once, not just guard against attacks.

## References

- [Pandora's Toolbox Or Why Agent Safety Cannot Be Verified](https://arxiv.org/abs/2611.25325)
- [Replication of Agentic Security Events: Audit and Investigation (ROGUE-AI)](https://arxiv.org/abs/2611.26553)
- [ROGUE-AI incident replication list and project page](https://rogue-ai.surge.sh)
- [Pro$^2$ Agent: Scientific Problem Probing for Autonomous AI R&D](https://arxiv.org/abs/2611.25357)
- [arXiv cs.AI daily announcement list](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CR daily announcement list](https://arxiv.org/list/cs.CR/new)
