---
title: "Reading CMU 11-768 L10: How to Evaluate, Train, and Retrieve for Deep Research Agents"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, deep-research, evaluation, reinforcement-learning]
lang: en
series:
  name: "Reading CMU 11-768 AI Agents"
  order: 11
tldr: "Akari Asai's L10 splits deep research agents into three problems: evaluation has to cover four gaps (search difficulty, domain expertise, long-form answer quality, citation support); training runs mid-training → SFT → RL, with DR Tulu's evolving rubrics as the reward for long-form reports; retrieval should let the retriever see the agent's reasoning, which gets AgentIR-4B to 68% on BrowseComp-Plus with Tongyi-DR."
description: "A guided reading of CMU 11-768 Lecture 10, Deep Research Agents (guest lecturer Akari Asai): how evaluation evolved from BrowseComp and ScholarQABench to DeepResearch Bench, Tongyi DeepResearch's mid-training / SFT / RL pipeline, DR Tulu's evolving-rubric reward, and AgentIR's reasoning-aware retrieval. Written from the slides."
draft: false
glossary:
  - term: "GRPO"
    aliases: ["Group Relative Policy Optimization"]
    definition: "Sample a group of answers to the same prompt and use the group mean as the baseline: answers above the mean get more probability, answers below get less, with no separate value model."
    context: "The lecture uses it to explain how search agents like Search-R1 and DR Tulu learn from their own attempts."
  - term: "RLER"
    aliases: ["Reinforcement Learning with Evolving Rubrics", "evolving rubrics"]
    definition: "DR Tulu's training method: the grading rubric is not fixed but keeps gaining and dropping items during training, based on newly retrieved information and contrasts between good and bad responses."
    context: "The lecture uses it to answer where the RL reward comes from when a long research report has no single correct answer."
  - term: "hard negative"
    definition: "A document that looks similar and relevant to the query but is missing a key piece of information; it forces a retriever or agent to tell 'similar' apart from 'correct'."
    context: "BrowseComp-Plus deliberately adds such documents to its fixed corpus."
---

> 🌏 [中文版](/posts/ai/2026-09-29-cmu-11768-lecture-10-deep-research-agents)

**Video status: Videos included.** [Source details](#course-video-sources)

> **This post is written from the slides and the recording.** The slides remain the backbone (the official recording is 72 minutes, published 2026-10-10); the speaker's spoken remarks and the Q&A are collected in the section "Q&A and spoken remarks from the recording" and marked as spoken. The recording's English captions are auto-generated; I corrected proper nouns from context and the papers (for example "DP 2" is DR Tulu and "OTI" is CMU LTI), and where the speaker did not give a number or setup clearly, I report only what she said. Every number and example below comes from the slides, the papers they cite, or the speaker's remarks. For each paper used to support a point, I opened the full text and checked the relevant passage: where the slides and the paper differ, both are given, and anything found only on the slides is marked as such.

[CMU 11-768 AI Agents](https://www.cmu-agents.com/) is Daniel Fried and Graham Neubig's Fall 2026 course on agents. Its Domains module covers coding agents, then computer use agents, and the third domain is deep research. Lecture 10 (Sep 24) is a guest lecture by [Akari Asai](https://akariasai.github.io/), first author of [OpenScholar](https://arxiv.org/abs/2411.14199) (arXiv:2411.14199, Nature 2026) and joint first author of [DR Tulu](https://arxiv.org/abs/2511.19399) (arXiv:2511.19399, ICML 2026), so half of this lecture is her explaining how she built these systems.

A deep research agent takes a research question that needs many searches and synthesis across many documents, then plans, searches, reflects, searches again, and finally hands back a long answer with citations. The slides split the lecture into three parts: **evaluation** (benchmarks, rubrics, citation support), **modeling** (learning to search and synthesize), and **retrieval** (finding evidence for the agent's next step). This post follows the same order.

## Course video sources

Checked the public recording of CMU 11-768 Fall 2026 Lecture 10 (speaker: Akari Asai); it is published on instructor Graham Neubig's channel, and the title and description match this course.

```youtube
url: https://www.youtube.com/watch?v=nKUBrXFQBUM
title: CMU AI Agents 2026: 10. Deep Research
```

Original video: [CMU AI Agents 2026: 10. Deep Research](https://www.youtube.com/watch?v=nKUBrXFQBUM)

Official sources:

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

Checked on 2026-10-10.

Content check: verified against the video transcript (2026-10-10): Read the first part of the transcript and keyword-searched the rest (video about 72 min, speaker Akari Asai), and checked every figure and statement in the "Q&A and spoken remarks" section (about $3,000–4,000 of search API per RL run, Serper, BM25 and a 4B embedding model, about one hour per rubric, GPT-4.1 rubric generation about 10 points better than Qwen, about 40% at 600 RL steps and about 10 points more with 5% SFT, roughly 20% on BrowseComp without search, blocking Hugging Face, the benchmark recommendations) plus the transcript-visible numbers cited in the body (25% for human experts on BrowseComp, 50% after training, BrowseComp-Plus with about 830 questions and 100k documents, about 80% expert agreement on rubric items, about 15% errors in ResearchQA rubrics); all supported. Slide-only details and paper figures still rest on the slides and papers; the "Sept 24" lecture date is not stated in the video and rests on the official schedule.

## One search versus many

The lecture opens with a contrast. "What is Akari Asai's office number at CMU?" takes one search of the faculty page. "Can AI agents synthesize scientific literature as well as human experts?" does not, and the slides break the agent's work on it into four steps:

1. **Plan**: separate "strong benchmark results" from "direct comparisons with human experts," then plan to find literature-synthesis studies, check how experts and agents were compared, and compare tasks and limits.
2. **Search**: two kinds of results come back — a benchmark that scores answers against other AI systems, and an expert evaluation that compares agent answers with human-written ones.
3. **Reflect**: the two studies measure different things, and a higher benchmark score does not answer the question about human experts. So the agent asks which tasks and domains were tested, and searches again.
4. **Final answer**: "Promising on tested tasks; broader parity with experts remains unproven," citing OpenScholar and DR Tulu separately.

Step three is the point. The hard part of deep research is not searching many times. It is **judging whether the evidence supports the conclusion**, then narrowing the conclusion to what the evidence can hold. The rest of the lecture's evaluation material is about measuring exactly that.

## Evaluation: four gaps between QA and deep research benchmarks

The slides use a [Natural Questions](https://ai.google.com/research/NaturalQuestions/databrowser) item as the foil: "who wrote the score for the force awakens?" The answer is John Williams, found in one Wikipedia page. Classic QA benchmarks like this have four gaps, and the section fills them one at a time:

| Gap | Problem with classic QA | Benchmarks the slides use to fill it |
|---|---|---|
| Search complexity | One search, or recall, is enough | [BrowseComp](https://arxiv.org/abs/2504.12516), [BrowseComp-Plus](https://arxiv.org/abs/2508.06600) |
| Domain expertise | Broad web questions do not test expert knowledge | [MedBrowseComp](https://arxiv.org/abs/2505.14963), [FinSearchComp](https://arxiv.org/abs/2509.13160) |
| Answer quality | Short-answer matching cannot assess multi-document synthesis | [ScholarQABench](https://arxiv.org/abs/2411.14199), [ResearchQA](https://arxiv.org/abs/2509.00496) |
| Evidence support | A correct answer does not show the evidence was used correctly | [DeepResearch Bench](https://arxiv.org/abs/2506.11763) |

### Search complexity: BrowseComp writes questions backwards

[BrowseComp](https://arxiv.org/abs/2504.12516) (arXiv:2504.12516) has 1,266 human-written questions. The authors write them backwards: start from a known person, event, or artifact as the answer, hide its name, and combine several factual clues into one complex question. Difficulty is checked twice: models with search should fail and five Google searches should not suffice, and a human should still find it hard after 10 minutes. The paper notes the 10-minute rule was not strictly enforced; a second trainer attempted only a portion of the questions.

The slides' example asks for a fictional character. The question gives five clues, covering the character's narrative device, backstory, personality, and when their TV show aired and how many episodes it ran. Each clue on its own returns a pile of candidates; only the intersection converges. (The BrowseComp paper asks readers not to repost its example questions in plain text, so they don't leak into training data and contaminate the benchmark. This post therefore describes only the question's structure, not the question or its answer.)

The results on the slide (the five model rows match Table 3 of the BrowseComp paper):

| System | Accuracy |
|---|---|
| GPT-4o | 0.6% |
| GPT-4o + browsing | 1.9% |
| GPT-4.5 | 0.9% |
| OpenAI o1 (medium) | 9.9% |
| Deep Research (trained for this kind of task) | 51.5% |
| Human reference match (computed on the slide) | 25.3% |

The paper does not report the human row this way. Its numbers: trainers attempted 1,255 questions and solved 29.2%, giving up on the other 70.8% after two hours of searching; of the solved questions, 86.4% matched the reference answer. The slide's 25.3% multiplies the two (317 / 1,255).

Adding browsing barely helps; the jump comes from training the search behavior itself. The slides then show Figure 10(a) of the [Tongyi DeepResearch](https://arxiv.org/abs/2510.24701) report (arXiv:2510.24701): as context length grows from 8K to 128K, BrowseComp accuracy climbs from near zero to over 40% (values read off the plot). The report also says over 20% of its SFT samples exceed 32K tokens and involve more than 10 tool calls, and evaluation allows up to 128 tool calls per task. **Give the agent more room to search and accuracy follows.**

BrowseComp runs on the live web, where search APIs and pages keep changing, so two systems' scores are hard to compare fairly. [BrowseComp-Plus](https://arxiv.org/abs/2508.06600) (arXiv:2508.06600) freezes the corpus. It takes BrowseComp question–answer pairs, has o3 find evidence pages, has humans mark the spans that support each clue and the answer documents, then adds hard negatives. The slides describe them as related pages that miss a clue; in the paper, GPT-4o splits each question into about seven sub-queries, each is sent to Google search, and the returned pages become distractors. Of the original 1,266 questions, 830 passed human verification, and the fixed corpus is 830 questions over 100,195 documents. Once the corpus is fixed, you can isolate the retriever's contribution, which matters in the last section.

### Domain expertise: let experts write the questions

Broad web questions do not test expert judgment. In [FinSearchComp](https://arxiv.org/abs/2509.13160) (arXiv:2509.13160; ICLR 2026 per the slides), finance experts write questions from work scenarios or financial tables and cross-check answers against multiple sources; one or two other experts then solve each question blind, and a senior expert arbitrates when results disagree. The paraphrased example: how did Johnson & Johnson's international share of revenue change year over year during 2022–2024? The same idea appears in medicine with [MedBrowseComp](https://arxiv.org/abs/2505.14963) (linking trials, drugs, and regulatory facts), and in academic search with [ScholarSearch](https://arxiv.org/abs/2506.13784) and [AutoResearchBench](https://arxiv.org/abs/2604.25256) (find one paper, or find all matching papers).

### Answer quality: similarity metrics fail, so use rubrics

The slides reuse the opening question to show why long answers are hard to grade. A reference summary says "experts preferred OpenScholar in one study; parity across domains is unproven." Another valid summary says "one study favors OpenScholar; it does not establish equivalence across domains." A third says "…parity across domains **is** proven" — nearly identical to the reference in wording, and wrong. **There are several valid answers, and similarity to the gold answer is not enough.**

The evidence agrees. The slides cite [A Critical Evaluation of Evaluations for Long-form Question Answering](https://aclanthology.org/2023.acl-long.181/) (ACL 2023): across 109 expert comparisons with reference answers, using a similarity metric to pick the answer experts preferred gets ROUGE to 58%, BERTScore to 57%, and BLEURT to 62%, against a 50% chance baseline. The same table has a more embarrassing comparison: on the same expert comparisons (129 pairs, including fields with no reference answer), simply picking the longer answer scores 68%, higher than all three metrics.

The alternative is a rubric. In ScholarQABench, from the [OpenScholar paper](https://arxiv.org/abs/2411.14199), the Scholar-CS subset (100 questions) has PhD-level experts list the ingredients a good answer needs, marked must-have or nice-to-have; GPT-4o checks each one, and this part is 60% of the score, with the other 40% covering general criteria such as length, expertise, citations, and excerpts. The slides simplify this into a two-item weighted example: "reports a direct comparison with human experts" (weight 2) and "qualifies the conclusion by task and domain" (weight 1). A candidate that says "OpenScholar wins 70% of expert comparisons, and this holds across all fields" passes the first and fails the second, scoring (2×1 + 1×0) / 3 = 0.67. The Nature version of the paper measures agreement on whether a rubric item is satisfied, using outputs from two systems and two expert annotators: 0.80 between the experts and 0.79 between an expert and the LLM judge. The slides add that this covers 12 questions with 2 expert raters per answer; the question count is not in the paper's main text, so it follows the slides here.

Expert-written rubrics do not scale. [ResearchQA](https://arxiv.org/abs/2509.00496) (arXiv:2509.00496; TACL 2026 per the slides) mines questions from survey papers and uses LMs to generate rubrics, reaching 21K questions across 75 fields with 160K rubric items. The cost is that the rubric itself can be wrong. In the expert audit, an item is void if it is hard to judge, unclear, vacuous (for example, a mere rephrasing of the query), or erroneous (for example, citing a nonexistent paper). Of the three rubric types, parametric rubrics — generated from the model's own knowledge — had the highest void rate, 15%; the paper's final benchmark uses hybrid rubrics that merge survey content with model knowledge. The slides add one more failure: a vague criterion lets plausible errors pass. The slides' takeaway: **evaluate the rubric before using it to evaluate an answer** — ground criteria in sources, then audit their relevance and verifiability. [DeepResearch Bench II](https://arxiv.org/abs/2601.08536) does this: it derives criteria from expert-written investigative reports through four stages (LLM extraction, LLM self-evaluation, manual revision, and domain-expert review), ending with 132 tasks and 9,430 binary rubric items.

### Evidence support: check every citation

An answer can be right and still cite the wrong things. The FACT framework in [DeepResearch Bench](https://arxiv.org/abs/2506.11763) (arXiv:2506.11763; ICLR 2026 per the slides) has three steps: an LLM extracts each statement with its cited URL and merges duplicates, the cited page's text is fetched, and an LLM judges whether the page supports the statement; citation accuracy and average effective citations per task are computed from those judgments. In the slides' own example, "OpenScholar was compared with human answers [1]" is supported by the OpenScholar paper; "OpenScholar matches experts in every field [1]" is not, because the paper did not test every field. One of two claims holds, so citation accuracy is 50% and the effective citation count is 1.

With all four gaps filled, the slides' summary grid reads: the BrowseComp family covers search difficulty, MedBrowseComp and FinSearchComp cover domains, ScholarQABench and ResearchQA cover answer quality with rubrics, and DeepResearch Bench covers citation support. **No single benchmark covers all four cells**, so before picking one, decide which cell you are trying to measure.

## Modeling: how a deep research agent is trained

### The inference loop

The slides first unpack one inference: the model generates `<think>` reasoning → generates a `<tool>search(...)</tool>` call → the search runs → retrieved text is appended to the context → the model continues reasoning with the new evidence → it produces an `<answer>` with citations. This is the tool-calling loop from [L2](/en/posts/ai/2026-09-29-cmu-11768-lecture-02-tool-use-en); the only differences are that the tool is search and the output is a cited long answer.

### A three-stage recipe: mid-training, SFT, RL

The slides use Tongyi DeepResearch's pipeline as the template:

| Stage | Goal | Training data |
|---|---|---|
| Mid-training | Learn agent behavior at scale | Input + answer, teacher trajectories |
| SFT | Imitate successful demonstrations | Input + answer, teacher trajectories |
| RL | Learn from feedback on its own attempts | Input + answer, the policy's own rollouts |

The next question is where the tasks and trajectories come from.

**Synthesizing tasks by sampling a knowledge graph.** The slides cite [WebSailor-V2](https://arxiv.org/abs/2509.13305) (arXiv:2509.13305), which builds a dense knowledge graph, extracts subgraphs by random walk, and writes questions from them. The CMU example below is the slides' own illustration, with facts from the CMU archives and the Nobel Prize records. Nodes are entities and labeled arrows are relationships: Allen Newell was CMU faculty; Newell and Herbert Simon coauthored *Human Problem Solving* (1972); they shared the 1975 Turing Award; Simon won the 1978 economics Nobel Prize. Sample a connected subgraph, hide the target's name, and turn the relations into clues: "Which CMU researcher coauthored a book on human problem solving with a future economics Nobel laureate, and shared the Turing Award with that colleague three years before the Nobel Prize?" The answer, Allen Newell, is known in advance, so it can be checked automatically. It is the same logic as BrowseComp's hand-written questions, produced by machine at scale.

**SFT: collect, filter, then imitate.** A teacher model generates trajectories for these questions, and only those with a correct answer, a valid format, and a coherent trajectory are kept for SFT. This matches [WebDancer](https://arxiv.org/abs/2505.22648)'s three-stage filter (validity, correctness, quality); the Tongyi report calls it rejection sampling. Correct-but-malformed and well-formed-but-wrong trajectories are both dropped.

**Mid-training: get the base model used to agent workflows first.** Tongyi's mid-training is Agentic Continual Pre-training ([Scaling Agents via Continual Pre-training](https://arxiv.org/abs/2509.13310); ICLR 2026 per the slides): continue pretraining the base model on large amounts of synthesized agent-behavior data plus web text, tool-call records, and discarded trajectories. The slides compare two starting points with the same downstream SFT data (Pass@1, %; the paper's Table 3 SFT-B setting, with Qwen3-30B-A3B and AgentFounder-30B):

| Benchmark | Qwen3 base + SFT | AgentFounder base + SFT |
|---|---|---|
| BrowseComp-en | 28.6 | 39.9 |
| BrowseComp-zh | 35.6 | 43.3 |
| GAIA | 71.8 | 72.8 |

A better starting point carries through SFT. The paper tries three SFT datasets, and the BrowseComp-en gap is 4.5 (SFT-A), 11.3 (SFT-B), and 14.3 (SFT-C) points; the slides show the middle one.

### RLVR: answer correctness as the reward

For short-answer questions, correctness can be the reward directly. [Search-R1](https://arxiv.org/abs/2503.09516) (arXiv:2503.09516) uses only final-answer exact match as its reward. The slides' illustration (the question and rewards are the slides' own): the policy searches and reasons on one question, three sampled trajectories answer Herbert Simon, Allen Newell, and Allen Newell, matching against the known answer gives rewards 0, 1, 1, and those rewards update the policy.

The slides' update rule is GRPO from [DeepSeekMath](https://arxiv.org/abs/2402.03300) (the Search-R1 paper tries both PPO and GRPO): compare attempts within a group for the same question, raise the probability of those above the group average and lower those below. [L9](/en/posts/ai/2026-09-29-cmu-11768-lecture-09-rl-basics-en) covered the basic RL objective (maximize expected reward); GRPO in detail is the topic of [L11](/en/posts/ai/2026-09-29-cmu-11768-lecture-11-advanced-rl-en).

<details>
<summary>The GRPO objective (as shown on the slides)</summary>

$$
J(\theta) = \mathbb{E}\left[\min\left(\rho \hat{A},\ \mathrm{clip}(\rho, 1-\epsilon, 1+\epsilon)\hat{A}\right) - \beta D_{\mathrm{KL}}\right]
$$

- $\hat{A}$: relative reward within the group (compared with other attempts at the same question)
- $\mathrm{clip}$: limits the size of each update
- $\beta D_{\mathrm{KL}}$: keeps the policy near the reference model

The slides note the loss is computed only on model-generated tokens, not on tool output. This is Search-R1's retrieved-token loss masking.

</details>

**Asynchronous rollouts.** Trajectories use different numbers of tool calls; some finish in two turns, others take five. The slides score each trajectory when it finishes, assemble a batch of completed trajectories, then update the policy, with cached tool results, robust API handling, and background task curation for efficiency. The Tongyi report's version is a step-level asynchronous RL loop with separate asynchronous servers for inference and tool calls, plus tool-side result caching, timeout-and-retry, and backup APIs. Scheduling and training efficiency are deferred to L12 (RL Systems).

The Tongyi report's curves (Figure 8) show training reward rising steadily, while policy entropy rises briefly and then settles at a stable value. The slides add a caveat: these are RL training curves, and the report does not isolate each training stage.

### A reward for long reports: DR Tulu's evolving rubrics

Short answers can be exact-matched; long research reports cannot. The slides list what open-ended synthesis needs to measure: coverage, relevance, factuality, and whether claims are supported by citations.

[DR Tulu](https://arxiv.org/abs/2511.19399)'s answer is RLER (Reinforcement Learning with Evolving Rubrics). Each rollout produces a report, and its reward is the weighted average over rubric items:

$$
r_i = \frac{\sum_k w_k \cdot \mathrm{Judge}(c_k, y_i)}{\sum_k w_k}
$$

The key is that the rubric items $c_k$ are not fixed. The slides' diagram has two layers (the IL-10 example is the slides'):

- **Persistent rubrics**: before training, the question is searched on the web and an LM writes rubrics from the retrieved documents; these stay for the whole run, e.g. "cites 'IL-10-engineered T cells reduced colitis severity'."
- **New rubrics per instance**: generated during training by contrasting good and bad rollouts for the same question. One rollout says IL-10 suppresses macrophage TNF-α via STAT3 activation; another claims an anti-inflammatory signal increases a pro-inflammatory one. The contrast yields a positive item like "states the STAT3 mechanism" and a negative item like "contains wrong claims that the anti-inflammatory cytokine upregulates…".

These rubrics go into a rubric buffer that is used both for scoring and for generating the next round of rubrics. In the paper, negative rubrics mainly target reward hacking, such as copying retrieved text verbatim to boost citation scores. The buffer has a fixed size and keeps the items whose scores vary most across rollouts for the same question. A fixed rubric stops separating good from bad once the policy has learned it; evolving rubrics update with the information the policy newly finds and the mistakes it newly makes.

The slides' ablation (the paper's Figure 6, averaged over HealthBench, ScholarQABench v2, and DeepResearch Bench; values read off the plot) starts around 50%. Random rewards reach only about 51%; initial rubrics alone reach about 59% at 2,500 steps; evolving rubrics reach about 61%. The paper's text says removing evolving rubrics costs up to 2 points, with the gap widening over training. **The quality of the reward decides what RL learns** — a sentence that comes back in A2.

Two more results:

- **SFT as an RL warm start.** From the slides' plot (the paper's Figure 5; values read off the plot): RL without SFT starts around 27%, the curve labeled Undertrained SFT starts near 46%, and the full SFT mixture gives the strongest RL results, reaching about 62% by 4,000 steps. The slide's note "even 5% SFT helps" matches the paper's text: a cold start from just 5% of the full SFT mixture already beats RL with no SFT.
- **Cost.** The slides' cost/performance plot puts DR Tulu-8B in the top-left corner: scores in the same band as OpenAI Deep Research and GPT-5+Search, at a per-query cost orders of magnitude lower. The paper's numbers: across four long-form benchmarks (ScholarQA-CSv2, HealthBench, ResearchQA, DeepResearch Bench) DR Tulu-8B averages 65.6, 15.6 points above Tongyi DR (the abstract writes 15.6%) and 0.7% above OpenAI DR; on ScholarQA-CSv2 it costs about USD 0.0019 per query versus about USD 1.80 for OpenAI DR, nearly three orders of magnitude less.

## Retrieval: let the retriever see what the agent is thinking

### Tools and dense retrieval basics

Deep research agents use two kinds of search tools: local search over your own index (lexical retrievers like BM25, embedding models) and black-box APIs (web search, browsing). Tongyi also uses Python execution, and both Tongyi and DR Tulu use scholarly search (Tongyi via Google Scholar; DR Tulu uses paper search 90% of the time on ScholarQA-CSv2).

Embedding retrieval follows the dual encoder of [Dense Passage Retrieval](https://aclanthology.org/2020.emnlp-main.550/) (EMNLP 2020): encode the document collection with a document encoder and build a vector index; encode the query with a query encoder; score by inner product $s(q,d) = E_q(q)^\top E_d(d)$ and retrieve the top k. Training uses contrastive learning, pulling the query toward a relevant passage and away from negatives:

$$
L = -\log \frac{\exp s(q, d^+)}{\exp s(q, d^+) + \sum_{d^-} \exp s(q, d^-)}
$$

The slides leave encoder design, negative sampling, and indexing to Advanced NLP and IR courses.

### The problem: the retriever only sees the last query

The agent's context holds the original task, previous reasoning, previous queries and evidence, and the current reasoning — but only the latest query is passed to the retriever. The reasoning spells out what the agent is looking for right now and why, and the retriever never sees it.

[AgentIR](https://arxiv.org/abs/2603.04384) (arXiv:2603.04384; COLM 2026 per the slides) changes two things:

1. **Input**: encode the current reasoning $\tau_t$ together with the query $q_t$.
2. **Training data (DR-Synth)**: standard retriever training has positives and negatives for the whole question, but each intermediate search in a trajectory wants something different, so you need local labels for "which documents help this turn." DR-Synth takes the top 50 documents from a conventional query-only retriever at this turn, puts the question's global positive documents at the front, and has an LLM run a listwise rerank using this turn's query plus the global question and answer; the top-ranked document becomes the positive and the bottom seven become hard negatives. Applied to WebShaper, this yields 5,238 training instances used to fine-tune Qwen3-Embedding-4B into AgentIR-4B.

### Results

On BrowseComp-Plus, the AgentIR paper reports 68% accuracy for AgentIR-4B with Tongyi-DeepResearch, versus 52% for a conventional embedding model twice its size and 37% for BM25. The slides' scatter plot adds a second axis: AgentIR is more accurate **and uses fewer search calls on average**, with the same trend for gpt-oss-120B and GLM-4.7 as the agent.

The ablation separates the two changes (the paper's Table 2, accuracy, %; "+ Reasoning" prepends the reasoning to the query with no extra training):

| Agent | Query only | + Reasoning | + DR-Synth | Both (AgentIR) |
|---|---|---|---|---|
| Tongyi-DR | 48.7 | 55.5 | 59.4 | 66.3 |
| gpt-oss-120B | 47.6 | 51.3 | 59.2 | 67.0 |
| GLM-4.7 | 50.5 | 50.9 | 57.5 | 64.7 |
| Tongyi-DR (visit) | 50.2 | 54.0 | 59.5 | 68.1 |

Each change helps on its own, and combining them is best.

The last ablation asks which history helps retrieval most. All retrievers use DR-Synth; only the input changes (the paper's Table 3, accuracy, %; the paper also has a "global question" column, which the slides and this table omit):

| Agent | Query only | Prior queries | Queries + reasoning | Queries + reasoning + docs | Current reasoning (AgentIR) |
|---|---|---|---|---|---|
| Tongyi-DR | 59.4 | 63.1 | 63.1 | 60.0 | 66.3 |
| gpt-oss-120B | 59.2 | 61.9 | 64.3 | 58.7 | 67.0 |
| GLM-4.7 | 57.5 | 59.1 | 60.8 | 58.7 | 64.7 |
| Tongyi-DR (visit) | 59.5 | 63.0 | 66.3 | 61.5 | 68.1 |

**The current step's reasoning is the strongest signal.** Adding previously retrieved documents scores below "queries + reasoning" in all four settings, so more history is not automatically better.

## Q&A and spoken remarks from the recording

Everything in this section comes from the recording and is not on the slides. These are Akari Asai's or students' spoken words; I summarize the points, and the numbers and judgments are the speaker's.

### Two reasons she gave that are not on the slides

- **Why BrowseComp-Plus exists.** To score well on BrowseComp, an agent makes on the order of a hundred search calls per trajectory. Hitting a real search API every time is expensive and slow, and Google's results change almost daily, so the same experiment cannot be reproduced the next day. BrowseComp-Plus fixes the corpus to remove that problem.
- **The cost of writing rubrics.** She said that in the OpenScholar work, one rubric took a PhD-level expert almost an hour. That is why people want LMs to generate rubrics automatically, and why rubric quality becomes the bottleneck.

### Advice for the final project

Someone in the room (the recording does not say who) asked: if you want a deep research project, which benchmark should you use? Her answer:

| If you want to… | Her suggestion | Reason (spoken) |
|---|---|---|
| Work on short, verifiable questions | [BrowseComp](https://arxiv.org/abs/2504.12516) | It has some issues but high-quality questions; good for trying methods such as context management and for seeing inference-time scaling. Downside: it is large and needs many searches |
| Cut inference cost, or do retrieval research | [BrowseComp-Plus](https://arxiv.org/abs/2508.06600) | Fixed corpus, no live API, and you can train your own embedding model to compare |
| Open-ended long answers | [DeepResearch Bench](https://arxiv.org/abs/2506.11763) (she named the second version) | Automatic grading still has problems, but the second version is relatively high quality; she said the first version is widely used and its scores are already very high |
| An expert domain | [FinSearchComp](https://arxiv.org/abs/2509.13160) | Her verdict was "decent"; there are also newer domain benchmarks she did not cover |

### Which model and which search tool

- **Baseline models.** There are now many 8B-scale deep research models, and Qwen models are common baselines on BrowseComp and BrowseComp-Plus. Beating the newest large proprietary models is hard, she warned; but if you target a specific task with a careful training recipe, beating a proprietary deep research product on one benchmark is possible, and that is a valid project direction.
- **Search tool.** A web search API is the safest start; she mentioned Serper as stable and fast enough. But RL repeats searches over many steps and many rollouts per step, and that is costly: she said that in a recent deep research training run, **a single RL run cost roughly $3,000 to $4,000 in search API fees alone** (spoken; she did not say which model or setup).
- **Cheaper options.** Use BrowseComp-Plus, or a local index during training: BM25, or Qwen3 4B/8B embedding models, which you can choose from the MTEB leaderboard.
- **For retrieval researchers.** She said not to chase the top number on one benchmark; show the method works across agents, for example strong public agents such as GPT-OSS or GLM, instead of tuning for a single agent.

### Where small models fall short of frontier models

Someone asked what an 8B specialist lacks that keeps it from beating frontier models. She started by saying it is hard to win, then split tasks into two kinds:

- **Long-horizon tasks like BrowseComp.** Frontier models are clearly stronger. She guessed small models lack the ability to manage many search calls, long contexts and planning, which SFT does not fix; even the 32B Tongyi DeepResearch does not catch the best models.
- **Open-ended long answers (HealthBench, ScholarQABench, DeepResearch Bench).** The challenge is not managing long context but collecting enough information and synthesizing a high-quality long answer, and she did not see a big gap there. She also admitted it may be that our way of grading long answers is not good enough to reveal one.

### The biggest bottleneck is evaluation

Asked about the biggest bottleneck in deep research today, she said **evaluation**, for concrete reasons:

1. For short-form tasks, once you know the target you can reverse-engineer the benchmark and borrow recipes from math and coding reasoning, so the numbers look great.
2. Open-ended tasks long lacked a decent benchmark, and without evaluation you cannot use it for rejection sampling or as an RL reward.
3. Rubric grading on existing long-form benchmarks has its own biases, such as favoring longer answers; BrowseComp questions are fairly synthetic, and whether they reflect real user needs is still open.
4. The gap she is working on: today's benchmarks grade the final answer, but people use deep research to change their next action, make a decision, or find a bug in code. **No benchmark measures whether the research result helps someone complete the downstream task.**

### Can evolving rubrics be used elsewhere

Asked whether DR Tulu's evolving rubrics apply to other open-ended benchmarks, she said her group did not try it, but other papers have used similar ideas for general chat (for example Arena-Hard). She thinks rubric-based RL is quite general, and heard that frontier labs are still working out how to optimize when there is no clean binary reward.

Other spoken details about rubrics:

- **How rollouts are contrasted.** During training, 8 trajectories are sampled per question, and an LM reads their final answers and generates positive and negative rubrics that separate good from bad. She said they did not ablate the number of trajectories or whether to look at intermediate steps.
- **Rubric weights.** She said they did not spend time estimating the importance of each item, because even experts often disagree about which items matter most; another direction to study.
- **How strong the rubric generator must be.** Final training used GPT-4.1 to generate rubrics. They also tried a Qwen base model, which still gave a large improvement, but to maximize performance GPT-4.1 was about 10 points better. Rubrics are generated at every training step, so a proprietary model is quite expensive; she said recent papers train open rubric-generation models, but those are mostly validated on short-form reward benchmarks, so whether they can replace a strong model is still open.
- **Why do a little SFT first.** Her spoken account of the ablation: starting RL from a Qwen base without SFT reached only about 40% at 600 steps; with just 5% of the SFT data (undertrained SFT) the same 600 steps gave about 10 points more. Because of compute limits, DR Tulu ran only one baseline out to 4,000 steps.

### Contamination, and answers that leak in

Asked how to tell search apart from memorized answers:

- BrowseComp was built by checking that the frontier models of the time could not answer; but she was candid that frontier labs' pretraining and post-training data are probably contaminated, so it is hard to be sure GPT-6 has not seen these questions.
- Newer papers run recent models on BrowseComp without search and still see no more than about 20% (her statement; she did not name the paper).
- A hole that is easy to miss: in DR Tulu's evaluation she found that without a blocklist, the agent retrieves the answers straight from Hugging Face or the original dataset page. **When evaluating a search agent, block at least Hugging Face and other sources of the original dataset.**

## The four-line summary

The final slide:

1. **Tasks**: deep research combines many searches with evidence synthesis.
2. **Evaluation**: assess answer quality and citation support; audit the rubrics too.
3. **Training**: learn from demonstrations, then improve through task feedback.
4. **Retrieval**: give retrievers the agent's information need and train for it.

## Things you can try tonight

- **Run a FACT-style check on your own research agent.** Take one recent report, extract every "claim + citation" into its own line, open each link, and check whether the page supports the sentence. Compute citation accuracy. This tells you where your agent breaks faster than any benchmark.
- **Search again with "reasoning + query."** If your agent uses embedding retrieval, feed the reasoning it wrote before searching into the query encoder along with the query, and compare the top 5 results before and after. No retraining needed to see whether the signal is there.
- **Audit your rubric before you use it.** Write 3–5 rubric items for one research question and ask of each: does it cite something that does not exist? Does it just restate the question? Would a plausible wrong answer pass it?

## Where it sits in the course

L10 is the third lecture of the Domains module, placed in the middle of the Training module: [L8](/en/posts/ai/2026-09-29-cmu-11768-lecture-08-sft-en) covered SFT and L9 RL basics before it, while [L11](/en/posts/ai/2026-09-29-cmu-11768-lecture-11-advanced-rl-en) covers advanced RL algorithms and L12 RL systems after it. So the modeling half of this lecture is essentially a worked application of L8 and L9 — data synthesis, rejection-filtered SFT, RLVR, and GRPO, all landed on a search agent.

It also sets up [Assignment 2 (Eval)](/en/posts/ai/2026-09-29-cmu-11768-assignment-2-eval-en). A2 asks students to write a validator for a data-visualization agent and runs into the same problems this lecture's evaluation section lists: more than one valid answer, unreliable similarity, and LM judges that need auditing. DR Tulu shows the next step: once the grader is good enough, it becomes the RL reward.

## Further reading

For the series overview, see [the course overview post](/en/posts/ai/2026-09-29-cmu-11768-course-overview-en).

Related posts on this site to read alongside the lecture:

- [Deep Research Landscape: Taxonomy of 80+ Implementations, Roadmap, and Trade-offs](/en/posts/ai/2026-09-19-deep-research-survey-overview-en)
- [How to Build a Deep Research Agent: Multi-Turn Search Planning, Conflict Resolution, and Verifiable Conclusions](/en/posts/ai/2026-06-04-autonomous-deep-research-agent-en)
- [From Search Results to Reliable Citations: URL Deduplication, Source Tiers, and Claim-Source Mapping](/en/posts/ai/2026-08-22-search-results-reliable-citations-en)
- [CS336 Lecture 16: RLVR Scales Reasoning with Verifiable Rewards, but GRPO Is Not Free PPO](/en/posts/ai/2026-08-22-cs336-rlvr-en)
- [Reading Stanford CS329Z Week 7: Score Honestly, Scale Data — Midterm Checkpoint](/en/posts/ai/2026-09-15-stanford-cs329z-week7-eval-benchmarks-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Corrected the video status. The Lecture 10 recording is now published, so the "pending" label no longer applied; the video is embedded, and the text is still based on the slides pending a video-based revision.
- 2026-10-10: Revised Lecture 10 against the official recording's captions: added the section "Q&A and spoken remarks from the recording" (project benchmarks, models and search tools, small-vs-frontier gap, the evaluation bottleneck, spoken details on evolving rubrics, contamination and blocklists) and updated the opening note.
- 2026-10-10: Checked the video content against its transcript. No changes needed; the transcript matches the figures and statements in the spoken-remarks section.

## References

Every source below was opened in full (arXiv HTML, ACL Anthology PDF, the Nature full-text page, or the original web page) and checked against the passages cited in the post.

Course materials:

- [CMU 11-768 AI Agents course site](https://www.cmu-agents.com/)
- [Lecture 10 slides: Deep Research Agents (Akari Asai)](https://www.cmu-agents.com/slides/lecture-10-deep-research-agents.pdf)
- [Natural Questions data browser](https://ai.google.com/research/NaturalQuestions/databrowser): the official train-set examples include "who wrote the score for the force awakens", whose document is the [2018 revision of Wikipedia's "Star Wars: The Force Awakens (soundtrack)"](https://en.wikipedia.org/w/index.php?oldid=824425456); its first paragraph names John Williams as the composer (checked 2026-09-29)

Assigned readings:

- [OpenScholar: Synthesizing Scientific Literature with Retrieval-augmented LMs (arXiv:2411.14199)](https://arxiv.org/abs/2411.14199); [Nature version](https://www.nature.com/articles/s41586-025-10072-4) (the 0.79 / 0.80 rubric agreement figures are from the Nature version's Methods)
- [BrowseComp: A Simple Yet Challenging Benchmark for Browsing Agents (arXiv:2504.12516)](https://arxiv.org/abs/2504.12516)
- [DeepResearch Bench: A Comprehensive Benchmark for Deep Research Agents (arXiv:2506.11763)](https://arxiv.org/abs/2506.11763)
- [Tongyi DeepResearch Technical Report (arXiv:2510.24701)](https://arxiv.org/abs/2510.24701)
- [DR Tulu: Reinforcement Learning with Evolving Rubrics for Deep Research (arXiv:2511.19399)](https://arxiv.org/abs/2511.19399)
- [AgentIR: Reasoning-Aware Retrieval for Deep Research Agents (arXiv:2603.04384)](https://arxiv.org/abs/2603.04384)

Other papers cited on the slides and used to support this post:

- [BrowseComp-Plus: A More Fair and Transparent Evaluation Benchmark of Deep-Research Agent (arXiv:2508.06600)](https://arxiv.org/abs/2508.06600) (the slides cite it as "A Fair and Disentangled Evaluation Benchmark for Deep Search Agents," ACL 2026)
- [FinSearchComp: Towards a Realistic, Expert-Level Evaluation of Financial Search and Reasoning (arXiv:2509.13160)](https://arxiv.org/abs/2509.13160)
- [MedBrowseComp: Benchmarking Medical Deep Research and Computer Use (arXiv:2505.14963)](https://arxiv.org/abs/2505.14963)
- [ScholarSearch: Benchmarking Scholar Searching Ability of LLMs (arXiv:2506.13784)](https://arxiv.org/abs/2506.13784)
- [AutoResearchBench: Benchmarking AI Agents on Complex Scientific Literature Discovery (arXiv:2604.25256)](https://arxiv.org/abs/2604.25256)
- [A Critical Evaluation of Evaluations for Long-form Question Answering (ACL 2023)](https://aclanthology.org/2023.acl-long.181/)
- [ResearchQA: Evaluating Scholarly Question Answering at Scale Across 75 Fields with Survey-Mined Questions and Rubrics (arXiv:2509.00496)](https://arxiv.org/abs/2509.00496)
- [DeepResearch Bench II: Diagnosing Deep Research Agents via Rubrics from Expert Reports (arXiv:2601.08536)](https://arxiv.org/abs/2601.08536)
- [WebSailor-V2: Bridging the Chasm to Proprietary Agents via Synthetic Data and Scalable Reinforcement Learning (arXiv:2509.13305)](https://arxiv.org/abs/2509.13305)
- [WebDancer: Towards Autonomous Information Seeking Agency (arXiv:2505.22648)](https://arxiv.org/abs/2505.22648)
- [Scaling Agents via Continual Pre-training (arXiv:2509.13310)](https://arxiv.org/abs/2509.13310)
- [Search-R1: Training LLMs to Reason and Leverage Search Engines with Reinforcement Learning (arXiv:2503.09516)](https://arxiv.org/abs/2503.09516)
- [DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (arXiv:2402.03300)](https://arxiv.org/abs/2402.03300)
- [Dense Passage Retrieval for Open-Domain Question Answering (EMNLP 2020)](https://aclanthology.org/2020.emnlp-main.550/)
