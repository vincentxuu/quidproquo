---
title: "AI Agent Arxiv Digest — 2026-09-09"
date: 2026-09-09
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Three papers each run a controlled experiment against an agent-design intuition — more agents, memory, and stronger models don't automatically deliver what they promise"
tldr: "MA-Evolve shows that under a fair call budget, a Planner-Executor-Critic team is not statistically better than a single agent (0.769 vs 0.754, p=0.80) — all the value comes from the Executor; a LinkedIn controlled study finds notes-style compressed memory swings asymmetrically by +9.91 or -13.28 points depending on migration direction after a model upgrade, while a fixed-schema knowledge graph loses almost nothing (+0.0004); an MIT team finds more capable models behave more correlatedly with each other, and when they share a misinformation environment, LLM traders push market tracking error to 5-7x the noise-only baseline"
series:
  name: "AI Agent Arxiv Digest"
  order: 108
---

> 🌏 [中文版](/posts/daily/2026-09-09-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers do the same thing from three different angles: they take a design intuition that "sounds obviously right" in agent development and put it through a controlled test. MA-Evolve takes the near-default assumption that "a multi-agent team beats a single agent" and re-runs the comparison under a fair call budget — the Planner-Executor-Critic team spends 1.8x the calls yet is statistically indistinguishable from a single agent (0.769 vs 0.754, p=0.80), with all the realized value concentrated in the Executor role. A LinkedIn controlled study asks a less-often-asked question: does your agent's memory survive when the underlying model gets upgraded? The answer depends entirely on the storage format — notes-style compressed memory swings asymmetrically depending on migration direction, while a fixed-schema knowledge graph barely loses anything. An MIT team finds a counterintuitive result in a financial-market simulation: the more capable a model is, the more its non-corrective behavior correlates with other capable models — and when those correlated models share a misinformation environment, the agents that were supposed to diversify risk instead push tracking error to 5-7x the noise-trader baseline. Together, all three say the same thing: "more agents," "add memory," and "upgrade to a stronger model" all sound like progress, but each needs a controlled test behind it rather than an assumption that it automatically holds.

## Terms to Know

| Term | Plain-Language Explanation |
|---|---|
| Iso-call Comparison | Comparing a single agent against a multi-agent team by fixing the total number of language-model calls both sides consume, rather than comparing them at equal environment rollouts (which quietly lets the team spend more) |
| Leave-one-in Decomposition | Running the system with only one role kept active at a time (e.g. only the Executor) to isolate which role is actually responsible for an observed gain |
| Memory Portability | Whether an agent's accumulated memory can still be correctly read and used after the underlying model is swapped for a different one |
| Retained Performance After Swap (RPAS) | How much performance a new model retains when reading memory written by the old model, compared to the new model reading memory it wrote itself |
| Non-corrective Behavior | The residual portion of an agent's action that cannot be explained by "correcting the system back toward ground truth" — it may come from framing bias, learned heuristics, or noise |
| Non-diversifiable Risk Floor | Even with an unlimited number of agents, if their non-corrective behaviors are correlated with each other, the aggregate risk has a floor that population size alone cannot eliminate |

---

## Paper 1 | Multi-Agent Teams Don't Actually Win When You Compare Them Fairly

**At Equal Inference Cost, Multi-Agent Structure Does Not Beat a Single Frozen Agent**
David Dylan, Aoife Brennan, Cian Murphy et al. (Trinity College Dublin + University College Dublin + Dublin City University) · arxiv: 2609.04217

Links: [arxiv](https://arxiv.org/abs/2609.04217) · [alphaxiv](https://www.alphaxiv.org/abs/2609.04217)

### TL;DR

Comparing a single agent against a Planner-Executor-Critic team under an identical language-model call budget, the team spends 1.8x the evaluation calls yet is statistically indistinguishable from the single agent on ALFWorld (0.769 vs 0.754, p=0.80) — and every bit of the realized gain traces back to the Executor role alone.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | Published 0 days ago; Semantic Scholar API rate-limited this run, and even if reachable a paper this fresh would almost certainly show 0 citations |
| Institution | Trinity College Dublin + University College Dublin + Dublin City University |
| Community signal | Not on HF Daily Papers or Papers with Code |
| Credibility | Pass — two evaluation environments, two budget regimes, a per-role decomposition, McNemar significance tests, and bootstrap confidence intervals are all present |
| Evidence maturity | Substantial — main results, per-role decomposition, and an instrumented collapse-mechanism analysis all covered, but everything rests on a single frozen 7B backbone |
| Reproducibility | Partial artifacts — algorithm, hyperparameters, and the full evolved Executor prompt are published in the appendix, but no public code repository link was found |
| Why this paper | Direct — directly tests the core design assumption behind CrewAI-, AutoGen-, and LangGraph-style planner/executor/critic multi-agent frameworks |
| Direction novelty | Substantive increment — first to treat "equal call budget" as the controlled variable and decompose a multi-agent team's value role by role |
| Today's importance | High — multi-agent orchestration is already the default industry pattern; this paper is the first systematic test of whether the structure itself is worth what it costs |
| Practical link | Clear — any team deciding whether to add a Planner or Critic role can directly apply this paper's controlled-comparison method |
| Editorial confidence | High — two budget regimes, per-role decomposition, and mechanism analysis all corroborate each other, and the claim's scope is stated precisely |
| Reading recommendation | Must-read — engineers designing or evaluating multi-agent orchestration architectures |
| Primary limitation | All results rest on a single frozen 7B backbone and a single Planner-Executor-Critic topology; the authors explicitly state they do not claim the conclusion transfers to larger or heterogeneous models |

### Field Context

Teams with a Planner that decomposes tasks, an Executor that acts, and a Critic that catches mistakes are already the standard design in frameworks like AutoGen, CAMEL, and MetaGPT, and are routinely reported to beat a single agent. But almost all of these comparisons hold environment rollouts fixed — a team issues two or three model calls per step where a single agent issues one, silently granting the team two or three times the compute without counting it as cost. This paper asks: if you fix the total number of calls instead, does the team's advantage survive?

### Mid-Level Walkthrough

- **The problem**: Imagine comparing two teams on a task — one with three players, one with a single player — but letting the three-player team play three times as many minutes. Winning under those conditions doesn't tell you whether "three players" as a structure actually helped. Multi-agent evaluations have long made exactly this mistake: teams consume two to three times the model calls of a single agent, yet are only ever compared "at equal environment rollouts."
- **The method**: The authors fix the evolutionary search's call budget and evolve prompts for both a single agent and a Planner-Executor-Critic team, sharing the same frozen 7B backbone across both — only the prompt content is free to evolve. After evolution, a "leave-one-in decomposition" keeps only one role active at a time (only Planner, only Executor, only Critic) to see which role is actually responsible for any gain.
- **Why it matters**: This turns the industry intuition "adding a role always helps" into a testable, decomposable question. Under a frozen backbone, the authors find the Planner and Critic prompts both evolve to empty — not because those roles are unimportant in principle, but because a shared frozen backbone offers no headroom for the roles to differentiate into genuinely distinct functions, so adding them buys nothing.

### Deep-Dive Points

- ALFWorld (n=134, binary scoring): single-agent evolution significantly beats the unevolved baseline (+0.097, McNemar p=0.021); the full team attains the highest mean (0.769), but its margin over the single agent (0.754) is only +0.015 and not statistically separable (p=0.80) — while spending 1.8x the evaluation calls (32.2 vs 18.0 per task)
- Leave-one-in decomposition: keeping only the Executor nearly matches the full team (+0.075); keeping only the Planner doesn't even separate from the unevolved baseline (+0.067, p=0.15)
- Even under the reversed, team-favoring budget rule — holding environment rollouts fixed and granting the team 2-3x free compute — the full team only ties the single agent (0.739=0.739), never converting the extra compute into a visible advantage
- On a second environment, WebShop (dense reward): single-agent evolution is essentially null (0.245≈0.245), and the team trends worse (0.185, Δ=-0.060, p=0.12) while costing more
- Deployment threshold: the conclusion is scoped to a frozen backbone (no fine-tuning); if the team's roles used models with genuinely different capabilities (e.g. a stronger model as Planner), the result might differ — the paper does not test that variant
- Connection to mainstream frameworks: directly targets the core design assumption behind AutoGen-, CrewAI-, and LangGraph-style planner/executor/critic orchestration, and offers a "fix the budget first" controlled-evaluation method that can be applied directly
- Limitation: all results are validated only on a single frozen 7B backbone, a single topology (Planner-Executor-Critic), a single optimizer (per-role coordinate ascent), and two benchmarks; the authors explicitly state they do not claim the conclusion extends to larger or heterogeneous models

### Reviewer's One-Line Take

The "fix the call budget" controlled design is very clean, and the two budget regimes plus per-role decomposition make the conclusion hard to dismiss; but this is still tested only on a small frozen 7B model, and whether larger or role-heterogeneous teams behave differently is deliberately left open — readers shouldn't extrapolate straight to their own larger systems.

### Takeaways for You

- If you're deciding whether to add a Planner or Critic role to your system: first ask whether the extra call budget that role consumes would be better spent evolving the Executor for a few more rounds — this paper's leave-one-in decomposition method can be applied directly as that comparison
- If you're writing an internal evaluation report for a multi-agent system: use "equal total calls" rather than "equal environment rollouts" as your comparison baseline, so extra compute the team quietly consumes doesn't get misread as a structural advantage

---

## Paper 2 | Does Your Agent's Memory Survive a Model Upgrade?

**Does Your Agent's Memory Survive a Model Upgrade? A Controlled Study of Memory Portability**
Ankit Goyal, Jaideep Ray (LinkedIn) · arxiv: 2609.05339

Links: [arxiv](https://arxiv.org/abs/2609.05339) · [alphaxiv](https://www.alphaxiv.org/abs/2609.05339)

### TL;DR

Comparing four common memory formats after a model upgrade, a fixed-schema knowledge graph loses almost nothing (+0.0004), while memory compressed into natural-language notes swings asymmetrically by +9.91 or -13.28 percentage points depending on migration direction — and without the original raw history retained, repair is very likely to fail.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (authors note "under review") |
| Citation velocity | Published 5 days ago; Semantic Scholar API rate-limited this run |
| Institution | LinkedIn (industry, two-person team) |
| Community signal | Not on HF Daily Papers or Papers with Code |
| Credibility | Pass — four hypotheses were locked into a signed Git tag before the experiments ran, and the authors honestly report that only two of the four cleared the preregistered threshold; methodology is unusually transparent |
| Evidence maturity | Substantial — four migration tests with significance testing, plus a diagnostic decomposition that traces loss to construction, retrieval, or reading — but only one cross-family model-upgrade pair was tested |
| Reproducibility | Partial artifacts — the preregistration tag, deviation log, and statistical code are stated to be "stored with the repository," but no public GitHub link was found |
| Why this paper | Direct — directly addresses the most practical reliability question for Mem0-, Zep-, or Letta-style memory layers: what happens when you swap the underlying model |
| Direction novelty | Substantive increment — first systematic comparison of four memory formats' portability under a model upgrade, with loss decomposed to a specific processing stage |
| Today's importance | High — model upgrades are routine, yet memory migration is almost never systematically tested; this paper is the first to quantify the risk |
| Practical link | Clear — directly yields an actionable memory-architecture selection guide |
| Editorial confidence | High — preregistered analysis combined with honest disclosure of hypotheses that missed the threshold gives the claimed narrative strength a solid statistical footing |
| Reading recommendation | Must-read — any team operating a production agent memory layer that expects to change model providers or versions in the future |
| Primary limitation | Only one cross-family model-upgrade pair was tested (Llama-3.1-8B ↔ Qwen2.5-7B, both under 10B parameters) on 48 synthetic histories; generalization to larger models or production-scale memory stores is unverified |

### Field Context

Agent platforms tend to treat memory as a solved problem: plug in Mem0, Zep, Letta, or a self-built vector store, and conversation history just gets remembered. But model upgrades are routine, and memory migration is rarely tested systematically. A new model may interpret an old model's notes completely differently; after an embedding-model swap, old vectors and new queries can effectively live in different spaces. The system still starts up, the database still returns results — performance just quietly degrades, with no error ever raised.

### Mid-Level Walkthrough

- **The problem**: Imagine your agent has been running for six months and its memory store has accumulated a huge amount of project detail, user preferences, and unfinished tasks. Now you swap the underlying model from A to B — the database doesn't throw an error, everything looks normal, but does B actually understand what A wrote correctly, or did some facts quietly get lost the moment they were written?
- **The method**: The authors compare four memory formats under a "written by the old model, read by the new model" scenario: raw long-context history (LC-RAW), chunk-and-retrieve RAG, model-compressed natural-language notes (NOTES), and a fixed-schema knowledge graph (KG-fixed). The core metric is Retained Performance After Swap — how much of the new model's own-store performance survives when it reads memory the old model wrote. All four hypotheses were locked into a signed Git tag before any test ran, and the paper honestly reports which cleared the threshold and which did not.
- **Why it matters**: This turns a vague worry — "will memory break?" — into a concrete, per-format risk list. Knowing that a fixed-schema knowledge graph survives migration best and natural-language notes are the most fragile gives teams an empirical basis for choosing a memory architecture, rather than a guess.

### Deep-Dive Points

- KG-fixed accuracy changes by only +0.0004 ± 0.0020 after a writer swap (own-store performance was already 0.845-0.988); NOTES instead swings asymmetrically by migration direction — Llama reading Qwen's notes gains +9.91 points, while Qwen reading Llama's notes loses -13.28 points
- After an embedding-model upgrade, a 50/50 mixed old/new index captures only 4.96 of the 11.90-point gain achieved by a full re-embed — most of the potential benefit is left on the table
- Diagnostic decomposition: 80% (0.467 ± 0.014) of the NOTES accuracy deficit comes from information lost during writing, while 81% (0.364 ± 0.012) of the RAG deficit comes from retrieval failing to surface the right chunk — the two formats fail for entirely different reasons
- Store-only repair (without access to the raw history) fails to reach the 90% recovery target in all 48 test cases for NOTES; retaining the raw source history enables successful recovery in 34 of 48 cases for one migration direction ⚠️ (LinkedIn internal evaluation, two-person team, no external replication yet)
- Deployment threshold: the methodology itself is easy to replicate against your own memory architecture, but only two sub-10B open-weight models were swapped here — enterprise-scale memory stores, larger models, and same-family version upgrades remain untested
- Connection to mainstream frameworks: directly relevant to Mem0-, Zep-, Letta-, and LangMem-style memory layers built on notes-style or RAG-style storage, and highlights that "keep the raw history around" — a design choice that looks wasteful — turns out to be the key insurance policy for repair
- Limitation: only two of the four preregistered hypotheses (partial embedding-migration loss; raw history's benefit for repair) cleared the preregistered five-point threshold; the two symmetry-based hypotheses did not, and the authors disclose this honestly rather than selectively reporting

### Reviewer's One-Line Take

Locking four hypotheses into a signed Git tag beforehand and honestly disclosing that two of four missed the threshold is a rare level of transparency for an engineering paper; but this only tests one small-scale cross-family model swap, and whether the conclusions hold at the scale of your own production memory store with hundreds of thousands of records is something the paper itself hasn't verified.

### Takeaways for You

- If you operate a production agent memory layer and expect to change models in the future: first check which memory format you're using — natural-language notes compressed by the model carry the highest risk, so consider a fixed-schema structured store, or at minimum ensure raw conversation history is backed up for repair
- If you're upgrading an embedding model: don't treat a "mixed old/new vector index" as a convenient shortcut — this paper's numbers show a mixed index captures only a fraction of a full re-embed's gain, so most of that investment is wasted

---

## Paper 3 | Stronger Models May Mean More Systemic Risk in Multi-Agent Systems

**Why Better Models Can Create Riskier Systems: Evidence from LLM Agents in Financial Markets**
Jillian Ross, Eric So, Zoe De Simone, Charles Pozniak, Andrew W. Lo (MIT + Harvard Kennedy School) · arxiv: 2609.04373

Links: [arxiv](https://arxiv.org/abs/2609.04373) · [alphaxiv](https://www.alphaxiv.org/abs/2609.04373)

### TL;DR

As capability scores rise, the pairwise correlation of models' non-corrective behavior rises significantly with them (ELO: p=0.001; MMLU-Pro: p<0.001); when these highly correlated models share a misinformation environment, LLM traders that were supposed to improve price discovery instead push market tracking error to 5-7x the noise-trader baseline.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | Published 6 days ago; Semantic Scholar API rate-limited this run |
| Institution | MIT (EECS + Sloan School of Management) + Harvard Kennedy School Belfer Center; senior author Andrew W. Lo is a well-known figure in systemic risk and the Adaptive Markets Hypothesis |
| Community signal | Not on HF Daily Papers or Papers with Code; authors state code "will be distributed with a repository license" — no link found yet |
| Credibility | Pass — three research questions each have independent controls and significance tests, the theoretically derived risk floor is bootstrap-validated, and a "does sharing a provider matter" control rules out the simplest alternative explanation |
| Evidence maturity | Substantial — correlation regression, theoretical risk-floor validation, participation-scaling simulation, and an adversarial-information stress test all corroborate each other, but the entire study rests on one simplified simulated market |
| Reproducibility | Partial artifacts — simulation mechanics, decomposition equations, and capability benchmarks are specified in the paper and appendices, but no public code link was available at time of review |
| Why this paper | Direct — directly addresses whether capability improvements in individual LLMs actually translate into better system-level outcomes when multiple agents are deployed together |
| Direction novelty | Substantive increment — first to extend the static algorithmic-monoculture literature into a dynamic feedback system, and to show capability and correlated risk have a non-monotone relationship |
| Today's importance | High — frontier models are increasingly deployed into environments where they interact with each other; this paper identifies a systemic risk source that individual evaluation cannot see |
| Practical link | Clear — gives teams deploying multiple similarly-capable models in one system a concrete metric to monitor (cross-model correlation), not just single-model accuracy |
| Editorial confidence | High — the three research questions' conclusions connect coherently, the theoretical floor is empirically validated, and the paper clearly states the simulated market's scope boundary |
| Reading recommendation | Must-read — architects deploying frontier models in multi-agent environments, and teams responsible for AI risk governance |
| Primary limitation | All empirical evidence comes from a simplified single-asset simulated market with exogenous fundamentals and non-endogenous liquidity; real markets' asset correlations and strategic adaptation are not modeled, and the paper explicitly states cross-domain generalization is an open question |

### Field Context

The algorithmic-monoculture literature has already shown that shared adoption of a single algorithm makes decision-makers' errors correlate, even when that algorithm is individually optimal — but these studies mostly stay in static, one-shot decision settings. As LLM agents get deployed into financial markets, content moderation, and hiring — systems that interact continuously over time and affect each other's state — does improving individual model capability actually make the whole system more stable? This paper takes the static monoculture theory and re-tests it inside a dynamic feedback system.

### Mid-Level Walkthrough

- **The problem**: Imagine a market full of automated LLM trading agents, each excelling on its own benchmark. Intuitively, swapping in more capable models should make the market more stable and price discovery more accurate. But what if the reason these models are "better" is precisely that similar training data and architecture taught them to think the same way?
- **The method**: The authors split each agent's action into a corrective component (the part that pulls price back toward fundamentals) and a non-corrective residual (whatever's left, possibly from framing bias, learned heuristics, or noise). If different agents' non-corrective residuals are independent, they cancel out in aggregate; if they're correlated, they leave behind a risk floor that no amount of adding more agents can eliminate. The authors first measure how this correlation rises with capability across 7 frontier models in a controlled panel, then run a single-asset market simulation to test what happens when (a) more capable agents join the market, and (b) those agents share a misleading information environment.
- **Why it matters**: This shows that standard model evaluation — accuracy, or any single agent's benchmark score — cannot see what happens when multiple similarly-capable models are deployed together. A model can top every standard evaluation while simultaneously contributing a large aggregation risk to every system it's deployed in, undetectable by any current audit.

### Deep-Dive Points

- Pairwise non-corrective correlation across 7 LLMs is significantly predicted by capability: ELO score (t=3.94, p=0.001, R²=0.475) and MMLU-Pro (t=4.88, p<0.001, R²=0.580) are both strong significant predictors, while sharing a provider is not significant at all (p=0.39 / p=0.28) — showing the correlation tracks capability itself, not vendor-specific quirks
- A bootstrap resample validates the theoretically derived risk floor (ρ·σᵣ²=0.010, roughly half a single model's variance), confirming this floor is not a small-sample artifact but a real limit that holds even with an unlimited number of models
- Under a neutral information condition, increasing LLM participation share monotonically lowers tracking error, with all three model families (Claude Haiku 4.5, Claude Sonnet 4.6, Gemini 2.0 Flash Lite) beating the noise-trader baseline
- But when every agent shares a coordinated distractor asserting fundamentals are overstated by 25-30%, tracking error rises steeply with LLM share, reaching 5-7x baseline at full participation; directional accuracy collapses to 42-68% (Claude Sonnet 4.6 falls below chance, meaning its net orders actively move against the true direction)
- Deployment threshold: what this paper offers is a diagnostic method for checking whether the multiple models you deploy have correlated non-corrective behavior, not a ready-made fix — the paper itself lists "how to decorrelate a model population without sacrificing individual capability" as an open problem
- Limitation: all empirical evidence comes from a simplified single-asset market with exogenous fundamentals; real markets' asset correlations, endogenous liquidity, and strategic adaptation are not modeled, and whether the same dynamics generalize across domains is explicitly left open

### Reviewer's One-Line Take

The "sharing a provider isn't significant, but capability is" control is this paper's most persuasive move, ruling out the simplest alternative explanation; but the whole conclusion rests on a highly simplified single-asset simulated market, and whether it generalizes to real markets with complex asset correlations and strategic adaptation is a question the paper itself hasn't answered yet.

### Takeaways for You

- If you deploy multiple similarly-capable frontier models within one system: beyond each model's individual accuracy, also measure how correlated their non-corrective behaviors are with each other — this paper provides a concrete regression design you can apply directly
- If you're responsible for AI risk governance or multi-agent system safety review: before treating "use more diverse model providers" as a risk-diversification cure-all, check whether the correlation you're worried about actually tracks capability itself — this paper's results suggest cross-provider deployment may not diversify risk as much as assumed

---

## What Today Added Up To

I used to assume "add more agents," "wire up a memory system," and "upgrade to a stronger model" each corresponded straightforwardly to better collaboration, longer memory, and stronger capability — obvious progress. Today I learned all three need a controlled test before they count: a multi-agent team's advantage can vanish once you account for its call budget as a real cost; a memory system's reliability depends on which storage format you chose, not on whether it has "memory" at all; and improving model capability, once placed inside a multi-agent system where models affect each other, might not shrink risk — it might make risk harder to diversify away.

## References

- [At Equal Inference Cost, Multi-Agent Structure Does Not Beat a Single Frozen Agent](https://arxiv.org/abs/2609.04217)
- [Does Your Agent's Memory Survive a Model Upgrade? A Controlled Study of Memory Portability](https://arxiv.org/abs/2609.05339)
- [Why Better Models Can Create Riskier Systems: Evidence from LLM Agents in Financial Markets](https://arxiv.org/abs/2609.04373)
- [arXiv cs.MA new submissions, Monday 7 September 2026 (source announcement batch)](https://arxiv.org/list/cs.MA/new)
- [arXiv cs.AI new submissions, Monday 7 September 2026 (source announcement batch)](https://arxiv.org/list/cs.AI/new)
