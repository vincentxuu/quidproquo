---
title: "AI Agent Arxiv Digest — 2026-09-17"
date: 2026-09-17
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers puncture the same assumption from three angles: the signals we use to decide whether agent training, evaluation, and governance can be trusted don't hold up under scrutiny"
tldr: "RL-trained tool-use policies learn to trigger search from surface cues rather than real need, inflating spurious tool calls by up to 39.2 percentage points — a dense tool-necessity reward almost eliminates it; a peer-reviewed audit finds the top ten SWE-bench Verified submissions solve the exact same 285 instances and fail the exact same 51, with none of 29 adjacent top-30 pairs separable by a paired test; in the viral OpenClaw/ClawHub agent-skill ecosystem, 77.86% of skills have zero stars and zero comments yet 85.06% carry privilege evidence, and three security scanners disagree on 23,702 of 61,990 shared listings with weighted sensitivity of only 21.67%-61.06%"
series:
  name: "AI Agent Arxiv Digest"
  order: 116
---

> 🌏 [中文版](/posts/daily/2026-09-17-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers puncture the same assumption at three different layers — training, evaluation, and governance: that if a signal exists, it can be trusted. The first finds that RL-trained tool-use policies become *more* prone to shortcut learning as they get better at a task — they invoke tools because of superficial prompt cues, not genuine need. The second is a peer-reviewed audit proving that the SWE-bench Verified leaderboard everyone checks before picking a coding agent can no longer statistically separate its own top entries. The third is an empirical study of a viral agent-skill ecosystem, showing that stars, downloads, and scanner flags — all signals that look like governance — contradict each other and have little to do with what actually gets reviewed. All three clear a real credibility bar (two are peer-reviewed, one ships a fully reproducible statistical pipeline), but each keeps its claim narrow: none says "agents are untrustworthy" — each precisely identifies one signal that doesn't measure what we assume it measures, under stated conditions.

## Terms Worth Knowing Before Reading

| Term | Plain-language explanation |
|---|---|
| Agent Skill | A document (typically SKILL.md) that instructs an AI agent how to use tools and take actions — not executable code itself, but once loaded it produces real side effects |
| Counterfactual Evaluation | Creating a cue-present and cue-absent version of the same question to isolate whether a cue, rather than the task itself, is driving a decision |
| Effective Size (n_eff) / Nesting Coefficient | The number of leaderboard instances that can actually distinguish systems; the nesting coefficient measures whether a weaker system's solved instances are almost entirely a subset of a stronger system's — together they explain why rankings can stop being readable |
| McNemar's Exact Test | A paired statistical test for comparing two systems graded on the exact same set of instances, used to check whether a rank difference is more than noise |
| Privilege Evidence | A textual pattern match indicating a skill may request sensitive capabilities like filesystem, network, or credential access — it only means the text matched a rule, not that anyone reviewed it |
| Dense vs. Sparse Reward | Sparse reward only scores the final answer; dense reward gives feedback on each intermediate decision (e.g. every tool call), catching cases where the final answer is right but the process wasn't |

---

## Paper One | Spurious Tool Use: RL Agents Learn to Trigger Tools from Cues, Not Need

**Spurious Tool Use: When RL Agents Learn the Wrong Reason to Act**
Yiwei Yang, Haoxiang Zhang, Bingbing Wen et al. (University of Washington, UC San Diego, Stanford University) · arxiv: 2609.16268

Links: [arxiv](https://arxiv.org/abs/2609.16268) · [alphaxiv](https://www.alphaxiv.org/abs/2609.16268)

### TL;DR

Injecting a surface cue with no causal relevance to tool necessity (e.g. an `<answer>` tag) into a synthetic training environment causes RL-trained agents to invoke search whenever the cue appears — even on math questions that need code execution — inflating spurious tool calls by up to 39.2 percentage points; adding a dense reward in which an LLM judge scores whether each tool call was necessary almost eliminates the shortcut.

### Editorial Judgment

| Aspect | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | Published 3 days ago; Semantic Scholar was rate-limited during this run, no citation data available (expected near-zero for a fresh preprint regardless) |
| Institution | University of Washington + UC San Diego + Stanford University |
| Community signal | Not on HF Daily Papers / no Papers with Code repo found |
| Credibility | Pass — the swapped-cue control (Tables 3, 4) rules out two confounds: mere class imbalance and the model simply failing to learn math |
| Evidence maturity | Preliminary — validated only in synthetic environments (NQ + DeepMath) with a single 7B base model; not yet tested on naturalistic training data |
| Reproducibility | Partial artifacts — base model (Qwen2.5-7B-Instruct) and datasets are public, hyperparameters and judge prompts are in the appendix, but code is promised "upon acceptance" |
| Why this one | Direct — directly addresses why RL-trained agent tool-selection policies learn the wrong thing |
| Novelty | Substantive — moves the shortcut-learning analysis framework from supervised classification into an agent's intermediate decision (which tool to call), and finds it coupled to task competence |
| Today's importance | High — as more agent systems fine-tune tool-use policies with RL, this shows capability gains can increase susceptibility to spurious shortcuts |
| Practical link | Clear — ships a directly applicable dense-reward design (an LLM judge scoring the necessity of each tool call) |
| Editorial confidence | Medium — the causal mechanism itself is well supported; extrapolation to production-scale agents still needs validation |
| Reading recommendation | Must-read — for teams fine-tuning tool-use policies with RL (e.g. GRPO) |
| Primary limitation | Validated only in a synthetic setting with a single 7B model; whether it holds at larger scale and on naturalistic training data is left as future work |

### Field Context

Agent tool-use policies are mostly trained with RL that only rewards the final answer. The problem: an unnecessary search call incurs no penalty as long as the final answer is still correct — so a shortcut can survive quietly under evaluation protocols that look completely normal. Prior shortcut-learning work mostly studied mispredictions in supervised classification; this is one of the few papers to bring the same framework to an agent's intermediate decision of which tool to call.

### Mid-level Walkthrough

- **The problem**: Imagine an agent trained so that any factual question ending with an `<answer>` tag gets answered by querying a database, while math questions never carry this tag. Over training, the agent may not learn "this question needs a database lookup" but rather "seeing `<answer>` means query the database" — so later, pasting that same tag onto a pure math question still triggers a database query, even though it's useless there.
- **The method**: The team trains Qwen2.5-7B-Instruct with GRPO on a mix of factual QA (search tool) and math reasoning (code tool), deliberately injecting a cue with no causal relation to tool necessity into one task type. They then use counterfactual evaluation groups — cue-present vs. cue-absent versions of the same question — to isolate how much of the tool-invocation rate is due to the cue alone. The shortcut only appears for tasks the agent has already learned to solve reliably, and it's stronger the more semantically aligned the cue is with the tool. Finally, they add a dense "tool-necessity reward," where an LLM judge scores each individual tool call rather than only the final answer.
- **Why it matters**: This shows that sparse, outcome-only reward is not enough to guarantee an agent learns "I genuinely need this tool" rather than "I saw this cue so I use this tool." For teams fine-tuning tool-use policies with RL, this is a concrete, actionable blind spot.

### Deep-dive Points

- Injecting a search-semantic cue (e.g. `[WEB_INDEX_742]`) into factual training data causes spurious search calls on math tasks: +19.9pp on DeepMath, up to +39.2pp on GSM8K
- The symmetric control (code-semantic cue on math training, evaluated on factual tasks) shows almost no effect: Δ ranges from -0.3 to +0.7, ruling out simple class imbalance as the driver
- A swapped-cue experiment shows a semantically mismatched cue paired with an already-well-learned tool produces only a weak effect (≤3.5%), far below the 39.2% seen with an aligned cue
- Adding the dense tool-necessity reward suppresses spurious tool use to near zero without hurting — and sometimes slightly improving — task accuracy
- Adoption cost: requires an additional LLM judge (GPT-5 Nano in the paper) scoring every tool call in the training loop in real time, adding training cost and latency
- Limitation: all experiments are on synthetic datasets with a single 7B model; the authors themselves list validation at larger scale and on naturalistic training data as future work

### Reviewer's One-liner

The experimental design is clean — the swapped-cue control genuinely separates task competence from semantic alignment as confounds — but since the cues are deliberately injected and synthetic, whether real-world agent training data contains implicit cues of comparable strength still needs larger-scale validation.

### Take-aways for You

- If you're fine-tuning an agent's tool-use policy with RL: don't reward only final-task correctness — consider adding a dense, decision-level reward like this one, with a judge specifically scoring whether each tool call was necessary
- If you're building agent evaluations: outcome-only correctness won't surface this kind of shortcut; add counterfactual test sets — the same question with a surface cue added or removed — and check whether tool-invocation patterns shift accordingly

---

## Paper Two | The Leaderboard Can't Be Read: SWE-bench Verified's Top Tier Has Converged

**Coding Agents Have Converged: Why the SWE-bench Leaderboard Can No Longer Order Its Top Entries, and What to Measure Instead**
Fengshuo Liu (Imperial College London) · arxiv: 2609.17394

Links: [arxiv](https://arxiv.org/abs/2609.17394) · [alphaxiv](https://www.alphaxiv.org/abs/2609.17394)

### TL;DR

Auditing 254 public submissions across four SWE-bench splits: the top ten Verified entries jointly solve the same 285 instances and jointly fail the same 51, leaving only 164 that can actually distinguish them; the frontier's solution sets overlap heavily (median nesting 0.935), and none of 29 adjacent top-30 pairs is separable by an exact paired test (McNemar).

### Editorial Judgment

| Aspect | Assessment |
|---|---|
| Venue | ADMA 2026 (Responsible Data Intelligence special session) — accepted, camera-ready |
| Citation velocity | Published 2 days ago; Semantic Scholar was rate-limited during this run, no citation data available |
| Institution | Imperial College London |
| Community signal | Not on HF Daily Papers; author released the audit tool's source (github.com/Adkid-Zephyr/resolution-audit), no external star count recorded yet |
| Credibility | Pass — 254 public per-instance verdict records, cross-validated by three mutually reinforcing statistical tools: nesting coefficient, exact McNemar tests, and IRT |
| Evidence maturity | Substantial — peer-reviewed, fully reproducible data and scripts, and a counter-test on the non-saturated Test split confirms the method can detect separability when it exists |
| Reproducibility | Full artifacts — every input is per-instance verdict data SWE-bench maintainers already publish; analysis scripts, seeds, and hashes are all released |
| Why this one | Direct — directly addresses the credibility of how coding agents are evaluated and selected |
| Novelty | Substantive — introduces two new constructs (comparison-set-relative effective size, nesting coefficient against a score-implied baseline) proving current leaderboard readings don't hold up |
| Today's importance | High — nearly every team picking a coding agent checks the SWE-bench leaderboard; this proves the top-tier ranking can't actually be read |
| Practical link | Clear — gives 7 concrete recommendations for teams building internal benchmarks (record the model-scaffold pair, use paired tests, publish tiers instead of ranks, etc.) |
| Editorial confidence | High — statistical tools cross-validate each other, peer-reviewed, data and code fully available to rerun |
| Reading recommendation | Must-read — for anyone using SWE-bench or a similar leaderboard to make a selection decision |
| Primary limitation | Observational, not causal; 54% of submissions lack a machine-readable model-scaffold tag and are excluded from that analysis; findings validated only within the SWE-bench family |

### Field Context

SWE-bench Verified is one of the most commonly cited leaderboards for comparing coding agents, and score gaps at the top are routinely read as "this scaffold/model is stronger." Prior audits found quality problems in the tasks themselves (roughly a quarter are flawed). This paper asks a different question: even where the tasks are sound, can the observed rank gaps actually be read?

### Mid-level Walkthrough

- **The problem**: Imagine two coding agents that resolve 396 instances each on SWE-bench Verified, ranked first and second. Looking at per-instance results, though, the two systems solve almost the exact same set of problems — the gap isn't "who's smarter" but "who got lucky on one or two edge cases."
- **The method**: The author defines "effective size" — the number of instances in a comparison set that aren't solved by every system or none — and finds only 33% of instances discriminate among the top ten, and just 7% among the top two. The "nesting coefficient" then quantifies whether solution sets overlap (frontier median 0.935, far above the score-implied baseline), and exact paired McNemar tests on every adjacent ranking pair find none of 29 separable at α=0.05. The same test is run on the not-yet-saturated Test split, where it does separate 14 of 23 pairs — ruling out the concern that the statistical method simply can't detect anything anywhere.
- **Why it matters**: For any team making a model/framework procurement decision off a leaderboard score, this gives a concrete toolkit: compute the effective size, check the nesting coefficient, then use a paired test to decide whether to trust a rank difference — rather than reading the score directly as an ordering.

### Deep-dive Points

- Top ten on Verified: 285 instances solved by all, 51 by none, leaving 164 (33%) discriminating; top two share only 36 discriminating instances (7%)
- Frontier median nesting coefficient of 0.935 against a score-implied baseline of 0.774, showing a weaker system's solutions are almost entirely a subset of a stronger system's
- Holding the model fixed and varying the scaffold produces score ranges up to 29.8 percentage points (claude-3-5-sonnet across nine scaffolds) — larger than the entire top-thirty spread (8.8pp)
- None of 29 adjacent Verified top-30 pairs is separable by exact McNemar at α=0.05; the same test separates 14 of 23 pairs on the not-yet-saturated Test split, confirming the method works when a real difference exists
- Adoption cost: for an organization building an internal benchmark, an independent-sample design at n=100 can only reliably detect roughly a 17-point gap; a paired design can do better but its required size depends on the actual discordance rate observed
- Limitation: the model-scaffold factor is observational (teams choose the pairing themselves), so causal attribution isn't possible; 54% of submissions lack a machine-readable model-scaffold tag and are excluded from that part of the analysis

### Reviewer's One-liner

Statistically rigorous, fully public and rerunnable data, and the Test-split counter-test proves the method isn't simply null everywhere — but the conclusions are scoped to the SWE-bench family, and whether they generalize to other leaderboards (e.g. broader multi-domain agent benchmarks) remains to be seen.

### Take-aways for You

- If you're picking a coding agent from a leaderboard: don't just read the total-score ranking — ask "what's the effective size here" and "can adjacent ranks be separated by a paired test" before switching systems over a few points of difference
- If you're building an internal benchmark: record the (model, scaffold, version) triple for every run, publish tiers instead of strict ranks, and prioritize adding instances that break the existing nesting structure rather than simply adding more of the same kind

---

## Paper Three | After the Party: An Agent-Skill Ecosystem's Governance Signals All Fail

**After the Party: Governing What a Viral Agent-Skill Ecosystem Left Behind**
Yunpeng Xiong, Ting Zhang (Monash University) · arxiv: 2609.17274

Links: [arxiv](https://arxiv.org/abs/2609.17274) · [alphaxiv](https://www.alphaxiv.org/abs/2609.17274)

### TL;DR

An empirical study of the OpenClaw/ClawHub agent-skill ecosystem that went viral in H1 2026: the registry nearly doubled in 91 days, yet 77.86% of skills carry neither a star nor a comment while 85.06% carry evidence of privileged capabilities like shell or network access; the three deployed security scanners disagree on 23,702 of 61,990 jointly covered listings, and after human adjudication, weighted sensitivity ranges only from 21.67% to 61.06% — no single scanner or majority vote can substitute for ground truth.

### Editorial Judgment

| Aspect | Assessment |
|---|---|
| Venue | APSEC 2026 (33rd Asia-Pacific Software Engineering Conference) — accepted, to appear in IEEE Digital Library |
| Citation velocity | Published 2 days ago; Semantic Scholar was rate-limited during this run, no citation data available |
| Institution | Monash University |
| Community signal | Not on HF Daily Papers; the OpenClaw/ClawHub ecosystem itself is corroborated by multiple independent security papers and community lists (e.g. awesome-openclaw-skills) found via web search, confirming its real-world scale |
| Credibility | Pass — three dated registry snapshots, a pre-declared 7-feature statistical design, and a 180-case, two-annotator adjudicated reference standard |
| Evidence maturity | Substantial — 65,175 real production listings, multiple robustness checks (cohort restriction, age adjustment, four cross-validated identity definitions), and an explicit threats-to-validity section |
| Reproducibility | Partial artifacts — underlying data sources (OpenClaw/ClawHub GitHub repos) are public and timestamped, but the authors' own analysis scripts are described as an "anonymized replication package" with no public link found in this run |
| Why this one | Indirect — not about an agent's own architecture or reasoning, but about whether an agent-skill ecosystem's governance signals can be trusted; directly affects anyone running or relying on a skill marketplace |
| Novelty | Substantive — the first study to jointly examine a viral agent-skill ecosystem's scale, signal stability, accountability, and scanner validity |
| Today's importance | High — skill/plugin marketplaces are quickly becoming standard agent infrastructure; this provides real measurements showing stars, downloads, and scanners alone aren't enough |
| Practical link | Clear — tells any team building or consuming a skill registry which signals not to trust and how to design a review queue |
| Editorial confidence | High — claims are carefully scoped (explicitly stating only the methodology, not the specific numbers, is claimed to transfer), and evidence maps cleanly to each claim |
| Reading recommendation | Must-read — for anyone doing governance or security auditing of an agent skill/plugin marketplace |
| Primary limitation | Covers a single registry over a single half-year window, and two of the three data sources were withdrawn by the platform mid-study; the seven RQ2 baseline associations mostly vanish or reverse after adjustment |

### Field Context

Agent skills (instruction documents, typically SKILL.md, that tell an agent how to act) are quickly replacing conventional packages as the way agent ecosystems extend themselves — this very repo's own `.agents/skills/` directory is a small-scale instance of the same pattern. But when a skill marketplace doubles in scale within months, whether the signals we normally use to judge trustworthiness (stars, downloads, scanner flags) still mean anything has rarely been measured with real data.

### Mid-level Walkthrough

- **The problem**: Imagine two skills in a marketplace: one has 100 stars and high downloads, the other has zero stars and zero comments. Intuitively you'd pick the first. But if that marketplace grew from 33,000 to 65,000 listings in three months, how do you know "having stars" means "someone actually reviewed it" rather than "it was published earlier and happened to be seen by more people"?
- **The method**: The team cross-references OpenClaw's Git history, GitHub issues/PRs, and three dated ClawHub registry snapshots. RQ1 quantifies the growth (33,399 to 65,175 listings in 91 days, +95.14%); RQ2 uses Mann-Whitney U tests with age adjustment to test whether baseline metadata (downloads, stars) reliably predicts continued visibility — restricting to the earlier-creation cohort makes all seven positive associations vanish or reverse; RQ3 separately measures visible community feedback versus text-detected privilege evidence, finding the two coexist without correlating; RQ4 has two security-experienced annotators independently label 180 cases to build an adjudicated reference standard, then checks how three deployed scanners perform against it.
- **Why it matters**: This shows that signals that "look like governance" (stars, downloads, a scanner having run) are a different thing from "actually having been validated." For any team running or relying on an agent-skill marketplace, this offers a concrete measurement approach rather than a vague "be careful with third-party skills" warning.

### Deep-dive Points

- Registry stock grew from 33,399 to 65,175 listings in 91 days (+95.14%); downloads are highly concentrated, with the top 10% of skills capturing 46.93% of total downloads (Gini 0.528)
- Restricting to the earlier-creation (pre-March-cutoff) cohort reverses all seven baseline associations (downloads, stars, multiple versions, file count, etc.) to negative — the original 6-of-7 positive-direction agreement doesn't survive
- 77.86% of skills have neither a star nor a comment, yet among evaluable artifacts 85.06% carry at least one of twelve privilege-evidence dimensions (shell execution, network access, etc.) — the two coexist heavily
- Across 61,990 listings jointly covered by all three scanners (LLM-based, static analysis, VirusTotal), they disagree on 23,702; after human adjudication, weighted sensitivity ranges from 21.67% (static analysis) to 61.06% (LLM scanner)
- Adoption cost: replicating this kind of analysis requires multiple historical registry snapshots and building your own human-adjudicated reference standard — you can't just trust any single scanner or a majority vote
- Limitation: the study covers a single half-year window on a single registry, and two data sources (Git history, comment bodies) were withdrawn by the platform mid-study; the authors explicitly state only the measurement methodology, not the specific numbers, is claimed to transfer to other agent-skill ecosystems

### Reviewer's One-liner

All four research questions tie tightly to one governance logic, and the human-adjudicated reference standard is a genuinely strong design that cleanly separates "the scanner ran" from "the scanner is accurate" — but the study covers only one ecosystem over one window, so the specific numbers can't be directly applied elsewhere.

### Take-aways for You

- If you run or audit an agent skill/plugin marketplace: don't treat stars or downloads as evidence that review has happened — build a prioritized review queue based on privilege-evidence scores, and keep an explicit "unknown" state rather than treating unreadable skills as safe by default
- If your security process relies on automated scanners: this paper's numbers show a single scanner or majority vote cannot serve as ground truth — periodically validate scanner sensitivity/precision against a small, human-adjudicated sample rather than assuming a deployed scanner equals review

---

## Today's Cognitive Shift

Previously it seemed enough to judge whether an agent (or its skill marketplace) is trustworthy by checking whether a signal exists — was a tool called, is the leaderboard rank high, are there lots of stars. Today's three papers all point to the same deeper issue: a signal existing is not the same as a signal having been validated. A tool call can coincidentally land on the right answer for the wrong reason; a leaderboard's top-tier rank gap can already be swallowed by nested solution sets; a zero-star skill can still carry full shell privileges. The real question isn't "does a signal exist," but "has this signal, at this scale, under these conditions, actually been checked — and does it hold up."

## References

- [Spurious Tool Use: When RL Agents Learn the Wrong Reason to Act](https://arxiv.org/abs/2609.16268)
- [Spurious Tool Use — alphaxiv](https://www.alphaxiv.org/abs/2609.16268)
- [Coding Agents Have Converged: Why the SWE-bench Leaderboard Can No Longer Order Its Top Entries, and What to Measure Instead](https://arxiv.org/abs/2609.17394)
- [Coding Agents Have Converged — alphaxiv](https://www.alphaxiv.org/abs/2609.17394)
- [resolution-audit (audit tool source)](https://github.com/Adkid-Zephyr/resolution-audit)
- [SWE-bench experiments (official per-instance verdict data source)](https://github.com/swe-bench/experiments)
- [After the Party: Governing What a Viral Agent-Skill Ecosystem Left Behind](https://arxiv.org/abs/2609.17274)
- [After the Party — alphaxiv](https://www.alphaxiv.org/abs/2609.17274)
- [OpenClaw ClawHub — How ClawHub Works (official docs)](https://docs.openclaw.ai/clawhub/how-it-works)
- [arXiv cs.AI new listings, 2026-09-16](https://arxiv.org/list/cs.AI/new)
