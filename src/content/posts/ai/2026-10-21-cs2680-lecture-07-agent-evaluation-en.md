---
title: "Evaluating Agents: Benchmarks, pass@k, and Data Leakage | Harvard CS2680 Lecture 7"
date: 2026-10-21
category: ai
type: guide
tags: [cs2680, ai-course, harvard, agent-evaluation, benchmark, coding-agent, course-guide]
lang: en
series:
  name: "Reading Harvard CS2680"
  order: 9
tldr: "CS2680 Lecture 7 (2026-09-30) is about measuring whether an agent is any good. First, be clear whether you are measuring a component or the whole task, and whether \"success\" means a correct answer, working code, or an environment left in the right state. On metrics, pass@k asks whether at least one of k tries succeeds, while pass^k asks whether all k succeed; from the same set of trials the two can come out as 0.9 and 0.3. Then come eight representative benchmarks and what each one measures, and finally when a score can't be trusted: the answer may be in the training data, the agent may look it up online, it may be sitting in the environment's git history, and the grader itself can be gamed."
description: "Guide to Lecture 7 of Harvard CS2680 Modern AI Systems (Fall 2026): component vs. end-to-end evaluation, five meanings of \"success\", pass@k and pass^k (with unbiased estimators and a worked example), the benchmark evaluation loop, GAIA, BFCL, WebArena, OSWorld, SWE-bench, τ-bench, Terminal-Bench, and TheAgentCompany, four layers of data leakage, the blind spot of single-turn instructions, and benchmark saturation. Based on the public slides and the course notes."
draft: false
glossary:
  - term: "pass@k"
    definition: "The probability that at least one of k independent tries on the same task succeeds. It fits settings where you really have a verifier at deployment time and can pick the correct candidate out of several, such as code generation with unit tests."
    context: "Lecture 7 contrasts it with pass^k: on the same trials, pass@k is never lower than the single-try success rate."
  - term: "pass^k"
    aliases: ["pass hat k", "pass-hat-k"]
    definition: "The probability that all k independent tries on the same task succeed, averaged over tasks. It measures consistency and fits settings where every attempt has to be right, such as customer service. Introduced by τ-bench."
    context: "Lecture 7 says pass^k is deliberately stricter than pass@k."
  - term: "data leakage"
    aliases: ["contamination"]
    definition: "When a benchmark task or its solution becomes known to the system under test, through training data, web access during the run, files or history left in the environment, or repeated tuning against the test set, so the score overstates real capability."
    context: "Lecture 7 splits it into four layers: training, eval time, environment, and benchmark overfitting."
---

> 🌏 [中文版](/posts/ai/2026-10-21-cs2680-lecture-07-agent-evaluation)

**Video status: The course is not recorded.** This post is based on the public slides and course notes; the numerical examples are this site's additions. [Source notes](#course-video-sources)

Lecture 7 of [CS2680](https://cs2680.com/) met on September 30, 2026, under the title "Agent design IV: evaluation" ([slides](https://cs2680.com/slides/7_agent_design_4.pdf)). It comes with a course note, "[Agent evaluation and benchmarks](https://cs2680.com/notes/agent-evaluation)", which turns the metrics the slides mention in one line into estimators and examples. Earlier lectures covered how to build an agent, how to split work across several agents, and how to make it [remember things and trace where it went wrong](/posts/ai/2026-10-21-cs2680-lecture-06-memory-reliability-en) (Lecture 6). This lecture asks: once you've changed something, how do you know it actually got better?

The lecture answers two questions: how do you measure whether an agent is good, and when can't you trust the number? By the end you should be able to take a set of repeated trials and compute pass@k and pass^k, and to name several ways a benchmark score can be inflated.

If you did [Assignment 2](/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop-en), you have already run a small evaluation: 10 SWE-Bench Pro tasks plus 4 tasks of your own. This lecture scales that up into a method.

The slides have four parts: how to measure, eight representative benchmarks, why evaluation is hard, and how evaluation has evolved. The last slide previews how Assignment 3 is graded; cost optimization, listed in the outline, moved to Lecture 8.

## What are you measuring?

### Components, or the whole task

There are two ways to evaluate an agent (p6):

- **Component-level evaluation**: look at capabilities inside the agent. Planning and task decomposition, tool use (finding the tool, choosing the right one, filling in the parameters), error recovery, and memory (extraction, consolidation, retrieval).
- **End-to-end evaluation**: look only at the outcome. Did the task get done, how much did each task cost, how long did it take.

The two complement each other. An end-to-end score tells you whether it's good; component scores tell you where it breaks. The course note adds an important point: a benchmark score measures "a particular system on a particular task distribution under a particular protocol." For an agent, that system includes the model, prompts, memory, tools, control loop, and execution environment; change only the tool interface or the retry budget and the score can move without the model changing at all. This is the flip side of "Agent = Model × Harness" from [Lecture 4](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering-en).

### Five meanings of "success"

Benchmarks have evolved from the language-model era into the agent era (p7), and the definition of success changed along the way (p8):

| Evaluation objective | Representative benchmarks | What success means |
|---|---|---|
| Predict text | PTB, WikiText | Assign high probability to the observed text |
| Produce a correct answer | MMLU, GSM8K, GPQA, HLE | Match a known answer |
| Produce a preferred response | Arena, AlpacaEval, MT-Bench | Human or model judges prefer it |
| Produce functioning code | HumanEval, LiveCodeBench, SWE-bench | Pass executable tests |
| Complete an interactive task | WebArena, OSWorld, τ-bench, Terminal-Bench | The environment ends in the required state |

The first four look at what the model produces; the last looks at what the world has been changed into. Agents act, so agent evaluations mostly fall into the last two rows. It also means a score for answering questions correctly tells you nothing about whether the agent will update a database correctly.

> **Self-check**: your agent changes shipping addresses on customer orders. If you build it on a model with a high MMLU score, can you say it's well suited to the job?
> Answer: no. MMLU measures answering knowledge questions; your job needs the backend data changed correctly, and only what should change. To evaluate it you have to inspect the order database after the task, which puts it in the "complete an interactive task" row.

## Metrics: finding one success, or succeeding every time

### The metrics on the slides

p10 groups the metrics into three sets:

- **Earlier benchmarks**: perplexity (how "surprised" a model is by text it hasn't seen; lower is better), accuracy or F1 (a score that weighs both precision and recall), and preference win rate.
- **Capability**: pass@k, at least one of k succeeds; pass^k, all k succeed, introduced by [τ-bench](https://arxiv.org/abs/2406.12045).
- **Cost and latency**: cost is mostly model spend, but tool calls and cache misses are often overlooked; latency isn't only model time either.

pass@k and pass^k look alike but ask opposite questions (p19). pass@k asks "out of k tries, did any get it right?" and fits code-writing settings where tests can pick out the correct version. That assumes you really have those tests at deployment time: a benchmark's hidden tests can't be used to pick answers for the agent, or pass@k ends up measuring the grader rather than the agent (course note). pass^k asks "out of k tries, did every one get it right?" and fits customer service, where every user has to succeed, which is why τ-bench calls it deliberately stricter than pass@k.

### Same results, two numbers three times apart

The course note's example: one task, run independently 5 times, succeeds 3 times. What are the two metrics for k = 2?

- **pass@2**: the probability that at least one of 2 randomly chosen runs succeeded. There are 10 ways to choose 2 of 5; only 1 of them picks two failures (exactly the 2 failed runs). So pass@2 = 1 − 1/10 = 0.9.
- **pass^2**: the probability that both chosen runs succeeded. There are 3 ways to choose 2 of the 3 successes. So pass^2 = 3/10 = 0.3.

```diagram
title: Choosing 2 of 5 trials: 10 possible pairs
desc: Of 5 trials, the first 3 succeed and the last 2 fail; among the 10 ways to pick 2, 3 pairs are both successes, 6 are one of each, and only 1 is both failures, so pass^2 is 3/10 and pass@2 is 1 − 1/10.
caption: Example from the course note. Only pairs of trial i and trial j with i smaller than j are drawn; the number in each cell is how many of the two succeeded. Which trials succeeded doesn't change the result.
---
<svg viewBox="0 0 548 336">
  <text class="dg-label" x="218" y="28" text-anchor="middle" dominant-baseline="central">Trial 2</text>
  <text class="dg-sub" x="218" y="48" text-anchor="middle" dominant-baseline="central">pass</text>
  <text class="dg-label" x="306" y="28" text-anchor="middle" dominant-baseline="central">Trial 3</text>
  <text class="dg-sub" x="306" y="48" text-anchor="middle" dominant-baseline="central">pass</text>
  <text class="dg-label" x="394" y="28" text-anchor="middle" dominant-baseline="central">Trial 4</text>
  <text class="dg-sub" x="394" y="48" text-anchor="middle" dominant-baseline="central">fail</text>
  <text class="dg-label" x="482" y="28" text-anchor="middle" dominant-baseline="central">Trial 5</text>
  <text class="dg-sub" x="482" y="48" text-anchor="middle" dominant-baseline="central">fail</text>
  <text class="dg-label" x="112" y="88" text-anchor="end" dominant-baseline="central">Trial 1</text>
  <text class="dg-sub" x="160" y="88" text-anchor="end" dominant-baseline="central">pass</text>
  <text class="dg-label" x="112" y="140" text-anchor="end" dominant-baseline="central">Trial 2</text>
  <text class="dg-sub" x="160" y="140" text-anchor="end" dominant-baseline="central">pass</text>
  <text class="dg-label" x="112" y="192" text-anchor="end" dominant-baseline="central">Trial 3</text>
  <text class="dg-sub" x="160" y="192" text-anchor="end" dominant-baseline="central">pass</text>
  <text class="dg-label" x="112" y="244" text-anchor="end" dominant-baseline="central">Trial 4</text>
  <text class="dg-sub" x="160" y="244" text-anchor="end" dominant-baseline="central">fail</text>
  <rect class="dg-heat-3" x="176" y="64" width="84" height="48" rx="2"/>
  <text class="dg-label" x="218" y="79" text-anchor="middle" dominant-baseline="central">2</text>
  <text class="dg-sub dg-text--ink" x="218" y="99" text-anchor="middle" dominant-baseline="central">both pass</text>
  <rect class="dg-heat-3" x="264" y="64" width="84" height="48" rx="2"/>
  <text class="dg-label" x="306" y="79" text-anchor="middle" dominant-baseline="central">2</text>
  <text class="dg-sub dg-text--ink" x="306" y="99" text-anchor="middle" dominant-baseline="central">both pass</text>
  <rect class="dg-heat-2" x="352" y="64" width="84" height="48" rx="2"/>
  <text class="dg-label" x="394" y="79" text-anchor="middle" dominant-baseline="central">1</text>
  <text class="dg-sub dg-text--ink" x="394" y="99" text-anchor="middle" dominant-baseline="central">one each</text>
  <rect class="dg-heat-2" x="440" y="64" width="84" height="48" rx="2"/>
  <text class="dg-label" x="482" y="79" text-anchor="middle" dominant-baseline="central">1</text>
  <text class="dg-sub dg-text--ink" x="482" y="99" text-anchor="middle" dominant-baseline="central">one each</text>
  <rect class="dg-heat-3" x="264" y="116" width="84" height="48" rx="2"/>
  <text class="dg-label" x="306" y="131" text-anchor="middle" dominant-baseline="central">2</text>
  <text class="dg-sub dg-text--ink" x="306" y="151" text-anchor="middle" dominant-baseline="central">both pass</text>
  <rect class="dg-heat-2" x="352" y="116" width="84" height="48" rx="2"/>
  <text class="dg-label" x="394" y="131" text-anchor="middle" dominant-baseline="central">1</text>
  <text class="dg-sub dg-text--ink" x="394" y="151" text-anchor="middle" dominant-baseline="central">one each</text>
  <rect class="dg-heat-2" x="440" y="116" width="84" height="48" rx="2"/>
  <text class="dg-label" x="482" y="131" text-anchor="middle" dominant-baseline="central">1</text>
  <text class="dg-sub dg-text--ink" x="482" y="151" text-anchor="middle" dominant-baseline="central">one each</text>
  <rect class="dg-heat-2" x="352" y="168" width="84" height="48" rx="2"/>
  <text class="dg-label" x="394" y="183" text-anchor="middle" dominant-baseline="central">1</text>
  <text class="dg-sub dg-text--ink" x="394" y="203" text-anchor="middle" dominant-baseline="central">one each</text>
  <rect class="dg-heat-2" x="440" y="168" width="84" height="48" rx="2"/>
  <text class="dg-label" x="482" y="183" text-anchor="middle" dominant-baseline="central">1</text>
  <text class="dg-sub dg-text--ink" x="482" y="203" text-anchor="middle" dominant-baseline="central">one each</text>
  <rect class="dg-heat-1" x="440" y="220" width="84" height="48" rx="2"/>
  <text class="dg-label" x="482" y="235" text-anchor="middle" dominant-baseline="central">0</text>
  <text class="dg-sub dg-text--ink" x="482" y="255" text-anchor="middle" dominant-baseline="central">both fail</text>
  <rect class="dg-outline--accent" x="440" y="220" width="84" height="48" rx="2"/>
  <line class="dg-rule" x1="20" y1="288" x2="528" y2="288"/>
  <text class="dg-tag" x="20" y="312" dominant-baseline="central">KEY</text>
  <rect class="dg-heat-3" x="84" y="304" width="16" height="16" rx="2"/>
  <text class="dg-small" x="108" y="312" dominant-baseline="central">Both pass: 3 cells</text>
  <rect class="dg-heat-2" x="252" y="304" width="16" height="16" rx="2"/>
  <text class="dg-small" x="276" y="312" dominant-baseline="central">One each: 6 cells</text>
  <rect class="dg-heat-1" x="404" y="304" width="16" height="16" rx="2"/>
  <text class="dg-small" x="428" y="312" dominant-baseline="central">Both fail: 1 cell</text>
</svg>
```

Same data, one number is 0.9 and the other is 0.3. Report a number without saying which one and your reader can be off by a factor of three.

Many people plug the success rate of 0.6 straight in: pass@2 ≈ 1 − 0.4² = 0.84 and pass^2 ≈ 0.6² = 0.36. This is a plug-in estimate, and it is biased when the number of trials is finite; counting combinations, as above, gives the unbiased estimate (course note; [Chen et al., 2021](https://arxiv.org/abs/2107.03374)). The plug-in errs in opposite directions for the two metrics: on average it underestimates pass@k (the conclusion of Chen et al.'s appendix; here 0.84 vs. 0.9) and overestimates pass^k, making consistency look better than it is (0.36 vs. 0.3). That is why you count combinations.

There's another common mistake: averaging the success rate over all tasks first and then applying the formula. Say there are two tasks, each run 5 times: task A succeeds all 5 times, task B only once. The overall success rate is 0.6, which looks the same as above. But compute per task, then average:

- pass^2: task A is 1; task B has fewer than 2 successes, so 0; the average is 0.5.
- pass@2: task A is 1; task B is 1 − 6/10 = 0.4; the average is 0.7.

Plugging the overall success rate into the formula gives 0.36 and 0.84, and both are wrong. The course note's rule: compute each task separately, then average over tasks.

<details>
<summary>Estimators and code (if you want to compute it yourself)</summary>

Each task is run n times with c successes. C(a, k) is the number of ways to choose k items from a, and is 0 when a < k:

```text
estimated pass@k = 1 − C(n − c, k) / C(n, k)
estimated pass^k = C(c, k) / C(n, k)
```

Both require n ≥ k, with n fixed in advance and the environment reset every time. If you stop collecting at the first success, the estimate no longer holds. The pass@k formula comes from the HumanEval paper (Chen et al., 2021, whose appendix shows the plug-in estimate is biased); the pass^k formula comes from τ-bench.

```python
from math import comb

def pass_at_k(n, c, k):
    return 1 - comb(n - c, k) / comb(n, k)

def pass_hat_k(n, c, k):
    return comb(c, k) / comb(n, k)

print(pass_at_k(5, 3, 2), pass_hat_k(5, 3, 2))   # 0.9 0.3

# Two tasks, 5 runs each: A succeeds 5 times, B once; compute per task, then average
tasks = [(5, 5), (5, 1)]
print(sum(pass_at_k(n, c, 2) for n, c in tasks) / len(tasks))   # 0.7
print(sum(pass_hat_k(n, c, 2) for n, c in tasks) / len(tasks))  # 0.5
```

If you know the single-try success probability p, the formulas are simpler: pass@k = 1 − (1 − p)^k and pass^k = p^k. The course note's example is p = 0.8, k = 3: pass@3 = 99.2% and pass^3 = 51.2%. For an agent that succeeds 80% of the time, the chance of handling the same kind of request correctly three times in a row is only about one half.

When comparing two systems, the course note recommends paired comparison: look at both systems' results on the same task side by side. To estimate how reliable the gap is, use a paired bootstrap: resample tasks with replacement, carrying both systems' results and the repeated trials of each task together. For the idea of the bootstrap see [Stanford CS109 Lecture 16](/posts/learning/2026-08-22-stanford-cs109-lecture-16-bootstrapping-p-values-en); for combinations see [CS109 Lecture 4](/posts/learning/2026-08-22-stanford-cs109-lecture-04-counting-combinatorics-en).

</details>

### Beyond success rate: what did it cost?

p31 puts the problem in one line: two runs both succeed, one takes 200 steps and $40, the other 12 steps and $0.30; should they score the same? The course note recommends always reporting latency, call counts, token counts, and actual spend next to the success rate. Failed attempts cost money too.

The note's hypothetical example has two systems each run once on the same 100 tasks:

| | System A | System B |
|---|---|---|
| Both succeed | 65 tasks | 65 tasks |
| Only this one succeeds | 5 tasks | 10 tasks |
| Both fail | 20 tasks | 20 tasks |
| Success rate | 70% | 75% |
| Total cost (including failures) | $100 | $150 |
| Cost per success | about $1.43 | $2.00 |

B solves 10 tasks that A misses and loses 5 that A solves, a net gain of 5 tasks, for $50 more, or $10 per extra task solved. Neither system wins on both success and cost. Pairing reveals one more thing: B regressed on 5 tasks, which you can't see by comparing 70% with 75%.

> **Self-check**: you're building a customer-service agent. Should you look at pass@k or pass^k?
> Answer: pass^k. Every customer has to be served well; "one success out of k tries" isn't enough, and a customer won't let you retry k times and keep the best attempt.

## How one evaluation run works

p11 writes the loop shared by every benchmark as a few lines of pseudocode:

```text
for task in benchmark:
    environment = reset_to_task_initial_state(task)
    while not terminated and within_budget:
        observation = environment.observe()
        action = agent(task_instruction, observation, history, tools)
        environment.execute(action)
    score = task_evaluator(agent_final_answer, final_environment_state, trajectory)
```

Three parts:

1. Before each task, reset the environment to its initial state.
2. The agent observes and acts step by step, within a budget.
3. The grader looks at one or more of three kinds of evidence: the final answer, the final environment state, and the whole trajectory.

The course note separates two harnesses: the agent's harness decides what the model sees, runs the tools, and decides when to stop; the evaluation harness initializes tasks, imposes limits, preserves evidence, and calls the graders. Keeping them separate means the system under test can't change its own scoring rule.

### The grader is part of the measurement

The course note uses a refund example to show why looking only at the final state isn't enough. The task: a user wants to return an eligible item, and company policy says to get the user's confirmation before issuing the refund. Three hypothetical trajectories:

| Trajectory | Correct final state? | Confirmed first? | Counts as success? |
|---|---|---|---|
| Gets confirmation and says it's done, but never issues the refund | No | Yes | No |
| Issues the right refund, but before the user confirms | Yes | No | No |
| Confirms, issues the right refund, and reports it correctly | Yes | Yes | Yes |

The second trajectory's final state is exactly right, so a grader that looks only at the database gives it full marks. To catch "confirm before acting" you have to look at the order of events in the trajectory. The τ-bench paper itself admits this: its reward looks only at the final database and the response content, and r = 1 "might be a necessary but not sufficient condition"; the agent might issue the return without explicit confirmation ([Yao et al., 2024](https://arxiv.org/abs/2406.12045)).

Going the other way and requiring the agent to follow the reference steps is wrong too: the same job often has several valid paths. p31 states the dilemma in one line: outcome-only scoring lets lucky or unsafe runs pass; trajectory matching fails valid alternatives.

> **Self-check**: what evidence would catch the second trajectory in the table?
> Answer: the order of events in the trajectory: the "user confirmed" event has to come before the "call the refund API" event. Neither the final database nor the agent's last reply can show it.

## Eight representative benchmarks

The slides spend eleven pages on eight benchmarks (p12–22) and gather them into one table on p23. Ordered by where the agent works:

| Benchmark | Where the agent works | Typical actions | What is graded |
|---|---|---|---|
| [BFCL](https://gorilla.cs.berkeley.edu/leaderboard.html) | Function/API interface | Structured function calls | Calls, arguments, and resulting state |
| [GAIA](https://arxiv.org/abs/2311.12983) | Web, files, code tools | Search, inspect files, calculate | A short final answer |
| [τ-bench](https://arxiv.org/abs/2406.12045) | Customer-service APIs plus dialogue | Talk to the user, call APIs | Database state and the response |
| [SWE-bench](https://www.swebench.com/) | A code repository | Read code, edit files, run tests | Whether the patch passes the tests |
| [Terminal-Bench](https://www.tbench.ai/) | An isolated terminal container | Arbitrary shell commands | Task-specific verifier tests |
| [WebArena](https://arxiv.org/abs/2307.13854) | Self-hosted websites | Click, type, navigate | Website or backend state |
| [OSWorld](https://arxiv.org/abs/2404.07972) | A full desktop VM | Mouse, keyboard, app interaction | Files, app state, and system state |
| [TheAgentCompany](https://arxiv.org/abs/2412.14161) | A simulated software company | Use web tools, write code, ask coworkers | Workflow checkpoints and final state |

Each benchmark's design decides what it can't measure:

- **GAIA** (466 questions, p12–13) scores only the final answer, a number or a short string. Searching, downloading, and running Python along the way earn nothing. So it measures research and synthesis, not actions like sending an email, booking a flight, or modifying a database.
- **BFCL** (p14) checks whether tool calls are reliable. The example is "book the cheapest flight from Boston to Chicago next Monday", and the two typical mistakes are inventing a `passenger_id` (it should ask the user) and calling an irrelevant `get_weather`. The slides note that V4 adds web search and memory categories, and that you should read the category scores rather than only the composite.
- **WebArena** (812 tasks, p15) and **OSWorld** (369 tasks, p16) both check the final state; they differ in what the agent observes: the first reads the page's accessibility tree (the structured page description browsers provide for assistive tools), the second sees screenshots. WebArena-Verified removed LLM-as-a-judge in favor of deterministic checks; OSWorld 2.0 moves to 108 long workflows with partial credit.
- **SWE-bench** (p17) applies the agent's patch to the repo and runs the tests. The family includes the human-checked Verified, the 300-task Lite, Multilingual across 9 languages, the image-based Multimodal, and the harder Pro.
- **τ-bench** (p18–19) has an LLM playing the user, and the agent must follow airline policy, for example that basic economy can't be changed. The reward is r = r_action × r_output: the final database must match the reference exactly and the response must include the required information, both at once.
- **Terminal-Bench** (p20–21) sits between SWE-bench and OSWorld: the agent works through a shell with no mouse coordinates to predict, and tasks go beyond repo bug fixes to system administration, data processing, model training, and security. [Version 2.0](https://arxiv.org/abs/2601.11868) has 89 tasks; [3.0](https://www.tbench.ai/news/terminal-bench-3-0) switched to a harder set of 74; [4.0](https://www.tbench.ai/news/terminal-bench-4-0) removed 8 more, leaving 66, with 8 hours per task. The slides write "89 → 66", but versions 2.1 and 3.0 came in between.
- **TheAgentCompany** (175 tasks, p22) has the agent finish a whole job in a simulated company: read the ticket, ask a coworker, change code, run tests, update the ticket, report back. It gives partial credit:

```text
S_partial = 0.5 × checkpoint points earned / total checkpoint points + 0.5 × S_full
```

S_full is 1 when the whole job is complete and 0 otherwise. 4 of 8 checkpoints done, job incomplete: 0.5 × 4/8 = 0.25; 7 of 8 done, incomplete: 0.5 × 7/8 ≈ 0.44; everything done: 0.5 + 0.5 = 1.00. The jump for finishing the whole job is worth more than any single checkpoint.

> **Self-check**: your agent reads internal company documents and answers employees' questions; it never changes any system. Which of the eight is closest, and what can't it measure?
> Answer: GAIA is closest: use tools to look things up, give a short answer, score only the answer. It can't measure whether actions are correct or what side effects they have, which matters little because your agent doesn't act; the catch is that GAIA's questions come from the public web and attachments, not your internal documents, so in the end you still need your own tasks.

## When can't you trust the score?

### Leakage has four layers

Data contamination usually means the task showed up in training data. p25 points out that agent evaluation has at least four layers of leakage, and that the more the agent resembles real work, the larger the leakage surface: realistic tools include the web, and the benchmark itself may be searchable.

| Layer | How it happens | Real case |
|---|---|---|
| Training | The task or its human fix was in the training data | Every frontier model OpenAI tested could reproduce the original fix or problem details for some SWE-bench Verified tasks. This is one of two reasons OpenAI stopped reporting the benchmark and switched to SWE-bench Pro; the other, tests that are too narrow, is in the next section ([OpenAI](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)) |
| Eval time | The agent finds the future fix online | NIST CAISI found agents in its own evaluation logs using curl to pull public write-ups for CTF (capture-the-flag security competition) challenges and submitting the answer ([NIST CAISI](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations)); of the 8 tasks Terminal-Bench 4.0 removed relative to 3.0, 2 were removed because their solutions were already public |
| Environment | The sandbox exposes future commits or hidden tests | SWE-bench Verified containers kept the full git history, and Claude 4 Sonnet and Qwen3-Coder ran `git log --all` and saw the future commit that fixed the issue ([SWE-bench issue #465](https://github.com/SWE-bench/SWE-bench/issues/465)) |
| Benchmark overfitting | Prompts and scaffold (the outer framework wrapping the model, i.e. the harness) tuned on the public test set | Developers keep looking at test-set failures and tuning the system until the test set has become another development set |

The third layer is the one closest to you. [Assignment 2](/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop-en) uses SWE-Bench Pro tasks, and SWE-Bench Pro's public Docker images have been reported to have the same problem: future git history not fully removed ([SWE-Bench Pro issue #93](https://github.com/scaleapi/SWE-bench_Pro-os/issues/93), reported in April 2026 and still open as of October). When you build your own eval set, remember to remove commits, branches, tags, and reflog entries newer than the base commit.

p26 widens the scope: an agent's performance is roughly

```text
P = f(LLM, prompt, scaffold, tools, retriever, memory, environment)
```

Any of these can carry benchmark information: few-shot examples taken from test tasks, a RAG corpus that indexes the answers, memory holding the result of a previous attempt at the same task, hand-written rules that happen to target the benchmark. So "the model was not trained on the test set" is nowhere near sufficient for agent evaluation.

### Graders get gamed too

Beyond leakage, the other class of problem is the grader itself. The course note calls it grader gaming: the agent makes the check pass without doing what was actually asked.

- The CVE-Bench example from [NIST CAISI](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations): the task was to use a specific publicly numbered vulnerability (a CVE) to make a server stop responding, and the grader only checked whether the server stopped. gpt-4o didn't use the vulnerability; it sent a request reading from `/dev/urandom` and flooded the server with endless random data.
- Flaws in the scoring design: the [Agentic Benchmark Checklist](https://arxiv.org/abs/2507.02825) found that 38% of τ-bench's airline subset are intentionally impossible tasks whose success condition is "leave the environment unchanged", so an agent that does nothing passes all of them.
- Tests that are too narrow: [OpenAI](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/) had engineers review 138 SWE-bench Verified tasks that o3 often failed across 64 runs, and 59.4% had material problems in the tests or the problem description, such as tests requiring a function name the problem never mentions, so correct fixes were marked wrong.

What these cases share: a high score doesn't mean the work was right, and a low score doesn't necessarily mean it was wrong. The course note's advice is to sample trajectories from both passes and failures, investigate suspicious high scores, and not infer integrity from the score.

> **Self-check**: your agent goes from 40% to 55% on SWE-bench-style tasks. Name two sources of "fake progress" you should rule out first.
> Answer: any two of: the container still has future git history and the agent found the fix with `git log`; the agent has web access and found the upstream PR; you've been tuning prompts on the same task set and have overfit; the change happens to make a grader loophole easier to trigger. To check, read the trajectories of newly solved tasks and rerun on tasks you haven't seen.

### Real work isn't a single instruction

Most benchmarks hand the agent one fully specified instruction, with no user in the loop (p27). Real work is ambiguous, revised, and interrupted: missing constraints, corrections mid-task, goals that shift. Single-turn scoring also rewards confident guessing, because asking a clarifying question costs steps and earns nothing.

The instructor used the class's own Claude Code logs from Assignment 1 as evidence (p28–29). Of 166 build sessions, 40, about a quarter, had only one prompt; 64, about two in five, had 11 or more. The most common prompt length was only 21–100 characters, a sentence or two. At least for this large group, real use is many short back-and-forth turns, far from a benchmark's "one complete instruction."

p30 therefore lists three things single-turn benchmarks can't measure: does the agent ask when the goal is underspecified, does it re-plan after a mid-task correction, and does it carry constraints across many turns.

### Three more difficulties

p31 adds three:

- **Non-determinism**: same agent, same task, different outcomes, so a single-run score is noise, not signal. That's why pass@k and pass^k came up earlier.
- **Safety and side effects**: deleted files, sent emails, or money spent along the way cost nothing as long as the run passes in the end.
- **Cost and latency**: as above, success rate isn't enough.

## Benchmarks saturate quickly

p32 gives six examples; here are four of them (numbers as on the slides): GLUE reached human level in 14 months and MMLU reached expert level in 39 months; SWE-bench Verified went from 33% to 95% in 22 months; ARC-AGI-3 went from 0.5% to 62.7% in six months. p33 lays out the timeline: in every generation, most benchmarks saturate within a few years. The slides define "saturated" as the frontier reaching the human baseline, or top models no longer separating. As of September 2026, the slides list newer sets such as OSWorld 2.0, ARC-AGI-3, and SWE-bench Pro as still open.

This is why benchmarks keep changing, and why the first question about any score is "which version?" The 2 saturated tasks [Terminal-Bench 4.0](https://www.tbench.ai/news/terminal-bench-4-0) removed met a clear bar: every model family in the latest generation solved them 5 times out of 5, so they no longer told models apart.

p34 sums up the evolution in a table:

| Dimension | Earlier | Now |
|---|---|---|
| What is evaluated | The base model | Model + prompt + tools + agent harness |
| Interaction | Static, single-turn | Stateful, long-horizon |
| Grader | Exact match or likelihood | Tests, environment state, humans, or judge models |
| Dataset | Fixed and public | Fresh, hidden, dynamic, or contamination-aware |
| Main metric | Average accuracy | Reliability, quality, cost, and latency besides task success |

p35 previews how Assignment 3 is graded: capability, cost, and speed are ranked together. If A is no worse than B on every metric and better on at least one, A dominates B; the group that no one dominates is rank 1, the Pareto frontier. The Assignment 3 guide covers this in detail.

## Designing an evaluation for your own agent

The last two sections of the course note make a checklist you can use directly:

1. **Define success first**: what outcome is required, which actions are allowed, which side effects are unacceptable. When the final state can't establish policy compliance, evaluate it separately.
2. **Validate tasks and graders**: can each task be solved with the information and tools provided? Does the grader accept wrong answers or reject valid alternatives? Keep hidden tests and grader state where the agent can't write.
3. **Hold out unseen tasks**: tune on development tasks, then freeze the eval set and configuration. If you claim the agent works on new repos or new customers, hold out whole groups of new repos or customers, not just random items from groups you've already seen.
4. **Control the comparison**: fix tasks, starting states, tools, stopping rules, and resource limits. When comparing models, keep the harness fixed; when comparing whole systems, say exactly what differs.
5. **Repeat and inspect**: keep per-task results, use paired comparisons and uncertainty estimates, and read trajectories from both passes and failures.
6. **Report clearly**: task-set version and count, system configuration, budget, grading method, numerator and denominator, trials per task, whether it's pass@k or pass^k, cost (including failures), and the latency distribution.

This checklist is the full version of [the self-built eval set section of Assignment 2](/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop-en#building-your-own-eval-set). The assignment's split into "solvable after the change" and "still unsolved" amounts to making you run a paired comparison.

## Final self-check

1. Your agent ran one task 6 times and succeeded 4 times. Compute pass@3 and pass^3.
   Answer: C(6,3) = 20. pass@3 = 1 − C(2,3)/20, and C(2,3) = 0, so it's 1; with only 2 failures, any 3 picks must include a success. pass^3 = C(4,3)/20 = 4/20 = 0.2.
2. A colleague says: "The new version went from 62% to 68% on our benchmark, let's ship it." What three questions do you ask first?
   Criterion: any three of: how many runs per task, and is the 6-point gain stable across trials (paired comparison, uncertainty); did any tasks regress; how did cost and latency change; has the task set been tuned against repeatedly, or is there leakage; does the grader check the final state or the trajectory, and would it let side effects through.
3. You're building an agent that places orders for users on a website. Given the four layers of leakage on p25 and the side effects on p31, what two things must the evaluation environment do?
   Criterion: isolate and protect grading: the task environment can't reach anywhere the reference answer can be found, and reference answers and grader state sit where the agent can't write; and record and check side effects, such as extra orders or extra charges, rather than only whether the final order is correct.

## Further reading

- [CMU 11-768 Assignment 2: writing a validator for a data-visualization agent](/posts/ai/2026-09-29-cmu-11768-assignment-2-eval-en): build a grader yourself, with four error families and verifiers.
- [Stanford CS329A Lecture 17: long-horizon evaluation](/posts/ai/2026-10-11-stanford-cs329a-lecture-17-long-horizon-evaluation-en): the difference between finishing, being correct, and being worth delivering.
- [Stanford CS109 Lecture 16: bootstrapping and p-values](/posts/learning/2026-08-22-stanford-cs109-lecture-16-bootstrapping-p-values-en): the statistics behind paired comparison.
- [Kapoor et al., AI Agents That Matter](https://arxiv.org/abs/2407.01502): how focusing only on accuracy makes agents costly and complex, and the lack of holdout sets in benchmarks.
- [NIST CAISI: Cheating on AI agent evaluations](https://www.nist.gov/blogs/caisi-research-blog/cheating-ai-agent-evaluations): how to find cheating in evaluation logs.

## Course video sources

- The course is not recorded ([policy page](https://cs2680.com/policy)).
- Source: [Lecture 7 slides](https://cs2680.com/slides/7_agent_design_4.pdf) (PDF pages p5–35) and the course note "[Agent evaluation and benchmarks](https://cs2680.com/notes/agent-evaluation)", read on 2026-10-22. Page numbers always follow PDF page order.
- The pass@k and pass^k estimators were checked against the HumanEval and τ-bench papers; benchmark task counts were checked against the original papers or official pages. The real cases of leakage and grader problems (OpenAI, NIST CAISI, SWE-bench issue #465, the Agentic Benchmark Checklist, the Terminal-Bench 4.0 announcement) are sources this site added.
- The two-task per-task averaging example and the answers to the self-checks are this site's additions; the 3-of-5 example, the p = 0.8 example, and the System A/B example come from the course note.

## References

- [CS2680 Lecture 7 slides: Agent design IV: evaluation](https://cs2680.com/slides/7_agent_design_4.pdf)
- [CS2680 course note: Agent evaluation and benchmarks](https://cs2680.com/notes/agent-evaluation)
- [Chen et al., Evaluating Large Language Models Trained on Code (2021)](https://arxiv.org/abs/2107.03374)
- [Yao et al., τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (2024)](https://arxiv.org/abs/2406.12045)
- [Mialon et al., GAIA: a benchmark for General AI Assistants (2023)](https://arxiv.org/abs/2311.12983)
- [Berkeley Function Calling Leaderboard](https://gorilla.cs.berkeley.edu/leaderboard.html)
- [Zhou et al., WebArena (2023)](https://arxiv.org/abs/2307.13854)
- [Xie et al., OSWorld (2024)](https://arxiv.org/abs/2404.07972)
- [SWE-bench](https://www.swebench.com/)
- [Merrill et al., Terminal-Bench (2026)](https://arxiv.org/abs/2601.11868)
- [Terminal-Bench 3.0 announcement](https://www.tbench.ai/news/terminal-bench-3-0)
- [Terminal-Bench 4.0 announcement](https://www.tbench.ai/news/terminal-bench-4-0)
- [Xu et al., TheAgentCompany (2024)](https://arxiv.org/abs/2412.14161)
- [OpenAI: Why we no longer evaluate SWE-bench Verified](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)
- [NIST CAISI: Examples of cheating in CAISI's agent evaluations (2025)](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations)
- [SWE-bench issue #465: Repo State Loopholes During Agentic Evaluation](https://github.com/SWE-bench/SWE-bench/issues/465)
- [SWE-Bench Pro issue #93: Git Reward Hacking in SWEBench Pro OSS](https://github.com/scaleapi/SWE-bench_Pro-os/issues/93)
- [Zhu et al., Establishing Best Practices for Building Rigorous Agentic Benchmarks (2025)](https://arxiv.org/abs/2507.02825)
- [Kapoor et al., AI Agents That Matter (2024)](https://arxiv.org/abs/2407.01502)
