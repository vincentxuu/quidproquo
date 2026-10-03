---
title: "AI Agent Arxiv Digest — 2026-10-04"
date: 2026-10-04
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's theme is three overlooked signals in agent systems — a skill handoff record can be swapped for a fake approval, half of a single benchmark score can be noise, and organizational memory may not want write-time compression at all"
tldr: "APEX lets attackers smuggle a fake approval record through a skill chain, pushing attack success above 50% across all 24 model-family combinations on SkillsBench and to 84.3% on GPT-5.4, while the original task's verifier score barely moves; Agents Are Systems, Not Models runs 8,640 trials and finds about 54% of the score variance from repeating the same configuration is pure noise, with the information given to an agent mattering more than a bigger model or budget; Mem++ shows organizational memory doesn't need an LLM call to compress documents at write time — storing documents whole and deciding at read time beats the strongest baseline by 8.0-13.1 points on OrgMemBench"
series:
  name: "AI Agent Arxiv Digest"
  order: 133
---

> 🌏 [中文版](/posts/daily/2026-10-04-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers each puncture a different piece of the assumption that "agent performance is what you can see." APEX shows that the handoff record between two Agent Skills can be swapped for a fake user-approval claim, letting an agent quietly take an action you never agreed to while the original task's verifier score barely changes. Agents Are Systems, Not Models runs the same configuration 8,640 times and finds that nearly half the resulting score variance is noise, not an effect of the configuration itself — which means the single benchmark number you usually see may tell you far less than it looks like. Mem++ attacks the same problem from the memory-system side: the mainstream habit of calling an LLM to compress a document into facts the moment it's written turns out to have a real cost, and simply storing the document whole and letting retrieval decide at read time beats several existing systems on organizational memory. Together, all three are making the same point: the scores and system behaviors that look normal — verifier pass rates, benchmark numbers, a memory system's apparent "intelligence" — all hide assumptions that need to be pulled apart before you can trust them.

## Terms Worth Knowing Before You Read

| Term | Plain explanation |
|---|---|
| Agent Skill | A reusable package of task instructions an agent reads and follows (e.g. a SKILL.md file); shareable and composable, like a plug-in instruction manual |
| Attack Success Rate (ASR) | The share of attempts where an attack gets the agent to do what the attacker wants; an ASR of 74.2% means roughly seven or eight out of ten tries succeed |
| Harness | The execution loop and infrastructure wrapped around a model — it dispatches tool calls and manages context. The model is just one component inside it |
| Write-time distillation vs. read-time selection | Write-time distillation compresses a document into facts or a summary with an LLM the moment it's stored; read-time selection stores the document whole and decides which version to use only when a question arrives |
| Calibration error | The gap between what an agent predicts its own score will be and its actual score; a positive value means the agent is overconfident |
| Reciprocal Rank Fusion (RRF) | A way to merge several retrieval results by combining their ranks (not raw scores) with weights, so different systems' scores never need to be normalized to the same scale |

---

## Paper One | How a Skill Chain Turns "Done" Into "Approved"

**Chaining Skills to Hijack LLM Agents**
Tian Dong, Zixuan Ma, Haodong Zhao et al. (The University of Hong Kong, with Shandong University, Shanghai Jiao Tong University, and Southeast University)　·　arxiv: 2610.01564

Links: [arxiv](https://arxiv.org/abs/2610.01564) · [alphaxiv](https://www.alphaxiv.org/abs/2610.01564)

### TL;DR

APEX gets an upstream skill to make the agent write a record claiming the task is "done and approved," then has a downstream skill act on that record to carry out an attacker-chosen action; across 24 model-family combinations on SkillsBench, attack success exceeds 50% in every one, reaching 84.3% on GPT-5.4, while the original task's verifier score changes by only 2.6 percentage points on average.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (cs.CR cross-listed cs.AI), not peer reviewed |
| Citation velocity | Published 3 days ago; Semantic Scholar API returned 429 (rate limit) throughout this round, citation count unavailable |
| Institution | The University of Hong Kong (lead), Shandong University, Shanghai Jiao Tong University, Southeast University |
| Community signal | Not on HuggingFace Daily Papers; the paper references internal supplementary scripts but no public GitHub repo was found |
| Credibility | Pass — six models, four targeted-action families plus one resource-exhaustion family, 690 attempts, with a formal information-theoretic analysis of the handoff and ablation studies |
| Evidence maturity | Substantial — multi-model, multi-family experiments plus formal propositions and a defense evaluation, but still a SkillsBench simulation, not an observed real-world incident |
| Reproducibility | Partial artifacts — the paper claims supplementary data and scripts exist, but no public link was found |
| Why selected | Direct — points straight at a handoff blind spot in the fast-growing Agent Skill supply chain (Claude Skills, various skill marketplaces) |
| Novelty | Substantive — turns the "task-progress record" itself into a vehicle for smuggling a fake approval claim, with a formal proof bounding how well any decision based only on that local record can distinguish approval from prohibition |
| Today's importance | High — the Agent Skill ecosystem is growing fast and almost no one is systematically checking this attack surface |
| Practical link | Clear — applies to any system that lets an agent load third-party skills and pass information between them through files or records |
| Editorial confidence | High — strongly supports the bounded claim that, under this threat model and test environment, skill chains can induce a high rate of unwanted actions while the native verifier score barely moves |
| Reading recommendation | Must-read — teams building or adopting Agent Skill ecosystems |
| Main limitation | Results are reported per experimental condition rather than per individual run, so a high condition-level utility score doesn't guarantee every single successful attack still left the task useful (Appendix A, authors' own note) |

### Background

Agent Skills let users and developers package repeatable task instructions into shareable, composable manuals, and a task often invokes several skills in sequence, with what one skill writes becoming the next skill's context. Prior work (ColluSkill, CompoSkill, SCR-Bench) already noticed that composing multiple skills can bypass a single skill's safety scanner, but none of it asked the more practical question: when a skill chain is under attack, how much of the user's original task still gets done?

### Mid-Level Walkthrough

- **The problem**: Imagine asking an agent to "summarize this report, but keep the original file." A malicious skill can nudge the agent, right after finishing the summary, to also write a record saying "summary done, source file approved for cleanup" — which looks like a normal byproduct of task progress. The next skill reads that record and deletes the original file on its basis. The user gets their summary, but the instruction to preserve the original has been violated.
- **The method**: APEX splits into a generation phase and a verification phase. Generation first identifies real work the agent can complete, then designs upstream instructions that have the agent write that work — together with the attacker's desired next step — into one record; downstream instructions then direct the agent to act on that record. Every candidate chain is actually run in an isolated environment, and the system distinguishes "the chain never connected" from "it connected but the agent didn't comply," revising only the stage that needs it. The paper also provides two formal results: when the "approved" and "prohibited" cases look identical in the local information an agent sees at the handoff, any rule that decides based only on that information has a false-approval-plus-false-denial rate that approaches certainty; and for attacks that send the agent back to repeat work, a finite-state model calculates the marginal effect of revisiting a given node on total token cost.
- **Why it matters**: This means "the original task's verifier score didn't drop noticeably" cannot by itself confirm an agent wasn't hijacked — an attacker can have the agent both finish the summary and carry out an action you never wanted. For any system that allows third-party skills, this is an attack surface almost nobody is systematically checking right now.

### Deep-Dive Points

- Across four targeted-action families plus one resource-exhaustion family (Work Loop), spanning 24 model-family combinations across six models, attack success rate exceeds 50% in every single one, ranging 54.8%-90.3% (512/690 overall, 74.2%)
- On GPT-5.4, the full chain reaches 84.3% ASR, compared with just 3.5% for "direct injection" (stating the goal in one skill) and 17.4% for a "monolithic" version that merges the whole workflow into one skill
- Original task verifier scores barely move: on GPT-5.4 the average change across all four families is just 2.6 percentage points, and the Output Tampering family only drops from 90.4% to 89.6% even at a 90.3% ASR
- The Work Loop resource-exhaustion attack pushes mean per-task token usage to 2.20x-36.39x the native baseline; on Claude Sonnet 5, a 21.33x token ratio comes with utility dropping from 78.8% to 42.5%, but on Kimi K2.6 a 36.39x token ratio barely dents utility at all — showing resource exhaustion and utility loss aren't the same thing
- The authors' own "request-checking" prompting defense lowers GPT-5.4's ASR from 84.3% to 59.1%, but also drops the pass rate on 72 benign native-skill tasks from 86.7% to 56.3%
- Limitation (Appendix A, authors' own words): results are aggregated per condition rather than per run, so a condition's high utility score cannot establish that every individual successful attack preserved useful work; the same task can appear in multiple attack families, so evaluations across families should not be treated as independent observations

### Reviewer's One-Line Take

The threat model and formal analysis are solid, and the proof that handoff information alone cannot establish approval is the paper's sturdiest contribution; but the evaluation is aggregated by condition rather than by individual run, so readers should note that "utility didn't drop" doesn't mean "this particular attack caused no damage," and the study only tests the authors' own threat model, not an attacker adapting to the proposed defense.

### Your Take-Away

- If you're building a system that loads third-party Agent Skills: don't rely on the original task's verifier score to judge whether the system is safe — separately check whether files or records handed off between skills are being used to impersonate user approval, which the verifier score cannot reveal at all
- If you're designing a cross-skill state-handoff mechanism: this paper's formal result gives you a test — if your approval decision only sees the local information available at the handoff, and the approved and prohibited cases look the same in that information, the mechanism is theoretically unable to block this class of attack, and the decision logic needs access to the original user request itself

---

## Paper Two | Agents Are Systems, Not Models: Half the Score You See From One Run Is Noise

**Agents Are Systems, Not Models: Rethinking Agentic Evaluation**
Luis Wiedmann, Leander Girrbach, Cordelia Schmid, Zeynep Akata (Technical University of Munich / MCML / Helmholtz Munich, with Inria, École normale supérieure, CNRS, PSL Research University)　·　arxiv: 2610.01618

Links: [arxiv](https://arxiv.org/abs/2610.01618) · [alphaxiv](https://www.alphaxiv.org/abs/2610.01618)

### TL;DR

Across four scientific tasks requiring an agent to operate a specialist model, running 432 configurations x 5 repeats = 8,640 trials shows that repeating the same configuration alone produces about 54% of the score variance as noise; and among five configurable axes, how much information the agent is given outranks both backbone model size and time budget.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (cs.AI), not peer reviewed |
| Citation velocity | Published 3 days ago; Semantic Scholar API returned 429 (rate limit) throughout this round, citation count unavailable |
| Institution | Technical University of Munich / MCML / Helmholtz Munich (lead), Inria, École normale supérieure, CNRS, PSL Research University (Cordelia Schmid) |
| Community signal | Not on HuggingFace Daily Papers; a GitHub repo exists but currently holds only a README — the authors commit to releasing code and 18,240 trajectories |
| Credibility | Pass — a full factorial design of 432 configurations x 5 repeats x 4 tasks, plus ablations across model families and open- vs. closed-weight models |
| Evidence maturity | Substantial — a large repeated-run design built specifically to quantify variance rather than just point estimates, but limited to four tasks across two scientific domains, and the authors flag that memory and multi-agent coordination are excluded as configuration axes |
| Reproducibility | Partial artifacts — the authors promise code, the benchmark, and 18,240 trajectories; the GitHub repo exists but held no code at the time of this reading |
| Why selected | Direct — directly challenges the assumption, implicit in almost every benchmark report, that a single run's score represents an agent's performance |
| Novelty | Substantive — a full factorial design systematically decomposes the effect and interaction of five configuration axes, backed by a new large-scale trajectory dataset and a behavior taxonomy |
| Today's importance | High — directly changes how a reader should interpret every other agent benchmark number they see |
| Practical link | Clear — gives a directly applicable priority order (information first, then budget, then a larger model) and shows that self-verification is better implemented in the system than requested through prompting |
| Editorial confidence | High — the 54%-noise figure comes directly from the repeated-run design itself, which is the most direct evidence this kind of claim can get |
| Reading recommendation | Must-read — anyone building or evaluating agent systems |
| Main limitation | Covers only four tasks across two scientific domains (astrophysics, genomics); the finding that "system design matters more than prompting" is demonstrated on only one behavioral dimension (self-verification), and the authors explicitly say it isn't yet a general principle |

### Background

Recent agent-evaluation work has started arguing that a single success rate isn't enough — cost, consistency, and robustness should be reported too — but this work typically still treats the agent itself as fixed. In practice an agent is a model plus a harness, and a user decides how much information to give it, whether to keep its reasoning, how strongly to demand self-verification, how much time to allow, and which backbone model to use — each choice can shift both performance and reliability, yet little prior work has systematically pulled apart the effect of each choice and how they interact.

### Mid-Level Walkthrough

- **The problem**: Imagine reading a benchmark report that says "our agent scored 70 on this task." How much should you trust that number? If the same team reran the exact same configuration the next day, would it land at 50 or 85? If it could swing that much, what does "70" actually tell you?
- **The method**: The team built four tasks requiring an agent to operate specialist astrophysics and genomics models, then systematically varied five configuration axes — how much information to give, whether to keep reasoning across steps, how strongly to require self-verification, how much time budget to allow, and how capable the backbone model is — forming 432 configurations, each run 5 times, for 8,640 trials total. They split the resulting score variance into "variance caused by the configuration" and "noise from repeating the same configuration," then analyzed which axis matters most and how axes interact.
- **Why it matters**: If even a fully fixed configuration, run repeatedly, produces half its score variance as noise, then any single-run benchmark number that doesn't report repeat counts and variance deserves a question mark. And "giving the agent more information" doesn't just raise the score — it simultaneously lowers cost, shortens runtime, and makes the agent's self-estimate more accurate, a rare improvement with no apparent trade-off, worth prioritizing.

### Deep-Dive Points

- Core finding: even counting only genuine attempts (excluding runs that clearly gave up), about 54% of the score variance from repeating the same configuration is pure run-to-run noise; including every run (not excluding give-ups), the noise share is even higher, with configuration differences explaining only 39.4% of variance (versus 46.1% after excluding give-ups)
- Ranking the five axes by effect size: "Information" ranks first on every one of the four tasks, and stays first in at least 99% of bootstrap resamples; on average "Reasoning" ranks second, "Budget" third, and "Verification" last
- Axes interact: for small and medium models, more time budget raises completion rate but lowers the score; for the large model, more time budget raises both — meaning extra time only helps once the agent already knows what to do or is capable enough to use it productively
- "Information" improves three things at once with no trade-off: higher score, lower cost, and smaller calibration error — at the fullest "protocol" level of information, both the mean and spread of calibration error drop sharply
- Asking an agent via prompting to verify its own answer barely changes its actual verification behavior (reference-based verification rises only from 19% to 22% from "none" to "binding," with about three-quarters of runs checking only format); but giving the agent an oracle tool it can call to check its score roughly triples the share of reference-based verification at every prompt level — suggesting this kind of behavior is better provided by the system than requested through the prompt
- On a task where the specialist model is actually weaker than the backbone (mmlu-astronomy), 99.8% of runs still use the weaker specialist, and even with an oracle tool available, performance doesn't improve substantially
- Limitation (Section 6, authors' own words): the analysis covers over 18,000 trajectories but is limited to four tasks across two scientific domains; it excludes memory and multi-agent coordination as further configuration axes; the finding that system design shapes behavior more than prompting is demonstrated on only one behavioral dimension (verification) and is not yet a general principle

### Reviewer's One-Line Take

Using a full factorial design with repeated runs specifically to quantify noise is this paper's sturdiest and rarest design choice — most agent-evaluation papers don't even report how much a single configuration's score swings on a rerun; but the scope is limited to four tasks in two scientific domains, and the headline "system design beats prompting" conclusion is currently verified on only one behavior (self-verification), still some distance from a general principle, as the authors themselves caution.

### Your Take-Away

- If you're reading any agent benchmark report (including this series' own past single-run comparisons): first check whether it reports repeat counts and variance; if it doesn't, treat the score with a question mark, because the variance from simply rerunning the same configuration can be as large as the effect of the configuration itself
- If you're prioritizing an agent system's design: first make sure the agent gets enough task information (how to operate the tools, what protocol to follow), then consider a larger time budget, and only then consider a stronger backbone model — and for behaviors you want the agent to exhibit, like self-verification, build them as a system-level tool (e.g., a checkable verification interface) rather than requesting them through the prompt

---

## Paper Three | Organizational Memory Shouldn't Flatten Documents at Write Time

**Mem++: Non-Destructive Memory for Long-Term Organizational LLM Agents**
Ahmad Yehia, Aly O. Abdelkareem, Islam Ahmed et al. (The University of Texas at Austin, with AIDAChip Inc.)　·　arxiv: 2610.02002

Links: [arxiv](https://arxiv.org/abs/2610.02002) · [alphaxiv](https://www.alphaxiv.org/abs/2610.02002)

### TL;DR

Mem++ stores every document whole, calling no LLM at write time, and uses weighted rank fusion at read time to select evidence from the full record for a given question; on the organizational-memory benchmark OrgMemBench, this design beats the strongest existing memory-system baseline by 8.0-13.1 points, though it still loses to plain RAG on "contradiction" and "cross-time reasoning" categories.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (cs.CL cross-listed cs.AI), not peer reviewed |
| Citation velocity | Published 3 days ago; Semantic Scholar API returned 429 (rate limit) throughout this round, citation count unavailable |
| Institution | The University of Texas at Austin, AIDAChip Inc. (startup) |
| Community signal | Not on HuggingFace Daily Papers; the official GitHub repo is public with a substantive architecture and results writeup |
| Credibility | Pass — a formal architecture definition, seven baselines, three benchmarks, two answering models, with ablations and a transparent "where it trails" disclosure |
| Evidence maturity | Preliminary — the method and ablations are clearly described, but the core organizational-memory claim rests on only 73 questions over one synthetic organization, the overall margin is only 2.6 points above RAG, and the method loses to RAG on the contradiction and cross-time reasoning categories |
| Reproducibility | Partial artifacts — benchmark evaluation code is public; the full system is promised "upon publication," not yet separately confirmed |
| Why selected | Direct — offers a concrete architectural choice for organizational memory systems: whether to compress documents with an LLM at write time |
| Novelty | Adaptation leaning substantive — reframes "should the memory system decide at write time or read time" as an explicit architectural choice, and uses ablations to show write-time LLM calls add no stable contribution |
| Today's importance | Medium — directly useful for teams building long-term or multi-author memory systems, but the validation scale isn't yet enough to call it "the best architecture" |
| Practical link | Clear — gives a directly applicable design principle (don't compress with an LLM at write time; store documents whole; reserve some read-time slots for the most recent documents) |
| Editorial confidence | Medium — supports the hedged claim that keeping documents whole and deferring selection to read time beats write-time distillation on the tested organizational and conversational benchmarks, but the 73-question synthetic benchmark and the categories where it loses to RAG mean the framing needs tempering |
| Reading recommendation | Skim for general readers; must-read for teams building multi-author organizational memory systems |
| Main limitation | The core organizational-memory evaluation rests on only 73 questions over one synthetic organization, which the authors acknowledge directly in their conclusion, noting future work will collect more diverse real organizational records |

### Background

Most existing agent memory systems are built for conversational memory: one person talks to an agent, and a later statement updates an earlier one, so overwriting the old fact is reasonable. Organizational memory is different — decisions are written independently by many different people across emails, tickets, and meeting notes, and a revised decision typically arrives as a new document rather than an edit to the old one. Existing systems (Mem0 resolves conflicts by overwriting; Zep uses a dated knowledge graph but stores only extracted facts) all make a structuring decision the moment a document is written, which means what questions can be answered is fixed before any question has actually been asked.

### Mid-Level Walkthrough

- **The problem**: Imagine an organization sets a policy in March, revises it in June, and reverses it in September — all three documents remain, because nobody goes back to delete the old ones. Someone now asks, "what was the reasoning behind the June revision at the time?" If each document was distilled into a handful of facts the moment it was written, the June version's reasoning, conditions, and approval trail may well have been lost in that distillation step.
- **The method**: Mem++ stores every document whole, with its date and author attached, calling no generative model at write time. To answer a question, the system first filters to documents valid as of the question's cutoff date, then ranks candidates through three indexes — lexical matching, author tags, and semantic vectors — and merges the three rankings with weighted reciprocal rank fusion, reserving a few slots for the most recent matching documents. Choosing between versions is left entirely to the answering model that reads these documents last; the system itself performs no inference.
- **Why it matters**: This means the shared assumption behind almost every existing system (Mem0, Zep, HippoRAG, GraphRAG) — that a memory system should structure information at write time — doesn't necessarily hold for organizational memory. Keeping the original text and deferring the decision to read time lets the system answer questions like "what did this decision replace" and "who approved it," which need the original context intact.

### Deep-Dive Points

- On OrgMemBench (443 documents, 157 threads, spanning 18 months, 73 questions), Mem++ with gpt-4.1-mini scores 57.6 overall, 2.6 points above the strongest baseline RAG (55.0) and 13.1 points above A-Mem; with gpt-4o-mini, the graph-augmented Memg++ variant leads at 44.4 and Mem++ is second at 44.2, both ahead of RAG's 43.4
- On "Supersession" questions, Mem++ scores highest with both answering models (67.7 and 57.0); the authors attribute this to every original document, with its date, remaining in the store — Mem0, which resolves conflicts by overwriting, scores only 40.8 and 32.3 on this category
- Mem++ does not win everywhere: on "Contradiction" questions, RAG beats Mem++ by 27.4-28.2 points; on "Bi-temporal reasoning" with gpt-4.1-mini, RAG also beats Mem++ by 16.7 points; every method scores below 23 on "Justification Chain"
- Ablations show removing the write-time "consolidation" or "fact-extraction" steps barely changes the score, confirming Mem++'s performance doesn't depend on write-time LLM calls; removing the semantic-vector retrieval leg drops the score by 35.7 points on OrgMemBench and 76.0 points on LongMemEval_S, the largest effect among the three retrieval legs
- On the conversational benchmark LoCoMo, Mem++ with gpt-4.1-mini reaches an average of 81.5, beating the existing method Nemori by 2.1 points, with a 3.8-5.9 point lead on "temporal reasoning" that the authors attribute to the recency-reserved slots
- Limitation (authors' own words in the conclusion): the core organizational-memory evaluation rests on only the medium tier of OrgMemBench's 73 questions, since public organizational-memory benchmarks are still scarce; the authors state future work will collect more diverse real organizational records to validate further

### Reviewer's One-Line Take

The design principle — do no structuring at write time, defer the decision to read time — is stated clearly, and the ablations are honest about the graph extension's inconsistent gains and the loss to RAG on contradiction questions; but the core organizational-memory claim rests on a single 73-question synthetic benchmark with only a 2.6-point margin, so it's still some distance from "this is the architecture organizational memory should use" without broader, more diverse validation.

### Your Take-Away

- If you're building a multi-author, long-accumulating organizational memory system (e.g. cross-department decision records, support-ticket history): ask yourself whether your write path calls an LLM to compress documents into facts or summaries. If it does, consider storing documents whole instead and filtering by the question's time range at read time — this paper's ablations show the write-time LLM call doesn't reliably add accuracy
- If you're evaluating an existing memory system: specifically test categories like "supersession" and "audit replay," which need to know what a decision replaced and who approved it, rather than just looking at an overall score — this is exactly where write-time-distillation systems most easily lose information, and where architectural differences show up most clearly

---

## Today's Takeaway

I used to think the main risk in agent systems was whether the model or the memory system was "smart enough." These three papers make clear that the more fundamental risk often hides in the signals you assume you can trust — a verifier score that may not move at all when an agent is hijacked, a single benchmark number where half the variance might be noise, and a memory system that seems considerate by "figuring everything out at write time" but may actually erase the answer right when you need the original context most. All three papers are asking the reader to do the same thing: pull apart what "looks normal" — the score, the system's behavior — before deciding whether it's a real signal.

## References

- [Chaining Skills to Hijack LLM Agents](https://arxiv.org/abs/2610.01564)
- [Chaining Skills to Hijack LLM Agents — alphaxiv](https://www.alphaxiv.org/abs/2610.01564)
- [Agents Are Systems, Not Models: Rethinking Agentic Evaluation](https://arxiv.org/abs/2610.01618)
- [Agents Are Systems, Not Models — alphaxiv](https://www.alphaxiv.org/abs/2610.01618)
- [Agents Are Systems, Not Models — official code and trajectories](https://github.com/lusxvr/rethinking-agent-evaluation)
- [Mem++: Non-Destructive Memory for Long-Term Organizational LLM Agents](https://arxiv.org/abs/2610.02002)
- [Mem++ — alphaxiv](https://www.alphaxiv.org/abs/2610.02002)
- [Mem++ — official code](https://github.com/AIDAChip-Inc/mem-plus-plus)
- [arXiv cs.MA 2026-10-02 announcement batch](https://arxiv.org/list/cs.MA/new)
