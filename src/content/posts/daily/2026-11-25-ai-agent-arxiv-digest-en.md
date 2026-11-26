---
title: "AI Agent Arxiv Digest — 2026-11-25"
date: 2026-11-25
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Three papers make the same point: with the model held fixed, how the harness is designed decides how much an agent can do and whether it makes things up when something breaks"
tldr: "AutoPILOT lets one model call start a macro or a controller the model wrote itself, lifting GPT-6.1 Sol's real-time game success from 38.3% to 68.6%; Demystifying the Autoresearch Harness isolates memory mechanisms one at a time and finds that keeping a digest of every attempt (context folding) works best, and the resulting MLEvolver reaches a 72.7% medal rate on MLE-Bench Lite; When Tools Fail, Agents Fabricate injects tool faults and finds 6-26% of faulted runs end in a fabricated answer, while a mostly code-based verifier cuts fabrication from 17.3% to 10.8%"
series:
  name: "AI Agent Arxiv Digest"
  order: 185
---

## Today's Overview

What the three papers share is that none of them touches the model. What changes is the harness around it. AutoPILOT changes how model output becomes actions: with the same model, success in real-time games where the clock keeps running rises from 38.3% to 68.6%. Demystifying the Autoresearch Harness changes which past attempts and lessons an agent keeps, swapping one memory mechanism at a time inside a fixed harness so each contribution can be separated. When Tools Fail, Agents Fabricate looks at the flip side: when a tool fails, how the agent fails is determined mostly by what the fault returns rather than by the model, and a verifier that leans on code checks removes part of the fabricated answers. All three are arXiv preprints, and the benchmarks are built or chosen by the authors, so the numbers help decide what to verify first, not what to expect in production.

## Terms to know before reading

| Term | Plain explanation |
|---|---|
| Harness | The code around a model: what the model sees and remembers, how its output becomes actions, and what happens on failure. The model itself is not part of it |
| Macro / Controller | A macro is a fixed sequence of actions the model wrote ahead of time; a controller is a small program the model writes that reads the screen and decides the next step on its own, with no further model calls while it runs |
| Context folding | Compress each attempt into a short digest, keep all digests in context, and expand individual attempts when needed; the contrast, compaction, merges older records into one rolling summary |
| Skill library | Text lessons an agent distills from past attempts and retrieves when a similar situation recurs; deletion removes lessons that went unselected for 5 consecutive iterations |
| Silent ingestion | A tool returns incomplete but plausible data, the agent treats it as valid on first contact without retrying or flagging it, then builds an answer on top |
| Fabrication / Honest failure | Fabrication is confidently asserting a wrong answer; honest failure is saying the data is unavailable. Downstream systems can handle the second, not the first |

---

## Paper 1 | AutoPILOT: One Model Call That Plays a Whole Stretch of the Game

**AutoPILOT: A Visual Agent Harness for Real-Time Gameplay**
Mark Zhao, Pengcheng Wang, Rui Yang et al. (University of Illinois Urbana-Champaign, Georgia Institute of Technology, Northwestern University)　·　arxiv: 2611.28202

Links: [arxiv](https://arxiv.org/abs/2611.28202) · [alphaxiv](https://www.alphaxiv.org/abs/2611.28202)

### TL;DR

Multimodal models play games well when the game waits for them and fall apart when it keeps running; AutoPILOT lets one model call start a macro or a controller the model wrote itself, and with the same GPT-6.1 Sol, real-time success rises from VISTA's 38.3% to 68.6%.

### Editorial Assessment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint (not peer reviewed), submitted 2026-11-20, updated to v2 on 2026-11-25 |
| Citation velocity | 5 days since posting; the Semantic Scholar query returned 429 (rate limited), so no citation data |
| Institutions | University of Illinois Urbana-Champaign, Georgia Institute of Technology, Northwestern University |
| Community response | Not checked: whether HuggingFace Daily Papers or Papers with Code list it |
| Credibility | Pass — three baselines, two clock protocols, ablations that remove macros and controllers, and a relaxed-budget comparison; key numbers trace back to tables in the paper |
| Evidence maturity | Fairly complete — 120 games plus a second benchmark, GameWorld, across several open and closed models; still an author-built game benchmark |
| Reproducibility | Partial artifacts — the paper links a project page (autopilot-harness.github.io); code and benchmark release not confirmed in this review |
| Why this paper | Direct — how model output becomes actions is a part of harness design that is usually left at its default, and this paper tests it on its own |
| Novelty | Substantive increment — controllers are written by the model at run time from screen pixels and interrupted by wake events, unlike fixed rules or reflexes compiled in advance |
| Why today | High — in any environment that does not wait for the agent (real-time interfaces, monitoring, games), single-step loop latency is a structural problem |
| Practical link | Speculative — all experiments are browser games; transfer to real computer use or robotics is not tested directly |
| Editorial confidence | Medium — the in-game gap is large and backed by ablations, but extrapolating beyond games needs caution |
| Reading advice | Must read — for anyone building computer-use or real-time interactive agents |
| Main limitation | All evaluation is on browser games; GPT-6.1 Sol runs three seeds per task, other models one episode per task |

### Background

Most agent harnesses follow a ReAct-style single-step loop: one model call yields at most one action, and the environment is assumed to wait. Harnesses like VISTA improve what the model sees and remembers but leave that loop alone. What the paper measures: letting the game clock run drops VISTA's GameWorld success from 84.1% to 42.9%, and in real time VISTA only ties the plain Codex harness (38.3% vs 38.9%), so better memory and inspection tools did not help.

### Walkthrough

- **Problem**: Imagine playing a shooter with a controller, but before every key press you must write a letter to a friend asking which key to press, and by the time the reply arrives the bullet has already landed. The single-step loop works like this: each action is based on a frame from before the model call, and each call can send only one action.
- **Method**: On each call AutoPILOT lets the model choose one of three modes: send one primitive action; send a pre-written macro; or write a Python controller that a worker runs in a sandbox for up to 120 seconds, reading the screen and acting on its own. Control returns to the model on one of six wake events, such as the controller requesting a handoff, the screen changing sharply, a decision screen appearing, or a timeout.
- **Why it matters**: It turns "how often should the model step in" into a tunable harness choice. The model no longer has to think at every step, only at the moments that matter.

```diagram
title: How much one model call can do
desc: A single-step harness sends one action per call; AutoPILOT lets one call start a macro or a controller
---
<svg viewBox="0 0 680 300">
  <rect class="dg-box" x="30" y="20" width="300" height="100" rx="6"/>
  <text class="dg-label" x="180" y="44" text-anchor="middle" dominant-baseline="central">Single-step (VISTA)</text>
  <text class="dg-sub" x="180" y="68" text-anchor="middle" dominant-baseline="central">One call sends at most one action</text>
  <text class="dg-sub" x="180" y="88" text-anchor="middle" dominant-baseline="central">Acts on a frame from before the call</text>

  <rect class="dg-box dg-box--accent" x="350" y="20" width="300" height="100" rx="6"/>
  <text class="dg-label" x="500" y="44" text-anchor="middle" dominant-baseline="central">AutoPILOT</text>
  <text class="dg-sub" x="500" y="68" text-anchor="middle" dominant-baseline="central">One call can start a macro or controller</text>
  <text class="dg-sub" x="500" y="88" text-anchor="middle" dominant-baseline="central">Wake events hand control back</text>

  <path class="dg-line" d="M180 120 V160" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M500 120 V160" marker-end="url(#arrow-accent)"/>

  <rect class="dg-box dg-box--warn" x="30" y="160" width="300" height="100" rx="6"/>
  <text class="dg-label" x="180" y="188" text-anchor="middle" dominant-baseline="central">About 80 model calls per episode</text>
  <text class="dg-sub" x="180" y="212" text-anchor="middle" dominant-baseline="central">$1.50 per episode, 38.3% real-time success</text>
  <text class="dg-sub" x="180" y="232" text-anchor="middle" dominant-baseline="central">(GPT-6.1 Sol, AFK-Bench)</text>

  <rect class="dg-box" x="350" y="160" width="300" height="100" rx="6"/>
  <text class="dg-label" x="500" y="188" text-anchor="middle" dominant-baseline="central">About 43 calls, 681 steps</text>
  <text class="dg-sub" x="500" y="212" text-anchor="middle" dominant-baseline="central">$0.89 per episode, 68.6% real-time success</text>
  <text class="dg-sub" x="500" y="232" text-anchor="middle" dominant-baseline="central">(GPT-6.1 Sol, AFK-Bench)</text>
</svg>
```

### Key Details

- AFK-Bench is a set of 120 browser games built by the authors, split into three types of 40 by what happens when the agent idles: hostile real-time (idling risks failure), benign real-time (the world moves but idling is not punished), and turn-based; every game can be played under a real-time protocol and a paused-clock protocol
- With GPT-6.1 Sol, AutoPILOT reaches 68.6% real-time success against 38.3% for VISTA and 38.9% for Codex; in the hostile type it is 62.5% vs 16.7%; across 360 paired episodes, 111 were won only by AutoPILOT and 2 only by VISTA
- With Claude Opus 5.5: AutoPILOT 53.3%, VISTA 30.0%, Claude Code 32.5%; AutoPILOT with DeepSeek-V4.1-Flash (39.2%) beats VISTA with GPT-6.1 Sol (38.3%)
- Even with the clock paused and no latency, AutoPILOT still leads VISTA (73.1% vs 56.1%), because one call can execute a whole plan while VISTA spends one call per action and exhausts its budget first
- Ablation: removing both controllers and macros drops success to 45.8% (22.5% in the hostile type); removing only controllers drops that type from 62.5% to 50.8%
- Cost: AutoPILOT takes 43 calls and $0.89 per episode, VISTA 80 calls and $1.50; tripling VISTA's call cap lifts it to 55.0% at $5.28 per episode, still below AutoPILOT's 69.2% at the standard budget
- On GameWorld, AutoPILOT keeps 80.0% in real time while VISTA falls from 84.1% to 42.9%
- Barrier to adoption: controllers recognize the screen with rules such as pixel color (the paper's own example uses color thresholds to find the ship and bullets), so a game with a different art style may need a rewrite; the model must be able to write code

### Reviewer's One-Liner

Positive: it turns "how much one call can do" into its own variable, and uses ablations, budget relaxation and paired comparisons to rule out "it's just faster" and "it just had more budget"; to watch: everything is browser games, so how controllers recognize the screen and recover from errors in real computer use is not tested, and apart from GPT-6.1 Sol each model runs only one episode per task.

### Your Take-Away

- If you build computer-use or real-time interactive agents: first measure how much of the time goes to model-call latency, then let the model write a small self-running program with explicit conditions for handing control back, rather than just tuning the single-step loop to be faster
- If you compare harnesses: run each under both a paused clock and real time; the gap between them is how much the harness loses to latency, and it shows where the problem is better than a single success rate

---

## Paper 2 | Demystifying the Autoresearch Harness: What an Agent Should Remember and What It Should Forget

**Demystifying the Autoresearch Harness: How Context and Skills Shape Self-Evolving Agents**
Kelvin Kiu-Wai Tam, Newt Hue-Nam K. Nguyen, Tianshi Zheng et al. (The Hong Kong University of Science and Technology, The University of Tokyo, National Taiwan University, NVIDIA AI Technology Center)　·　arxiv: 2611.28244

Links: [arxiv](https://arxiv.org/abs/2611.28244) · [alphaxiv](https://www.alphaxiv.org/abs/2611.28244)

### TL;DR

Swapping one memory mechanism at a time inside the same agent, keeping an expandable digest per attempt is the most effective, and deleting lessons left unused for consecutive iterations is the best skill-management mechanism on average; combined as MLEvolver, they reach a 72.7% medal rate on MLE-Bench Lite.

### Editorial Assessment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint (not peer reviewed), submitted 2026-11-20 |
| Citation velocity | 5 days since posting; the Semantic Scholar query returned 429 (rate limited), so no citation data |
| Institutions | The Hong Kong University of Science and Technology, The University of Tokyo, National Taiwan University, NVIDIA AI Technology Center |
| Community response | Not checked: whether HuggingFace Daily Papers or Papers with Code list it |
| Credibility | Conditional pass — a clean one-variable-at-a-time design with results on three models and two benchmarks; but the tables read here carry no repeat counts or error bars, so small gaps (for example +1.6% for gpt-6-sol on MLE-Bench) should not be read as stable advantages |
| Evidence maturity | Preliminary — results point consistently one way, but the ablation uses only 10 MLE-Bench competitions and 50 KernelBench problems, with one implementation and one parameter setting per mechanism |
| Reproducibility | Partial artifacts — the appendix describes the MLE-Bench and KernelBench evaluation protocols and anti-reward-hacking checks; code release not confirmed in this review |
| Why this paper | Direct — how to manage context and a lessons library is a design decision in every self-improving loop |
| Novelty | Substantive increment — the mechanisms already exist; what is new is a head-to-head, one-variable-at-a-time comparison inside one harness |
| Why today | Medium — design principles you can try directly, but an engineering trade-off rather than a new capability |
| Practical link | Clear — you can map "folding" and "deletion" onto your own agent's history and lessons store |
| Editorial confidence | Medium — direction is consistent, but without error bars the claims are kept to "within the settings the paper tested" |
| Reading advice | Skim — for people building long-horizon self-improving agents, sections 4.2, 5.1 and 5.2 are enough |
| Main limitation | Conclusions depend on specific implementations and parameters (deletion threshold of 5, merge similarity of 0.8); the tables read here do not report repeat counts |

### Background

A self-improving research agent attempts the same task dozens to hundreds of times, receiving a score after each. The history soon overflows the context window and the lessons library grows noisy. Earlier systems (such as AIDE and OpenEvolve) tie search strategy to memory mechanism, so it is hard to know which mechanism contributes. This paper fixes the harness and swaps mechanisms one at a time.

### Walkthrough

- **Problem**: Imagine a lab assistant running 100 experiments in a row. If they only keep full notes on the last 6, earlier attempts simply vanish; if they merge all older notes into one "story so far" page, the detail gets worn away.
- **Method**: The baseline is recency truncation: drop the oldest when it does not fit. Two alternatives for context: folding (one digest per attempt, selectively expandable) and compaction (older records merged into a rolling summary). Three for the skill library: deletion (remove after 5 consecutive iterations without selection), merging (merge at embedding similarity of 0.8), and promotion (turn proven skills into standing rules included in every prompt).
- **Why it matters**: It shows that saving tokens is not the goal; whether individual history stays accessible is. Folding and compaction use about the same context (around 12.1k tokens on average) yet perform differently.

### Key Details

- Setup: three models, gpt-oss-120b, gpt-6-luna, gpt-6-sol; a fixed 32,000-token context budget; 100 iterations on each of 10 MLE-Bench competitions and 50 iterations on each of 50 KernelBench problems
- Folding is best in all six model-by-benchmark settings, +8.6% over baseline on average and up to +19.2% (gpt-6-luna, KernelBench); compaction averages only +0.3% and is slightly below baseline for gpt-6-sol on MLE-Bench (-1.7%)
- Late-stage new-best rate: folding 12.0%, baseline 10.2%, compaction 9.7%; folding keeps records of 42.0 attempts on average using about 12.1k tokens, while the baseline keeps 6.2 full attempts using 18.4k
- Skill management against baseline: deletion +4.1%, promotion +3.0%, merging +2.2%; on MLE-Bench with gpt-oss-120b, deletion leaves 31 skills at the end of a run versus 312 for the unmanaged baseline
- Model differences: skills selected per prompt are 6.4-7.1 for gpt-oss-120b, 1.2-1.9 for gpt-6-luna and 0.5-0.6 for gpt-6-sol; skill management also helps gpt-oss-120b more (averaged over the three mechanisms, 5.1% vs 1.9% for luna and 2.1% for sol)
- MLEvolver (folding plus deletion), against AIDE and OpenEvolve, all using gpt-6-sol and 100 iterations: medals in 16 of 22 MLE-Bench Lite competitions (72.7%) with 10 gold; on KernelBench Level 3, fast1 is 94% (47/50) and fast2 is 62% (31/50), with a final geometric-mean speedup of 2.99x against 1.85x for AIDE and 1.41x for OpenEvolve
- Limitation: the ablation and the MLEvolver comparison use different problem sets; skill classification and parameters are single settings

### Reviewer's One-Liner

Positive: changing one variable at a time, plus a chain of evidence for why individual history beats a rolling summary (new-best rate, number of attempts retained), makes the conclusion more than a ranking; to watch: no error bars were seen, and folding and deletion were each tested in only one implementation, so whether the ranking survives a different digest prompt or deletion threshold is unknown.

### Your Take-Away

- If your agent runs many attempts: before compressing history into a rolling summary, try one digest per attempt with "expand on demand", and compare the new-best rate on your own task
- If you have an accumulating lessons library: add a rule to remove a lesson after N consecutive unselected iterations, and look at library size and performance before deciding whether to add merging or promotion

---

## Paper 3 | When Tools Fail, Agents Fabricate: When a Tool Breaks, Agents Mostly Don't Fail, They Make Up an Answer

**When Tools Fail, Agents Fabricate: Silent Failure and Verification-First Oversight in Tool-Using LLM Agents**
Gün Kaynar, Boshen Yan, Carl Kingsford (Carnegie Mellon University)　·　arxiv: 2611.28341

Links: [arxiv](https://arxiv.org/abs/2611.28341) · [alphaxiv](https://www.alphaxiv.org/abs/2611.28341)

### TL;DR

Across 2,100 runs with injected tool faults, correct recovery was only 19-68% and 6-26% ended in a confidently wrong answer; faults that return partial data fabricate most, and a mostly code-based verifier cuts fabrication from 17.3% to 10.8%.

### Editorial Assessment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint (not peer reviewed); the authors' arXiv comment marks it as a NeurIPS 2026 Workshop paper ("Who Verifies the Agents?") |
| Citation velocity | 5 days since posting; the Semantic Scholar query returned 429 (rate limited), so no citation data |
| Institutions | Carnegie Mellon University |
| Community response | Not checked: whether HuggingFace Daily Papers or Papers with Code list it |
| Credibility | Pass — every run is graded against ground truth, and two judges are compared (kappa 0.91, versus only 0.58 for LLM-judged behavior categories); key numbers trace back to tables in the paper |
| Evidence maturity | Preliminary — 4 agents, 30 tasks, 9 fault types is a moderate scale; faults are injected through middleware, not real production incidents |
| Reproducibility | Full artifacts — the paper states it releases the testbed, the fault-injection toolkit and all annotated traces (GitHub: Kingsford-Group/RetryRealistic; the repo was not opened in this review) |
| Why this paper | Direct — tool-call errors happen in every deployed agent, and the paper measures how agents fail, not just how often |
| Novelty | Substantive increment — fault type and persistence are treated as independent variables, and "silent ingestion" is proposed as a testable mechanism |
| Why today | High — it bears directly on whether to add verification before the final answer, and what to verify |
| Practical link | Clear — compare against your own agent's tool return formats to find tools that return partial data without an error |
| Editorial confidence | Medium — effects point the same way, but the monitor is a stronger model than every tested agent |
| Reading advice | Must read — for people building tool-calling agents and evaluations |
| Main limitation | Only 4 agents tested; the monitor (Claude Sonnet 4.6) is stronger than every tested agent, and the paper itself notes the monitor and judge are strong proprietary models |

### Background

Most agent evaluations ask whether a task was completed and rarely control at which step and in what way a tool breaks, so it is hard to tell how an agent failed. A common assumption is that the agent retries repeatedly, gets confused by error messages, and finally invents an answer under budget pressure. This paper tests that assumption with controlled fault injection.

### Walkthrough

- **Problem**: Suppose you ask an assistant to total a report, and the database returns only half of the rows with no error. The assistant does not notice and reports "total: 32,000" when the true answer is 48,750. This is more dangerous than "the database is unreachable" because it looks like success.
- **Method**: RetryRealistic has agents complete 30 multi-step tasks with 8 tools over a real filesystem (with genuine permission enforcement), SQLite, a local HTTP server and a constrained shell, injecting one of 9 fault types at the first matching call. Grading always compares the final answer to ground truth, in three outcomes: correct, fabricated, honest failure.
- **Why it matters**: It shows the main cause of fabrication is not too many retries but believing partial data on first contact, so the fix belongs in verification, not in calling retries more times.

### Key Details

- Setup: four agents (Llama-3.1-8B, Llama-3.1-70B, DeepSeek-V4, Claude Haiku 4.5), 2,100 faulted runs; correct recovery ranges from 18.9% (Llama-8B) to 67.6% (DeepSeek-V4), and fabrication from 6-26% (5.5% for DeepSeek-V4, 19-26% for the other three)
- Fault type predicts the failure mode better than the model: partial_success, which returns truncated but plausible data, fabricates 38.3% of the time, while permission denials and required authentication end in honest failure 78.1% and 53.4% of the time; fault type explains 1.6x as much of the variance in fabrication as the model (eta-squared 0.061 vs 0.038)
- Testing the mechanism: when agents retried a visibly failing call 3 or more times, fabrication was only 7.0% and honest failure 82.2%; at 0-1 retries fabrication was 20.7%; on partial-data faults, in 554 of 609 runs (91%) the agent repeated the faulted call at most once, and 27.8% of those ended in fabrication
- Content-only control: holding injection point, target tool and persistence fixed and varying only the payload, misleading partial data gave 35.2% fabrication against 16.0% for a structurally identical explicit denial
- The monitor (Claude Sonnet 4.6): correct recovery rises from 45.6% to 56.3% and fabrication falls from 17.3% to 10.8%; the code-only variant gets 54.7% and 13.4%; it adds 6.4 monitor calls per run on average (the agent itself averages 11 steps)
- The monitor helps least where silent ingestion is strongest: on partial_success fabrication only drops from 38.3% to 32.1% (40.7% for the code-only variant), because truncated data raises no error and in 224 of 324 partial_success runs the monitor never acted
- Removing chain-of-thought raises fabrication from 17.3% to 25.6% (+8.3 percentage points); adding a "do not fabricate" honesty prompt only lowers it to 13.7% and barely helps on partial_success (38% vs 40%)
- Methodology: LLM judges agree on behavior category only 67% of the time (kappa 0.58), while grading the final answer against ground truth reaches 94% agreement (kappa 0.91)
- Limitations the authors state: constrained shell and mock HTTP; the recompute stage covers scalar aggregations only; the monitor and judge are strong proprietary models; in 118 of the faulted runs the fault never fired

### Reviewer's One-Liner

Positive: replacing LLM behavior classification with ground-truth grading, and locking the mechanism to silent ingestion with a content-only control, makes the inference sturdier than reporting failure rates alone; to watch: the monitor is stronger than every tested agent, and what effect and cost a same-tier model monitoring itself would have is not answered here.

### Your Take-Away

- If your agent calls tools that return partial results without raising an error (pagination, truncation, timeouts with partial data): first add completeness signals at the tool layer (total row count, a truncated flag), and before the final answer check that the numbers in it appear in tool outputs
- If you design evaluations: prefer objective final-answer-versus-ground-truth metrics over asking an LLM which kind of failure it was; the paper measured noticeably lower judge agreement for the latter

---

## Today's Takeaway

I used to treat agent performance as mostly a property of the model, with the harness as packaging. Today's numbers do not support that: with the same model, changing how output becomes actions moved success by about 30 points; changing how history is stored changed the ranking; changing what a tool returns turned failure from honest admission into invention. To judge whether an agent is good, the harness has to be evaluated as its own variable, not just the model.

## References

- [AutoPILOT: A Visual Agent Harness for Real-Time Gameplay (arXiv abstract page)](https://arxiv.org/abs/2611.28202)
- [AutoPILOT full text (arXiv HTML v2)](https://arxiv.org/html/2611.28202v2)
- [AutoPILOT project page](https://autopilot-harness.github.io/)
- [Demystifying the Autoresearch Harness: How Context and Skills Shape Self-Evolving Agents (arXiv abstract page)](https://arxiv.org/abs/2611.28244)
- [Demystifying the Autoresearch Harness full text (arXiv HTML v1)](https://arxiv.org/html/2611.28244v1)
- [When Tools Fail, Agents Fabricate: Silent Failure and Verification-First Oversight in Tool-Using LLM Agents (arXiv abstract page)](https://arxiv.org/abs/2611.28341)
- [When Tools Fail, Agents Fabricate full text (arXiv HTML v1)](https://arxiv.org/html/2611.28341v1)
- [RetryRealistic testbed and annotated traces (GitHub)](https://github.com/Kingsford-Group/RetryRealistic)
- [arXiv cs.AI daily announcement list](https://arxiv.org/list/cs.AI/new)
