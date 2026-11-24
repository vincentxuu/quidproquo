---
title: "Taking a Benchmark Apart: Task, System Under Test, Grader, Sandbox, and Records"
date: 2026-11-24
category: ai
type: deep-dive
tags: [benchmark, llm-evaluation, evaluation, agent-evaluation, mmlu]
lang: en
tldr: "A benchmark comes apart into five pieces: the task (input plus an answer key or tests), the system under test, the grader, an isolated environment, and the records. An MMLU item has only a question, a model, and a letter match; Terminal-Bench's fix-git adds a Docker environment, tests that check the container's final state, and a reference solution, and what is tested is a model plus an agent harness: the same Claude Opus 4.5 scores 57.8% in one harness and 52.1% in another."
description: "Takes one MMLU question and one Terminal-Bench task apart side by side to show the five components of a benchmark, whether the thing under test is a model or a model plus scaffold, the three ways of grading (matching, execution checks, judging), and why every task needs a reference solution that scores full marks (an oracle)."
series:
  name: "Understanding AI Benchmarks"
  order: 1
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-24-benchmark-anatomy)

Both of the following are "one item" of a benchmark.

The first is from [MMLU](https://arxiv.org/abs/2009.03300) (item 0 of high school computer science in the [dataset](https://huggingface.co/datasets/cais/mmlu)):

> Let x = 1. What is x << 3 in Python 3?
> A. 1　B. 3　C. 8　D. 16

The second is [`fix-git`](https://github.com/harbor-framework/terminal-bench-2/tree/main/fix-git) from [Terminal-Bench 2.0](https://arxiv.org/abs/2601.11868). The whole task statement is one sentence:

> I just made some changes to my personal site and checked out master, but now I can't find those changes. Please help me find them and merge them into master.

The first has a one-letter answer; you check it against the key. The second has no "answer" to check. The agent under test types commands into a container with git installed, finds a lost commit, and merges it back. Afterwards a separate test program inspects the files in the container.

Both end up as a single percentage in a release table, but the machinery that produces each percentage is very different. The [overview](/posts/ai/2026-11-24-understanding-benchmarks-overview-en) walked through the stages a score passes on its way from question to leaderboard. This post opens up one of them, how a single item becomes a score: what the parts are, what each one does, and how to point each of them out when you read a benchmark's documentation.

## Five components

Three primary sources from people who build evaluation tooling use different words but cut the problem the same way:

- [Inspect](https://inspect.aisi.org.uk/), the open-source evaluation framework from the UK AISI: an eval is "a **dataset** of samples, a **solver** that produces an answer for each sample, and a **scorer** that grades the answers", plus sandboxes and log files.
- [Harbor](https://github.com/harbor-framework/harbor), the evaluation framework from the Terminal-Bench team: a task is "an instruction, environment, and test script"; an agent works on it inside a sandbox, a verifier grades it, and every attempt leaves a trajectory.
- Anthropic's engineering post "[Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)": task, trial, grader, transcript, outcome, plus an evaluation harness and an agent harness.

Put together, there are five pieces:

```diagram
title: How one benchmark item becomes a score
desc: The task input goes to the system under test, which acts inside an isolated environment; the grader takes the final state or output, compares it with an answer key or tests that only it can see, and emits a score; both the system's actions and the grading are written to the records.
caption: Text-only items such as MMLU have no environment; the model's output goes straight to the grader.
---
<svg viewBox="0 0 640 404">
  <rect class="dg-zone" x="16" y="40" width="164" height="264" rx="8"/>
  <text class="dg-tag" x="32" y="62" dominant-baseline="central">TASK</text>
  <rect class="dg-zone" x="408" y="40" width="144" height="120" rx="8"/>
  <text class="dg-tag" x="424" y="62" dominant-baseline="central">SANDBOX</text>

  <path class="dg-line" d="M168 108H192" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M372 100H416" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M420 116H376" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 136V220" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M168 252H412" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M544 252H568" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M284 140V244A8 8 0 0 1 284 260V328" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M480 280V328" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="28" y="80" width="140" height="56" rx="6"/>
  <text class="dg-label" x="98" y="98" text-anchor="middle" dominant-baseline="central">Input</text>
  <text class="dg-sub" x="98" y="120" text-anchor="middle" dominant-baseline="central">question / task</text>

  <rect class="dg-box dg-box--store" x="28" y="224" width="140" height="56" rx="6"/>
  <text class="dg-label" x="98" y="242" text-anchor="middle" dominant-baseline="central">Answer key</text>
  <text class="dg-sub" x="98" y="264" text-anchor="middle" dominant-baseline="central">or test script</text>

  <rect class="dg-box dg-box--accent" x="196" y="76" width="176" height="64" rx="6"/>
  <text class="dg-label" x="284" y="96" text-anchor="middle" dominant-baseline="central">System under test</text>
  <text class="dg-sub" x="284" y="120" text-anchor="middle" dominant-baseline="central">model (+ scaffold)</text>

  <rect class="dg-box" x="420" y="80" width="120" height="56" rx="6"/>
  <text class="dg-label" x="480" y="98" text-anchor="middle" dominant-baseline="central">Container</text>
  <text class="dg-sub" x="480" y="120" text-anchor="middle" dominant-baseline="central">Docker image</text>

  <rect class="dg-box dg-box--accent" x="416" y="224" width="128" height="56" rx="6"/>
  <text class="dg-label" x="480" y="242" text-anchor="middle" dominant-baseline="central">Grader</text>
  <text class="dg-sub" x="480" y="264" text-anchor="middle" dominant-baseline="central">match·run·judge</text>

  <rect class="dg-box" x="572" y="228" width="56" height="48" rx="6"/>
  <text class="dg-label" x="600" y="252" text-anchor="middle" dominant-baseline="central">Score</text>

  <rect class="dg-box dg-box--store" x="196" y="332" width="344" height="56" rx="6"/>
  <text class="dg-label" x="368" y="350" text-anchor="middle" dominant-baseline="central">Records</text>
  <text class="dg-sub" x="368" y="372" text-anchor="middle" dominant-baseline="central">transcript · log · trajectory</text>

  <text class="dg-edge" x="394" y="88" text-anchor="middle" dominant-baseline="central">acts</text>
  <text class="dg-edge" x="394" y="128" text-anchor="middle" dominant-baseline="central">sees</text>
  <text class="dg-edge" x="490" y="188" text-anchor="start" dominant-baseline="central">final state</text>
  <text class="dg-edge" x="350" y="240" text-anchor="middle" dominant-baseline="central">grader only</text>
</svg>
```

| Component | What it does | Inspect | Harbor | Anthropic |
|---|---|---|---|---|
| Task | The input, plus whatever decides right and wrong (answer key, tests, rubric) | a Sample's `input` and `target` | `instruction.md`, `tests/` | task |
| System under test | Whatever produces the answer or the actions | solver (agents go here too) | agent | agent harness + model |
| Grader | Turns output or final state into a score | scorer | verifier | grader |
| Isolated environment | Where the system acts; every attempt starts clean | sandbox | `environment/` (Docker) | environment |
| Records | A complete trace of the process and the result | eval log | trajectory | transcript |

The most important line in the diagram is "grader only": the two halves of a task travel separately, and the system under test should see only the input. Once that line is breached, the score measures skill at peeking at the answers rather than the ability you care about. That is the subject of part 8.

## Taking apart one MMLU item

MMLU is 15,908 four-option multiple-choice questions across 57 subjects, collected by students from freely available practice and exam questions online (GRE and USMLE practice questions, university course questions, and so on).

- **Task**: the question, four options, and an answer key. The `answer` field of the item above is `2`, the third option, C (8).
- **System under test**: the model itself. The original paper starts the prompt with "The following are multiple choice questions (with answers) about [subject].", adds up to 5 worked examples, ends with "Answer:", and compares the model's probabilities for the next token being A, B, C, or D, taking the highest. No tools, no multi-turn interaction.
- **Grader**: matching. The chosen letter scores 1 if it equals the key and 0 otherwise; the benchmark score is the average.
- **Isolated environment**: none. Text goes in and text comes out (or just four probabilities).
- **Records**: each item's input, which letter the model chose, and whether it was right. Frameworks such as Inspect write these to a log.

"The model itself" does not mean nothing sits in between. How the prompt is worded, how many examples it includes, and whether the model writes a letter or you compare token probabilities together form a very thin harness. [HELM](https://arxiv.org/abs/2211.09110) measured this: the same OPT 175B on HellaSwag scored 79.1% when each option was scored separately and 30.2% when the options were presented together as a multiple-choice question. So "how you ask" is part of the spec of an MMLU score; parts 5 and 6 go into this.

## Taking apart one Terminal-Bench task: fix-git

[Terminal-Bench](https://www.tbench.ai/) measures how well agents complete long tasks in a terminal. Version 2.0 has 89 tasks, crowd-sourced and then filtered through review. Per §2.1 of the paper, every task has "instruction, Docker image, tests, example solution, time limit". The `fix-git` folder looks like this:

```text
fix-git/
├── instruction.md          # the one sentence above
├── task.toml               # difficulty, time limits, resources
├── environment/
│   ├── Dockerfile          # python:3.13-slim-bookworm, installs git
│   ├── setup.sh            # stages the "lost commit"
│   └── resources/patch_files/
├── solution/solve.sh       # reference solution
└── tests/
    ├── test.sh             # runs pytest, writes the reward
    └── test_outputs.py     # checks the contents of two files
```

Mapping each piece back to the five components:

- **Task**: the sentence in `instruction.md` is the input; whatever decides right and wrong lives in `tests/`, which the agent cannot see. `task.toml` lists the difficulty as easy, an expert estimate of 5 minutes, a junior-engineer estimate of 20 minutes, and an agent time limit of 900 seconds.
- **Isolated environment**: while the image is built, `setup.sh` clones a personal website repo, edits two files on a detached HEAD, commits them, and checks out master again. The commit is now on no branch and survives only in the reflog. That is the container the agent receives.
- **System under test**: an agent, meaning a model plus the code that issues commands, reads the output, and decides what to do next. That layer is called a scaffold or harness. The paper runs six agent harnesses crossed with a range of frontier models.
- **Grader**: execution checks. `test_outputs.py` computes the MD5 of two files and compares them with the correct versions; if all tests pass, `test.sh` writes `1` to `/logs/verifier/reward.txt`, and `0` otherwise. The paper's principle: "The tests verify that all outcomes described in the instruction have been achieved by testing properties of the final container state; they do not test the agent's commands or console output." Only the outcome counts, not whether the agent used `git reflog` or read `.git/logs/HEAD`.
- **Records**: every command and output from the agent is saved as a trajectory, and the test output as a verifier log. Since April 2026 the Terminal-Bench leaderboard [requires](https://www.tbench.ai/news/leaderboard-integrity-update) a trajectory for every passing trial.
- There is also `solution/solve.sh`: it reads `.git/logs/HEAD` to find the commit, creates a branch, and merges it into master. This is the reference solution; the oracle section below explains what it is for.

fix-git is a 2.0 task, and its tests run in the same container the agent used. Harbor has since changed that: starting with v0.25.0 (2026-10-25), new tasks created with `harbor task init` run the verifier in a [separate sandbox](https://docs.harborframework.com/tasks/separate-verifier) by default, which only receives the artifacts the task declares, and the template gains a `tests/Dockerfile` (based on the source code and documentation; not run). The five components stay the same; "grader and system under test do not share an environment" moved from a review guideline to the default architecture. How Terminal-Bench got there is part 13.

## The two items side by side

| Component | MMLU, high school CS item 0 | Terminal-Bench 2.0 fix-git |
|---|---|---|
| Input | Question + four options | One natural-language instruction |
| What decides right and wrong | Answer key `C` | MD5 comparison of two files in `tests/` |
| System under test | Model (plus a fixed prompt format) | Model + agent harness |
| Grader | Letter match | Run tests, check the container's final state |
| Isolated environment | None | Docker container with git and the repo staged |
| Reference solution | The answer key itself | `solution/solve.sh` |
| Records | Each item's choice and correctness | Command trajectory + verifier log |
| How long one attempt takes | One forward pass | Up to 900 seconds of multi-turn interaction |

## Is the thing under test a model, or a model plus scaffold?

Answer this before reading any benchmark score, because it decides what the score can be compared with.

An MMLU score is a model's score: the harness is fixed and thin, so swapping the model swaps the test-taker. A Terminal-Bench score belongs to a combination. Anthropic's post says it plainly: "When we evaluate "an agent," we're evaluating the harness and the model working together." Table 2 of the Terminal-Bench paper shows an instance: the same Claude Opus 4.5 scores 57.8% in the neutral Terminus 2 harness and 52.1% in Claude Code. The paper concludes that changing the model usually matters more than changing the harness, but both move the score, which is why every leaderboard row is "agent + model", not a model alone.

How to tell: look at what a leaderboard row says. If it names only a model, the model is under test; if it says "Claude Code + some model" or "Codex CLI + some model", the combination is. The [ABC checklist](https://arxiv.org/abs/2507.02825) lists this as a reporting item (R.6): a benchmark should state whether its subject is a model or an agent framework.

Inspect's design reflects this too: an agent and "add a system prompt, then generate" occupy the same solver slot. To the framework, the system under test is whatever slot receives the input and returns an answer or actions, and how much is packed into that slot is part of the spec.

## Three ways of grading

Inspect's [scorer documentation](https://inspect.aisi.org.uk/scorers.html) lists four forms, and Anthropic splits graders into code, model, and human. Grouped by what the grader has to do, they fall into three kinds:

**Matching**: compare the output with a reference answer, whether by exact equality, substring, regex, or a multiple-choice letter. Cheap, deterministic, and reproducible; MMLU is this kind. The weakness is that valid variants get marked wrong. Anthropic's own example: Claude Opus 4.5 initially scored 42% on CORE-Bench, and one of the problems was a grader that expected "96.124991…" and penalized "96.12". After fixing that grading problem, ambiguous task specs, and stochastic tasks that could not be reproduced, and switching to a less constrained scaffold, the score reached 95%.

**Execution checks**: run code to check the result, such as unit tests or checks on database or file state. Suited to tasks with many correct approaches whose outcomes can be checked; Terminal-Bench and SWE-bench are this kind. The weakness is the tests themselves: too loose and unfinished solutions pass, too narrow and other correct solutions fail. Part 7 deals with this.

**Judging**: another model scores against a rubric, or people do (human-preference leaderboards belong here). It handles open-ended output, at the cost of non-determinism and the need to calibrate against human labels. An easy-to-miss default: when no grader model is specified and no grader role is bound, Inspect's [model grading](https://inspect.aisi.org.uk/model-graded.html) has the model under test grade itself.

One benchmark can mix them. Inspect can re-score the same log with a different scorer, and Harbor's RewardKit can set code checks and an LLM judge as separate dimensions and weight them. When you read the documentation, look for which kind of grader produced the final percentage.

## Oracle: first prove the item can be passed

A reference solution (oracle) is a solution that is guaranteed to be correct if followed. The system under test never sees it; its job is to check the task itself. If even the reference solution cannot score full marks, the task or the grader needs fixing, and the test-taker has nothing to do with it.

Harbor makes this a fixed step in task authoring: after writing the tests, run the reference solution through the oracle agent, and the [create-a-task tutorial](https://docs.harborframework.com/tutorials/create-a-task) requires it to get reward 1. When it fails, the things to check are that `solve.sh` is not executable, the Dockerfile is missing a dependency, the tests do not write the reward file, or the test paths and solution paths disagree. Terminal-Bench's review process puts it in CI together with a check in the opposite direction: the oracle must solve the task, and a no-op agent that does nothing must fail. One confirms full marks are reachable; the other confirms zero is not free.

Anthropic's post makes the same point from the other side: for frontier models, a task that fails on all 100 attempts (0% pass@100) "is most often a signal of a broken task, not an incapable agent".

For multiple-choice questions the oracle is the answer key. Nobody "runs" it, so if the key itself is wrong, nothing catches it. After a sampled re-annotation, [MMLU-Redux](https://arxiv.org/abs/2406.04127) estimated that about 6.49% of MMLU questions have problems (unclear questions, unclear options, no correct option, multiple correct options, and wrong keys all count). How wrong answer keys affect scores is left for part 7.

## Practice on a benchmark's documentation

The next time you read a new benchmark's README or paper, spend five minutes filling in this table. Any cell you cannot fill is a place where the score is not yet comparable.

| Question | Where to look |
|---|---|
| What does one item look like? What is the input, and is right and wrong decided by an answer key, tests, or a rubric? | Example items, data format description |
| Is the thing under test a model, or a model plus scaffold? Is the harness fixed by the benchmark or brought by the submitter? | Leaderboard columns, evaluation settings |
| Is grading matching, execution checks, or judging? If judging, by which model? | The grading section, scorer code |
| Where does the system act? Is there a container, internet access, a time limit? | Environment settings, task config files |
| Is there a reference solution proving each item is solvable? | A solution field in the dataset, the review process |
| What is left behind after a run? Can you see trajectories? | Leaderboard submission rules, log format |

Filled in for fix-git: the input is one sentence, right and wrong is an MD5 match on two files, the thing under test is agent + model, grading is an execution check, the environment is a Docker container with internet access and a 900-second limit, there is a `solve.sh`, and the leaderboard requires trajectories. All six cells can be filled.

## Self-check

[GAIA](https://arxiv.org/abs/2311.12983) has 466 real-world questions whose answers are a word, a number, or a list, graded by quasi-exact match after normalization. Is the thing under test a model or an agent?

Answer: an agent. GAIA's questions require browsing the web, reading files, and combining several tools to reach the answer. The grader is plain matching, but the system under test is a model plus tools and scaffold. The paper's own numbers show the gap: on Level 1, GPT-4 alone scores 9.1%, and with plugins hand-picked for each question it scores 30.3% (a setup that cannot be reproduced).

Criterion: answering "agent" with the reason "it needs tools and multi-step interaction" is enough. If your reason was "it is graded by matching, so it measures a model", go back to the section on whether the thing under test is a model or a model plus scaffold: the grading method and the subject under test are two independent components.

Next, part 2, "How large is the error on one score?", picks up from here: with all the components in order, does a 3-point gap on an 89-task benchmark mean anything?

## References

- [Measuring Massive Multitask Language Understanding](https://arxiv.org/abs/2009.03300) (Hendrycks et al., the original MMLU paper); dataset [cais/mmlu](https://huggingface.co/datasets/cais/mmlu)
- [Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces](https://arxiv.org/abs/2601.11868) (2026)
- [harbor-framework/terminal-bench-2: fix-git](https://github.com/harbor-framework/terminal-bench-2/tree/main/fix-git) (task source files)
- [Leaderboard integrity update](https://www.tbench.ai/news/leaderboard-integrity-update) (tbench.ai, 2026-04-19)
- [Inspect](https://inspect.aisi.org.uk/): [Scorers](https://inspect.aisi.org.uk/scorers.html), [Model Grading](https://inspect.aisi.org.uk/model-graded.html), [Sandboxing](https://inspect.aisi.org.uk/sandboxing.html), [Eval Logs](https://inspect.aisi.org.uk/eval-logs.html) (UK AI Security Institute)
- [Harbor](https://github.com/harbor-framework/harbor): [Create a task](https://docs.harborframework.com/tutorials/create-a-task), [Separate verifier](https://docs.harborframework.com/tasks/separate-verifier), [Cracking down on reward hacking](https://docs.harborframework.com/news/reward-hacking)
- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (Anthropic Engineering, 2026-01-09)
- [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110) (HELM)
- [Establishing Best Practices for Building Rigorous Agentic Benchmarks](https://arxiv.org/abs/2507.02825) (ABC, NeurIPS 2025)
- [Are We Done with MMLU?](https://arxiv.org/abs/2406.04127) (MMLU-Redux)
- [GAIA: a benchmark for General AI Assistants](https://arxiv.org/abs/2311.12983)
- On this site: [Understanding AI Benchmarks overview](/posts/ai/2026-11-24-understanding-benchmarks-overview-en), [CS329Z Lecture 10: Terminal-Bench](/posts/ai/2026-09-10-stanford-cs329z-lecture-10-terminal-bench-en), [How to Read a Model's Report Card](/posts/ai/2026-08-26-understanding-ai-models-evaluation-en)
