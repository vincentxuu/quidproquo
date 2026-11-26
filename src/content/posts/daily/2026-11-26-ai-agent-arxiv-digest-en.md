---
title: "AI Agent Arxiv Digest — 2026-11-26"
date: 2026-11-26
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Three papers approach the same layer from three angles — an agent's context and memory — where training can make it steadier, evaluation can be undone by its own instability, and once it's shared it can become an attacker's foothold"
tldr: "RECAP uses a behavior-distortion signal to train context compaction, beating task-reward-only RL by 4.6 and 4.3 points on deep research and software engineering tasks; an Adobe team ran the same 739 questions ten times each on a deployed agentic RAG system and found retrieval hit rate swinging between 69.4% (any run) and 50.9% (every run), with over half the divergence traced to retrieval planning, not generation; MIMPA shows that with only normal participation privileges, misleading content stored as a team's 'past success' in shared memory reaches a 79.5% attack success rate on TruthfulQA"
series:
  name: "AI Agent Arxiv Digest"
  order: 186
---

## Today's Overview

Today's three papers close in on the same question from three different angles: how much should we trust the context and memory an agent accumulates and shares? RECAP is the rare positive result — with the right learning signal, context compaction can fit long tasks into a much smaller window with almost no cost in accuracy. But an Adobe team's study of their own deployed system, run 7,390 times, shows that a single-run score for agentic RAG means almost nothing: the same question run ten times gives a retrieval hit rate that drifts between 50.9% and 69.4%, and most of that divergence originates in retrieval planning, not generation. MIMPA pushes this same fragility into security: once a multi-agent system stores "successful collaboration" in shared memory for reuse, an insider agent with nothing more than normal participation rights can make misleading content keep influencing the team under the credibility of "what the team already got right." The three papers differ in how mature their evidence is, but they point at the same thing: letting an agent remember and share context is both the most worthwhile capability to invest in today and the least honestly examined risk surface.

## Terms worth knowing before this one

| Term | Plain explanation |
|---|---|
| Context Compaction | Condensing an agent's interaction history into a summary so it can keep working within a limited context window |
| Behavior Distortion | A measure of how much the agent's behavior under a compressed context differs from its behavior under the original context; smaller means the summary preserved more |
| Agentic RAG | RAG where the agent itself decides what to search for, how many times, and when to stop, instead of retrieving once and generating |
| Any-run / Every-run accuracy | When evaluating an agent, "succeeded at least once in ten runs" and "succeeded in all ten runs" can be very different numbers |
| Shared Memory | A multi-agent system stores records of past successful collaborations and retrieves similar ones to reuse in later tasks |
| Attack Success Rate (ASR) | In adversarial testing, the share of originally-correct cases that get steered into the attacker's designated wrong answer |

---

## Paper One | RECAP: Training Agents to Compact Their Own Context by Preserving Behavior

**RECAP: Training Long-horizon LLM Agents with Context Compaction**
Yulun Jiang, Maria Brbic, Michael Moor et al. (EPFL + ETH Zurich) · arxiv: 2611.31258

Links: [arxiv](https://arxiv.org/abs/2611.31258) · [alphaxiv](https://www.alphaxiv.org/abs/2611.31258)

### TL;DR

Using "the compressed behavior should stay close to the original behavior" as a training signal, RECAP beats task-reward-only RL by 4.6 and 4.3 points on deep research and software engineering tasks under a 32K context limit, closing most of the gap to an uncompacted 128K window.

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint (not peer reviewed) |
| Citation velocity | Entered today's arXiv cs.CL /new batch; too fresh — repeated Semantic Scholar queries returned 429 (rate limited), no citation data available |
| Institution | EPFL + ETH Zurich |
| Community signal | Not found on HuggingFace Daily Papers / Papers with Code at the time of checking |
| Credibility | Pass — the body gives a full gradient derivation, two task environments (BrowseComp-Plus deep search, SWE-bench Verified software engineering), ablations isolating each learning signal's contribution, and generalization tests across context-window sizes |
| Evidence maturity | Preliminary — core results are backed by ablations and multiple baselines, but validated on a single 4B model and two task domains only, explicitly left to future work by the authors |
| Reproducibility | Partial artifacts — code is on GitHub, but the paper doesn't spell out every detail needed to re-run the exact training setup |
| Why this paper | Direct — context compaction is the most immediate engineering bottleneck for long-horizon agents, and this directly addresses how to train an agent to do it well |
| Novelty | Substantive — splits "what compaction should preserve" into a summary-level reward and a self-distillation signal for post-compaction actions, both computed without extra rollouts |
| Today's importance | High — nearly every production agent harness uses context compaction, and this gives a concrete, comparable training-side improvement |
| Practical link | Clear — usable as a reference for designing the training objective of a context-compaction module when RL-training agents |
| Editorial confidence | Medium — numbers are concrete and ablation-backed, but the sample is limited to one model scale and two task domains, so the claim's strength should stay within that scope |
| Reading recommendation | Must-read — directly relevant to teams training or fine-tuning long-horizon agents that must manage a context budget |
| Primary limitation | Only validated on Qwen3.5-4B across two task domains; it also carries an implicit premise that full-context behavior itself is worth preserving — if the original behavior already takes detours, compaction will just reproduce them more faithfully rather than fix them |

### Background

Context compaction is the most common way agent harnesses handle exceeding their context budget — condense history into a summary and keep going. Earlier approaches relied on hand-written summarization prompts or backed out a training signal from final task success, but in a long trajectory, the effect of one compaction can propagate through many later steps or even the next compaction, so task outcome alone gives an extremely sparse signal.

### Mid-level Walkthrough

- **The problem**: imagine a deep-research agent that's searched for 50 steps and is about to blow its context budget, so it has to compress its earlier search history into a summary and keep going. If the summary drops a key clue, every subsequent step drifts off course — but it takes several more steps before anyone notices, and by then it's unclear which compaction was to blame.
- **The method**: RECAP's core idea is that a good summary should keep the agent's subsequent behavior close to what it would have been with the full, uncompressed history. It compares behavior under the compressed context against behavior under the full context, measures the gap with KL divergence, and splits it into two training signals — the summary itself learns that a smaller gap deserves reward, while every post-compaction action is directly distilled from the full-context policy acting as teacher. Both signals are added to the task reward, with no extra rollouts required.
- **Why it matters**: context compaction no longer has to learn from the sparse signal of final task success alone — every single compaction now has a directly optimizable target, so the agent learns faster what kind of summary won't leave its later self lost.

### Key Findings

- BrowseComp-Plus (deep search): under the 32K limit, RECAP reaches 62.8% accuracy, 4.6 points above the task-reward-only baseline's 58.2%, closing to within 1.0 point of the uncompacted 128K baseline's 63.8% while using a quarter of the context length
- SWE-bench Verified (software engineering): under the 32K limit, RECAP reaches 51.1%, 4.3 points above the 46.8% baseline, approaching the uncompacted 128K baseline's 55.5%
- Ablation: adding only the summary-reward signal alone actually drops BrowseComp-Plus accuracy to 56.7%; adding only the self-distillation signal alone lifts it to 60.3%; combining both reaches 62.8% — the two signals are complementary
- Efficiency side effect: agents trained with RECAP use fewer tool calls and fewer total tokens on average, which the authors attribute to more consistent post-compaction behavior reducing redundant exploration
- Limitation: only validated on the single Qwen3.5-4B model scale and two task domains; whether this holds at larger scale, across more task types, and under multiple stacked compactions is explicitly left to future work

### Reviewer's Take

Turning "preserve behavior" into a KL-divergence training signal is a clean design with ablations that clearly isolate each component's contribution — a rare direct improvement to agent training methodology today. But the method carries an unexamined premise: that full-context behavior is itself worth preserving. If the agent already takes detours under full context, RECAP's current design will just teach the compressed version to reproduce those detours more precisely, not correct them.

### Takeaways for You

- If you're training or fine-tuning agents that need long-horizon context compaction: RECAP's behavior-distortion signal design (summary reward plus post-compaction self-distillation) is a more direct training-objective reference than backing out a signal from task outcomes alone
- If you're evaluating similar context-management papers: check first whether multiple model scales and task domains were tested, and whether the effect holds under multiple stacked compactions — these are the two gaps RECAP itself acknowledges

---

## Paper Two | Agentic Systems Need Multi-Run Evaluation: Retrieval Hit Rate Drifts Between 51% and 69% on the Same Question

**Agentic Systems Need Multi-Run Evaluation: A Study of Retrieval and Response Variability in a Deployed Enterprise RAG System**
Karan Gupta, Sumit Bhatia, Yunyao Li (Adobe) · arxiv: 2611.31266

Links: [arxiv](https://arxiv.org/abs/2611.31266) · [alphaxiv](https://www.alphaxiv.org/abs/2611.31266)

### TL;DR

Running 739 questions ten times each on a deployed enterprise agentic RAG system, retrieval hit rate is 69.4% under "succeeded at least once" but drops to 50.9% under "succeeded every time," and over half (53.5%) of attributable divergence between runs originates in retrieval planning, not generation.

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint (not peer reviewed) |
| Citation velocity | Entered today's arXiv cs.CL /new batch; too fresh — repeated Semantic Scholar queries returned 429, no citation data available |
| Institution | Adobe (Noida, India + San Jose, USA) |
| Community signal | Not found on HuggingFace Daily Papers / Papers with Code at the time of checking |
| Credibility | Pass — 739 questions × 10 runs (7,390 executions total) on a real deployed system, a clearly specified setup and statistical method, with a full six-point Limitations section at the end |
| Evidence maturity | Substantial — the core divergence-attribution finding rests on objective Hit matching and trace comparison, not an LLM judge; but the secondary finding that the agentic system is "more comprehensive but less grounded" rests on an unvalidated GPT-4o judge, so that part is less mature |
| Reproducibility | Not provided — this is an internal study of a single deployed system; no code or dataset release found |
| Why this paper | Direct — directly challenges the common industry practice of treating a single agent run as a performance score |
| Novelty | Substantive — the first to quantify, with trace-level attribution, exactly which step two runs first diverge at, rather than just noting that variance exists |
| Today's importance | High — nearly every agentic RAG system's reported performance number comes from a single run, and this shows that practice can hide serious reliability problems |
| Practical link | Clear — the number of parallel searches issued at the first retrieval step alone explains 20.1% of divergence, giving teams a concrete place to check in their own retrieval planning logic |
| Editorial confidence | High — the paper clearly separates how strong the evidence is for "divergence attribution" versus the "quality trade-off" finding, and proactively flags that the LLM judge was never validated against humans |
| Reading recommendation | Must-read — directly relevant to any team evaluating or reporting performance numbers for an agentic RAG system |
| Primary limitation | The grounding/comprehensiveness comparison relies on a GPT-4o judge never validated against independent human annotation; this does not undermine the core finding — that divergence originates in retrieval planning — which rests on an objective Hit metric |

### Background

RAG systems have mostly been scored from a single run; agentic RAG adds a layer where the agent itself decides how many times to search, how, and when to stop — decisions that are sampled, so the same question run twice can take entirely different retrieval paths. Existing RAG evaluation tools measure faithfulness, relevance, and other single-output-quality dimensions; none of them measure whether that score would still hold if you ran it again tomorrow.

### Mid-level Walkthrough

- **The problem**: imagine asking an enterprise documentation agent to describe "the admin and usage reporting type for Product B." It might issue four parallel searches this time (including audit logs), and only three the next (focused on admin reporting types) — same question, different retrieval results, possibly a different answer. If you run it once and compare that score across two system versions, you have no idea whether the number reflects luck or a real improvement.
- **The method**: the authors ran 739 questions ten times each (7,390 executions total) on the deployed system, logging the full trace of each run. They separately compute "succeeded at least once" (69.4%) and "succeeded every time" (50.9%); the 18.5-point gap between them is the run-to-run instability. They then trace-compare 45 pairwise response combinations per question, find the first step where two runs act differently, and classify it as routing, retrieval, reasoning, trace depth, or generation.
- **Why it matters**: over half (53.5%) of attributable divergence originates in retrieval planning, and the number of parallel searches issued at the very first retrieval step alone explains 20.1% of it — what many assume is generation-level instability actually starts much earlier, in the agent's decision about how to search.

### Key Findings

- Retrieval hit rate: 69.4% under any-run, 50.9% under every-run, 61.5% per-run on average — an 18.5-point spread, meaning no single number represents the system's true reliability
- Across 8,092 divergent response pairs, retrieval planning accounts for 43.9% (the number of parallel searches at the first round alone explains 20.1%), reasoning 17.0%, and generation (identical retrieval pipeline, different final text) 18.0%
- Agentic vs. a non-agentic baseline (retrieve once, then generate): retrieval hit rate is nearly identical (61.5% vs. 61.8%), but the agentic system scores 22.6 points higher on comprehensiveness and 12.8 points lower on groundedness — searching more doesn't mean a more reliable answer, it's a trade-off between coverage and staying close to the source
- In 185 of the divergent pairs, two runs with an identical retrieval pipeline produced directly contradictory factual claims; the authors stress this isn't a surface wording difference but genuinely conflicting information delivered to the user
- Limitation: the ground-truth documentation URL is used as a proxy for retrieval correctness (which can miss cases that were answered correctly from a different page), and the agentic-vs-non-agentic quality comparison relies on a GPT-4o judge never validated against human annotation

### Reviewer's Take

7,390 real deployed executions plus trace-level attribution is a rare empirical study that pins run-to-run variance down to a specific pipeline step, and the methodology section is admirably honest about its own limits. But this studies a single enterprise system in a single setting, so whether "divergence mostly comes from retrieval planning" generalizes to other agentic RAG architectures is still unknown.

### Takeaways for You

- If you report or compare performance numbers for agentic RAG systems: don't run once and compare scores across versions — run the same question multiple times and check the any-run/every-run gap, or you may mistake noise for improvement
- If you're designing retrieval logic for agentic RAG: check first whether a planning decision like "how many parallel searches to issue in the first round" has been accidentally randomized — this paper shows that one decision alone explains a fifth of run-to-run divergence, and it's a relatively easy thing to make deterministic by design

---

## Paper Three | MIMPA: When "Successful Collaboration" Gets Stored in Shared Memory, It Becomes a Persistent Channel for Insiders

**When Successful Collaboration Becomes an Attack Surface: Insider Memory Poisoning in Multi-Agent Systems**
Jihyung Ahn, Buru Chang (Korea University) · arxiv: 2611.31307

Links: [arxiv](https://arxiv.org/abs/2611.31307) · [alphaxiv](https://www.alphaxiv.org/abs/2611.31307)

### TL;DR

In a multi-agent debate system, using only normal participation privileges and no direct memory access, a malicious agent can embed a targeted payload inside a collaboration record that actually answered correctly, which later gets retrieved and steers benign agents to the attacker's designated wrong answer — reaching a 79.5% attack success rate on TruthfulQA, far above existing insider attacks' 18.1%.

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint (not peer reviewed, cs.MA) |
| Citation velocity | Entered today's arXiv cs.MA /new batch; too fresh — repeated Semantic Scholar queries returned 429, no citation data available |
| Institution | Korea University |
| Community signal | Not found on HuggingFace Daily Papers / Papers with Code at the time of checking |
| Credibility | Pass — a full cross of 3 benchmarks × 2 backbones × 2 memory settings, decomposed into Storage/Retrieval/Influence stage contributions, with an auditing-agent test and ablations; code is public |
| Evidence maturity | Preliminary — core ASR numbers are backed by full ablations, but the threat model assumes a strong premise — that the attacker already knows the future target task and the designated wrong answer — and the paper doesn't test what happens without that foreknowledge |
| Reproducibility | Full artifacts — code is public on GitHub, with the full task sequence, payload design, and prompts |
| Why this paper | Direct — it directly exposes how "reusing shared memory," an increasingly common multi-agent design, is itself a security hole |
| Novelty | Substantive — unlike prior memory-poisoning attacks like AgentPoison or MINJA, the payload here is planted through normal collaboration rather than direct memory-write access, and it's the first to quantify the gap between "saying it directly" and "saying it through memory" |
| Today's importance | High — memory-augmented multi-agent systems are becoming more common, and this shows that even a normal participant, with no extra system access, can run a long-lived attack |
| Practical link | Clear — G-Memory (hierarchical memory management) reduces but doesn't eliminate the attack, and an auditing agent only partially catches it; a concrete design warning for teams adopting shared memory |
| Editorial confidence | Medium — the attack is validated within a simulated multi-agent debate framework and a fixed task sequence; whether a real production system's unpredictable task sequence would let an attacker plan this far ahead is untested |
| Reading recommendation | Must-read — directly relevant to teams designing or adopting shared-memory mechanisms for multi-agent systems |
| Primary limitation | The threat model assumes the attacker already knows the future target task and the wrong answer to induce, and can pick semantically similar past tasks to plant the payload in; without that foreknowledge, task selection becomes closer to guessing, and the Storage/Retrieval success rates could drop substantially |

### Background

Prior insider-attack research on multi-agent systems focused on a malicious agent misleading teammates directly during the current discussion — information that's still attributable to one agent and can be challenged by the others. But more systems now store records of past successful collaborations in shared memory and retrieve similar ones for reuse, giving misleading information a chance to resurface under a different identity.

### Mid-level Walkthrough

- **The problem**: imagine a three-agent team answering a medical multiple-choice question, where one agent is secretly malicious — it answers a prior question correctly while slipping in a plausible-looking "correction" that's actually misleading. The team got that question right, so the exchange gets stored as a "success" in memory. Three questions later, the team hits a similar question, and the system automatically pulls up that past success — the misleading note no longer looks like one agent's opinion, it looks like something the team already got right, which carries far more weight.
- **The method**: MIMPA works in three steps: design a payload that only triggers in a specific context (a signature that locates the target task, a correction that gives the designated wrong answer, and a scope that limits it to that target so it doesn't disrupt the current task); answer a past task that's semantically close to the future target task correctly while slipping the payload into the response, so the record gets stored successfully; and when the target task later arrives and the system retrieves that record, the attacking agent can further amplify the effect by explicitly pointing out that the stored record applies to the current case.
- **Why it matters**: the attacker needs no additional system privileges at all — just the standing of a normal participant — to make misleading content wear the credibility of "what the team already got right" and keep influencing later tasks, an effect far stronger than simply saying the same thing directly in the moment.

```diagram
title: The MIMPA attack chain: how trusted memory becomes an attack surface
desc: A malicious agent plants a targeted payload while correctly solving a planting task, and the poisoned record is stored in shared memory; a later target task retrieves it, the malicious agent cites it, and the benign agent switches to the designated wrong answer
caption: The four stages defined by MIMPA (Ahn and Chang, 2026): storing maps to Storage, retrieval maps to Retrieval, citing maps to Triggering, and switching maps to Influence
step: The malicious agent answers the planting task correctly while hiding the payload in the collaboration record, which gets stored in shared memory
step: A later target task triggers retrieval, and shared memory returns the poisoned record to the benign agent
step: The malicious agent actively points out that this record applies to the current task
step: The benign agent trusts this "past success" and switches to the attacker's designated wrong answer
---
<svg viewBox="0 0 640 400">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="312"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="312"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="312"/>

  <g data-step="1">
    <path class="dg-line" d="M96 140H316" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="206" y="128" text-anchor="middle" dominant-baseline="central">Plants payload</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M320 220H540" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="432" y="208" text-anchor="middle" dominant-baseline="central">Gets retrieved</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M96 280H540" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="200" y="268" text-anchor="middle" dominant-baseline="central">Cites record</text>
  </g>

  <rect class="dg-box" x="8" y="24" width="176" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">Malicious Agent</text>

  <rect class="dg-box dg-box--accent" x="232" y="24" width="176" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">Shared Memory</text>

  <rect class="dg-box" x="456" y="24" width="176" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">Benign Agent</text>

  <g data-step="4">
    <rect class="dg-box dg-box--accent" x="454" y="332" width="180" height="60" rx="6"/>
    <text class="dg-label" x="544" y="354" text-anchor="middle" dominant-baseline="central">Gives the</text>
    <text class="dg-sub" x="544" y="376" text-anchor="middle" dominant-baseline="central">poisoned answer</text>
  </g>
</svg>
```

### Key Findings

- On TruthfulQA, under the basic memory setting MIMPA's attack success rate (ASR) reaches 79.5%, far above existing attacks' MAC Attack (18.1%) and AutoTransform (14.5%)
- Stage breakdown: Storage (record successfully stored) succeeds 94.7%-100% of the time; Retrieval (retrieved for the target task) succeeds 86.6%-100% under the basic setting; Influence (the answer actually changes) is the main bottleneck — only 38.0% on MMLU-Pro (where agents can re-derive the answer and resist more), but over 80% on both TruthfulQA and MedMCQA
- Ablation: removing memory poisoning and stating the same correction directly during the target task drops ASR sharply to 3.6%-18.1%, showing the same content is far more effective "said through memory" than "said directly"; removing the triggering amplification (not participating in the target task) still leaves meaningful ASR (22.9%-60.2% under the basic setting), showing the memory itself carries influence
- Against an auditing agent that reviews collaboration records after the fact, ASR drops but doesn't disappear — on MedMCQA, ASR after auditing is still 67.2%, because misleading content in that domain relies on specialized knowledge that's hard to verify from the transcript alone
- Limitation: the attacker is assumed to already know the future target task and the wrong answer to induce; hierarchical memory management (G-Memory) drops retrieval success from 86.6%-100% to 51.3%-58.3%, but doesn't eliminate the attack entirely

### Reviewer's Take

Three benchmarks, two backbones, two memory settings, plus an ablation and an auditing-agent test — this has the most complete methodology of today's three papers, and the clean "said through memory vs. said directly" comparison nails down that the attack's mechanism really is a credibility transfer from memory. But the entire threat model assumes the attacker has considerable foreknowledge of future tasks, and whether that holds in a real production system where the task sequence isn't planned in advance is something the paper doesn't test.

### Takeaways for You

- If you're designing or adopting a shared-memory mechanism for multi-agent systems: don't assume "the collaboration succeeded" means "the content is trustworthy" — this paper shows that the label "this worked before" alone can massively amplify misleading content's influence, so you need content-level verification at write or retrieval time, not just a task-success check
- If you're evaluating how effective an auditing or monitoring mechanism is: test it specifically on knowledge-intensive domains that are hard to verify from the transcript alone (like MedMCQA here) — this paper shows auditing's catch rate drops notably in exactly that setting

---

## Today's Takeaway

I used to think "context compaction," "evaluation methodology," and "memory security" were three agent-engineering problems at different stages of maturity, each worth improving on its own; today's lineup changed how I see it — they're all circling the same layer: how an agent handles and shares the history it has seen. RECAP proves that layer can be trained to be better, but "better" carries an untested premise (that full-context behavior is itself worth preserving); the multi-run evaluation study shows that layer's instability in real deployment is enough to make a single-run score meaningless; and MIMPA shows that once this layer is designed to be shared and reused, it stops being an efficiency optimization and becomes a channel an attacker can live in for a long time. Memory and context aren't just one component of an agent's architecture — they're simultaneously the most worthwhile capability to invest in today and the least honestly examined risk surface.

## References

- [RECAP: Training Long-horizon LLM Agents with Context Compaction](https://arxiv.org/abs/2611.31258)
- [RECAP code (GitHub)](https://github.com/eth-medical-ai-lab/recap)
- [Agentic Systems Need Multi-Run Evaluation: A Study of Retrieval and Response Variability in a Deployed Enterprise RAG System](https://arxiv.org/abs/2611.31266)
- [When Successful Collaboration Becomes an Attack Surface: Insider Memory Poisoning in Multi-Agent Systems](https://arxiv.org/abs/2611.31307)
- [MIMPA code (GitHub)](https://github.com/ahnji0520/MIMPA-code)
- [arXiv cs.AI new submissions](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL new submissions](https://arxiv.org/list/cs.CL/new)
- [arXiv cs.MA new submissions](https://arxiv.org/list/cs.MA/new)
