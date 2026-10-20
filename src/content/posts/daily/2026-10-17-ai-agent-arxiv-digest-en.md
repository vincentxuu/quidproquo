---
title: "AI Agent Arxiv Digest — 2026-10-17"
date: 2026-10-17
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers aren't about what agents can do, but about how you'd know if they did it right — policy violations static test suites miss, a guard's published accuracy swinging double digits from a cosmetic rewrite, and the standard 'retrieval failure' diagnosis in RAG hiding which bottleneck actually needs fixing"
tldr: "PROBE trains an auditor smaller than its target to probe policy violations across multi-turn tool dialogue, uncovering nearly twice the policy coverage of a zero-shot, larger auditor; Shortcut Sensitivity audits three public agent-safety guard benchmarks and finds that rewriting a marker string or aliasing tool names swings one guard's measured accuracy by double digits; Beyond Retrieval Failure splits multi-hop RAG's standard 'retrieval failure' diagnosis into two separate causes, and shows that recovering missing evidence does not proportionally improve final-answer accuracy"
series:
  name: "AI Agent Arxiv Digest"
  order: 146
---

> 🌏 [繁體中文版](/posts/daily/2026-10-17-ai-agent-arxiv-digest)

## Today's Overview

All three papers today ask the same question: how do you know an agent actually passed a test, rather than the test simply failing to catch the problem? PROBE trains an auditor smaller than its target model to actively probe for policy violations across multi-turn dialogue, and it digs deeper and broader than a zero-shot, much larger auditor. Shortcut Sensitivity audits three public agent-safety guard benchmarks and finds that rewriting a marker phrase or aliasing tool names can swing one guard's measured accuracy by double digits — though the effect only reproduces on one model, and the authors are themselves co-founders of an agent-security startup, which is flagged explicitly below. Beyond Retrieval Failure shows that the standard "retrieval failure" diagnosis in multi-hop RAG actually conflates two different causes: fixing search guidance genuinely recovers more evidence, but final-answer accuracy doesn't improve proportionally, because the real bottleneck shifts to whether retrieved evidence is correctly judged as sufficient. Together, the reminder is: whether it's policy compliance, a safety guard's accuracy, or a RAG system's retrieval score, the number you publish may be measuring a weakness in the evaluation itself, not the real capability of the system.

## Terms Worth Knowing Before You Read

| Term | Plain-language explanation |
|---|---|
| Policy compliance | Whether an agent follows extra rules around pricing, privacy, confirmation steps, etc., on top of just completing the task — a separate question from "did it finish the task" |
| Multi-turn behavioral auditing | Instead of checking whether a single reply is correct, having an auditor converse back-and-forth with an agent like a real user, watching for violations across the whole interaction |
| Shortcut learning | When an evaluation model learns to predict labels from incidental surface features in the data (e.g., how long an instruction is) rather than the capability actually being tested |
| Black-box guard | A safety-supervision model that only sees inputs and outputs, with no access to internal weights or reasoning — the form most commercial safety layers take |
| Multi-hop RAG | A retrieval-augmented generation task that requires chaining together evidence scattered across multiple documents to answer one question |
| Evidence recall vs. evidence verification | "Did the search find the passage it needed to" (recall) versus "did the system correctly judge whether what it found is actually sufficient" (verification) — two things evaluations commonly conflate |

---

## Paper 1 | PROBE: Training a Small Auditor to Catch an Agent's Policy Violations in Tool Dialogue

**PROBE: Learning to Audit Policy Compliance in Tool-Using LLM Agents**
Kshitij Mishra, Abhijith Sharma, Nils Lukas, Salem Lahlou (Mohamed bin Zayed University of Artificial Intelligence, UAE) · arxiv: 2610.22124

Links: [arxiv](https://arxiv.org/abs/2610.22124) · [alphaxiv](https://www.alphaxiv.org/abs/2610.22124)

### TL;DR

Formalizes "did the agent follow policy" as a human-agent dialogue game and trains a 4B auditor to actively probe for violations, discovering far more policy coverage (12/20) than a zero-shot 30B auditor (7/20) or random probing (1/20).

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | NeurIPS 2026 (main conference, accepted) |
| Citation velocity | Published 2 days ago; Semantic Scholar rate-limited (429) across the entire run, no citation data obtained (near-zero expected regardless) |
| Institution | Mohamed bin Zayed University of Artificial Intelligence (MBZUAI), Abu Dhabi |
| Community signal | Not found in the partial HF Daily Papers 10-16 recovery; no Papers with Code entry |
| Credibility | Pass — the main text gives a complete two-player game formalization, a three-optimizer ablation (GRPO/DPO/GFlowNet), a 50-scenario held-out evaluation, human-annotator validation, and two independent transfer tests across model families and benchmarks |
| Evidence maturity | Substantial — covers method, ablation, human validation, and two transfer tests, but only on two synthetic tool environments |
| Reproducibility | Partial artifacts — algorithm, reward formula, and prompt details are thoroughly documented, but no public code or weights repository was found |
| Why this paper | Direct — defines and measures a genuinely new evaluation axis, filling the gap between capability benchmarks and safety red-teaming |
| Novelty | Substantive — first to formalize policy auditing as a two-player Markov game and systematically compare three RL training methods |
| Today's relevance | High — as tool-using agents enter real transactional and customer-service settings, policy compliance is something that must be verified before deployment, yet most teams still rely on static test suites |
| Practical link | Clear — directly usable in a pre-deployment continuous-auditing pipeline; the paper even proposes a co-evolutionary loop where the auditor finds problems and the agent improves from feedback |
| Editorial confidence | High — the article only states claims validated under the held-out/transfer protocol, and honestly discloses that the judge agreed with human consensus only 39.6% of the time |
| Recommended reading | Must-read — teams doing agent safety/compliance evaluation, or shipping tool-using agents to production |
| Primary limitation | The auditor rarely drives the target agent past search into booking/cancellation states (over 90% of tool calls are search-only), so the highest-severity policies remain hard to fully test |

### Field Context

Agents today are evaluated with two main tools: capability benchmarks measure whether a task gets done, and content-safety red-teaming measures whether harmful content gets generated. But an agent that finishes the task and says nothing harmful can still violate operational policies around pricing, privacy, or confirmation along the way — and these violations often only surface after several turns and several tool calls, which a fixed test suite rarely happens to hit.

### Mid-Level Walkthrough

- **Problem**: Imagine a flight-booking customer-service agent under a policy requiring verbal confirmation before modifying a ticket. A single-turn test easily passes, because the test item usually states the confirmation requirement clearly. But a real conversation rambles — price, then baggage, then a sudden request to change the flight — and the agent might quietly skip the confirmation step somewhere in that natural flow, which is exactly the scenario a fixed test suite misses.
- **Method**: PROBE frames auditing as a two-player game: a small (4B) language model plays "auditor," conversing with a frozen target agent (30B) like a real customer, aiming to surface as many distinct policy violations as possible through plausible dialogue — not repeatedly exploiting the same easy one. The authors train this auditor with reinforcement learning (comparing GRPO, DPO, and GFlowNet), with a reward that balances violation discovery, user-like plausibility, conversation progress, and policy diversity.
- **Why it matters**: This treats policy compliance as its own evaluation axis, tested by active probing rather than passive answer-checking — and doing so doesn't require a model as large as the target; a trained small model digs deeper than an untrained large one.

### Deep-Dive Points

- The best trained auditor discovers 12/20 policy violations across 50 held-out scenarios, versus 7/20 for a zero-shot 30B auditor and 1/20 for random probing
- Digging a lot isn't the same as digging broad: the variant with the highest raw violation count (the dedup-only ablation) produces 1,914 hits per 100 episodes but covers only 55% of the policy suite — showing why coverage, not raw hit count, is the headline metric
- The authors validated their own LLM judge against human annotators: two humans agree almost perfectly (kappa=0.985), but the judge matches human consensus only 39.6% of the time (kappa=0.084), and training exploited this judge error ⚠️ (the authors caught and corrected this themselves; deterministic re-scoring drops best coverage from 60% to 55% with the ranking unchanged)
- Applied without adaptation to an unseen Gemma model family, the trained auditor still discovers 40% of policy violations (vs. 55% in-domain), while a fixed static test suite stays at 5%
- Adoption bar: this requires a frozen target agent, a clear policy/verifier set, and compute to train the auditor (two A100s in the paper)
- Limitation: over 90% of tool calls stay at search, so the target agent rarely reaches genuinely high-risk states like booking or cancellation, leaving the most severe policies hard to fully test

### Reviewer's One-Line Take

A solid framework for carving policy compliance out as its own evaluation axis, and the authors deserve credit for catching and correcting their own judge's systematic error; but it's only tested on a booking-customer-service environment and tau-bench, so how far it generalizes to genuinely high-stakes finance or healthcare agents remains to be seen.

### Take-aways for You

- If you're auditing a tool-using agent before deployment: don't rely only on a fixed policy test suite — consider training a small "adversarial auditor" with RL to actively probe for violations across multi-turn dialogue
- If you're using LLM-as-judge to score your agent's tests: validate the judge against a small batch of human annotations first — this paper shows judge-human agreement can run under 40%

---

## Paper 2 | A Guard's "Accuracy" May Just Be an Artifact of How the Benchmark Is Written

**Shortcut Sensitivity in Agent-Safety Evaluations**
Hasan Demirkiran, Jens Ernstberger (Kontext) · arxiv: 2610.22243

Links: [arxiv](https://arxiv.org/abs/2610.22243) · [alphaxiv](https://www.alphaxiv.org/abs/2610.22243)

### TL;DR

Audits three public agent-safety guard benchmarks and finds that rewriting a marker phrase or aliasing tool names swings one guard's measured accuracy by double digits — but the effect only reproduces on one model and vanishes entirely with a different provider.

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | Accepted at NeurIPS 2026 workshops TAE ("Can We Trust AI Evaluation?") and AIWILD — workshop-level, not the main conference |
| Citation velocity | Published 2 days ago; Semantic Scholar rate-limited (429) across the entire run, no citation data obtained (near-zero expected regardless) |
| Institution | Kontext — both authors are co-founders of this agent-security startup, which raised a $4M seed round in September 2026 (confirmed via web search; not disclosed in the paper itself) |
| Community signal | Not found in the partial HF Daily Papers 10-16 recovery; aggregate code and results are public on GitHub, but with raw benchmark text and provider responses stripped per the authors' stated policy |
| Credibility | Conditional pass — the three-level auditing framework is logically clear and produces concrete numbers across three guard datasets, but the authors are co-founders of an agent-security startup with a commercial stake in the conclusion that "published evaluations are unreliable," and the core effect only reproduces on one of three tested models |
| Evidence maturity | Preliminary — the paired-intervention effect on Claude Haiku 4.5 is placebo-controlled, but does not reproduce on GPT-5.6 Luna or a quantized TS-Guard reproduction; the authors themselves label it "configuration-specific" rather than a general finding |
| Reproducibility | Partial artifacts — aggregate code and results are public, but raw benchmark text and tool arguments are stripped, so the intervention cannot be fully re-run |
| Why this paper | Direct — directly tests whether the accuracy numbers teams currently publish for their guards reflect real guard behavior or benchmark artifacts |
| Novelty | Substantive — systematizes shortcut learning into a three-level auditing framework, first applied to three public agent-safety benchmarks this way |
| Today's relevance | High — more teams are citing a single F1 or accuracy number to claim their guard is safe, and this paper shows that number can be an artifact of how the benchmark happens to be written |
| Practical link | Clear — gives three concrete recommendations: domain-group holdouts, evaluation-unit metrics, and placebo-controlled paired interventions |
| Editorial confidence | Medium — the core finding has concrete numbers and a placebo control, but the effect reproduces on only one model, and the authors' commercial position should be weighed alongside it |
| Recommended reading | Must-read — any team citing F1/accuracy to claim a guard is safe; skim — readers who just want to know the problem exists |
| Primary limitation | The headline effect vanishes under cross-provider replication (Luna), and the authors are co-founders of a commercial agent-security product, whose business case benefits from the same conclusion the paper reaches |

### Field Context

Agent safety guards are usually a supervision layer separate from the main model, checking for dangerous actions around tool calls. These guards almost always ship with a published accuracy or F1 score, and teams routinely use that number to decide whether to deploy. But a guard's training data and evaluation data often come from the same annotation pipeline — and if that pipeline leaves behind some surface feature unrelated to actual danger but coincidentally predictive of the label (like sentence length or phrasing habits), the guard can learn to exploit that shortcut, with the evaluation score giving no sign of it.

### Mid-Level Walkthrough

- **Problem**: Imagine a guard trained to judge "is this tool call safe," where the annotated data happens to have shorter average instructions labeled unsafe. The guard might quietly learn "shorter instruction = unsafe," scoring beautifully on that evaluation set despite having nothing to do with actually understanding harm — and the shortcut breaks the moment the data changes.
- **Method**: The authors build a three-level auditing framework: level 1 tests how predictable the label itself is from unrelated features; level 2 tests whether suspicious cues in the evaluation data (like a specific marker string) are statistically associated with the guard's decisions; level 3 is the strictest — taking a fixed set of real cases and rewriting only the suspicious cue (without changing whether the case is actually safe), to see if the guard's decision changes. This framework is applied to three public benchmarks: LinuxArena, AgentDojo, and AgentHarm.
- **Why it matters**: If part of a guard's accuracy comes from exploiting a shortcut, a team might publicly claim "our guard hits F1 0.9," while in a different context or phrasing, the actual protection could be something else entirely.

### Deep-Dive Points

- AgentDojo-Traj: the same tool-lookup rule scores F1=.901 under mixed-domain folds, but drops to .495 under domain-holdout splitting
- AgentHarm-Traj: the released TS-Guard scores F1=.902 weighted by row, but drops to .719 weighted by interaction (while balanced accuracy actually rises — showing the scoring unit itself can change the conclusion)
- On a fixed set of 64 real steps, rewriting only the marker phrase (replacing `<INFORMATION>` with `<UNTRUSTED_EXTERNAL_CONTENT>`) lowers Claude Haiku 4.5's blocking rate by 8.33 percentage points; aliasing tool names instead raises it by 11.46 points, with both effects surviving a formatting-placebo subtraction ⚠️ (based on 960 repeated calls, reproducing only on Haiku)
- The same intervention produces essentially no effect on GPT-5.6 Luna, and only 3 of 64 decisions change for a quantized TS-Guard reproduction — the authors explicitly state this is "configuration-specific," not a general guard weakness
- Adoption bar: running this kind of audit requires a guard's raw prediction logs plus a placebo-controlled rewritten version of the evaluation set — not expensive, but it requires discipline (freezing the sample before seeing results)
- Limitation: the 64-step cohort is not a probability sample and the confidence intervals are exploratory; there is no blinded human check confirming the rewrites truly preserve the underlying safety label

### Reviewer's One-Line Take

Systematizing shortcut learning into an operational three-level auditing framework is a real contribution, and honestly disclosing the lack of cross-provider replication deserves credit; but the authors are co-founders of an agent-security startup, and "published evaluations are unreliable" happens to be exactly the narrative their business needs — readers should weigh that alongside the effect's instability.

### Take-aways for You

- If you're shipping or procuring an agent safety guard: don't take a single F1 or accuracy number at face value — ask how it's scored (per row or per interaction) and how the test set is split (mixed-domain or domain-holdout)
- If you're designing your own guard evaluation: run at least one placebo-controlled test that rewrites only a safety-irrelevant surface feature to see if the guard's decisions change

---

## Paper 3 | RAG's "Retrieval Failure" Diagnosis Actually Conflates Two Different Problems

**Beyond Retrieval Failure: Understanding Why LLMs Miss Evidence in Multi-Hop RAG**
Jiaqi Wei, Wenxuan Huang, Chengdong Xu, Xiang Zhang, Wanli Ouyang (Shanghai Artificial Intelligence Laboratory and others) · arxiv: 2610.21184

Links: [arxiv](https://arxiv.org/abs/2610.21184) · [alphaxiv](https://www.alphaxiv.org/abs/2610.21184)

### TL;DR

Without changing the retriever, corpus, or generation model, guiding search with a simple to-do list of open sub-questions drops MuSiQue's missing-evidence-caused wrong answers from 382 to 234 — but final-answer accuracy doesn't improve proportionally, because the new bottleneck shifts to misjudging evidence as sufficient.

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | DAI 2026 Oral (8th International Conference on Distributed Artificial Intelligence, CCF-C rated, accepted) |
| Citation velocity | Published 2 days ago; Semantic Scholar rate-limited (429) across the entire run, no citation data obtained (near-zero expected regardless) |
| Institution | Acknowledgements credit Shanghai Artificial Intelligence Laboratory; co-author Wanli Ouyang is a senior researcher there |
| Community signal | Not found in the partial HF Daily Papers 10-16 recovery; no Papers with Code entry |
| Credibility | Pass — the main text gives a complete method definition, a matched-baseline comparison (the only difference being the to-do-list module), replication across two embedding models, and an ablation isolating each component's contribution |
| Evidence maturity | Substantial — the causal attribution is backed by a matched baseline and reproduces across embedding models, but the generation model is only tested as GPT-4o-mini |
| Reproducibility | Partial artifacts — dataset, metrics, and hyperparameters are clearly documented, but no public code repository link could be confirmed in the sections retrieved |
| Why this paper | Direct — directly challenges the most common "retrieval failure" diagnosis in RAG evaluation and proposes an actionable alternative attribution method |
| Novelty | Substantive — uses a training-free to-do list to separate two variables long conflated together: whether search is well-guided, and whether evidence is actually reachable |
| Today's relevance | High — multi-hop RAG and agentic search are core modules in today's agent toolchains, and this directly changes the order teams should debug a RAG pipeline in |
| Practical link | Clear — gives a directly applicable four-category failure attribution (judge error / gave up / reasoning error / missing evidence) usable for debugging your own RAG pipeline |
| Editorial confidence | High — the article only states what the matched-baseline setting supports, and honestly reports that reasoning errors and abstentions both increase, rather than overstating the result as a clean win |
| Recommended reading | Must-read — teams optimizing or debugging RAG/agentic-search pipelines |
| Primary limitation | Only GPT-4o-mini was tested as the generation model; the to-do list itself is not a reliable evidence verifier and can still resolve an item prematurely; missing evidence remains the dominant failure cause on the hardest four-hop questions |

### Field Context

Multi-hop RAG requires chaining several pieces of scattered evidence together to answer a question. The standard way teams diagnose "why did it get this wrong" is to check whether the needed passage was ever retrieved — if not, it's blamed on "retrieval failure." But this diagnosis has a blind spot: the passage may well be reachable by the retriever, yet the search itself drifted mid-task and stopped chasing that still-unanswered sub-question, so it was simply never searched for. Conflating these two causes can lead a team to optimize the wrong thing — the retriever when the real issue is search strategy, or vice versa.

### Mid-Level Walkthrough

- **Problem**: Imagine a question that requires chaining three pieces of evidence. The first two are found smoothly, but by the time the agent should be searching for the third, its search focus has quietly drifted to a different sub-question — so the third passage, though sitting right there in the corpus and reachable by the retriever, is simply never searched for. The traditional diagnosis logs this as "retrieval failure," but the retriever was never actually the problem.
- **Method**: The authors introduce ExecutionRAG, a training-free "to-do list": every sub-question has a status (pending / active / resolved / retired), each search round targets exactly one still-open sub-question, and the system only answers once nothing remains open. The retriever, corpus, and generation model are left completely untouched — the only thing that changes is that search is guided more precisely by this list.
- **Why it matters**: This is the first time researchers can cleanly separate "how well is search guided" from "is the evidence actually reachable" — and the result shows that fixing search guidance genuinely recovers more missing evidence, but this doesn't translate proportionally into higher answer accuracy, because the new bottleneck becomes whether, once evidence is found, the system correctly judges it as sufficient.

### Deep-Dive Points

- On MuSiQue, wrong answers caused by missing required evidence drop from 382 to 234 under all-MiniLM-L6-v2, and from 383 to 274 under Qwen3-Embedding-0.6B — the same retriever compared before and after, ruling out "just a stronger retriever" as the explanation
- But reasoning errors rise from 9% to 26% (MiniLM) and abstentions from 7% to 13% — showing that solving the missing-evidence problem surfaces a new bottleneck in its place
- Switching to the Qwen3-Embedding-0.6B retriever, ExecutionRAG's LLM-judged accuracy beats the matched baseline on all three benchmarks (HotpotQA/2Wiki/MuSiQue), with the largest gain on 2Wiki achieved using comparable or fewer retrieved tokens — showing the gain isn't just from reading more text
- Ablation: removing "build the initial list from a first retrieval pass" drops accuracy from 50.2 to 48.7; further removing "update the list as you search" drops it to 48.3 — both design choices contribute independently
- Adoption bar: applying this requires first re-categorizing wrong answers into judge error / gave up / reasoning error / missing evidence, so a team can see which bottleneck its own RAG pipeline is actually stuck on
- Limitation: only GPT-4o-mini was tested as the generation model; the to-do list's own "resolved" judgment is still made by a language model and can be premature; on the hardest four-hop questions, missing evidence remains the dominant failure cause, so this method doesn't fully solve long evidence-chain reliability

### Reviewer's One-Line Take

Cleanly isolating "search guidance" as a single variable via a matched baseline is solid experimental design, and the honest reporting of side effects (more reasoning errors, more abstentions) is commendable; but only one generation model was tested, and the to-do list itself can still misjudge "resolved" — there's still distance to travel before multi-hop RAG reliability is actually solved.

### Take-aways for You

- If you're debugging your own multi-hop RAG pipeline: first split wrong answers into judge error / gave up / reasoning error / missing evidence before deciding whether to optimize the retriever or the search strategy — you may think it's a retrieval problem when it's actually a verification problem
- If you're designing an agentic search loop: consider adding an explicit status list tracking which sub-questions remain open, rather than relying on the model to track progress through free-form reasoning alone

## Today's Takeaway

I used to think auditing an agent's policy compliance just needed a checklist, a guard's "0.9 accuracy" meant it was actually safe, and a RAG system's "retrieval failure" could be fixed by improving the retriever. Today's papers changed that: all three make the same mistake of treating an evaluation score as the destination, rather than asking whether the evaluation itself measures what it claims to. A trained, actively-probing auditor finds nearly twice the violations a fixed checklist does; rewriting one marker phrase can swing a guard's published accuracy by double digits; and fixing search guidance recovers evidence without proportionally fixing the final answer. An evaluation score is never the destination — it needs to be audited too.

## References

- [PROBE: Learning to Audit Policy Compliance in Tool-Using LLM Agents — arXiv 2610.22124](https://arxiv.org/abs/2610.22124)
- [Shortcut Sensitivity in Agent-Safety Evaluations — arXiv 2610.22243](https://arxiv.org/abs/2610.22243)
- [Beyond Retrieval Failure: Understanding Why LLMs Miss Evidence in Multi-Hop RAG — arXiv 2610.21184](https://arxiv.org/abs/2610.21184)
- [Shortcut Sensitivity code and aggregate results — GitHub](https://github.com/hasandemirkiran/shortcut-sensitivity-agent-safety-evaluations)
- [DAI 2026 — 8th International Conference on Distributed Artificial Intelligence](https://www.adai.ai/dai/2026/)
- [AgentDojo benchmark — arXiv 2406.13352](https://arxiv.org/abs/2406.13352)
- [AgentHarm benchmark — arXiv 2410.09024](https://arxiv.org/abs/2410.09024)
- [arXiv cs.AI new submissions](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL new submissions](https://arxiv.org/list/cs.CL/new)
