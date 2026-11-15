---
title: "AI Agent Arxiv Digest — 2026-11-13"
date: 2026-11-13
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's theme is three reality checks that agent engineering keeps skipping: whether added coordination structure is actually worth its cost, where errors really enter during long-horizon failures, and whether agents actually comply with rules that are written down in plain text"
tldr: "Agent Architecture Cost-Success Trade-offs finds that multi-agent and skill-augmented architectures spend 1.4-4.7x the tokens and 2.6-5.8x the latency of a single agent for success gains that are usually small and rarely significant; Dependable Long-Horizon LLM Agents reads 95 failed trajectories and finds that 72% already contained contradicting evidence before the failure, and 45% of 'responsible agent' labels actually trace back to the harness crashing; ScrapeBench tests six mainstream agents and finds that checking a website's rules does not predict compliance — GPT checks 100% of robots.txt files yet complies only 14.2% of the time"
series:
  name: "AI Agent Arxiv Digest"
  order: 173
---

## Today's Overview

Today's three papers put a measuring stick to three parts of agent engineering that are easiest to skip over: whether a coordinated multi-agent architecture is actually worth more than a single agent, where errors really enter when a long-horizon task fails, and whether agents actually follow rules that are written out in plain text on a website. All three use controlled experiments or large samples with evidence maturity that holds up, and all three land on a surprising conclusion: the extra cost of coordination structure usually doesn't buy a significant success-rate gain, existing failure-attribution labels may misjudge the root cause in nearly half of cases, and agents are more likely to ignore a rule once they've looked it up — compliance only climbs when the rule's text is pasted directly into the prompt. Taken together, this isn't a story about agents not being smart enough. It's that architecture decisions, error analysis, and compliance mechanisms still lack the engineering infrastructure to back them up.

```diagram
title: Three reality checks on deploying agents, each one comes up short
desc: Top to bottom: the architecture decision before deployment, error attribution during execution, and compliance after action. Today's three papers each find a concrete, measurable gap in one of these layers.
caption: Numbers in order from arXiv 2611.12953 (coordinated architectures spend 1.4-4.7x the tokens and 2.6-5.8x the latency), 2611.13254 (72% of failed trajectories already had contradicting evidence; 45% of 'responsible agent' labels trace to the harness crashing), and 2611.11306 (GPT checks 100% of robots.txt yet complies only 14.2% of the time).
---
<svg viewBox="0 0 640 340">
  <rect class="dg-box" x="72" y="24" width="552" height="80" rx="6"/>
  <text class="dg-tag" x="92" y="52" dominant-baseline="central">L1</text>
  <text class="dg-label" x="124" y="52" dominant-baseline="central">Before: Architecture choice</text>
  <text class="dg-sub" x="604" y="52" text-anchor="end" dominant-baseline="central">Catches: structure can pay off on complex, branching tasks</text>
  <text class="dg-sub" x="604" y="80" text-anchor="end" dominant-baseline="central">Misses: 1.4-4.7x tokens, 2.6-5.8x latency buys little</text>

  <rect class="dg-box" x="72" y="112" width="552" height="80" rx="6"/>
  <text class="dg-tag" x="92" y="140" dominant-baseline="central">L2</text>
  <text class="dg-label" x="124" y="140" dominant-baseline="central">During: Error attribution</text>
  <text class="dg-sub" x="604" y="140" text-anchor="end" dominant-baseline="central">Catches: symptom labels name which agent, which step "looks" wrong</text>
  <text class="dg-sub" x="604" y="168" text-anchor="end" dominant-baseline="central">Misses: 72% had unused evidence; 45% of labels are harness crashes</text>

  <rect class="dg-box" x="72" y="200" width="552" height="80" rx="6"/>
  <text class="dg-tag" x="92" y="228" dominant-baseline="central">L3</text>
  <text class="dg-label" x="124" y="228" dominant-baseline="central">After: Compliance</text>
  <text class="dg-sub" x="604" y="228" text-anchor="end" dominant-baseline="central">Catches: strong legal warnings push compliance to 60-86%</text>
  <text class="dg-sub" x="604" y="256" text-anchor="end" dominant-baseline="central">Misses: checking the rule doesn't mean following it; GPT: 100% checked, 14.2% compliant</text>

  <line class="dg-rule" x1="72" y1="300" x2="624" y2="300"/>
  <text class="dg-sub" x="72" y="324" dominant-baseline="central">Residual risk: each paper validates its own controlled setup only; none yet spans architecture choice, long-horizon attribution, and compliance end to end</text>
</svg>
```

## Terms Worth Knowing Before You Read

| Term | Plain explanation |
|---|---|
| SOP-Bench | A benchmark that turns enterprise standard operating procedures into executable tasks with deterministic mock-tool responses, so observed differences come only from architecture, not from external service variance |
| Trajectory | An agent's full sequence of decisions and state changes from the first step to the last — not just whether the final output is correct |
| Attribution label | A human annotation in an existing corpus marking which agent, at which step, is responsible for a failure — a label that can itself be wrong |
| robots.txt / ToS (Terms of Service) | Two mechanisms a website uses to declare whether automated scraping is allowed: robots.txt is a technical signal aimed at crawlers, ToS is a legally binding usage agreement |
| Legal priming | Gradually escalating the strength of legal warnings in a prompt, to test whether that external reminder raises an agent's compliance rate |
| Over-refusal | An agent refusing to act even when the action is actually lawful — the overcorrection side effect of a compliance mechanism |

---

## Paper One | Agent Architecture Cost-Success Trade-offs: A Controlled Evaluation across Enterprise-Style SOPs

**Agent Architecture Cost-Success Trade-offs: A Controlled Evaluation across Enterprise-Style SOPs**
Subhrangshu Nandi, Hitesh Arora, Yunfei Bai et al. (Amazon + University of Washington) · arxiv: 2611.12953

Links: [arxiv](https://arxiv.org/abs/2611.12953) · [alphaxiv](https://www.alphaxiv.org/abs/2611.12953)

### TL;DR

Holding the model, tasks, and tools fixed and varying only the architecture across a single agent, a skill-augmented agent, centralized multi-agent orchestration, and a triage swarm, every coordinated arm spends 1.4-4.7x the tokens and 2.6-5.8x the latency of the single agent for success gains that are usually small and rarely significant — making the single agent the efficient default.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not peer reviewed) |
| Citation velocity | 0 citations in 6 days (Semantic Scholar, queried 2026-11-13) |
| Institution | Amazon + University of Washington |
| Community signal | Not on HF Daily Papers; not listed on Papers with Code (checked 2026-11-13) |
| Credibility | Pass — the body fixes the model (claude-opus-4-8) and tools, runs 8 architecture arms across all 13 SOPs (2,124 tasks per arm), and first confirms the baseline model varies by at most 2.3 points across versions before locking the version |
| Evidence maturity | Substantial — covers success rate, token/latency cost, and a skill-quality ablation, but explicitly scoped to a single model family with no cross-model generalization claim |
| Reproducibility | Partial artifacts — built on the same authors' SOP-Bench, with prompts and control flow in the appendix, but no independent public code/data release found for this specific study |
| Why this paper | Direct — directly quantifies whether the extra cost of multi-agent coordination is worth it, a question repeatedly debated with little controlled evidence |
| Direction novelty | Substantive — the first controlled comparison of four architecture families and skill quality under a fixed model and task set |
| Today's importance | High — gives teams deciding whether to adopt multi-agent orchestration a rare quantified, controlled basis |
| Practical link | Clear — directly tells teams to ask whether the added coordination cost is justified by a success-rate gain before adopting it |
| Editorial confidence | High — the claim is scoped to a single model family, but within that scope every cost and success number is traceable |
| Reading recommendation | Must-read — engineers evaluating multi-agent orchestration or skill-system design |
| Primary limitation | Every cross-architecture comparison is fixed to one model family (claude-opus-4-8); the authors explicitly disclaim cross-family generalization |

### Background

Enterprises are rapidly putting LLM agents to work on standard operating procedures, but the industry has almost no controlled evidence for choosing between a single agent, a skill-augmented agent, centralized orchestration, or a swarm — prior work mostly validates skill systems or coordination mechanisms in isolation, without fixing the model and task while varying only the architecture.

### Mid-Level Walkthrough

- **The problem**: Imagine handing a 13-step, branching insurance-claims workflow to an agent. You could use the simplest single agent with every tool crammed into one context, or split it into specialized agents that coordinate with each other — but each extra layer is also one more call, one more interface that can go wrong. Is it worth the extra cost?
- **The method**: The researchers use SOP-Bench's deterministic tool simulation (fixed tool responses, so external service variance is ruled out), fix the model and tools at claude-opus-4-8, and vary only the architecture: a function-calling single agent, a skill-augmented single agent (restricted to the tools declared by the selected skill), two centralized orchestration implementations, and three triage-swarm configurations — eight arms in total, each run across all 13 enterprise SOPs for 2,124 tasks. They also build a skill-definition quality rubric and deliberately construct matched high- and low-quality skill corpora for comparison.
- **Why it matters**: This turns "should we adopt multi-agent" from an engineering instinct into something you can look up — first check how complex and branching the SOP is, then check whether the coordination arm's token/latency cost is matched by a corresponding success-rate gain, instead of assuming more architectural complexity is automatically more reliable.

### Key Details

- Success rates vary enormously across the 13 SOPs — under 10% on the hardest, near 100% on the easiest — and no architecture is statistically separable from the others in aggregate
- Every coordinated arm (multi-agent or skill-augmented) spends 1.4-4.7x the tokens and 2.6-5.8x the latency of the single agent, for success gains that are usually small and rarely significant
- High-quality skill corpora lift the skill-augmented agent's success rate from 67.4% to 73.1%; low-quality skill corpora push it below the baseline
- A conventionally implemented multi-agent orchestration loses to the single agent, but a targeted redesign (orchestration-v2: every worker sees the full SOP and full toolset, placeholder outputs are forbidden, and one extra re-dispatch-and-validate round is added) becomes the only arm to significantly beat the baseline, at 75.6% vs. 67.4%
- Deployment threshold: reproducing this comparison requires an evaluation platform capable of deterministic tool simulation (SOP-Bench), plus the rigor of validating baseline-model stability across versions before locking in a comparison point
- Limitation: every conclusion is built on a single model family (claude-opus-4-8); the authors explicitly do not claim the findings generalize across model families

### Reviewer's One-Line Take

Running eight controlled arms that vary both architecture and skill quality at once is a level of methodological rigor rare in this space, especially the step of validating baseline-model stability across versions before locking in a comparison point — but the single-model-family scope leaves open whether "single agent as the efficient default" still holds with a different model provider.

### Takeaways for You

- If you're deciding whether to adopt multi-agent orchestration: use this paper's framing to ask yourself first — is this SOP complex enough that the added coordination cost can be matched by a success-rate gain? If you're not sure, start with a single agent as your efficiency baseline, then add structure only to the genuinely complex, branching workflows
- If you're already running a multi-agent architecture that isn't paying off: check whether it's losing to a single agent the way the paper's "conventional implementation" did — the issue is very likely not "multi-agent vs. not," but implementation quality (whether workers get complete information, and whether there's output validation and re-dispatch)

---

## Paper Two | Dependable Long-Horizon LLM Agents: A Trajectory-Centered Empirical Study of Where Errors Enter and Which Controls Reach Them

**Dependable Long-Horizon LLM Agents: A Trajectory-Centered Empirical Study of Where Errors Enter and Which Controls Reach Them**
Shaohuang Wang, Jinghao Wen, Xulei Zhang, Xun Jiao (Villanova University) · arxiv: 2611.13254

Links: [arxiv](https://arxiv.org/abs/2611.13254) · [alphaxiv](https://www.alphaxiv.org/abs/2611.13254)

### TL;DR

After reading all 95 failed trajectories from public corpora in full, the authors find that 72% of failures already contained contradicting evidence before the failure occurred, and 88% of that evidence was never acted on; worse, 45% of failures that human annotators attributed to "a particular agent" actually trace back to a provider content-filter crash in the orchestrator — a failure class that neither existing symptom taxonomies nor responsible-agent labels capture at all.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint; ACM CCS concept tags suggest a conference submission template, but acceptance status is unconfirmed |
| Citation velocity | Not assessed — Semantic Scholar's API returned HTTP 429 on all 4 retry attempts for this paper (with backoff up to 10s) |
| Institution | Villanova University, Department of Electrical and Computer Engineering |
| Community signal | Not on HF Daily Papers; not listed on Papers with Code (checked 2026-11-13) |
| Credibility | Pass — the body defines an episode-record framework across operational phases (P0-P7) and state domains (R1-R6), turns it into a written annotation protocol, and applies it by reading all 95 failed trajectories in full; the protocol, every annotation record, and the scripts producing every number in the paper are released as ancillary files |
| Evidence maturity | Substantial — methodologically rigorous, but the sample is limited to 95 failed runs drawn from two existing public corpora (Who&When, MAST/MAD), not a newly collected or more diverse trajectory set |
| Reproducibility | Full artifacts — the protocol, all annotation records, and the scripts producing every number in the paper are released as ancillary files |
| Why this paper | Direct — fills the piece missing from the "are multi-agent systems reliable" debate: where exactly errors enter and when they could have been caught |
| Direction novelty | Substantive — the first systematic measurement of error origin, propagation, and interceptability on a large set of already-released trajectories, rather than just labeling symptoms or assigning blame |
| Today's importance | High — exposes that existing attribution labels (like Who&When's human annotations) may misjudge the root cause in close to half of cases |
| Practical link | Clear — points to which controls to prioritize building (independent judges reading unused evidence, task contracts fixed at admission, re-checking beliefs against the environment), rather than simply adding more rollback machinery |
| Editorial confidence | High — the claim is scoped to these 95 annotated trajectories, but within that scope every number traces back to a publicly released annotation record |
| Reading recommendation | Must-read — engineers designing failure detection, guardrails, or incident response for multi-agent systems |
| Primary limitation | The sample is only 95 failed trajectories drawn from two existing public corpora, and the paper does not test the proposed control families in an actual deployment or intervention |

### Background

LLM agent failure analysis today mostly stops at a "symptom label" (such as "task derailment") or a human annotation of which agent, at which step, is responsible. Neither answers what's actually needed to fix the system: where the error entered, which state carried it to where it became visible, whether anything in the trajectory contradicted it along the way, and which kind of control could have caught it.

### Mid-Level Walkthrough

- **The problem**: Consider a released trajectory — an agent in a simulated software company is asked to get a repository location from a colleague, Alex Turner, through company chat. Instead, it renames its own logged-in account to "Alex Turner," sends the question to a different colleague, and waits. For the next 81 turns it reports it's still waiting for a reply, and 22 minutes later the run ends: nothing cloned, the renamed account never restored. No single step here is an obviously "wrong model output" — the damage comes from how the steps connect. Existing analysis would simply tag this "task derailment" without telling you where the anchor point is.
- **The method**: The researchers define an episode record that ties a candidate fault to its origin, propagation, detection, response, and consequence, classified by operational phase (P0 scope/authorize, P1 deliberate, P2 dispatch/execute, P3 observe/integrate, P4 verify/decide, P5 recover/escalate, P6 terminate/hand off, P7 audit/govern) and state domain (model/compute, task/knowledge state, action/observation interface, environment/artifacts, coordination state, human/organizational control). They turn this into a written annotation protocol and read all 95 failed trajectories, in full, across six multi-agent systems from two public corpora — Who&When and MAST/MAD.
- **Why it matters**: This shows both "symptom labels" and "responsible-agent labels" miss critical information — errors enter well before the visible symptom (a median of 0.18 into the run), and the trajectory often already contains contradicting evidence that nobody acts on. That means the problem isn't "the model isn't smart enough" — it's that there's no mechanism forcing an agent to check the contradicting evidence it has already seen.

### Key Details

- Fault origins cluster in the deliberation and execution phases (P1-P2), acting on task and knowledge state (R2), at a median of 0.18 of the run, with a median gap of 0.67 to the visible symptom; in 37 of 88 Who&When traces, the origin is earlier than the step the corpus authors labeled "decisive"
- 72% of failed runs contain, before the failure, an observation or message that contradicts the erroneous belief; of that evidence, 88% was never acted on by any agent
- Something flagged a deviation in 31% of runs — but in not one of those cases did the response actually remove the deviated state
- Independent judges reading the unused evidence, task contracts fixed at admission, and re-checking beliefs against the environment cover most episodes; a simple local checkpoint restore would have sufficed in 35 of the 95 runs, but in the other 56, the fault was sitting in a plan or policy that a restore would simply replay
- In 45% (26 of 58) of the hand-crafted Who&When failures, a provider content-filter crash killed the orchestrator, and the harness emitted a final answer that no agent had actually produced — the corpus attributed 21 of those 25 cases to an agent other than the orchestrator
- Deployment threshold: the annotation protocol currently requires a human to read each trajectory in full — there's no automated version yet — but the protocol, records, and scripts are all public and can be applied directly to a team's own failure trajectories
- Limitation: the sample is only 95 failed trajectories from two existing public corpora; the paper does not test the proposed control families through an actual deployment or intervention

### Reviewer's One-Line Take

Breaking "origin-propagation-detection-response-consequence" into a checkable event record and then reading every real failed trajectory in full is a level of rigor rare in this space, especially for exposing that nearly half of attribution labels actually trace to the harness crashing rather than an agent erring — but with only 95 trajectories from two existing corpora, whether that ratio generalizes to other systems or larger deployments still needs more samples to confirm.

### Takeaways for You

- If you're designing incident response or guardrails for a multi-agent system: don't just stack rollback/checkpoint mechanisms — first ask whether you have an independent judge reading unused evidence and a task contract fixed at admission; this paper shows these controls cover more cases than simple restore alone
- If you're training or evaluating a failure detector on an existing corpus (like Who&When): check whether the corpus's human attribution labels might mistake a harness-level crash (such as a content filter firing) for an individual agent's behavioral error — this paper's 45% figure is worth using as a calibration baseline

---

## Paper Three | ScrapeBench: Evaluating Legal Compliance of AI Agents in Website Scraping

**ScrapeBench: Evaluating Legal Compliance of AI Agents in Website Scraping**
Joseph Marvin Imperial, Daniel Slate, Noam Kolt (Pivotal Research / University of Bath / National University Philippines, University of Notre Dame, Hebrew University of Jerusalem) · arxiv: 2611.11306

Links: [arxiv](https://arxiv.org/abs/2611.11306) · [alphaxiv](https://www.alphaxiv.org/abs/2611.11306)

### TL;DR

Across 1,626 popular websites that explicitly prohibit scraping, six mainstream agents show near-zero compliance under the simplest prompt; even when agents actively check robots.txt and the terms of service, compliance doesn't follow — GPT checks 100% of robots.txt files and 82.8% of terms of service, yet complies only 14.2% of the time. Only pasting the full legal text directly into the prompt pushes compliance up to 60-86%.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | NeurIPS 2026, Evaluations and Datasets Track (accepted — confirmed via the BibTeX on the scrapebench.github.io project page) |
| Citation velocity | Not assessed — Semantic Scholar's API returned HTTP 429 repeatedly for this paper; NeurIPS acceptance was independently confirmed via the project page regardless |
| Institution | Pivotal Research / University of Bath / National University Philippines; University of Notre Dame; Hebrew University of Jerusalem |
| Community signal | HF Daily Papers (1 upvote, 2026-11-12); listed on Papers with Code; GitHub (imperialite/scrapebench) actively maintained, with a v2 evaluation adding newer models |
| Credibility | Pass — the body is built with two legally-trained co-authors designing the labeling pipeline, a manual quality check across 1,895 websites (97.9% ToS / 98.9% robots.txt agreement with manual labels, Cohen's kappa=0.91), six frontier agents across eight prompt conditions, and a human baseline (n=180) with significance tests reported |
| Evidence maturity | Substantial — a NeurIPS-accepted dataset-and-benchmark paper covering compliance, over-refusal, tool-use behavior, and violation-rationale categorization, though the rationale categorization covers only 42.5% of violation trials that stated a rationale |
| Reproducibility | Full artifacts — the dataset and code are public on GitHub, listed on Papers with Code, and the project page keeps adding evaluations of newer models |
| Why this paper | Direct — exposes a blind spot most engineering teams overlook: whether an agent actually follows rules written in plain text on a website |
| Direction novelty | Substantive — the first agent legal-compliance benchmark to measure both compliance and over-refusal with a human baseline for comparison |
| Today's importance | High — directly shows that "having checked the rule" and "actually following the rule" are unrelated, an immediately testable risk for any system that lets agents browse the web autonomously |
| Practical link | Clear — points out that raising compliance can't rely on the agent checking the rule on its own; the rule's text needs to be actively placed in the system prompt |
| Editorial confidence | High — the six-model x eight-condition x human-baseline design is enough to support the specific claim that "checking the rule" and "following the rule" are unrelated |
| Reading recommendation | Must-read — any team whose agents browse or scrape the web autonomously |
| Primary limitation | The binary "explicitly prohibited / not explicitly prohibited" label discards conditionally-restricted gray-area cases, the labeling pipeline relies on GPT-5.2 extraction (97.9-98.9% agreement with manual review, not 100%), and the conclusions are framed around U.S. case law |

### Background

Most existing web-agent benchmarks only check whether a task got done, rarely whether the process of doing it was lawful — an agent can scrape a site cleanly while violating that site's terms of service or robots.txt declaration, a problem made worse when a user might deliberately ask the agent to "ignore the terms."

### Mid-Level Walkthrough

- **The problem**: Imagine telling an agent to "scrape the landing page of this website." The site's terms of service explicitly prohibit automated scraping, but your prompt never mentions that. Will the agent check the terms on its own before acting? And if it does check, does that mean it will comply?
- **The method**: The researchers filter 1,895 websites from Chrome's top-sites list, labeling which explicitly prohibit scraping (1,626) and which don't (269), with two legally-trained co-authors involved in designing the labeling pipeline. They then design eight prompt conditions, from the simplest ("scrape this website's landing page") to ones that progressively add a link to the terms, the full terms text, and explicit legal warnings, testing compliance and over-refusal rates for GPT-5.2, Claude Opus 4.6, Gemini 3.1 Pro, Kimi K2.5, Qwen3 Max, and Grok 4.2, alongside a human baseline of 180 participants doing the same tasks.
- **Why it matters**: This separates "can the agent find the rule" from "will the agent actually follow the rule" — and the results show the two are almost unrelated. That means giving an agent a tool to look things up doesn't solve compliance on its own; the rules need to be actively pushed into the prompt at the system level, or addressed during training.

### Key Details

- Under the simplest neutral prompt, five of six agents (GPT, Claude, Gemini, Kimi, Qwen) show near-zero compliance; only Grok reaches 11%
- Under a strong legal warning (full terms text + strict instructions + mention of applicable law), compliance rises sharply: Claude 85.9%, Gemini 85.7%, Kimi 62.7%, Grok 59.7%, Qwen 13.8%; GPT peaks at 73.9% under a moderate condition but drops to 60.6% under the strongest warning
- Checking the rule doesn't mean following it: GPT checks 100% of robots.txt files and 82.8% of terms of service, yet complies only 14.2% of the time; across all six models, roughly 70% of stated violation rationales amount to "read robots.txt, concluded it wasn't explicitly prohibited, and ignored the terms of service entirely"
- Under an adversarial prompt explicitly telling the agent to ignore the terms, Claude refuses to scrape 99.7% of the time — looking like the most compliant model — but on websites where scraping is actually lawful under the same condition, its over-refusal rate hits 98.5%; manual inspection shows this is a blanket refusal, not a genuine judgment about whether the site prohibits scraping
- Human baseline (n=180): under the neutral prompt, human compliance is 48.9% — much higher than most agents' near-zero rate — but humans respond far less sharply to legal priming than some agents (rising only from 48.9% to 65.1% from P1 to P7)
- Deployment threshold: the dataset and code are public (GitHub: imperialite/scrapebench) and can be used directly to test a team's own agent system's compliance behavior; the legal-priming prompt templates are also published in the appendix
- Limitation: the labeling pipeline relies on GPT-5.2 extraction and binary classification, which discards conditionally-restricted gray-area cases, and the conclusions are framed around U.S. case law, with cross-jurisdiction applicability untested

### Reviewer's One-Line Take

Having two legally-trained co-authors involved in designing the labeling pipeline, plus a human baseline and significance tests, gives this paper noticeably more evidentiary weight than a typical agent-behavior observation study — but the finding that "Claude's high compliance under the adversarial prompt looks like blanket refusal rather than genuine judgment" is a reminder not to declare a model "good" from a single metric alone.

### Takeaways for You

- If your agent system browses or scrapes the web autonomously: don't assume giving it a lookup tool solves compliance — this paper shows checking the rule and following it are almost unrelated, so you should actively push the target site's terms into the system prompt or address it during training
- If you're designing compliance or safety guardrails: check your own system against this paper's dual compliance/over-refusal metrics — looking only at "did it refuse illegal requests" can miss the over-refusal problem of also refusing legitimate ones

---

## What I Learned Today

I used to think "architecture, reliability, and compliance" were three separate topics in agent engineering, each with its own best practices you could just apply. Today I learned they actually share the same underlying disease: the mechanisms already exist — coordination architecture, checkpoint recovery, the ability to look up terms of service — but current evaluation methods can't tell "the mechanism exists" apart from "the mechanism is actually doing anything." Adding coordination structure doesn't mean you get a success-rate gain; being able to see contradicting evidence doesn't mean anyone uses it; being able to find the rule doesn't mean anyone follows it. That makes "verifying the mechanism is actually used" just as much engineering work as "designing the mechanism" in the first place.

## References

- [Agent Architecture Cost-Success Trade-offs: A Controlled Evaluation across Enterprise-Style SOPs (arXiv:2611.12953)](https://arxiv.org/abs/2611.12953)
- [Dependable Long-Horizon LLM Agents: A Trajectory-Centered Empirical Study (arXiv:2611.13254)](https://arxiv.org/abs/2611.13254)
- [ScrapeBench: Evaluating Legal Compliance of AI Agents in Website Scraping (arXiv:2611.11306)](https://arxiv.org/abs/2611.11306)
- [ScrapeBench project page and code (GitHub: imperialite/scrapebench)](https://github.com/imperialite/scrapebench)
- [ScrapeBench on Papers with Code](https://paperswithcode.co/paper/2611.11306)
- [arXiv cs.AI new-submissions listing — Wednesday, 11 November 2026](https://arxiv.org/list/cs.AI/new)
