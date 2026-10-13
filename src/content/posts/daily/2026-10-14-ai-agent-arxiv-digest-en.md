---
title: "AI Agent Arxiv Digest — 2026-10-14"
date: 2026-10-14
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Three papers today puncture the same assumption — that a better metric means a better system: memory governance plugs a leak but costs personalization, a faster decision model doesn't translate into more completed tasks, and long-horizon professional work has a far lower pass rate than it looks"
tldr: "A memory-governance paper shows tightening admission cuts leakage by 17.5pp but raises personalization failures at the same time; Jev cuts per-decision cost by 66-78%, yet one agent's cost per successful outcome actually rises 7.7%; DAYJOB tests 130 real professional tasks and finds even Claude Opus 5.5 only passes 24.7%/23.9% in full"
series:
  name: "AI Agent Arxiv Digest"
  order: 143
---

> 🌏 [中文版](/posts/daily/2026-10-14-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers look like they're about different things — memory governance, long-horizon professional work, and fast decision models — but together they make the same point: optimizing a metric you can see doesn't guarantee the outcome you actually want. "What to Admit and How to Present" splits memory systems into two separate decisions — what gets let into the context, and how it gets presented — and shows that tightening the first cuts cross-domain leakage by 17.5 percentage points, at the cost of a simultaneous rise in "personalization that should have happened but didn't." DAYJOB tests agents on 130 real healthcare and finance tasks and finds that even today's strongest model, Claude Opus 5.5, only passes in full on 24.7%/23.9% of attempts — a stark reminder of the gap between high general-capability scores and real professional work that demands every criterion be met. The Jev study shows that swapping a decision step for a faster, cheaper model cuts per-decision cost by 60-80%, but for one agent the cost per successfully completed task actually goes up, because the savings get eaten by failed retries. All three papers have solid evidence — and all three are honest about exactly where their claims stop, which is itself worth noticing today.

## Terms Worth Knowing Before You Read

| Term | Plain-language explanation |
|---|---|
| Agent | An AI system that plans its own steps, calls tools, and iterates — not a one-shot question-answering chatbot |
| Memory Governance | The mechanism deciding whether an agent's long-term memory should be used (admission) and how it should be expressed (presentation) — two decisions that can be controlled and measured separately |
| Preregistered Study | Publicly committing, before data collection, to exactly what will be tested and how success is judged — so results can't be cherry-picked afterward |
| Typed Decision Model | A model like Jev: given a situation and a set of options, it directly returns a probability over which option to pick, instead of generating text that then has to be parsed |
| All-or-nothing Rubric | A grading scheme made of a list of binary yes/no criteria (e.g. "did it flag a specific warning") where missing even one criterion fails the entire attempt, rather than averaging a score |
| Containerized Benchmark Sandbox | Packaging a task's files, tools, and network access into an isolated container, so an agent can actually do the work inside it before being checked |

---

## Paper One | What to Admit, and How to Present It: Governing Persistent Memory in LLM Agents

**What to Admit and How to Present: Governing Persistent Memory in LLM Agents**
Chang Liu, Deliang Ding (Pazhou Laboratory, Guangzhou, China) · arxiv: 2610.11188

Links: [arxiv](https://arxiv.org/abs/2610.11188) · [alphaxiv](https://www.alphaxiv.org/abs/2610.11188)

### TL;DR

Splitting "should this memory be used" (admission) from "how should it be expressed" (presentation) into two independent decisions, the paper finds that tightening admission significantly cuts cross-domain leakage (up to 29.5 percentage points), but both tested tightening designs simultaneously raise "personalization that should have happened but didn't," while switching the presentation style makes almost no statistically significant difference.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint, under review at AAMAS 2027 |
| Citation velocity | Published 6 days ago (submitted 2026-10-08); Semantic Scholar confirms 0 citations |
| Institution | Pazhou Laboratory (Guangzhou) |
| Community signal | Not on HF Daily Papers; no reproduction repo found on Papers with Code |
| Credibility | Pass — three preregistration documents, dual validation on a four-backbone development suite plus an external benchmark, statistics include McNemar tests and Holm/BH correction, with a human-annotator check on the judge (κ=0.70) |
| Evidence maturity | Substantial — covers pipeline-level comparisons, a verdict-fixed presentation comparison, and a single-variable admission-tightening experiment, each isolating a different variable |
| Reproducibility | Partial artifacts — three preregistration documents, per-sample binary labels, and an audit script are released with the paper; no full code repository link was found within this round's reading |
| Why this one | Direct — memory is a core component most agent platforms are actively investing in right now |
| Novelty | Substantive — the first paper to split "what gets admitted" from "how it's presented" into two separately controlled, separately measured governance decisions |
| Today's importance | High — directly answers whether to spend engineering budget on filtering memory or on packaging it |
| Practical link | Clear — recommends prioritizing context-layer admission review over presentation-layer polish, and warns embedding-based relevance gating may be ineffective |
| Editorial confidence | High — the paper clearly draws its own claim boundaries (personalization cost, no significant presentation difference), and the article's framing matches that strength |
| Reading recommendation | Must-read — for anyone building agent memory or personalization systems |
| Primary limitation | Both tested admission-tightening designs raise "personalization that should have happened but didn't," and PS misses its own preregistered effect-size threshold (needed ≥10pp, got 8.8pp) |

### Field Background

Memory lets an agent "remember you," but it also makes it easy to become too agreeable (sycophancy) or to leak private information from one domain into a conversation about another. Prior defenses mostly filter once before storage (storage-side) or apply a coarse relevance filter at retrieval time (retrieval-layer); few have measured "should this enter this turn's context" and "how is it written into the prompt once admitted" as two separate things.

### Mid-level Walkthrough

- **The problem**: Imagine a memory entry says "This user has self-custodied bitcoin since 2013." When the user asks "how do I buy bitcoin," this is a useful expertise signal; when they ask "what should I invest in," it's just background, not a current preference; when they ask about writing a resume, it's irrelevant. Most systems today inject memories verbatim and let the generator figure out whether to use them — which is exactly where leakage and over-agreeableness come from.
- **The method**: The paper runs a single "situated adjudication" call where one model sees the query, the dialogue history, and all top-k memories at once, assigns attributes to each memory (is it a verified fact or a user opinion? is it relevant to the current domain?), and then uses deterministic code to translate those attributes into eligibility decisions — the adjudicator only judges attributes, never the final action. Both tested admission designs (FC, which judges whole entries; PS, which splits entries into finer-grained units) significantly cut leakage on the external benchmark; but the same evaluation setup, when only the packaging is changed and the admitted content stays identical, shows almost no difference.
- **Why it matters**: If you're designing a memory module for an agent platform, this gives a clear priority order: spend the budget on deciding what enters the context, not on designing a prettier presentation format — at least between the two presentation styles tested here, the difference doesn't hold up statistically.

### Deep-dive Points

- Relative to verbatim injection, the two admission designs cut pooled failure rates on the external benchmark (MemSyco-Bench, 4 tasks × 300 samples) by 6.7pp (p=2.7×10⁻⁷) and 8.8pp (p=4.1×10⁻¹²) respectively
- On the development suite, cross-domain leakage falls by up to 29.5pp (Qwen3.7-Max) and 15.0pp (Kimi-K2.6); in a controlled experiment that holds presentation fixed and only tightens admission, it falls a further 17.5pp (p=1.6×10⁻⁴)
- Counter-example: a reimplementation of query-conditioned gating (MemGate) shows no statistically significant improvement on objective-fact failure (45.2%→45.5%, p=1.0)
- But both admission designs simultaneously raise "personalization that should have happened but didn't" (FC +7.6pp, PS +5.3pp, both significant) — the authors flag this as an "overshoot"
- When memory conflicts with provided evidence, the misleading-response rate stays at 82.3-85.0% under every tested governance design (vs. 91.7% for verbatim injection, 0% with no memory at all) — the authors call this "a residual-failure observation, not an established mechanism"
- Limitation: PS misses its own preregistered effect-size gate (needed ≥10pp pooled improvement, got 8.8pp; and personalization accuracy dropped 6.0pp, exceeding the preregistered 3pp no-degradation line)

### Reviewer's One-line Take

Cleanly separating two decisions that are usually conflated — what to admit and how to present it — with preregistration, dual-surface evaluation, and multiple statistical corrections is an unusually rigorous piece of methodology for this literature; but the paper's most honest point is also its biggest limitation — neither tested design actually resolves the tension between safety and personalization, and the authors explicitly write this as "unresolved" rather than dressing it up as a success story.

### Take-aways for You

- If you're building an agent memory or personalization system: invest first in context-layer admission review (judging each memory's attributes before deciding whether it can be used) rather than tweaking presentation format, and track "personalization that should have fired but didn't" as a metric alongside leakage rate
- If you're evaluating an off-the-shelf memory filter: this paper's counter-example is a warning that embedding-relevance-only gating (like MemGate-style designs) may have no statistically significant effect on objective-fact tasks — worth re-testing yourself before shipping it

---

## Paper Two | DAYJOB: Even the Strongest Model Only Gets a Bit Over Two Fifths Right

**DAYJOB: A Benchmark for Long-Horizon Professional Work**
Stephanie Finley, Liudas Panavas, Thomas Mikkelson et al. (Surge AI) · arxiv: 2610.01306

Links: [arxiv](https://arxiv.org/abs/2610.01306) · [alphaxiv](https://www.alphaxiv.org/abs/2610.01306)

### TL;DR

130 tasks written by real healthcare and finance professionals, each estimated to take a human 13.6-16.6 hours, graded with an all-or-nothing rubric — and even today's strongest model, Claude Opus 5.5, only passes in full on 24.7% (healthcare) / 23.9% (finance) of attempts, while the median configuration passes just 0.6%/2.5%.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | An earlier version accepted at a NeurIPS 2026 workshop (2nd Workshop on Agentic AI Benchmarks and Applications for Enterprise Tasks, AABA4ET); the current arXiv version has not been through main-conference or journal peer review |
| Citation velocity | Published 13 days ago (submitted 2026-10-01); Semantic Scholar confirms 0 citations |
| Institution | Surge AI (a data-labeling and evaluation company, not an academic institution) |
| Community signal | Open-source harness on GitHub (surge-ai/dayjob); full healthcare dataset and 50/80 finance tasks public on Hugging Face; not on HF Daily Papers |
| Credibility | Pass — 30 model configurations from 13 developers, 5 attempts per task, containerized environments with binary rubrics (median 47.5/57.5 criteria) cross-checked by an agent-as-judge, plus concrete case-study evidence |
| Evidence maturity | Substantial — main results, relaxed-threshold analysis, cost-frontier analysis, and case studies all reinforce each other, and scripts to recompute every statistic are released |
| Reproducibility | Full artifacts — the harness (Apache 2.0), all healthcare tasks, over half the finance tasks, grading scripts, and the leaderboard are all public; the remaining finance tasks are available on request to prevent training contamination (reason stated) |
| Why this one | Direct — directly measures whether agents can do real professional work that requires spotting contradictions across documents |
| Novelty | Substantive — the first long-horizon benchmark built from real professional documents (PDFs, statements, charts) rather than plain text questions, requiring every criterion to pass |
| Today's importance | High — gives teams evaluating vertical-agent deployment a realistic capability baseline |
| Practical link | Clear — its three case studies (unchallenged premises, carrying wrong inputs forward, mixing up data definitions) can be lifted directly into your own test scenarios |
| Editorial confidence | High — the paper reports both strict and relaxed thresholds, and its framing ("passing everything is hard" rather than "it can't do this at all") is backed by numbers |
| Reading recommendation | Must-read for teams evaluating or deploying healthcare/finance vertical agents; others can skim the case studies and leaderboard |
| Primary limitation | Currently a NeurIPS workshop-accepted version, not main-conference peer-reviewed; some finance tasks remain unreleased to prevent future training contamination |

### Field Background

Benchmarks like GDPval proved agents can handle "the kind of work a professional does," but its prompts tend to be detailed with few attachments. Real requests at work are usually short, and the professional has to figure out from a pile of files what matters and whether the premise even holds — this is exactly the gap DAYJOB tries to fill.

### Mid-level Walkthrough

- **The problem**: Imagine getting the request "take a look at this discharge patient's labs." Nobody tells you what to check. The chart actually contains an asymmetric facial exam finding and neck pain that hints at a possible arterial dissection, but if you only look at the label "Bell's palsy" on the chart and discharge the patient on medication, you'll miss an emergency that should have been ruled out first. All 130 DAYJOB tasks look like this: a short request, paired with a dozen to several dozen files that are a mix of real, irrelevant, and sometimes contradictory.
- **The method**: Each task runs in a containerized environment (Harbor) where the agent only has a terminal, a file editor, and a task tracker, and must dig through PDFs, spreadsheets, and Word documents on its own to produce the deliverable. An "agent judge" then opens the delivered files, recomputes values where needed, and checks every criterion in an expert-written binary rubric (median 47.5-57.5 criteria) — missing even one criterion fails the attempt, and the score is not an average.
- **Why it matters**: This probes something general capability benchmarks can't — not "does the model know finance/medicine," but "will the model actually notice a problem buried in a pile of noisy files." The strongest model still only gets a bit over two fifths right, showing this gap isn't something a stronger base model alone will fix.

### Deep-dive Points

- Across 30 configurations from 13 developers: Claude Opus 5.5 (adaptive/max) leads both domains (24.7%/23.9%); the runner-up, GPT-6 Astra, trails by 13.1 points in healthcare; the median configuration only passes 0.6%/2.5%, with 10 configurations never passing a single healthcare attempt
- Relaxed thresholds tell a different story: requiring only 90% of criteria, the leader's score jumps to 62.4%/58.3%, and the median jumps to 6.4%/10.4% — showing most failures come from missing one or two key checks, not total incompetence
- Case study: facing a patient with a likely arterial dissection, GPT-5.6 Sol reasoned "I shouldn't question the diagnosis unless necessary" and discharged the patient on the original medication; on the same chart, a Grok model connected the neck pain and abnormal facial exam and recommended ruling out a vascular cause first
- Case study: while building a financing analysis for a retailer's expansion, Grok 4.6 (xhigh) carried forward a sign error from the existing store-forecast model (adding returns to gross sales instead of subtracting them), making a leverage ratio that actually breaches a 3.00× loan covenant appear compliant
- Cost-frontier analysis: Claude Opus 5.5 costs $7.10 (healthcare)/$11.47 (finance) per attempt, processing 9.8M/17.8M tokens (94-95% cached) — the top scorer on the cost frontier, but also the most expensive
- Limitation: the released version is a NeurIPS workshop (AABA4ET) accepted early version; 30 of 80 finance tasks remain unreleased (available on request) to prevent future training contamination

### Reviewer's One-line Take

Using real professional-written tasks with an all-or-nothing rubric surfaces a gap that "looks fine on average" scoring methods hide, and the case studies are concrete enough to lift directly into your own test scenarios; but this is still a workshop-accepted early version that hasn't been through main-conference or journal peer review, and the strict all-or-nothing scoring alone could overstate how "completely incapable" models are — the relaxed-threshold numbers are closer to what real capability looks like.

### Take-aways for You

- If you're evaluating whether to put an agent into a healthcare or finance vertical: assume upfront it will "accept a premise the record contradicts" and "carry a wrong input forward into an otherwise-consistent analysis" — write both failure modes directly into your own acceptance tests instead of relying on general capability scores
- If you're designing an evaluation methodology: this paper shows that pairing an all-or-nothing rubric with a relaxed-threshold control lets you distinguish "can't do it at all" from "almost got it right," which is more diagnostic than a single average score

---

## Paper Three | Faster Decisions Don't Make Better Agents: An Empirical Test of Jev in Real Agent Workflows

**When Faster Decisions Do Not Make Better Agents: An Empirical Study of Jev in Agent Workflows**
Yuchen Ling, Shengcheng Yu, Zhenyu Chen et al. (Nanjing University / Technical University of Munich) · arxiv: 2610.13092

Links: [arxiv](https://arxiv.org/abs/2610.13092) · [alphaxiv](https://www.alphaxiv.org/abs/2610.13092)

### TL;DR

Swapping an agent's decision step for TypeSafe AI's fast "typed decision model" Jev cuts per-decision cost by 66-78% and latency by 74-82%, but for one agent (T3A), the cost per successfully delivered task actually rises 7.7% — because the savings get eaten by failed retries.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | Published 5 days ago (submitted 2026-10-09); Semantic Scholar confirms 0 citations |
| Institution | Nanjing University / Technical University of Munich |
| Community signal | Not on HF Daily Papers; no reproduction repo found on Papers with Code (experimental code is on an anonymous 4open.science link for review purposes) |
| Credibility | Pass — 5 agent families × 2 benchmarks, 4,500 task executions, with paired bootstrap statistics and human trace coding (7 behavior labels, κ=0.76-1.00) cross-validating the quantitative results |
| Evidence maturity | Substantial — all three research questions (effectiveness, efficiency transfer, failure/recovery) are quantified, with a control condition (LLM-Choice) isolating "interface change" from "the decision model itself" |
| Reproducibility | Partial artifacts — experimental code is on an anonymous review link, not a permanent repository; full raw trace data was not found to be released |
| Why this one | Direct — Jev is a genuinely new category of agent decision component, and this is its only systematic third-party empirical test so far |
| Novelty | Substantive — the first systematic test of whether resource savings from a "fast typed decision model" actually transfer to the task level in real multi-step workflows |
| Today's importance | High — many teams are actively evaluating whether to adopt this class of fast decision model, and this is the first independent evidence available |
| Practical link | Clear — gives concrete criteria for which workflows suit Jev, and warning signs for which don't |
| Editorial confidence | High — the paper's own title states the claim boundary (faster ≠ better), and the article's framing matches the evidence |
| Reading recommendation | Must-read for engineering teams evaluating or already using typed decision models for agent action selection |
| Primary limitation | Only tested on 5 agent families across 2 text-based benchmarks (ALFWorld, AndroidWorld), deliberately excluding visual tasks since Jev currently only supports text input; whether this generalizes to future versions remains to be seen |

### Field Background

An LLM agent makes a decision at every step (which tool, which action), and these decisions are usually simpler than generating a full passage of text, but still cost a full LLM call. Jev is TypeSafe AI's "System One Model," launched in September 2026, which replaces generative calls with a typed interface (given options, return a probability) and claims to be faster and cheaper — but whether "a single decision getting faster" translates into "the whole workflow getting more reliable" had never been systematically tested.

### Mid-level Walkthrough

- **The problem**: Imagine replacing the teammate who handles small calls like "retry or not" and "which API to use" with a faster, cheaper new hire. Individual decisions get quicker, but if the new hire is more error-prone when the situation is unclear and isn't good at fixing mistakes afterward, the team's overall delivery time and cost could actually go up — because the cleanup from a wrong decision costs far more than the seconds saved making it.
- **The method**: The study swaps the decision step of 5 agent families for Jev across two settings — ALFWorld (household text environment) and AndroidWorld (mobile app use) — running each three times for 4,500 total task executions, while tracking task success, decision- and task-level cost/latency, and failure behaviors manually coded by two annotators (e.g. "failed recovery," "premature completion"). It also adds an "LLM-Choice" control — a regular LLM given the exact same candidate list and instructions as Jev — to separate the effect of "the interface changed" from "the decision model itself changed."
- **Why it matters**: This gives a clear engineering criterion: fast decision models like Jev work best where "the goal, prerequisites, and completion condition are all explicit" (e.g. tool routing, API selection); but once a scenario requires multi-step recovery or has an ambiguous goal, the time saved on decisions gets eaten by extra auxiliary reasoning and failed retries — sometimes making the cost per successful delivery go up, not down.

### Deep-dive Points

- Across all 5 agent families, Jev cuts per-decision cost by 66.1-78.4% and latency by 73.9-81.5%, with decision time falling from 4.13-8.13 seconds to 1.04-1.75 seconds
- But a task-success gap appears: on ALFWorld, ReAct-J/Reflexion-J trail their originals by only 1.49/1.74 percentage points; on AndroidWorld, T3A trails by 13.22pp and FastAgent by 18.10pp
- Efficiency transfer is uneven: on ALFWorld, ReAct/Reflexion cut task-level cost by 50.9%/32.6%; on AndroidWorld, T3A's cost falls only 17.1%, because auxiliary-reasoning token use rises 53.5%-134.9%, absorbing most of the savings
- The key counter-example: measured as cost per successfully delivered task, T3A's cost rises from 68.70 to 73.97 mUSD (+7.7%), because the drop in task success cancels out the 17.1% saving in per-attempt cost
- Breaking down failure behavior (two annotators, κ=0.76-1.00): 29.1% of executions show "failed recovery," 24.7% show "ineffective search"; in Reflexion-J, just 2.0% of executions are failed-recovery attempts, yet they consume 53.3% of total inference spending
- Limitation: tested on only 5 agent families across 2 purely text-based benchmarks, deliberately excluding visual tasks since Jev currently only accepts text input; the experimental code sits on an anonymous review link rather than a permanent public repository

### Reviewer's One-line Take

Cleanly separating "the interface changed" from "the decision model itself changed" with a dedicated control group, and pinning down exactly where the savings went with human trace coding, is this paper's strongest methodological contribution; but the sample is limited to two text environments and 5 agent families, and Jev itself is a brand-new product launched less than a month ago, so the findings are better read as a current-stage reference point than a long-term verdict on this class of model.

### Take-aways for You

- If you're evaluating whether to swap a decision step for a typed model like Jev: first check whether that decision's goal, prerequisites, and completion condition are all explicit (like tool routing or API selection) — don't ship it just because it looks cheaper on paper; for ambiguous goals or scenarios requiring multi-step recovery, keep the generative decision step for now
- If you're optimizing agent system costs: measure effectiveness by "resources per successfully delivered task," not "resources per attempt" — this paper shows that looking only at the average cost reduction misses the portion eaten by failed retries

---

## Today's Takeaway

I used to think "a better number" meant "a better system" — lower leakage, faster decisions, higher benchmark scores. Today's three papers are a reminder to check that gap yourself. Tightening memory governance cuts leakage, but quietly removes personalization that should have happened. A faster, cheaper decision model can have its savings eaten right back by failed retries. And even the strongest model, on real professional work, has a much bigger gap than general benchmarks suggest between "mostly getting it right" and "getting every single thing right."

## References

- [What to Admit and How to Present: Governing Persistent Memory in LLM Agents (arXiv:2610.11188)](https://arxiv.org/abs/2610.11188)
- [What to Admit and How to Present (alphaxiv full text)](https://www.alphaxiv.org/abs/2610.11188)
- [DAYJOB: A Benchmark for Long-Horizon Professional Work (arXiv:2610.01306)](https://arxiv.org/abs/2610.01306)
- [DAYJOB (alphaxiv full text)](https://www.alphaxiv.org/abs/2610.01306)
- [DAYJOB evaluation harness (GitHub)](https://github.com/surge-ai/dayjob)
- [When Faster Decisions Do Not Make Better Agents (arXiv:2610.13092)](https://arxiv.org/abs/2610.13092)
- [When Faster Decisions Do Not Make Better Agents (alphaxiv full text)](https://www.alphaxiv.org/abs/2610.13092)
- [arXiv cs.AI new-submissions listing (2026-10-12 batch)](https://arxiv.org/list/cs.AI/new)
