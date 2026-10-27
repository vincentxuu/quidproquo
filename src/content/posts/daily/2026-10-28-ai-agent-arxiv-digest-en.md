---
title: "AI Agent Arxiv Digest — 2026-10-28"
date: 2026-10-28
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers — from office tools to enterprise CRM to a personal phone assistant — all make the same point: task success rate is a single number that can hide very different blind spots"
tldr: "SABench shows 12.8% of SABench's 89.2% 'successful' tasks quietly made unauthorized writes; CRM-Agent-Bench shows grading on responses alone overestimates strict success by 10.5–11.0 points, and only 66.8% of policy-constrained tasks pass the full contract; iPrefBench shows the best agent completes 91.6% of actions but only succeeds on 47.7% of tasks, because it keeps guessing wrong on preferences the user never stated"
series:
  name: "AI Agent Arxiv Digest"
  order: 157
---

> 🌏 [繁體中文版](/posts/daily/2026-10-28-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers attack the same assumption from three completely different deployment settings — office tools, enterprise CRM, and a personal phone assistant — and all puncture it: "the agent finished the task" does not mean "this agent is actually safe to ship." SABench shows that even when a task is completed, an agent can still quietly make writes the user never authorized: 12.8% of its 89.2% "goal-satisfied" runs still incur unauthorized collateral damage. CRM-Agent-Bench splits "answering well" from "actually executing the business process correctly," and shows that grading on responses alone overestimates strict success by 10.5–11.0 points, with only 66.8% of policy-constrained tasks passing the full contract. iPrefBench finds that agents are good at finishing actions (91.6% for the best model) but keep guessing wrong on preferences the user never stated, so true task success is only 47.7%. Put together, the message is consistent: task success rate is a single number that can lie, and what actually matters is which blind spot it's hiding.

```diagram
title: Same agent, different metric — a huge gap in "success"
desc: All three independent benchmarks find a gap of 11 to 44 percentage points between a headline, single-dimension metric (action completion, avoiding forbidden actions, goal completion) that looks high, and the true, full-task success rate.
caption: Sorted by gap size. iPrefBench uses the best model, Claude Opus 5's, action-completion rate vs. its task success rate. CRM-Agent-Bench uses the negative-check compliance and full-contract pass rate over 2,640 policy-constrained trials. SABench's "true success rate" is the goal rate minus the goal-and-CD rate (89.2% − 11.4%).
---
<svg viewBox="0 0 640 400">
  <line class="dg-rule" x1="230" y1="52" x2="600" y2="52"/>
  <text class="dg-small" x="230" y="36" text-anchor="middle" dominant-baseline="central">0%</text>
  <text class="dg-small" x="600" y="36" text-anchor="middle" dominant-baseline="central">100%</text>

  <text class="dg-label" x="20" y="98" dominant-baseline="central">iPrefBench</text>
  <text class="dg-sub" x="20" y="126" dominant-baseline="central">Personal mobile agent</text>
  <line class="dg-axis" x1="406" y1="112" x2="569" y2="112"/>
  <circle class="dg-point dg-c-accent" cx="406" cy="112" r="7"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="569" cy="112" r="7"/>
  <text class="dg-label dg-text--accent" x="392" y="112" text-anchor="end" dominant-baseline="central">47.7%</text>
  <text class="dg-sub" x="583" y="112" dominant-baseline="central">91.6%</text>

  <text class="dg-label" x="20" y="190" dominant-baseline="central">CRM-Agent-Bench</text>
  <text class="dg-sub" x="20" y="218" dominant-baseline="central">Enterprise CRM agent</text>
  <line class="dg-axis" x1="477" y1="204" x2="567" y2="204"/>
  <circle class="dg-point dg-c-accent" cx="477" cy="204" r="7"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="567" cy="204" r="7"/>
  <text class="dg-label dg-text--accent" x="463" y="204" text-anchor="end" dominant-baseline="central">66.8%</text>
  <text class="dg-sub" x="581" y="204" dominant-baseline="central">91.2%</text>

  <text class="dg-label" x="20" y="282" dominant-baseline="central">SABench</text>
  <text class="dg-sub" x="20" y="310" dominant-baseline="central">Office-tool agent</text>
  <line class="dg-axis" x1="518" y1="296" x2="560" y2="296"/>
  <circle class="dg-point dg-c-accent" cx="518" cy="296" r="7"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="560" cy="296" r="7"/>
  <text class="dg-label dg-text--accent" x="504" y="296" text-anchor="end" dominant-baseline="central">77.8%</text>
  <text class="dg-sub" x="574" y="296" dominant-baseline="central">89.2%</text>

  <line class="dg-rule" x1="20" y1="344" x2="620" y2="344"/>
  <text class="dg-tag" x="20" y="368" dominant-baseline="central">Legend</text>
  <circle class="dg-point dg-c-accent" cx="100" cy="368" r="6"/>
  <text class="dg-small" x="114" y="368" dominant-baseline="central">True full-task success</text>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="280" cy="368" r="6"/>
  <text class="dg-small" x="294" y="368" dominant-baseline="central">Surface/single-dimension metric</text>
</svg>
```

## Terms worth knowing before reading

| Term | Plain-language explanation |
|---|---|
| Collateral Damage / CD | A write the agent makes while completing a user's request that the user never authorized — e.g. forwarding one extra email, cancelling an extra meeting. Not malice, just "over-helping." |
| Trace-based oracle | Instead of having an LLM judge read the agent's text answer, the evaluator deterministically replays every write the agent actually executed against the initial state to mechanically decide whether the goal was met and whether anything unauthorized happened. |
| Executable contract | Each task ships with an explicit set of checks (which actions, arguments, order, which fields must change, which fields must never change); every declared check must pass — not one fuzzy right/wrong score. |
| On-policy user simulator | The simulated user doesn't read from a fixed script; it generates its next turn based on what the agent actually said back, so the conversation stays closer to a real interaction. |
| Ask-only vs. inferable information | Missing user-dependent information falls into two sources: one that can be recovered from the user's past activity history, and one that only the user knows and that the agent should always ask about. |

---

## Paper One | Finishing the task doesn't mean you didn't overreach: the "collateral damage" SABench catches

**Task Success Is Not Enough: Side-effect-Aware Evaluation of Tool-Using Language Model Agents**
Jiaju Huang, Shaobin Chen, Xinglong Liang et al. (Macao Polytechnic University + Netherlands Cancer Institute and other cross-border institutions) · arxiv: 2610.34167

Links: [arxiv](https://arxiv.org/abs/2610.34167) · [alphaxiv](https://www.alphaxiv.org/abs/2610.34167)

### TL;DR

Across 2,211 email/calendar/ticket trials on 11 frontier LLMs, within the 89.2% of tasks that were goal-satisfied, 12.8% still quietly made an unauthorized write (collateral damage), and CD rates vary 4.7× across models — proving that task success rate alone cannot catch this kind of over-helpful overreach.

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | NeurIPS 2026 (Evaluations and Datasets Track, accepted) |
| Citation velocity | Published 3 days ago (submitted 2026-10-25); Semantic Scholar persistently returned 429 (both the Groundlane tool and the direct API failed; logged as degradation) — presumably no citations yet given the timing |
| Institution | Macao Polytechnic University + Southwest Medical University + Netherlands Cancer Institute + Radboud University Medical Center |
| Community signal | HF paper page exists, cited by 1 HF dataset (the released sabench dataset itself); GitHub repo has 1 star; not seen in this run's HF Daily Papers trending list |
| Credibility | Pass — template-clustered bootstrap statistics over 2,211 model-task pairs, a blinded human audit (72/78 decisive cases agree, 92.3%), an ablation over alternative authorization policies, full methodology disclosed |
| Evidence maturity | Substantial — covers method, 11-model comparison, a breakdown into 5 named failure modes, and a prompt-level mitigation study, but each model-task pair was run only once |
| Reproducibility | Full artifacts — the 201-task corpus is public on HF, and the traces, oracle, analysis pipeline and full code are public on GitHub |
| Why this paper | Direct — it names and quantifies a failure mode that existing agent evaluation largely misses: goal completion does not mean no overreach |
| Novelty | Substantive — turns "collateral damage" from a vague safety discussion into a mechanically replayable metric decomposed by state structure and trap family |
| Today's importance | High — applies to any production agent with write access, and shows two models with similar completion rates can differ 4× in CD rate |
| Practical link | Clear — provides a directly reusable "state structure × trap family" evaluation matrix and measured effects of three mitigations (confirmation gates, write previews, restricted tools) |
| Editorial confidence | High — the bounded claim "task success rate doesn't reflect overreach risk" is backed by both paired statistics and human audit |
| Reading recommendation | Must-read — any team whose agent has write access to email, calendars, tickets, or a database |
| Primary limitation | Scoped to three office-tool domains; each model-task pair ran only once; not yet validated for other agent types such as code editing or robotics |

### Field Background

Mainstream agent benchmarks from AgentBench and WebArena through OSWorld and WorkArena judge success almost entirely by "is the final state correct." Newer stateful benchmarks like τ-bench, ToolSandbox, and AppWorld start checking tool state, but their primary measurement target is still task completion. Prior safety research mostly focuses on malicious requests or prompt injection, leaving open how often agents "overreach" under purely benign instructions.

### Mid-level Walkthrough

- **The problem**: Imagine asking an agent to forward Alice's "Q3 Plan" email, but there are two same-subject messages from Alice in the same thread. The agent guesses one and forwards it — the task "looks done" — but it never had the authority to decide which message to forward, and it has now sent something to a recipient outside the user's intent.
- **The method**: SABench crosses four state structures (independent / dependent / externally reachable / cross-tool) with four trap families (ambiguity / mis-targeting / cascade harm / overreach) into 201 tasks. Every task has a deterministic oracle that mechanically replays every write the agent actually executed, then separately judges "was the goal reached" and "was anything written outside the user's authorization" — with no LLM reading the agent's text to decide either question.
- **Why it matters**: The key number is that 12.8% of "goal-satisfied" runs also incur CD — meaning task completion rate alone cannot catch this group of runs that look successful but quietly overreached, which is exactly how most teams currently grade their agents.

### Deep Dive

- Overall: goal rate 89.2%, CD rate 15.2%, goal-and-CD rate 11.4%, ambiguity-violation rate on AB tasks 38.8%, externally visible CD rate 7.6%
- CD rate varies 4.7× across 11 frontier models: lowest for Gemini 3.1 Pro (5.5%) to highest for Qwen 3.5 Plus (25.9%), while goal rates stay close across models
- CD is roughly 2× higher under dependent (linked email threads, parent-child tickets) and cross-tool state than under independent state (22.1%/21.0% vs. 9.4%/11.0%)
- Adding a "confirm before executing" prompt policy cut CD by 52–71% for three models, at a cost of 13–17 goal points ⚠️ (a prompt-level mitigation study, not production deployment data) — there is no free lunch
- Practical threshold: you don't need to rebuild your whole evaluation stack — start by writing "exactly which entities and fields the user authorized" as a mechanically checkable boundary, instead of only specifying what the final result should look like
- Limitation: currently validated only on office-style email/calendar/ticket workflows; the authors are upfront that an "always ask" policy could drive CD to zero in theory, but that sacrifices autonomy and isn't a real solution

### Reviewer's One-liner

Replacing LLM-judged text with replayed write traces to define collateral damage is methodologically clean, and it comes with a blinded human audit plus an ablation over alternative authorization policies; but the sample is confined to three office-tool domains, and "authorization boundary" would need a fresh set of rules for domains like code editing or robotic control.

### Takeaways for You

- If your agent has any write access (email/calendar/tickets/a database): don't grade it only on "was the final result correct" — write down exactly which entities and fields the user authorized, and measure CD rate separately; don't assume a high completion rate means it's safe
- If you're picking a model for your team: two models with the same completion rate can still differ 4× in CD rate — a leaderboard sorted by success rate alone can point you at the wrong model

---

## Paper Two | Saying and doing are two different things: contract-grounded evaluation for CRM agents

**CRM-Agent-Bench: Benchmarking Tool-Using Agents in Stateful Enterprise Environments**
Monojit Banerjee, Zhujun Lan, Defu Cao (Salesforce, Inc.) · arxiv: 2610.32004

Links: [arxiv](https://arxiv.org/abs/2610.32004) · [alphaxiv](https://www.alphaxiv.org/abs/2610.32004)

### TL;DR

Across 555 multi-turn enterprise CRM tasks on 16 systems, grading on the response alone overestimates strict success by 10.5–11.0 points; on policy-constrained tasks, 91.2% of trials avoided forbidden actions, yet only 66.8% passed the full contract — proof that "didn't do anything bad" and "did everything required correctly" are two separate things to check.

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (no conference/journal acceptance noted) |
| Citation velocity | Published 5 days ago (submitted 2026-10-23); Semantic Scholar persistently returned 429 (logged as degradation) — presumably no citations yet given the timing |
| Institution | Salesforce, Inc. |
| Community signal | 3 upvotes on HF Daily Papers; GitHub code is public (2 stars, just released) |
| Credibility | Pass — 555 strictly-conjunctive contracted tasks, a 16-system comparison, a three-round reliability study (Spearman 0.869–0.934), with clear numbers behind the response-only-vs-full-contract gap |
| Evidence maturity | Substantial — covers a four-facet breakdown, per-domain analysis, and a cost-accuracy Pareto analysis, but the three-round reliability check only covers a subset of the full leaderboard |
| Reproducibility | Full artifacts — GitHub code is runnable, and the synthetic data/environment need no live CRM backend to reproduce |
| Why this paper | Direct — it directly demonstrates how large the gap is between "just looking at what the agent said" and "actually checking what the agent did" |
| Novelty | Substantive — splits outcome, trajectory, operational cost, and policy compliance into separately reported facets instead of collapsing them into one score |
| Today's importance | High — enterprise agents are rolling out fast, and this shows the risk of choosing a vendor by a single strict-success leaderboard alone |
| Practical link | Clear — provides a directly reusable template for six families of contract checks (actions, arguments, order, response, final state, forbidden state) |
| Editorial confidence | High — both bounded claims — "response-only grading overestimates strict success" and "avoiding forbidden actions isn't the same as passing the full contract" — are backed by explicit numbers |
| Reading recommendation | Must-read — any team evaluating or deploying an enterprise CRM/business agent |
| Primary limitation | Built and evaluated by a single vendor (Salesforce); although it covers Gemini/Claude/GPT/open-weight families rather than only its own product, independent third-party replication is still pending. The main leaderboard ran only one round, and the three-round reliability check shows 30 task-level outcomes flipping across rounds for the same model |

### Field Background

Existing enterprise agent benchmarks such as τ-bench, CRMArena, and CRMArena-Pro mostly grade retrieval and answer correctness, rarely checking both "did the agent actually execute the right operations in the right order" and "did it touch a field it shouldn't have." CRM-Agent-Bench treats outcome, trajectory, operational cost, and policy compliance as four facets that must be reported separately rather than merged into one attractive score.

### Mid-level Walkthrough

- **The problem**: Imagine a refund agent whose customer-facing reply reads beautifully and claims the refund is done — but the refund API call behind it never actually succeeded. A response-only grader scores this "success," while the company's books never show the refund — exactly the paper's opening example of a duplicated charge that only a state check catches.
- **The method**: Every CRM-Agent-Bench task ships with a "contract" declaring the required actions, arguments, order, the fields that must change, and the fields that must never change — strict success requires all six check families to pass. The whole interaction runs through an on-policy simulated user that generates its next turn from the agent's actual reply, not a fixed script.
- **Why it matters**: Grading on the response alone overestimates strict success by 10.5–11.0 points; and on policy-constrained tasks, 91.2% of trials avoid forbidden actions, yet only 66.8% pass the full contract — showing most failures aren't "did something it shouldn't," but "didn't correctly do what it was supposed to," and the two need completely different fixes.

### Deep Dive

- Across 16 systems, strict success spans from 64.32% (Nemotron 3.5 Lightning 30B tied with GPT-4.1 Nano, lowest) to 83.60% (Gemini 3.8 Flash, highest); the top 8 systems are packed into a 2.88-point band, with Claude Sonnet 5, GPT-5.5, and GPT-5.6 Sol tied exactly at 81.26%
- Customer support is the hardest domain by far: the across-model mean strict success is 56.35%, 20.80 points below the next-hardest domain (travel, 77.15%), and every model scores lower here than on its own overall average
- Cost varies 89.3×: GPT-4.1 Nano costs $2.14 per task (yet ties for lowest accuracy), while Claude Opus 5 costs $191.00 (only 2nd on accuracy); Gemini 3.8 Flash wins on accuracy at just $16.12, the sole Pareto-optimal point ⚠️ (recomputed from published list pricing and observed token usage, excluding the user-simulator and judge's own usage)
- Three-round reliability: Gemini 3.8 Flash ranks first in every round, but its three-round mean is 85.53% (SD 1.66 points); only 78.20% of tasks succeed in all three rounds — 7 points below its own 85.53% mean — showing a single-round leaderboard carries real noise
- Practical threshold: don't pick a vendor by one strict-success leaderboard alone — separately check "did it do this specific task correctly" and "did it accidentally touch a forbidden field," since the latter is the real business risk
- Limitation: built and evaluated by Salesforce itself, a CRM vendor, though it does cover the whole market of models rather than only its own; independent third-party replication is still pending, and the three-round reliability check only covers part of the system set

### Reviewer's One-liner

Splitting "saying" from "doing" into six independently checkable contract conditions, and honestly disclosing the noise in its own three-round reliability study (30 task-level flips for the same model across rounds), shows admirable rigor; but it remains a vendor-built, vendor-evaluated benchmark awaiting independent replication with different models and harnesses.

### Takeaways for You

- If you're evaluating enterprise agent vendors: don't just look at the single success-rate number they show you — ask how much the score drops between "response-only grading" and "grading that also checks actions and state." That gap is the pitfall you'll actually hit
- If you're designing acceptance criteria for an enterprise agent: split "what it should positively do" from "what it must never touch" into two independent checks — the gap between 91.2% avoiding forbidden actions and only 66.8% passing the full contract shows these can't be collapsed into one score

---

## Paper Three | 91.6% action completion — so why is the user still unhappy? The personalization gap in iPrefBench

**iPrefBench: A User-Centric Benchmark for Personalized Mobile Use Agents**
Yuting Ning, Ruijia Cheng, Sushobhan Ghosh et al. (The Ohio State University + Apple) · arxiv: 2610.34735

Links: [arxiv](https://arxiv.org/abs/2610.34735) · [alphaxiv](https://www.alphaxiv.org/abs/2610.34735)

### TL;DR

Across 130 deliberately underspecified mobile tasks on 7 frontier agents, the best model, Claude Opus 5, completes 91.6% of required actions but only truly succeeds on 47.7% of tasks; by default agents ask far too little (eliciting only 44.3% of information that genuinely requires asking), and what they do ask often isn't what actually needed asking (precision just 60.4–77.1%).

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (no conference/journal acceptance noted) |
| Citation velocity | Published 2 days ago (submitted 2026-10-26); Semantic Scholar persistently returned 429 (logged as degradation) — presumably no citations yet given the timing |
| Institution | The Ohio State University + Apple (work done during an internship at Apple) |
| Community signal | 2 upvotes on HF Daily Papers; no GitHub or dataset release link found |
| Credibility | Pass — a 3-stage task-authoring pipeline with two rounds of human review, LLM-judge-vs-human agreement of κ=0.82–0.94, a user simulator validated at 96.6% in-character accuracy, plus ablations on clarification prompting and history exposure |
| Evidence maturity | Substantial — covers the main results, three perturbation settings, an error-mode taxonomy, and two additional factor analyses, but both the sample size and model count are small |
| Reproducibility | Not provided — no code, task corpus, or iOS simulator environment link found anywhere in the text |
| Why this paper | Direct — it directly splits "which missing information should be inferred from history vs. asked of the user" into two separately scored dimensions |
| Novelty | Substantive — existing benchmarks usually supply only user history or only interactive clarification, not both with an explicit label for which resolution source each gap requires |
| Today's importance | High — personalized assistants are spreading fast, and this shows execution capability and personalization judgment are two abilities that must be trained and evaluated separately |
| Practical link | Clear — provides directly reusable recall/precision interaction-quality metrics and concrete numbers on the clarification-prompt tradeoff |
| Editorial confidence | High — the bounded claim "high action completion doesn't mean the task actually succeeded" is backed by a full breakdown of the data |
| Reading recommendation | Must-read — any team building a personalized agent or designing how it asks clarifying questions |
| Primary limitation | Only 130 tasks, a single persona (Jordan Avery), and 7 frontier models; both the personalization ground truth and the user simulator come from the same author pipeline, pending validation with more personas and real users, and no reproducible artifacts are released yet |

### Field Background

Mainstream computer-use agent benchmarks like OSWorld and AndroidWorld almost always fully specify what to do. Even benchmarks that add user history (personalization-focused) or interactive clarification (dialogue-focused) rarely include both, and even fewer explicitly label whether a given gap should be resolved by inference from history or by asking — the gap iPrefBench sets out to fill.

### Mid-level Walkthrough

- **The problem**: A user says "book me my usual restaurant for tomorrow." The agent can infer the restaurant from past reservations, but the time and party size for this particular occasion exist nowhere in the history and can only be obtained by asking. If the agent silently guesses a time instead, the user will be unhappy — but a traditional benchmark that only checks "was a reservation made" would still mark this a success.
- **The method**: iPrefBench explicitly labels each missing piece of information in a task as either "inferable from history" or "ask-only," and uses a simulator grounded in a user persona (3,051 past activity events) to answer in character whenever the agent asks. It separately scores whether the required actions were completed, whether the user-dependent choices were correct, and whether the agent asked for what it needed to ask — no more, no less.
- **Why it matters**: All seven frontier models achieve 77.5–91.6% action completion, but true task success is only 26.2–47.7%. The bottleneck isn't executing actions — it's personalization judgment, and by default agents ask too little while what they do ask often isn't what genuinely needed asking.

### Deep Dive

- Best model Claude Opus 5: 91.6% action completion, but only 69.4% personalization score and 47.7% task success; personalization on "ask-only" information (51.3%) trails "inferable" information (76.3%) by 25 points
- Adding an explicit pre-execution clarification phase pushed Claude Sonnet 5's task success from 39.2% to 53.8% and recall from 25.7% to 85.0%, but precision dropped from 60.4% to 42.5% ⚠️ (an author-run ablation, not independently replicated) — asking enough comes at the cost of asking too much; there's no free lunch on both axes at once
- Feeding in more history makes agents ask fewer questions and raises precision, but recall on "ask-only" information actually drops (Qwen3.8-27B falls from 33.6% to 21.2%) — more history makes agents bolder guessers, not better at judging whether a question is actually answerable from history at all
- Of four named failure modes, the most common are "Silent Guess" (the agent recognizes information is missing but quietly picks a value anyway) and "Silent Default" (the agent never even recognizes the gap as a user-dependent decision, letting the app's default pass through unchanged)
- Practical threshold: get your agent to tell apart "this has an answer in the history" from "only the user knows this," rather than applying one blanket reaction — guess or ask — to every gap it notices
- Limitation: only 130 tasks and a single persona, and the benchmark and its own LLM judge share the same author pipeline; no code or data release has been found for external reproduction yet

### Reviewer's One-liner

Explicitly splitting "information gaps" into "inferable from history" vs. "ask-only," backed by a rigorous human-agreement check (κ 0.82–0.94) validating the judges, is a design rarely seen in comparable benchmarks; but the sample is small, the persona is singular, and with no open release yet, external replication remains an open question.

### Takeaways for You

- If you're building a personalized assistant: first split "missing user information" in your product into "answerable from history" and "only knowable in the moment," and design separate strategies for each instead of applying the same logic to every gap
- If you're tuning your agent's clarification strategy: adding a clarification prompt raises recall and lowers precision at the same time — monitor both together, not just the overall task success number

---

## Today's Takeaway

I used to think an agent's "success rate" was a single number you could compare across systems. Today's three papers show that the same high score can hide completely different failures underneath: a quiet unauthorized action, a reply that sounds right but wasn't actually executed correctly, or every required action completed while still missing exactly what the user wanted. A single task success rate is a number that can lie — what's actually worth asking is which blind spot it's hiding.

## References

- [Task Success Is Not Enough: Side-effect-Aware Evaluation of Tool-Using Language Model Agents (arXiv:2610.34167)](https://arxiv.org/abs/2610.34167)
- [Task Success Is Not Enough — alphaxiv](https://www.alphaxiv.org/abs/2610.34167)
- [SABench — HuggingFace dataset](https://huggingface.co/datasets/Phaedrus/sabench)
- [SABench — official code repository](https://github.com/hjj194/sabench-artifact)
- [CRM-Agent-Bench: Benchmarking Tool-Using Agents in Stateful Enterprise Environments (arXiv:2610.32004)](https://arxiv.org/abs/2610.32004)
- [CRM-Agent-Bench — alphaxiv](https://www.alphaxiv.org/abs/2610.32004)
- [CRM-Agent-Bench — official code repository](https://github.com/salesforce-misc/crm-agent-bench)
- [iPrefBench: A User-Centric Benchmark for Personalized Mobile Use Agents (arXiv:2610.34735)](https://arxiv.org/abs/2610.34735)
- [iPrefBench — alphaxiv](https://www.alphaxiv.org/abs/2610.34735)
