---
title: "AI Agent Arxiv Digest — 2026-11-18"
date: 2026-11-18
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Three papers today puncture three assumptions: experience and memory can become a liability after a silent tool-interface change, self-improvement doesn't need heavy downstream evaluation, and mainstream agent orchestration frameworks still haven't gotten authorization boundaries right"
tldr: "Experience Rot shows agents carrying stale experience fail across the board once a tool interface silently changes, and misjudge their own success; ELITE's evaluation-free deterministic gate pushes a coding agent from 60.0% to 85.6% on SWE-bench Pro, 8.8x faster than its competitor; across LangChain, LangGraph, AutoGen and OpenClaw, 12 OWASP-mapped experiments all turned up prompt injection or unauthorized tool execution"
series:
  name: "AI Agent Arxiv Digest"
  order: 178
---

## Today's Overview

Three papers today puncture three assumptions treated as common sense in agent systems, each from a different angle. The first runs a preregistered, six-model experiment showing that once a tool interface silently changes, agents carrying prior experience fail *more* often than novices with no background knowledge at all — and still confidently report success. The second demonstrates a self-improvement loop that needs zero downstream task evaluation, pushing a coding agent from 60.0% to 85.6% on SWE-bench Pro while running 3-9x faster than competitors that depend on heavy evaluation. The third runs 12 experiments mapped to the OWASP Top 10 for Agentic Applications across four production orchestration frameworks — LangChain, LangGraph, AutoGen and OpenClaw — and finds every single one vulnerable. Together, they say the same thing: where agent systems actually get stuck today has shifted from "is the model smart enough" to "does it remember, evolve, and authorize correctly" — and right now, mainstream practice isn't getting any of those three right.

```diagram
title: Three layers punctured by today's agent papers
desc: From bottom to top: a single agent's memory and experience, a single agent's self-improvement loop, and the authorization/trust boundaries that only surface when agents collaborate; each of today's three papers quantifies a gap at one of these layers.
caption: The bottom-to-top ordering is an editorial grouping (individual agent → multi-agent collaboration), not a claim that the three papers depend on or cause one another.
---
<svg viewBox="0 0 640 280">
  <path class="dg-axis" d="M36 232V40" marker-end="url(#arrow)"/>
  <text class="dg-tag" x="16" y="12" dominant-baseline="central">multi-agent</text>
  <text class="dg-tag" x="16" y="248" dominant-baseline="central">single agent</text>

  <rect class="dg-box" x="72" y="24" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="40" dominant-baseline="central">L3</text>
  <text class="dg-label" x="124" y="40" dominant-baseline="central">Authorization &amp; trust boundaries</text>
  <text class="dg-sub" x="124" y="64" dominant-baseline="central">All 4 frameworks: injection, unauthorized tool calls</text>

  <rect class="dg-box" x="72" y="88" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="104" dominant-baseline="central">L2</text>
  <text class="dg-label" x="124" y="104" dominant-baseline="central">Self-improvement loop</text>
  <text class="dg-sub" x="124" y="128" dominant-baseline="central">Eval-free gate, 8.8x faster</text>

  <rect class="dg-box" x="72" y="152" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="168" dominant-baseline="central">L1</text>
  <text class="dg-label" x="124" y="168" dominant-baseline="central">Memory &amp; experience</text>
  <text class="dg-sub" x="124" y="192" dominant-baseline="central">Silent interface change: veterans lose to novices</text>
</svg>
```

## Terms worth knowing before reading

| Term | Plain-language explanation |
|---|---|
| MCP (Model Context Protocol) | A standard interface protocol that lets an agent call external tools/services; a tool's parameters or behavior can change at any time |
| Silent tool-interface change | A service updates a tool's parameters or behavior without any version warning — the caller has to discover it on its own |
| Recursive Self-Improvement (RSI) | Letting an agent modify and evolve its own code or strategy, getting stronger round after round |
| OWASP Top 10 for Agentic Applications | A security-community taxonomy of the top ten risks for agent applications, covering prompt injection, unauthorized tool execution, and more |
| Agent orchestration framework | Developer frameworks like LangChain, LangGraph, and AutoGen that wire together multiple agents, tools, and memory |
| Trust boundary | The line in a system over "who is allowed to ask whom to do what"; once it's breached, one agent's error or malicious instruction can spread to others |

---

## Paper 1 | Experience as liability: a tool interface quietly changed, and veterans lost to novices

**Experience Rot: Experienced Agents Fail Where Novices Succeed**
Zhen Xu, Hang Yin, Zitao Zhang et al. (University of Chicago + eBay + University of Florida) · arxiv: 2611.20922

Links: [arxiv](https://arxiv.org/abs/2611.20922) · [alphaxiv](https://www.alphaxiv.org/abs/2611.20922)

### TL;DR

Once an MCP tool interface is silently changed, agents carrying experience or memory fail *more* often than novices with zero background knowledge — and the failing agents still misjudge that they've completed the task.

### Editorial judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (not yet peer-reviewed) |
| Citation velocity | Published 1-2 days ago; no citation data yet |
| Institution | University of Chicago + eBay + University of Florida (academia/industry mix) |
| Community signal | Not found on HF Daily Papers curation; a Substack blog discussed it the same day — media pickup, not academic citation |
| Credibility | Pass — most conditions preregistered with 10,000 cluster-bootstrap resamples; a three-arm comparison (no experience / valid experience / stale experience); memory-format and remediation ablations |
| Evidence maturity | Substantial — across 6 models, with mechanism-level diagnosis (doc-lookup rate, re-check behavior) |
| Reproducibility | Partial artifacts — prompts and task setups are listed in the appendix, but no code or dataset link found |
| Why this paper | Direct — any memory-equipped agent using MCP or a similar tool protocol can hit this failure mode |
| Novelty | Substantive — the first preregistered design to decompose "experience backfiring" into measurable components like doc-lookup rate and re-check behavior |
| Today's importance | High — memory-equipped agent platforms are being deployed at scale, and this directly punctures the assumption that experience is always an asset |
| Practical link | Clear — any tool-calling system relying on cached memory should check interface versions instead of trusting that a past-successful call pattern still works |
| Editorial confidence | High — the preregistered design, statistical methods, and mechanism-level diagnosis support the narrative strength the article uses |
| Reading recommendation | Must-read — any team running agent memory/skill caching in production |
| Primary limitation | All three test services (calendar/todo/mailbox) are author-built synthetic environments, not real production MCP deployments |

### Field background

Agents operating across many turns or sessions are usually encouraged to accumulate "experience" — remembering how they solved problems before, how they called tools. But tools and APIs themselves evolve over time; prior work mostly assumed stable interfaces and rarely tested what happens to experience once the interface changes.

### Mid-level walkthrough

- **The problem**: Imagine you're used to a calendar app's API, and one day the developer quietly changes how "create event" takes its parameters — with no notice at all. A novice who's never used this API will dutifully read the latest docs; a veteran who remembers the old calling convention will instead rely on memory and force the old format — and fail.
- **The method**: The team built three synthetic MCP services (calendar, to-do, mailbox) and quietly changed the tool interfaces inside them, comparing three kinds of agents: total novices, veterans carrying "correct but now stale" experience, and an intermediate control. They also tested four memory formats (conversation history / files / retrieval / skill-wrapped) and several remediation mechanisms (reminding the agent to re-check docs, revising its own notes, and so on).
- **Why it matters**: The remediation mechanisms almost all failed — not because the remembered content was wrong, but because the agent simply lacks the reflex of "I should re-verify the current state." Worse, failing agents frequently and confidently report "task complete."

### Deep dive

- Across all 6 tested models, agents with stale experience underperformed novices every time ⚠️ (author-built synthetic environments, not real production MCP services)
- The failure mechanism decomposes: lower doc-lookup rates, less re-checking behavior — "too lazy to re-verify," not "remembered the wrong thing"
- Remediation like prompting agents to re-check docs or revise notes had limited effect
- Failing agents frequently misjudge themselves as having completed the task — a double risk (wrong, and unaware of it)
- The authors cite a real Todoist API-divergence case and SilentProbe statistics as motivation that silent interface changes are common in the real world
- Limitation: all three test services are author-built synthetic environments; the extent to which this transfers to real production environments is untested

### Reviewer's one-liner

The experimental design (preregistration + mechanism decomposition) is rigorous enough to support the scoped claim that "experience can become a liability" — but don't extrapolate the exact magnitude from these synthetic environments straight onto your own production system.

### Take-away for you

- If you maintain an agent system with memory or skill caching: don't treat "the agent got this right before" as a reliable signal by itself — add interface-version detection or a forced re-verification step.
- If you design agent evaluations: log self-reported task completion separately from external verification — this paper shows the two systematically decouple under failure.

---

## Paper 2 | Self-improvement without evaluation: ELITE drops the evaluation bill for coding agents

**Evaluation-Free Recursive Self-Improvement for Coding Agents (ELITE)**
Zhe Ren, Guowei Rong, Yimeng Chen et al. (Jilin University + KAUST) · arxiv: 2611.21056

Links: [arxiv](https://arxiv.org/abs/2611.21056) · [alphaxiv](https://www.alphaxiv.org/abs/2611.21056)

### TL;DR

A self-improvement loop that needs zero downstream task evaluation pushes a coding agent from 60.0% to 85.6% on SWE-bench Pro — 3-9x faster than competitors that need thousands of evaluation runs.

### Editorial judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (not yet peer-reviewed) |
| Citation velocity | Published 1-2 days ago; no citation data yet |
| Institution | Jilin University (School of AI) + KAUST (includes Jürgen Schmidhuber's research group) |
| Community signal | No GitHub code link found; no community curation signal yet |
| Credibility | Pass — headline results honestly disclose ELITE scoring slightly below both baselines; seven design ablations; cross-backbone portability test; Limitations section explicitly scopes down the claims |
| Evidence maturity | Substantial — multiple backbones, extensive ablations and sensitivity analysis, but confined to one domain (coding agents) |
| Reproducibility | Not provided — no code or data link found in the text excerpts read or the abstract |
| Why this paper | Direct — the self-improvement loop is one of the costliest, most sought-after pieces for agent platforms right now |
| Novelty | Substantive — replacing downstream evaluation with a deterministic gate is an uncommon structural change to RSI loop design |
| Today's importance | High — the efficiency gain (3-9x) is large enough to change whether a team dares put an RSI loop into production scheduling |
| Practical link | Clear — directly applicable to teams running Darwin/Huxley Godel Machine-style RSI loops who are struggling with evaluation cost |
| Editorial confidence | High — the text honestly discloses the trade-off (efficiency vs. absolute score), matching the narrative strength used |
| Reading recommendation | Must-read — teams doing self-improvement/automated iteration for coding agents |
| Primary limitation | Authors acknowledge the benchmark scope is confined to a selected coding-agent subset, some comparisons are single-run, and only one evolutionary lineage is currently maintained |

### Field background

Letting an agent modify and evolve its own strategy — "recursive self-improvement" (RSI) — has typically required running a full downstream evaluation every iteration to confirm the new version actually improved before adopting it, a step often more expensive than training itself. Methods like the Darwin/Huxley Godel Machine are representative: evaluation cost is high but treated as a necessary gatekeeper.

### Mid-level walkthrough

- **The problem**: Imagine every time you tweak a coding agent's strategy, you have to run the entire SWE-bench just to know if the change helped — evaluation alone takes hundreds of runs. Is there a way to skip re-taking the exam every time while still being sure the new version actually improved?
- **The method**: ELITE uses a two-step "Explore-then-Integrate" loop: explore multiple candidate changes first, then filter which ones to integrate using deterministic checks of structural/operational validity — instead of running downstream tasks. The key evidence: removing the deterministic gate collapses performance straight down to 52.0%, proving this "no evaluation, but still gatekept" design is the core mechanism.
- **Why it matters**: For teams running RSI loops, this means self-improvement can run at far lower compute cost without sacrificing gatekeeping quality.

### Deep dive

- SWE-bench Pro: ELITE 85.6%, vs. baselines DGM 86.7% and HGM 88.3% — scoring slightly below both baselines ⚠️ (author-reproduced baselines, not numbers taken directly from the original papers)
- Efficiency comparison: ELITE needs 0 downstream candidate evaluations vs. baselines' 810/800, yielding 8.8x/3.2x speedups
- Removing the deterministic gate collapses performance to 52.0%, proving the gate is core mechanism, not decoration
- Portability tested across multiple model backbones
- Limitation: benchmark scope confined to coding agents, some comparisons single-run, only one evolutionary lineage currently maintained

### Reviewer's one-liner

Honestly disclosing "an efficiency advantage, not an absolute-score advantage" is the most trustworthy part of this paper — but remember the DGM/HGM baselines are the authors' own reproductions, not numbers lifted directly from the original papers, when comparing.

### Take-away for you

- If you're building automated iteration/self-improvement for coding agents: the Explore-then-Integrate deterministic gate design is directly worth borrowing — shift evaluation cost from "run every round" to "structural validity check."
- If you're evaluating whether to adopt an RSI loop: ask first whether the efficiency numbers are based on reproduced baselines before deciding which comparison cost to anchor on.

---

## Paper 3 | Four mainstream agent orchestration frameworks, all vulnerable on authorization boundaries

**Evaluating Authorization and Trust Boundaries in Agentic Orchestration Frameworks**
Sahaya Jestus Lazer, Kshitiz Aryal, Maanak Gupta et al. (Tennessee Tech University + University of Nebraska Omaha + Purdue University) · arxiv: 2611.21259

Links: [arxiv](https://arxiv.org/abs/2611.21259) · [alphaxiv](https://www.alphaxiv.org/abs/2611.21259)

### TL;DR

Twelve experiments mapped to the OWASP Top 10 for Agentic Applications across four production orchestration frameworks — LangChain, LangGraph, AutoGen and OpenClaw — found every one vulnerable to prompt injection, unauthorized tool execution, memory poisoning, or inter-agent trust failure.

### Editorial judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (under submission, not yet finalized to a conference version) |
| Citation velocity | Published less than a day ago; no citation data yet |
| Institution | Tennessee Tech University + University of Nebraska Omaha + Purdue University (includes security researcher Elisa Bertino) |
| Community signal | Picked up and correctly summarized by the GitHub "Awesome multi-agent-system" tracking list |
| Credibility | Pass — 12 experiments mapped to the OWASP Top 10 for Agentic Applications, covering four real frameworks; vulnerable-vs-protected configurations compared experiment by experiment; Limitations explicitly discloses single-model testing |
| Evidence maturity | Substantial — 12 independent experiments, dual-configuration comparisons, clear OWASP mapping, but confined to one model and four frameworks |
| Reproducibility | Partial artifacts — full version numbers listed (LangChain 1.2.17, LangGraph 1.1.10, etc.) and environment specs, but no explicit code/dataset link found |
| Why this paper | Direct — LangChain/LangGraph/AutoGen are among the most widely used agent orchestration frameworks in production today |
| Novelty | Substantive — the first systematic mapping of the OWASP Top 10 for Agentic Applications onto empirical tests across four real frameworks |
| Today's importance | High — any team already running these frameworks in production should check today whether they've hit the same holes |
| Practical link | Clear — names exactly which OWASP risk category shows up in which framework, so readers can check their own deployment item by item |
| Editorial confidence | High — the authors disclose the limited scope precisely, matching the narrative strength used |
| Reading recommendation | Must-read — any team running multi-agent systems in production on one of these four frameworks |
| Primary limitation | Tested only one model (gpt-4o-mini); enterprise IAM, credential-based authentication, and external policy engines were not comprehensively evaluated |

### Field background

Orchestration frameworks like LangChain, LangGraph, and AutoGen let developers quickly wire together multiple agents and tools, but their design priority has been "making the functionality work," not systematic testing of the authorization/trust boundary — who is allowed to ask whom to do what. OWASP recently compiled a dedicated top-ten risk taxonomy for agentic applications, but cross-framework empirical data has been missing.

### Mid-level walkthrough

- **The problem**: Imagine you wire three agents together in LangGraph, dividing labor — one reads user input, one calls tools, one writes back to the database. If the input-reading agent gets injected with a malicious instruction, can it simply "borrow" the tool-calling agent's permissions to do something it was never authorized to do?
- **The method**: The team designed 12 experiments, each mapped to one risk category in the OWASP Top 10 for Agentic Applications (prompt injection, unauthorized tool/command execution, memory poisoning, inter-agent trust failure, and more), running each across LangChain, LangGraph, AutoGen, and OpenClaw, testing both an unprotected and a protected configuration for every experiment.
- **Why it matters**: All four frameworks were vulnerable under the unprotected configuration — meaning this isn't one framework falling short, but a sign that "multi-agent collaboration" as a design pattern is broadly still immature on authorization boundaries.

### Deep dive

- 12 OWASP-mapped experiments across 4 real frameworks (LangChain 1.2.17, LangGraph 1.1.10, AutoGen, OpenClaw)
- All four frameworks showed at least one of: prompt injection, unauthorized tool/command execution, memory poisoning, or inter-agent trust failure under their vulnerable configuration
- The protected configuration reduces risk, but the paper never claims any framework is "inherently safer"
- Limitation: tested only one model, gpt-4o-mini (authors state this was to reduce model-choice variance); enterprise IAM/credential-based authentication not comprehensively tested
- The authors themselves disclose: a stronger, better-aligned model might yield different attack success rates, but the framework-level lack of cross-component authorization checks is an architectural problem that switching models alone may not fix

### Reviewer's one-liner

Running the same OWASP taxonomy as a controlled experiment across four real frameworks is this paper's strongest contribution — but it only tested one relatively weak model (gpt-4o-mini), so don't treat the specific attack success rates as universal numbers that would hold for a stronger, safety-aligned model.

### Take-away for you

- If you're running a multi-agent system in production on LangChain/LangGraph/AutoGen/OpenClaw: follow the OWASP Top 10 for Agentic Applications taxonomy and check item by item whether you've implemented the protections this paper's "protected" configurations correspond to.
- If you're evaluating whether to adopt multi-agent collaboration: put authorization/trust-boundary testing on your pre-launch checklist — don't assume a framework's default settings are safe.

---

## Today's takeaway

I used to think agent systems get stuck mainly because the model's reasoning isn't smart enough. Now I know that even with a smart enough model, getting the engineering details right — how it remembers (Experience Rot), how it evolves (ELITE), how it authorizes (Auth Boundaries) — matters just as much, and getting any single one wrong can break the whole system. All three papers today point at exactly the places mainstream practice still hasn't gotten right.

## References

- [Experience Rot: Experienced Agents Fail Where Novices Succeed (arXiv:2611.20922)](https://arxiv.org/abs/2611.20922)
- [Experience Rot — alphaxiv](https://www.alphaxiv.org/abs/2611.20922)
- [Evaluation-Free Recursive Self-Improvement for Coding Agents, ELITE (arXiv:2611.21056)](https://arxiv.org/abs/2611.21056)
- [ELITE — alphaxiv](https://www.alphaxiv.org/abs/2611.21056)
- [Evaluating Authorization and Trust Boundaries in Agentic Orchestration Frameworks (arXiv:2611.21259)](https://arxiv.org/abs/2611.21259)
- [Auth Boundaries — alphaxiv](https://www.alphaxiv.org/abs/2611.21259)
- [OWASP Top 10 for Agentic Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
