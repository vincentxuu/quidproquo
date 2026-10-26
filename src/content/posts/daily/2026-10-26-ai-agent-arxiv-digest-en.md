---
title: "AI Agent Arxiv Digest — 2026-10-26"
date: 2026-10-26
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers answer the same question from three different memory roles — conversational memory, task-planning memory, and multi-agent coordination memory — and the answer to 'how complex should it be' is different for each"
tldr: "Naive RAG ranks first in six of seven benchmark-model settings across four long-term conversation benchmarks, beating 12 purpose-built agentic memory systems — conversational memory doesn't need complex management; MemPlan compiles memory into PDDL positive/negative constraints and beats pure language-memory agents across three interactive environments at NeurIPS 2026 — planning memory needs structured design; Muffin replaces full-trace multi-agent debate with a lightweight shared buffer, winning 17 of 20 benchmark settings while cutting tokens by 77.4% — coordination memory between agents doesn't need full sharing either"
series:
  name: "AI Agent Arxiv Digest"
  order: 155
---

> 🌏 [繁體中文版](/posts/daily/2026-10-26-ai-agent-arxiv-digest)

## Today's Overview

"How complex should agent memory be" sounds like one question, but today's three papers show it's actually three different questions with three different answers. Conversational memory: Raw-RAG, a bare-bones dense-retrieval-plus-reranking baseline, beats 12 purpose-built agentic memory systems — most of the complex memory management work here turns out to be wasted engineering. Task-planning memory: MemPlan goes the opposite way, showing that letting an LLM remember its own interaction history isn't enough — memory has to be compiled into positive/negative constraints a symbolic planner can use before it wins. Multi-agent coordination memory: Muffin lands somewhere in between — agents don't need to exchange full reasoning traces the way traditional multi-agent debate does; a lightweight shared buffer of notes gets better accuracy while cutting token cost by more than 70%. Put together: there's no universal slogan that says memory should be "simple" or "complex" — you first have to know which role your memory is playing before you know which direction to design it in.

```diagram
title: Three memory roles, three different answers
desc: Splitting "agent memory" into conversational memory, task-planning memory, and multi-agent coordination memory reveals that the winning design differs by role — some roles favor simple designs, others need structured ones.
caption: Simplified: each paper tests a complex option against a simple option for the same memory role; the winner (highlighted box) differs by role.
---
<svg viewBox="0 0 640 420">
  <rect class="dg-box" x="14" y="30" width="196" height="40" rx="6"/>
  <text class="dg-tag" x="112" y="50" text-anchor="middle" dominant-baseline="central">Conversational memory</text>

  <rect class="dg-box" x="222" y="30" width="196" height="40" rx="6"/>
  <text class="dg-tag" x="320" y="50" text-anchor="middle" dominant-baseline="central">Task-planning memory</text>

  <rect class="dg-box" x="430" y="30" width="196" height="40" rx="6"/>
  <text class="dg-tag" x="528" y="50" text-anchor="middle" dominant-baseline="central">Multi-agent coordination memory</text>

  <rect class="dg-box dg-box--link" x="14" y="85" width="196" height="95" rx="6"/>
  <text class="dg-label" x="112" y="117" text-anchor="middle" dominant-baseline="central">12 agentic memory systems</text>
  <text class="dg-sub" x="112" y="139" text-anchor="middle" dominant-baseline="central">Mem0 / MemOS / graph…</text>
  <text class="dg-sub" x="112" y="157" text-anchor="middle" dominant-baseline="central">complex option</text>

  <rect class="dg-box dg-box--accent" x="14" y="195" width="196" height="95" rx="6"/>
  <text class="dg-label" x="112" y="227" text-anchor="middle" dominant-baseline="central">Raw-RAG (wins)</text>
  <text class="dg-sub" x="112" y="249" text-anchor="middle" dominant-baseline="central">1st in 6/7 settings</text>
  <text class="dg-sub" x="112" y="267" text-anchor="middle" dominant-baseline="central">simple option</text>

  <rect class="dg-box dg-box--accent" x="222" y="85" width="196" height="95" rx="6"/>
  <text class="dg-label" x="320" y="117" text-anchor="middle" dominant-baseline="central">MemPlan (wins)</text>
  <text class="dg-sub" x="320" y="139" text-anchor="middle" dominant-baseline="central">memory compiled into PDDL</text>
  <text class="dg-sub" x="320" y="157" text-anchor="middle" dominant-baseline="central">structured option</text>

  <rect class="dg-box dg-box--link" x="222" y="195" width="196" height="95" rx="6"/>
  <text class="dg-label" x="320" y="227" text-anchor="middle" dominant-baseline="central">Pure LLM memory agents</text>
  <text class="dg-sub" x="320" y="249" text-anchor="middle" dominant-baseline="central">Full History / Summary / RAG…</text>
  <text class="dg-sub" x="320" y="267" text-anchor="middle" dominant-baseline="central">simple option</text>

  <rect class="dg-box dg-box--link" x="430" y="85" width="196" height="95" rx="6"/>
  <text class="dg-label" x="528" y="117" text-anchor="middle" dominant-baseline="central">Multi-agent debate</text>
  <text class="dg-sub" x="528" y="139" text-anchor="middle" dominant-baseline="central">full-trace synchronous sharing</text>
  <text class="dg-sub" x="528" y="157" text-anchor="middle" dominant-baseline="central">complex option</text>

  <rect class="dg-box dg-box--accent" x="430" y="195" width="196" height="95" rx="6"/>
  <text class="dg-label" x="528" y="227" text-anchor="middle" dominant-baseline="central">Muffin (wins)</text>
  <text class="dg-sub" x="528" y="249" text-anchor="middle" dominant-baseline="central">shared buffer, notes only</text>
  <text class="dg-sub" x="528" y="267" text-anchor="middle" dominant-baseline="central">simple option, -77.4% tokens</text>

  <line class="dg-rule" x1="14" y1="310" x2="626" y2="310"/>
  <text class="dg-tag" x="14" y="334" dominant-baseline="central">Legend</text>
  <text class="dg-small" x="14" y="358" dominant-baseline="central">Highlighted box = the experimental winner for that role; the winners are simple, structured, simple — no single rule</text>
  <text class="dg-small" x="14" y="380" dominant-baseline="central">Winners follow each paper's main results table; see "Key Takeaways" in each section</text>
</svg>
```

## Terms worth knowing before this one

| Term | Plain explanation |
|---|---|
| Agentic memory | A memory system that does more than retrieval — it also extracts, summarizes, organizes, builds graphs, or even rewrites memories; a different tier of design from plain retrieval-augmented generation |
| RAG (Retrieval-Augmented Generation) | A basic architecture that retrieves relevant text snippets at query time and hands them to a language model to answer from |
| PDDL (Planning Domain Definition Language) | A symbolic language describing objects, actions, preconditions, and effects; classical AI planners (e.g., Fast Downward) use it to search for a feasible action sequence |
| Positive/negative memory | MemPlan splits past interaction into two kinds of memory: positive memory flags which candidate hypothesis is worth trying first; negative memory flags which hypothesis the environment has already disproved, so it's excluded |
| Shared memory buffer | Multiple agents exchange only compact notes about intermediate findings, not their full reasoning process or conversation history |

---

## Paper 1 | Conversational memory doesn't need to be complex: Naive RAG beats 12 agentic memory systems

**Is Complex Agentic Memory Always Needed? Naive RAG Is Stronger Than We Thought**
Zhengye Bao, Shengtao Zhang, Haokai Zhang et al. (Xi'an Jiaotong University) · arxiv: 2610.30755

Links: [arxiv](https://arxiv.org/abs/2610.30755) · [alphaxiv](https://www.alphaxiv.org/abs/2610.30755)

### TL;DR

A bare-bones baseline, Raw-RAG — dense retrieval plus cross-encoder reranking, nothing else — ranks first in six of seven benchmark-model settings across four long-term conversation benchmarks (LoCoMo, LongMemEval, MEME, MemoryAgentBench), beating 12 purpose-built agentic memory systems including EverMemOS, Mem0, and MemOS; adding memory-management operations (fact extraction, summarization, graph construction) actually lowers accuracy.

### Editorial judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | Published 4 days ago; Semantic Scholar API returned 429 (rate limit, no key) throughout this run — expected to have no citation data yet given the publication date |
| Institution | Xi'an Jiaotong University |
| Community signal | Listed on HF Daily Papers (8 upvotes, 2026-10-23); listed on Papers with Code |
| Credibility | Pass — 4 benchmarks × 12 compared memory systems, with a 20,000-resample bootstrap + Holm-corrected ablation study and oracle-controlled diagnostics isolating the cause |
| Evidence maturity | Substantial — the core finding holds across all four benchmarks and is backed by both coverage/utilization decomposition and a complete-store oracle check, but limited to offline conversation tasks |
| Reproducibility | Partial artifacts — 62 pages with full appendices publishing settings, prompts, and per-item numbers, but no independent public code repository found |
| Why this paper | Direct — it directly challenges the industry's default assumption that agent memory needs complex management; anyone evaluating a memory architecture should read this first |
| Novelty | Substantive — turns "is memory management actually helping" into a testable, systematic question instead of assuming complex architecture is automatically better |
| Today's importance | High — most current agent-memory products are sold on complex memory management; this paper directly questions that selling point with 12 compared systems |
| Practical link | Clear — Raw-RAG's recipe (dense retrieval + cross-encoder rerank) is a baseline any team can ship and test at minimal cost |
| Editorial confidence | High — the "first in six of seven settings" claim used in this article maps directly to Table 3/4's raw numbers, with no extrapolation beyond what was tested |
| Reading recommendation | Must-read — teams designing or buying agent long-term memory systems |
| Primary limitation | Evaluated only on offline conversation benchmarks; does not cover interactive, multimodal, or real-deployment settings involving privacy/deletion constraints |

### Background

Recent agent long-term memory research has mostly pushed toward making memory "smarter" — using an LLM to extract facts, summarize, build knowledge graphs, and learn when to update or delete memories (systems like Mem0, MemOS, A-MEM). This paper steps back and asks a more basic question: are these complex operations actually better than the simplest possible approach — retrieval and reranking over raw conversation history?

### Mid-level walkthrough

- **The problem**: Imagine a memory system handling a conversation history spanning months and thousands of messages. The common intuition is "there's so much information, you must organize, condense, and structure it first to find what matters" — but the organizing process itself can be where information gets lost.
- **The method**: The authors first run two diagnostic experiments. Auditing Mem0's write behavior on LoCoMo and LongMemEval, they find UPDATE and DELETE together account for only 2.46–4.39% of all write decisions; replacing these with append-only ADD/NONE actually raises accuracy from 67.36% to 69.42%. Testing on MEME's dynamic tasks, they find that given enough raw evidence, capable readers can resolve most state changes themselves. Building on both findings, they propose Raw-RAG: no LLM-based extraction or structuring at all — just dense retrieval of 128 candidate windows, cross-encoder reranking down to the top 15, handed straight to the reader.
- **Why it matters**: The key diagnostic is that "coverage" (whether the needed evidence was retrieved at all) explains performance differences far more than "utilization" (whether the model answers correctly once it has the evidence) — Raw-RAG leads in coverage on both benchmarks measured (45.29%/76.35%, both highest), while the utilization gap across systems is comparatively small. In other words, where systems actually lose is in "did you retrieve the needed raw information," not "can the model use it."

### Deep-dive points

- Raw-RAG leads LoCoMo by 0.65–0.95 points, LongMemEval by 0.13 points, GPT-4o-mini MEME by 2.24 points, and MemoryAgentBench by 4.48–5.53 points; its only loss is DeepSeek-V4-Flash MEME, where MemMachine leads by 1.52 points
- Adding any of three memory-management operations lowers MemoryAgentBench's total score: atomic-fact extraction -19.62 points, summary augmentation -5.81 points, graph expansion -5.78 points; fact extraction specifically drops test-time-learning accuracy from 47.68% to 15.37%
- The efficiency gap is large: on a MEME subset, Raw-RAG finishes add+search in 305.91 seconds — 5.1× faster than the next system and 30.4× faster than EverMemOS; on a near-million-token streaming test (BEAM-1M), Raw-RAG's cumulative ingestion time is 0.33 hours versus 3.25 hours for the next-fastest (MemOS) and 26.95 hours for Memora ⚠️ (these efficiency numbers are self-reported by the authors and await external replication)
- On MEME tracking/cascade questions, Raw-RAG's conditional "path coverage" (retrieving the dependency chain needed to derive an answer, not just the value) reaches 62.34%, the highest among compared systems; MemU reaches only 9.62%
- Adoption threshold: quantify a dense-retrieval-plus-rerank baseline's real gain before investing in complex memory management — don't assume complexity automatically helps
- Limitation: evidence is limited to offline conversation tasks; the paper does not test interactive or multimodal settings, nor behavior under privacy/deletion constraints

### Reviewer's one-line take

Comparing against 12 systems across 4 benchmarks gives this kind of myth-busting paper an unusually thorough methodological footprint; but the memory complexity discussed here is concentrated at the retrieval/structuring layer — it hasn't yet touched the privacy-deletion and multi-tenant permission complexity that real products also have to handle, so whether simple approaches can cover that too remains open.

### Takeaways for you

- If you're designing or buying a long-term conversational memory system: ship a dense-retrieval-plus-rerank Raw-RAG baseline first, and measure any "complex memory management" product against it before paying for the extra engineering
- If your team already runs Mem0/MemOS-style systems: check the actual share and effectiveness of UPDATE/DELETE operations in your pipeline — this paper suggests they're often a small share of traffic yet a disproportionate source of instability

---

## Paper 2 | How task-planning memory should be designed: MemPlan turns memory into planning constraints

**MemPlan: Memory-Conditioned PDDL Planning for Partially Observable Text Environments**
Tengwei Song, Robert Hoehndorf (KAUST + Åbo Akademi University, Finland + ELLIS Institute Finland) · arxiv: 2610.30379

Links: [arxiv](https://arxiv.org/abs/2610.30379) · [alphaxiv](https://www.alphaxiv.org/abs/2610.30379)

### TL;DR

MemPlan, accepted at NeurIPS 2026, restricts the LLM to parsing observations and grounding actions, and compiles interaction memory into "positive memory" (priority ordering over candidate hypotheses) and "negative memory" (excluding hypotheses the environment has already disproved) directly inside a fixed PDDL planning problem — beating pure language-memory agents and several PDDL-assisted baselines across TextWorld, ALFWorld, and Robotouille.

### Editorial judgment

| Dimension | Judgment |
|---|---|
| Venue | NeurIPS 2026 (accepted, not just a preprint) |
| Citation velocity | Published 5 days ago; Semantic Scholar API returned 429 (rate limit) throughout this run — expected to have no citation data yet given the publication date |
| Institution | KAUST + Åbo Akademi University (Finland) + ELLIS Institute Finland |
| Community signal | Listed on Papers with Code; official code and data public on GitHub (github.com/tewiSong/MemPlan) |
| Credibility | Pass — full experiments across three interactive environments (134 ALFWorld episodes, 7 TextWorld task instances, 151 Robotouille task-seed runs) plus six ablations isolating each component's contribution, peer-reviewed at NeurIPS 2026 |
| Evidence maturity | Substantial — three environments, multiple baselines, and full ablations, but the TextWorld memory-agent comparison uses only 7 task instances, which the authors themselves flag as evidence for that setting rather than a broad claim |
| Reproducibility | Full artifacts — official GitHub repo with code and data; appendix details training data volume and hyperparameter sensitivity |
| Why this paper | Direct — a deliberate contrast with the selected Naive-RAG paper: both question memory complexity, yet this one shows that planning-type tasks need a more structured memory design to beat pure language-memory agents |
| Novelty | Substantive — compiles memory directly into PDDL action costs and exclusion constraints rather than treating it as extra text context for an LLM's decision — a genuinely different way of using memory compared to existing LLM-memory agents |
| Today's importance | High — for agents needing long-horizon, partially observable task planning (robots, process automation), this is a rare structured-memory approach with both peer review and public code |
| Practical link | Clear — the positive/negative memory mechanism and the fixed-domain, online-problem-rebuild design can be applied directly to any planning agent that already has a PDDL domain description |
| Editorial confidence | High — the "wins across three environments, ablations confirm each component's necessity" claim used here maps directly to the paper's Tables 1-4 and algorithm description |
| Reading recommendation | Must-read for teams building long-horizon planning agents (robots, process automation); skim for teams handling only short-horizon, fully observable tasks |
| Primary limitation | Assumes a complete PDDL domain description is available; MemPlan does not automate domain construction online. Negative memory uses hard exclusion, which can prematurely drop a valid candidate when feedback is ambiguous or mis-parsed |

### Background

Using an LLM as the main planner for long-horizon tasks is prone to hallucinated actions or losing track of earlier observations, while classical symbolic planners (e.g., Fast Downward) search reliably but need a complete symbolic state to operate — something partially observable text environments don't provide. Existing approaches either have the LLM guess a complete state before planning (expensive to recover from when the guess is wrong) or let the LLM rewrite PDDL files online (prone to malformed syntax or hallucinated facts). MemPlan takes a third path: keep the domain fixed, and let the memory mechanism decide how to rebuild the problem at each step.

### Mid-level walkthrough

- **The problem**: Imagine an agent exploring an unfamiliar house to find a key for a box, without seeing the full layout — it has to explore step by step. Every time it guesses a drawer wrong, a naive approach can keep re-trying already-excluded locations, or wander aimlessly without knowing where to check next.
- **The method**: MemPlan keeps one PDDL domain fixed and rebuilds a closed PDDL problem at every step from parsed facts, unresolved candidate hypotheses, positive memory, and negative memory. Positive memory uses mContriever embeddings to score how relevant a candidate hypothesis is to the goal, converting that score into the planner's action cost — higher relevance means a lower cost to check, so the planner naturally tries those candidates first. Negative memory turns hypotheses the environment has already disproved into hard exclusion constraints, so the planner never reconsiders them. The whole system uses one frozen language-symbol interface purely for observation parsing and action grounding — the LLM itself never plans or rewrites the domain.
- **Why it matters**: Ablations show that removing the "placeholder" mechanism causes outright planning failure (an unobserved but required object can't even be represented in the PDDL problem), and removing negative memory causes the agent to keep retrying hypotheses already refuted. Compiling memory into costs and constraints the planner can act on directly — rather than feeding it to an LLM as extra context — produces better task completion and shorter interaction trajectories across all three environments.

### Deep-dive points

- ALFWorld (134 episodes): MemPlan takes fewer interaction steps and uses fewer online tokens than GPT-5.1 ReAct and both PDDLEGO+ variants; LLM-DP still has the lowest online token cost
- TextWorld memory-agent comparison (7 task instances): MemPlan gets the highest normalized score among six memory-agent baselines — Full History, Summary, RAG, Reflexion, Simulacra, AriGraph ⚠️ (only 7 task instances; the authors explicitly flag this as evidence for this setting, not a broad claim)
- Robotouille sync/async tasks: MemPlan's lead over ReAct and LLM-DP is more pronounced in the asynchronous setting (delayed action effects), consistent with the intuition that memory-encoded exclusion constraints matter more when observations go stale faster
- TextWorld's PDDL domain was drafted offline by GPT-5.1; 5 of 7 (71.4%) were valid on the first attempt, with the remaining 2 fixed after one offline repair round — domain generation never touched the test instances' maps, object placements, or gold answers
- Adoption threshold: you need a (or the ability to offline-generate a) complete PDDL domain description, and negative memory's hard exclusion can misfire on ambiguous or mis-parsed feedback, requiring extra robustness design
- Limitation: MemPlan does not automate PDDL domain construction or online repair; evaluation is limited to simulated text environments, not safety-critical real deployment

### Reviewer's one-line take

Compiling memory directly into costs and constraints a planner can use — instead of handing it to an LLM as extra context — is a methodologically clean design validated by peer review; but the TextWorld memory-agent comparison's sample size is small, and the system depends heavily on a correct, pre-given PDDL domain, a premise whose durability in real-world settings with incomplete domain descriptions remains to be seen.

### Takeaways for you

- If you're building agents that need long-horizon planning (robots, process automation, complex multi-step tool use): assess whether your task's core constraints can be written as a PDDL domain, then use a MemPlan-style positive/negative memory mechanism to handle uncertainty, instead of handing every decision to the LLM
- If you already use an LLM memory agent for interactive tasks: note that "memory as context" and "memory compiled into planning constraints" are fundamentally different uses of memory — this paper's ablations suggest the latter is more robust for long-horizon, partially observable tasks

---

## Paper 3 | Multi-agent coordination doesn't need full sharing: Muffin replaces debate with a lightweight shared buffer

**Muffin - A Shared Memory Buffer for Asynchronous AI Agents**
Ping-Lin Kuo, Suman Navaratnarajah, Christian Frey et al. (University of Technology Nuremberg, Germany) · arxiv: 2610.31355

Links: [arxiv](https://arxiv.org/abs/2610.31355) · [alphaxiv](https://www.alphaxiv.org/abs/2610.31355)

### TL;DR

Muffin has multiple agents exchange compact intermediate findings through an asynchronous shared memory buffer, instead of synchronously exchanging full reasoning traces the way traditional multi-agent debate does — winning the best accuracy in 17 of 20 settings across four reasoning benchmarks and four models, beating the strongest multi-agent debate baseline by 19.2 accuracy points while using 77.4% fewer tokens.

### Editorial judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (code repo is anonymized, suggesting a double-blind review in progress; venue not yet confirmed) |
| Citation velocity | Published 4 days ago; Semantic Scholar API returned 429 (rate limit) throughout this run — expected to have no citation data yet given the publication date |
| Institution | University of Technology Nuremberg (UTN), Germany |
| Community signal | Not found on HF Daily Papers or Papers with Code |
| Credibility | Pass — 4 benchmarks × 4 models across 20 settings, averaged over three repeated runs with 95% confidence intervals and an explicit hypothesis-testing protocol (H1-H3), plus ablations isolating the number-of-shared-findings budget and the summarizer's contribution |
| Evidence maturity | Preliminary — the quantitative comparison is solid, but limited to question-answering/reasoning tasks; doesn't cover tool use, planning, or long-horizon execution, and the venue is unconfirmed |
| Reproducibility | Partial artifacts — anonymized code repository public (anonymous.4open.science/r/Muffin); reproducibility statement details prompt templates and experimental settings |
| Why this paper | Direct — pairs with the other two selected papers to complete a third memory role: how much memory agents need to exchange with each other, and the answer here is "much less than full sharing" |
| Novelty | Substantive — directly quantifies "asynchronous sharing of compact findings" against "synchronous sharing of full traces," rather than just proposing a new architecture without comparing efficiency to existing debate paradigms |
| Today's importance | Medium — a concrete alternative with quantified cost savings for teams currently using multi-agent debate or voting on complex reasoning tasks |
| Practical link | Clear — the three-stage design (orchestrator routes by reasoning demand, shared buffer carries only compact notes, summarizer produces the final answer) can be applied directly to other multi-agent collaboration settings |
| Editorial confidence | Medium — the claim "asynchronous compact sharing beats synchronous full-trace debate" is supported across four benchmarks, but the task scope is narrow and the venue is unconfirmed, so confidence stops short of high |
| Reading recommendation | Must-read for teams using multi-agent debate/voting on complex reasoning tasks who are concerned about token cost; skim for single-agent task settings |
| Primary limitation | Evaluation is limited to question-answering/reasoning benchmarks, not tool use, planning, or long-horizon execution; compute constraints meant not every closed- and open-weight model combination could be covered |

### Background

Multi-agent debate is a common reasoning-boosting technique: multiple agents each answer, then revise their own answers after seeing each other's full output. But "seeing each other's full output" means synchronous waiting and heavy token overhead — and the paper notes that single- and multi-agent systems are often on par in target-driven reasoning tasks anyway. The problem is often not "whether to use multiple agents" but "how agents should exchange information."

### Mid-level walkthrough

- **The problem**: Imagine three people solving a math problem together. The traditional debate approach has everyone read out their entire solution process to the other two, then revise — information-heavy and slow. Muffin tests whether sharing just "the one key insight I just found" as a compact note, instead of the full solution process, can be just as effective — or more so.
- **The method**: Muffin first uses an orchestrator to route a query by its expected reasoning demand — simple queries get answered directly, complex ones get sent into multi-agent collaboration. During collaboration, each agent keeps its private reasoning local and only writes intermediate findings into a shared buffer that other agents read asynchronously, without waiting for everyone to finish the same round. Finally, a summarizer combines each agent's compact summaries (not their full reasoning traces) into the final answer.
- **Why it matters**: The breakdown analysis shows that shared intermediate findings are most valuable early on — in the first round, a shared finding has a 51.6% chance of correcting a wrong answer to a right one, versus only a 14.2% chance of steering a right answer wrong. By later rounds, as the shared buffer accumulates more information, the correcting-versus-misleading ratio narrows to 34.8% versus 21.9%. This means the marginal value of compact sharing is concentrated early — it doesn't need to keep stacking full traces in later rounds.

### Deep-dive points

- Across four models (gemma-4-E4B-it, gemma-4-31B-it, Qwen3.8-27B, Qwen3.5-4B) on four benchmarks (Chess Move Validity, MMLU-Pro, GPQA-Diamond, OlymMATH) — 20 settings total — Muffin gets the best accuracy in 17 and second-best in 3
- On OlymMATH-Easy, Muffin beats the strongest multi-agent debate baseline by 19.2 accuracy points while using 77.4% fewer tokens; the summarizer step alone lifts final accuracy from 44.9% to 59.2%
- Agent-count ablation: going from 2 to 3 agents raises accuracy from 50.6% to 59.3%, but 4 or 5 agents only reach 59.7%/58.7% while token usage keeps climbing ⚠️ (a diminishing-returns signal, not linear scaling — don't just keep adding agents)
- Versus full-trace sharing: at the final step, full-trace sharing pushes accuracy from 85.0% to 87.3%, but needs 73.9% more tokens (160.6K vs. 41.9K) — most of the sharing benefit is recoverable with compact notes alone
- The number of shared findings isn't "more is better": for the smaller model (gemma-4-E4B-it), k=10 beats k=5 by 5.0 points, but more than that hurts accuracy; the larger model (gemma-4-31B-it) is far less sensitive to this budget (±2.0 points)
- Adoption threshold: first confirm your task actually needs multi-step collaboration (the orchestrator's routing step can filter out simple queries that don't), then decide agent count and shared-note budget — don't assume "more agents, more sharing" is automatically better
- Limitation: evaluation is concentrated on QA/reasoning tasks; the authors explicitly flag that future work needs to test the shared buffer on tool use, planning, and long-horizon execution; compute constraints also limited model-combination coverage

### Reviewer's one-line take

Directly quantifying "asynchronous compact sharing vs. synchronous full sharing," rather than just proposing a new architecture and claiming it's better, is this paper's methodological strength; but the task types are currently concentrated on QA and reasoning, the venue is still unconfirmed, and whether the shared buffer extends to tool-use or long-horizon multi-agent settings is, by the authors' own admission, the next step.

### Takeaways for you

- If your multi-agent system currently uses synchronous debate or full-trace sharing: test an asynchronous version that shares only compact intermediate findings first — this paper suggests most of the accuracy gain doesn't require full traces, and you can likely save a large share of tokens immediately
- If you're deciding agent count and collaboration depth for a multi-agent system: don't assume "more agents, more sharing" monotonically improves results — run a small-scale ablation to find your task's diminishing-returns point before committing resources

---

## Today's Takeaway

I used to think "how complex should agent memory be" had one universal answer. Today I learned the answer depends on which role the memory is playing: conversational memory (Raw-RAG beating 12 complex systems) and multi-agent coordination memory (Muffin's lightweight shared buffer beating full-trace debate) both point toward "simple is enough" — but task-planning memory (MemPlan needing memory compiled into PDDL positive/negative constraints to beat pure language-memory agents) points toward "you need structured design." What makes these three interesting together isn't which one is "right" — it's that together they show memory was never a single problem. Asking which role you're designing for matters more than reaching for either slogan, "more complex is better" or "simpler is better."

## References

- [Is Complex Agentic Memory Always Needed? Naive RAG Is Stronger Than We Thought (arXiv:2610.30755)](https://arxiv.org/abs/2610.30755)
- [Naive RAG vs Agentic Memory — alphaxiv](https://www.alphaxiv.org/abs/2610.30755)
- [Naive RAG vs Agentic Memory — Hugging Face Daily Papers](https://huggingface.co/papers/2610.30755)
- [MemPlan: Memory-Conditioned PDDL Planning for Partially Observable Text Environments (arXiv:2610.30379)](https://arxiv.org/abs/2610.30379)
- [MemPlan — alphaxiv](https://www.alphaxiv.org/abs/2610.30379)
- [MemPlan — official repository](https://github.com/tewiSong/MemPlan)
- [Muffin - A Shared Memory Buffer for Asynchronous AI Agents (arXiv:2610.31355)](https://arxiv.org/abs/2610.31355)
- [Muffin — alphaxiv](https://www.alphaxiv.org/abs/2610.31355)
- [Muffin — anonymous code repository](https://anonymous.4open.science/r/Muffin)
