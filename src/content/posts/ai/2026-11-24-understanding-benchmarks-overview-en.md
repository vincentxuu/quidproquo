---
title: "How Much Can You Trust a Benchmark Score? The Five Stages from Question to Leaderboard"
date: 2026-11-24
category: ai
type: deep-dive
tags: [benchmark, llm-evaluation, evaluation, agent-evaluation]
lang: en
tldr: "A benchmark score passes through five stages, question design, grading, execution, reporting, and the leaderboard, and each one can move the number by tens of points: the same o4-mini drops from 54% to 6% on SWE-bench Verified Mini when its agent scaffold changes, and an agent that does nothing scores 38% on τ-bench's airline tasks. When you see a score, first ask which stage set it."
description: "Overview of the Understanding AI Benchmarks series: what a benchmark is, the five stages a score passes through from question to leaderboard and the typical distortion at each, and a map of the 25 parts grouped into components, distortions, families, reading, and building."
series:
  name: "Understanding AI Benchmarks"
  order: 0
glossary:
  - term: "scaffold"
    aliases: ["harness", "agent scaffold"]
    definition: "The code that wraps a model into an agent: what prompt it gets, which tools it can use, how many steps it may take, and when it stops."
    context: "Swapping the scaffold around the same model effectively swaps the test-taker."
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-24-understanding-benchmarks-overview)

Same o4-mini, same SWE-bench Verified Mini (50 real code-fixing tasks). Run inside SWE-Agent, a scaffold built for fixing code, it solves 54%. Run inside the general-purpose HAL Generalist, it solves 6% (appendix table of the [HAL paper](https://arxiv.org/abs/2510.11977)).

Same GLM-4.6, same [GPQA Diamond](https://arxiv.org/abs/2311.12022) (graduate-level science multiple choice). Called directly through the developer Z.ai's API, four runs land at roughly 73%–83%. Routed through [OpenRouter](https://openrouter.ai) to a different inference provider, four runs land at roughly 2%–21% ([Epoch AI](https://epoch.ai/gradient-updates/why-benchmarking-is-hard)).

Both are benchmarks: standardized exams for comparing AI models. Neither experiment changed the model, and nobody cheated; what changed was how the score was measured.

That measuring process is what this series takes apart. Between a question being written and a rank appearing on a leaderboard, which stages does a model release number pass through? How does each stage push it off? And how do you avoid the same traps when you build an evaluation yourself? This post is the entry point: what a benchmark is, one diagram that strings the five stages together, and a map of all 25 parts.

## What a benchmark is

A benchmark is a fixed exam plus a fixed way of marking it. It specifies a set of questions, what counts as a correct answer, how the model is asked to answer, and how the per-question results are rolled up into one number. Scores are comparable only because everyone sits the same exam under the same marking rules.

Three common examples look very different:

- **[MMLU](https://arxiv.org/abs/2009.03300)**: four-option multiple-choice questions across 57 subjects. The original method checks which of A, B, C, D the model assigns the highest probability and compares it with the answer key.
- **[SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)**: each task is a real GitHub issue. The model under test, usually wrapped in an agent, edits the code; the project's unit tests then run, and the task counts as solved only if they pass. Verified is the 500-task subset that OpenAI had developers with Python experience screen by hand.
- **[Chatbot Arena](https://arxiv.org/abs/2403.04132)**: there is no answer key. A user asks a question, two anonymous models each answer, and the user votes for the better one; the platform turns many votes into a score and rank for each model.

Model developers use benchmarks to show a new model got better. Third parties such as [Epoch AI](https://epoch.ai/benchmarks) and [HAL](https://hal.cs.princeton.edu) rerun them to cross-check. People choosing a model use them to shorten the list. All three look at the same number, but the settings behind it are often known only to whoever ran it.

## The life of a score

From the moment a question is written to the moment a rank shows up on a leaderboard, a score passes through at least five stages. Someone makes decisions at each stage, and every decision changes the final number.

```diagram
title: The life of a benchmark score
desc: A score passes through question design, grading, execution, reporting, and the leaderboard in turn; each stage has one typical distortion, linked to the part of the series that covers it.
caption: One typical distortion per stage; the series map lists the others.
step: Question design: where the items come from and what ability they target
step: Grading: how a single item is marked correct
step: Execution: which scaffold, API provider, and settings are used
step: Reporting: how many items and runs, and whether error bars are given
step: Leaderboard: many scores turned into one rank
---
<svg viewBox="0 0 440 544">
  <path class="dg-line" data-step="2" d="M220 96V120" marker-end="url(#arrow)"/>
  <path class="dg-line" data-step="3" d="M220 204V228" marker-end="url(#arrow)"/>
  <path class="dg-line" data-step="4" d="M220 312V336" marker-end="url(#arrow)"/>
  <path class="dg-line" data-step="5" d="M220 420V444" marker-end="url(#arrow)"/>

  <g data-step="1">
    <rect class="dg-box" x="20" y="16" width="400" height="80" rx="6"/>
    <g class="dg-badge"><circle cx="44" cy="36" r="10"/><text x="44" y="36" text-anchor="middle" dominant-baseline="central">1</text></g>
    <text class="dg-label" x="64" y="36" dominant-baseline="central">Question design</text>
    <text class="dg-sub" x="64" y="58" dominant-baseline="central">Where items come from, what they target</text>
    <text class="dg-sub dg-text--warn" x="64" y="78" dominant-baseline="central">Seen before, too easy, off-target → Parts 3–5</text>
  </g>
  <g data-step="2">
    <rect class="dg-box" x="20" y="124" width="400" height="80" rx="6"/>
    <g class="dg-badge"><circle cx="44" cy="144" r="10"/><text x="44" y="144" text-anchor="middle" dominant-baseline="central">2</text></g>
    <text class="dg-label" x="64" y="144" dominant-baseline="central">Grading</text>
    <text class="dg-sub" x="64" y="166" dominant-baseline="central">How one item is marked correct</text>
    <text class="dg-sub dg-text--warn" x="64" y="186" dominant-baseline="central">Wrong answer keys, gamed graders → Parts 7–8</text>
  </g>
  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="20" y="232" width="400" height="80" rx="6"/>
    <g class="dg-badge dg-badge--accent"><circle cx="44" cy="252" r="10"/><text x="44" y="252" text-anchor="middle" dominant-baseline="central">3</text></g>
    <text class="dg-label" x="64" y="252" dominant-baseline="central">Execution</text>
    <text class="dg-sub" x="64" y="274" dominant-baseline="central">Which scaffold, API provider, settings</text>
    <text class="dg-sub dg-text--warn" x="64" y="294" dominant-baseline="central">Settings move it tens of points → Part 6</text>
  </g>
  <g data-step="4">
    <rect class="dg-box" x="20" y="340" width="400" height="80" rx="6"/>
    <g class="dg-badge"><circle cx="44" cy="360" r="10"/><text x="44" y="360" text-anchor="middle" dominant-baseline="central">4</text></g>
    <text class="dg-label" x="64" y="360" dominant-baseline="central">Reporting</text>
    <text class="dg-sub" x="64" y="382" dominant-baseline="central">How many items and runs, how much error</text>
    <text class="dg-sub dg-text--warn" x="64" y="402" dominant-baseline="central">The gap sits inside the noise → Part 2</text>
  </g>
  <g data-step="5">
    <rect class="dg-box" x="20" y="448" width="400" height="80" rx="6"/>
    <g class="dg-badge"><circle cx="44" cy="468" r="10"/><text x="44" y="468" text-anchor="middle" dominant-baseline="central">5</text></g>
    <text class="dg-label" x="64" y="468" dominant-baseline="central">Leaderboard</text>
    <text class="dg-sub" x="64" y="490" dominant-baseline="central">Many scores become one rank</text>
    <text class="dg-sub dg-text--warn" x="64" y="510" dominant-baseline="central">The best run gets posted → Parts 9, 19</text>
  </g>
</svg>
```

Both contrasts at the top happen at stage 3, which is why the diagram highlights it. But all five stages move the number, so let's walk through them one at a time.

### 1. Question design: what does this exam measure?

Whoever writes the benchmark decides where the items come from: exam banks, expert-written questions, real GitHub issues, or programmatic generation. They also decide whether the items are public, and what ability the items together are supposed to "represent."

The most common distortion is **the model has seen the exam before**. Public questions get crawled into the web and then into the next generation's training data. In February 2026 OpenAI [stopped reporting SWE-bench Verified](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/), partly because every frontier model they probed could reproduce the reference fix or the problem text for some tasks. Their conclusion was that gains on the benchmark "increasingly reflect how much the model was exposed to the benchmark at training time."

The same stage has two more problems. One is items that are too easy, so the top models all bunch up above 90 and can no longer be told apart (Part 4). The other is items that actually measure something else: on an exam called "reasoning," lost points may come mostly from the model not following the required answer format (Part 5).

### 2. Grading: how is one item marked correct?

The grading rule turns a model's answer into right or wrong. Four kinds are common: exact match against an answer key, running tests to see whether code passes, asking another model to judge, and human votes.

When grading is wrong, scores can move in either direction. An upward example is [τ-bench](https://arxiv.org/abs/2406.12045). Some of its airline customer-service tasks are deliberately impossible, and success means "the database is left unchanged." So an agent that does nothing at all scores 38% on the airline subset, higher than the GPT-4o agent reported in the original paper (35%) ([ABC](https://arxiv.org/abs/2507.02825)).

A downward example comes from SWE-bench Verified. OpenAI went back to the 138 tasks that o3 could not solve reliably across 64 runs and found problems with the tests or the problem statement in more than half of them. One class was tests that reject functionally correct fixes, so a model that got it right was still marked wrong.

Wrong answer keys are Part 7; agents actively exploiting the grader (for example, rewriting the tests so they always pass) are Part 8.

### 3. Execution: which settings was it run with?

Even with the questions and the grader fixed, the same model can produce very different scores. "Running" it involves a long list of choices: which agent scaffold, which API provider, which inference engine, how much reasoning effort, how much time per task, how the prompt is written.

Both opening examples live here. HAL swapped the scaffold. Epoch swapped the API provider; the low scores came mainly from rate limits, empty responses, and truncated responses, all of which the experiment counted as wrong answers. The Epoch researchers' conclusion: "Bugs and instabilities in the chosen API provider are the biggest source of evaluation errors, which particularly affects newer models."

When a developer's own number and a third party's rerun disagree, it is usually because the settings at this stage differ, not necessarily because anyone lied. Part 6 takes these settings apart one by one.

### 4. Reporting: how much information comes with the number?

A benchmark score is the result of sampling a batch of questions from all the questions you could have asked. Draw a different batch and the score moves, and the fewer the questions, the more it moves. So a score needs at least the number of items, the number of runs, and the size of the error, before a reader can tell whether the gap between two scores is real or luck.

Most benchmarks report none of this. An Oxford-led review of 445 benchmark papers found that only 16.0% used statistical tests or uncertainty estimates when comparing models ([Bean et al.](https://arxiv.org/abs/2511.04703)). Anthropic's Evan Miller worked through the item count with illustrative parameters he calls reasonable ([Adding Error Bars to Evals](https://arxiv.org/abs/2411.00640)): telling apart two models 3 percentage points apart with 80% power takes about 1,000 questions. The SWE-bench Verified Mini from the opening has 50.

How to estimate a score's error, and how big a gap has to be on a 50-item test before it means anything, is the subject of Part 2.

### 5. Leaderboard: many scores become one rank

The last stage turns scores into ranks: leaderboards, developers' release tables, and aggregate indices that compress dozens of benchmarks into one number. This stage decides which number gets seen.

The classic bias is **posting the best attempt**. The maximum of several noisy measurements is, in expectation, higher than a single measurement. [The Leaderboard Illusion](https://arxiv.org/abs/2504.20879) counted as many as 27 Meta models being tested privately on Chatbot Arena in the single month before the Llama 4 release; a developer can then publish only the best of them. Aggregate indices have the same structure: for the same model, Epoch's ECI [takes the highest score on each benchmark](https://epoch.ai/data/eci-documentation/data) across reasoning-effort levels and providers, and the leaderboard tables in the HAL paper show each combination's best run.

So a leaderboard number is closer to "what this model gets under the most favorable settings" than to what you will see day to day once you plug in the API. Arena's governance issues are Part 9; aggregate indices are Part 19.

## Series map: what each section answers

The 25 parts fall into five sections, ordered from the visible to the invisible: first take the components apart, then cover the abstract distortion mechanisms, then revisit those mechanisms on concrete benchmarks, and finally do it yourself.

1. **Components** (Parts 0–2): what a benchmark is made of, and how big a score's error is.
2. **Distortions** (Parts 3–9): why scores mislead, one mechanism per part, spread across the question design, grading, execution, and leaderboard stages in the diagram.
3. **Families** (Parts 10–18): the major benchmarks dissected one by one. Each opens with a short "pitfalls this benchmark has hit" table linking back to the mechanisms in Parts 3–9.
4. **Reading** (Parts 19–20): how to read aggregate indices, and a checklist for a release table. The checklist follows the five stages in this post.
5. **Building** (Parts 21–24): building an evaluation for your own product. Now you are the one writing the exam, every earlier pitfall becomes something to guard against, and the four parts go in the order of questions, graders, running and reporting, and maintenance.

| Part | Title | Question it answers |
|---|---|---|
| 0 | Overview: the life of a score (this post) | Which stages does a benchmark score pass through from question to leaderboard, and how does each go wrong? |
| 1 | [Taking a benchmark apart](/posts/ai/2026-11-24-benchmark-anatomy-en) | Which components make up a benchmark, and what does each do? |
| 2 | How big is a score's error? | Two models are 3 points apart; is that a real difference? |
| 3 | Contamination: the exam was seen | How does a model end up having "seen the exam," how much does that inflate the score, and how do you detect it? |
| 4 | Saturation: the exam is too easy | Why do scores stop being useful once everyone is above 90, and which designs delay that day? |
| 5 | Measuring what you mean to measure | Does a benchmark called "reasoning" actually measure reasoning? |
| 6 | Same model, different scores | Why does the same model's score swing by tens of points when you change the harness, API provider, or inference engine? |
| 7 | When the answer key is wrong | When reference answers or tests are wrong, which way does the score move? |
| 8 | How test-takers react to the test | Why do agents exploit graders, and what happens when a model knows it is being tested? |
| 9 | Leaderboards built on human votes | What do Arena scores mean and not mean, and where are the governance problems? |
| 10 | Knowledge: from MMLU to HLE | From recycled exam questions to expert-written items to model-filtered items, what did each step fix and what did it introduce? |
| 11 | Math: from competitions to open problems | Why did math benchmarks reach "verifiable answers" first, and why did even competition problems eventually fall short? |
| 12 | The SWE-bench family | Using real GitHub issues as tasks, why are three generations still fixing the same problem? |
| 13 | Terminal-Bench and Harbor | How do you write an agent task in a terminal, and how do you stop it from cheating? |
| 14 | ARC-AGI | To measure "efficiency at learning new skills" rather than "how many skills it has," how do you write the questions? |
| 15 | Interactive agent environments | Once grading checks the final state of an environment instead of an answer, what new problems appear? |
| 16 | Time horizons | How do you measure "how long a task AI can do," and how far can you trust the doubling time? |
| 17 | Economic-value evaluations | How do GDPval and the Remote Labor Index measure "how much paid work can be replaced"? |
| 18 | Chinese and Traditional Chinese benchmarks | Why are English scores not enough, and what can Traditional Chinese benchmarks measure and miss? |
| 19 | Reading aggregate indices | When dozens of benchmarks are compressed into one number, what is lost? |
| 20 | Reading a model release table | Given a developer's benchmark table, which questions do you ask, in what order? |
| 21 | Build your own: from failures to questions | For your own product, where do the first questions come from, how many do you need, and how do you define what you are measuring? |
| 22 | Build your own: graders | Exact match, executed tests, or an LLM judge, and how do you validate the grader itself? |
| 23 | Build your own: running and reporting | How do you run an evaluation reproducibly, in isolation, with logs, and report results with error bars? |
| 24 | Build your own: maintenance and retirement | After launch, how do you guard against contamination, rotate questions, and decide when to retire it? |

Parts not yet published are listed by title; links will be added as they go up.

## Where to start

Pick a route by the question you have:

- **You just want to read developers' release tables**: this post → Part 2 (error) → Part 6 (settings) → Part 20 (checklist). After those four, the next time you see "we lead by 2 points on X," you will go looking for the item count and the settings first.
- **You need to build an evaluation for your product**: this post → Part 1 (components) → Part 2 → Parts 21–24. Part 21 opens with a table mapping each distortion mechanism to what to do when writing questions; you can read that first and come back to Parts 3–9 later.
- **You care about one particular benchmark**: jump to its part among Parts 10–18 and follow the pitfalls table back to the mechanism parts.

A few earlier posts on the site work as side reading. [How to Read a Model's Report Card](/posts/ai/2026-08-26-understanding-ai-models-evaluation-en) covers three traps, cherry-picking, contamination, and saturation, in a single post, for readers who want the big picture first. [How to Read 2026 Coding Benchmarks](/posts/ai/2026-08-26-coding-benchmarks-how-to-read-en) compares six coding benchmarks side by side. [AI Model Evaluation Sources](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) lists where to find evaluations, including the multimodal and speech ones this series leaves out.

## What this series does not cover

- **It leans toward English, text, and code.** Benchmarks were chosen starting from the list Epoch tracks and from major labs' technical reports, so it favors the ones frontier labs report. Image, video, and speech generation evaluations are out of scope; see the evaluation sources guide above.
- **Chinese coverage is limited to Simplified and Traditional Chinese**, concentrated in Part 18; Japanese, Korean, and other languages get only a passing mention.
- **Statistics goes only as far as you need to make a call.** Formulas for standard errors and confidence intervals sit in collapsible sections, without full derivations.
- **Leaderboard numbers go stale.** Every rank and score cited carries its source and date; read it as of that date.

## Self-check

1. Two models on a developer's table are 2 points apart. What do you ask first? Criterion: any one of these counts.
   - Error: how many items the benchmark has, and whether 2 points is inside the noise (Part 2).
   - Settings: whether both scores came from the same scaffold, reasoning effort, and API provider (Part 6).
   - Question source: how long the items have been public, and whether the model could have seen them (Part 3).
2. Without looking at the diagram, name the five stages a benchmark score passes through and give one question you would ask at each. Reference answer:
   - Question design: are the items public? Do they measure the ability I care about?
   - Grading: does the answer key have known errors? What does a do-nothing agent score?
   - Execution: which scaffold, which API provider, what reasoning effort?
   - Reporting: how many items, how many runs, are there error bars?
   - Leaderboard: is this a single run or the best of several? Compared against whom?

## References

- [Holistic Agent Leaderboard: The Missing Infrastructure for AI Agent Evaluation (Kapoor et al., 2025)](https://arxiv.org/abs/2510.11977)
- [Why benchmarking is hard (Epoch AI, Gradient Updates, 2025-12)](https://epoch.ai/gradient-updates/why-benchmarking-is-hard)
- [Epoch Capabilities Index: data and preprocessing documentation (Epoch AI)](https://epoch.ai/data/eci-documentation/data)
- [Measuring Massive Multitask Language Understanding (MMLU, 2020)](https://arxiv.org/abs/2009.03300)
- [GPQA: A Graduate-Level Google-Proof Q&A Benchmark (2023)](https://arxiv.org/abs/2311.12022)
- [Introducing SWE-bench Verified (OpenAI, 2024)](https://openai.com/index/introducing-swe-bench-verified/)
- [Why SWE-bench Verified no longer measures frontier coding capabilities (OpenAI, 2026-02)](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)
- [Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference (2024)](https://arxiv.org/abs/2403.04132)
- [τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (2024)](https://arxiv.org/abs/2406.12045)
- [Establishing Best Practices for Building Rigorous Agentic Benchmarks (ABC, 2025)](https://arxiv.org/abs/2507.02825)
- [Measuring what Matters: Construct Validity in Large Language Model Benchmarks (Bean et al., 2025)](https://arxiv.org/abs/2511.04703)
- [Adding Error Bars to Evals: A Statistical Approach to Language Model Evaluations (Miller, 2024)](https://arxiv.org/abs/2411.00640)
- [The Leaderboard Illusion (2025)](https://arxiv.org/abs/2504.20879)
- [How to Read a Model's Report Card](/posts/ai/2026-08-26-understanding-ai-models-evaluation-en)
- [How to Read 2026 Coding Benchmarks](/posts/ai/2026-08-26-coding-benchmarks-how-to-read-en)
- [AI Model Evaluation Sources](/posts/tech/2026-08-24-ai-model-evaluation-sources-en)
