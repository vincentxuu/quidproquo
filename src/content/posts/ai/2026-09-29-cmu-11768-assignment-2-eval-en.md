---
title: "Reading CMU 11-768 A2: Writing a Validator for a Data-Visualization Agent — Four Error Families, MCC, and Harbor Verifiers"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, evaluation, llm-as-a-judge, benchmark]
lang: en
series:
  name: "Reading CMU 11-768 AI Agents"
  order: 14
tldr: "11-768's Assignment 2 has students use one fixed judge, Qwen3-VL-30B-A3B, to flag four error families in every run of a data-visualization agent, graded by the mean MCC across families on a private set (30% of the assignment). The second half packages students' own tasks as Harbor environments, with one wrong solution the verifier rejects and one that fools it. The theme: the grader you write becomes the RL reward later."
description: "A guide to CMU 11-768 Assignment 2 (Eval, due Oct 1): the four error families for a data-visualization agent, why it is scored with MCC, the constraints of a fixed weak judge and no reference answers, what each of the four Parts asks, the five layers of a deterministic Harbor verifier and mutant design, and how it ties back to reward design in L9, L10, and L11. Requirements and trade-offs only, no solutions."
draft: false
glossary:
  - term: "MCC"
    aliases: ["Matthews correlation coefficient"]
    definition: "A binary classification score that uses all four cells — true positives, true negatives, false positives, false negatives. 1 is perfect, 0 is no correlation, negative is inverse correlation. More reliable than accuracy when classes are imbalanced."
    context: "A2 computes one MCC per error family and averages them into macro-MCC."
  - term: "mutant"
    definition: "A deliberately wrong solution that looks like a correct one, used to test whether a verifier can tell right from wrong."
    context: "A2 asks for two mutants across the student's Harbor tasks: one the verifier rejects and one it lets through."
  - term: "Harbor"
    definition: "An agent evaluation framework that defines each task as a self-contained directory with its own sandbox and verifier, so any agent can run it with one command."
    context: "A2 Part 3 requires packaging the student's own visualization tasks as Harbor tasks."
---

> 🌏 [中文版](/posts/ai/2026-09-29-cmu-11768-assignment-2-eval)

The three individual assignments in [CMU 11-768 AI Agents](https://www.cmu-agents.com/) form a single line: [A1](/en/posts/ai/2026-09-29-cmu-11768-assignment-1-harness-en) builds a harness, A2 builds evaluation, A3 does training. [Assignment 2](https://github.com/cmu-agents/assignment-2) is worth 15% of the course grade and is due October 1; the course site sums it up as "design the evaluation framework needed to measure agent correctness and functionality." It was designed by Andy Liu, Jiarui Liu, and Yueqi Song, and runs on course-provided Modal compute credits.

This post covers only what the assignment asks for, how it is structured, how it is scored, and the design trade-offs — **no solutions**. The schedule has no lecture dedicated to evaluation; evaluation design lives only in this assignment. So the end of this post ties it back to L9 through L11: the validator you write in A2 is what RL maximizes as a reward from A3 on.

## What is being evaluated: a data-visualization agent

The system under test is a **data-visualization agent**: given data files and a user's chart spec, it writes matplotlib code, runs it, and saves `figure.png`. What students write is a **validator**: given the task, the agent's full trajectory, the input data, and the final figure, decide whether the run went wrong and in which family.

The Overview in `ASSIGNMENT.md` explains why this setting: agentic systems are complex and their tasks run long, which brings many new complications compared with pre-agentic LM evaluation, and you only find out where the difficulty lies by building one yourself. Visualization has the advantage that most errors are visible; the catch is that "visible" means a vision model has to look.

## The four error families

Each run's output is a list of errors. Each error belongs to one of four families and carries specific evidence grounded in that run. An empty list means the run is acceptable.

| Family | Meaning | Typical examples |
|---|---|---|
| `execution_failure` | No valid figure in the end | Crash, turns exhausted, gave up |
| `wrong_data` | The plotted data is not what was requested | Wrong aggregation, missing series, wrong column or filter, wrong order |
| `wrong_chart` | Data is right, requested chart design is not followed | Wrong chart type, wrong subplot layout, wrong axis label or limits, missing legend, wrong line style or colormap |
| `hard_to_read` | Drawn as requested, but unreadable or hard to read | Clipped or overlapping text, legend covering data, low contrast, indistinguishable series |

A few boundary rules are worth memorizing first, because they decide how a validator has to split its work:

- **`execution_failure` is terminal.** When the ground truth lists it, the other three families are excluded for that run, since there is no figure to judge. The reverse does not hold: a validator predicting it does not exempt the run from the other three.
- **Severity decides the family.** A title cut in half by the image edge is `hard_to_read`; a title entirely outside the image counts as missing, which is `wrong_chart`.
- **A legend over empty space is fine**; only one covering data counts as `hard_to_read`. The contrast threshold is about 2.5:1.

Of the 110 seed runs shipped with the assignment, only 16 have no errors at all; 71 have `wrong_chart`, 39 `hard_to_read`, 25 `wrong_data`, and 12 `execution_failure` (counted from `seed_labels.json`; one run can carry several families, and all 12 `execution_failure` runs carry that family alone).

## Why MCC and not accuracy

Each family is scored separately as a binary problem: a run is a positive when the ground truth lists the family, and a prediction is positive when the validator's error list names it. The four counts give the [Matthews correlation coefficient](https://en.wikipedia.org/wiki/Phi_coefficient):

$$
\mathrm{MCC}=\frac{TP\cdot TN-FP\cdot FN}{\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}}
$$

The overall `macro_mcc` is the unweighted mean of the four family MCCs, always divided by four.

The seed distribution shows why accuracy would not work. The 12 runs whose ground truth is `execution_failure` are excluded from the other three families, so `wrong_chart` is scored over the remaining 98 runs, 71 of them positive: a validator that always says "`wrong_chart`" is right more than 70% of the time (71/98). `execution_failure` appears in 12 of 110, so always saying "no" is right almost 90% of the time (98/110). MCC gives both constant predictors 0, so the only way to score is to actually discriminate.

The assignment also spells out the small-sample trap. On a handful of self-authored tasks, a family might never occur, or occur on every run; then MCC is undefined, the scorer reports 0 with an insufficient-support flag, and the score should be read cautiously. The private set is guaranteed to contain both classes in every family. And MCC measures classification only; the quality of the evidence in explanations is assessed separately.

## Three deliberate constraints

Most of the difficulty comes from three constraints, each matching a situation real-world evaluation runs into:

1. **The judge is fixed, and it is not strong.** The validator may only call `Qwen/Qwen3-VL-30B-A3B-Instruct-FP8` — no substitutions and no other models — and grading uses a deployment of the same model. The handout says it plainly: design the validator to generalize rather than to depend on a strong judge.
2. **No reference answer.** At grading time the validator sees one run at a time, with no ground-truth label, reference figure, or other candidate runs — only the task, inputs, trajectory, and figure.
3. **The private set may contain unseen chart types.** The handout warns against designs that overfit the public examples, and against hard-coding public task IDs or labels.

The first constraint also raises an engineering problem: trajectories can be longer than the context window. The official baseline first sends the full evidence; if the request is rejected for exceeding the context, it retries once, using the server's tokenizer to budget 50% of the context for text and the response, keeping the beginnings and ends of the trajectory and input files while leaving the task and figure intact. What happens if the compacted request still does not fit is where the two primary sources disagree: `ASSIGNMENT.md` says there is no progressively shrinking retry loop and the error is propagated, but `validator/baseline.py` in the same commit (`f609e76`) downscales the image's longest side by 0.7× per retry until it fits or reaches 64 pixels. Going by the code, it is the latter. The handout stresses that this is only the baseline's approach, that the fallback can lose relevant evidence, and that context management is up to the student.

## How the assignment is laid out

Students modify only `validator/solution.py`, implementing `validate(run)`; the function signature and the output schema (`validator/prediction.py`) are fixed. The skeleton splits into three functions: `judge_execution`, `judge_data_and_chart`, and `judge_readability`. The official baseline (`validator/baseline.py`) asks the judge one YES/NO question per family, sending the task, trajectory, inputs, and figure together; it checks `execution_failure` first and returns immediately if that fires.

The rest of the repo:

- `artifacts/<run_id>/`: the 110 seed runs, each with `result.json` (task, full trajectory, outcome) and `figure.png` (when one was produced). `run_id` is the only unique key; several runs can share a `task_id`.
- `workflow/`: commands to validate tasks, generate runs, initialize labels, score, package Harbor tasks, and check the submission.
- `infrastructure/`, `scripts/`: deploying the judge model, the three agent models, and the agent runner on Modal.
- `harbor/`: the Harbor worked example, task template, preflight check, and troubleshooting.

The three agents under test are fixed too: `Qwen/Qwen2.5-Coder-3B-Instruct`, `mistralai/Ministral-3-14B-Instruct-2512`, and `zai-org/GLM-4.7-Flash`. Each run is capped at 20 agent steps, 120 seconds per shell command, and 15 minutes of wall time.

## What the four Parts ask for

| Part | Work | What the report must cover |
|---|---|---|
| 1 Examine seed runs | Run the baseline, compare with human labels | All four family MCCs and macro-MCC; two common validator error types, each in at least two trajectories (with run IDs), their observable evidence, and a proposed fix |
| 2 Improve the validator | Implement the two changes from Part 1 | New MCCs vs. the baseline; at least one false positive and one false negative with their causes |
| 3 Design new tasks | Identify two task types the validator may not generalize to; write 5+ tasks (at least 2 per type); run each with all three agents (15+ runs); hand-label them; package each task for Harbor | MCCs on the authored runs; which failures are agent weaknesses vs. validator weaknesses; both mutants' rewards and why |
| 4 Iterate | At least one more validator change, rerun on seed and authored runs | New MCCs; at least one false positive and one false negative, quoting the trajectory with a hypothesis; motivation and effect of every additional change |

Parts 1 and 3 are two ways to find a validator's weaknesses: read real trajectories and generalize from the errors, or deliberately write out-of-distribution tasks as a stress test. The assignment requires both.

### Harbor packaging in Part 3

[Harbor](https://github.com/harbor-framework/harbor) defines evaluation tasks as self-contained directories with their own sandbox and verification criteria, runnable against any agent; the handout describes it as having become an industry standard for agent benchmarks since Terminal-Bench 2.0 popularized it. Harbor needs a **deterministic verifier**, not a model judge, so packaging requires each task to additionally ask the agent for `plot.py` and `plotted_values.json` — without redesigning the task content, and without editing the seeded prompt after runs are generated.

The official worked example (`harbor/example/`) is a bar chart of yield from a fictional orchard, with a verifier in five layers ordered by cost:

| Layer | What it does | What it catches |
|---|---|---|
| S1 | File exists, is a valid non-blank PNG, input CSV untouched, script left behind | Total failure |
| S2 | Re-run `plot.py` in a scrubbed workspace with `savefig` hooked, assert on the matplotlib artist tree (bar heights, tick labels, y limits) | `sum_crates` (sums the wrong column), plus other aggregation, ordering, and label errors |
| S3 | Check the delivered PNG is exactly the image the re-run produced | `forgery` (correct script, figure drawn from other data); only S3 catches it |
| S4 | Re-run against a modified input CSV and require the plotted numbers to move | `hardcoded` (correct totals typed in by hand, CSV never read); only S4 catches it |
| S5 | Cross-check the agent's own `plotted_values.json` against the key and the drawn chart | Sidecar and chart disagree |

The fourth mutant, `illegible`, is the point of this section: every number and label is right, but it is drawn on a 3×2.2-inch canvas in 2pt type, so the title, both axis labels, and the four orchard names are under three pixels tall. All fifteen assertions pass and it scores 1.0. Assertions over the artist tree measure data and structure; they cannot measure whether the rendered image is readable.

Students have to reproduce this finding on their own tasks: every packaged task's reference solution must score 1.0, and across tasks they write two mutants — one their assertions reject (reward 0) and one genuinely wrong answer that passes (reward 1.0). The report gives each mutant's reward, what it gets wrong, and either the assertion that caught it or why nothing could have. The handout is direct about it: the second mutant is the point of this part, because it is where you **measure**, rather than being told, the boundary a deterministic verifier cannot cross — the boundary your VLM validator exists to cross.

## Grading

| Weight | Component |
|---:|---|
| 40% | Report and design rationale |
| 30% | Validator macro-MCC on the private set |
| 20% | Quiz / comprehension check |
| 10% | Code quality and reproducibility |

The submission includes `validator/solution.py`, all prediction outputs, the authored tasks and inputs, runs from all three agents, `labels.json`, the Harbor tasks with two mutants, the report as PDF and LaTeX source, and `AI_USAGE.md` (declared AI tool use — not graded, but a quiz checks you understand the code you submitted). Before submitting, `workflow check-submission` verifies the structure and actually runs Harbor to confirm the reference solutions score 1.0 and the mutants score 0 and 1.0. It does not judge label correctness or report quality; those need a human.

The report outweighing the private-set score, 40% to 30%, is itself a signal: the assignment cares more about whether you can explain why your validator is designed the way it is and where it fails than about the number alone.

## Design trade-offs

These are questions I think are worth settling before writing code, after reading the handout. They have no single right answer, and the assignment does not prescribe one.

- **One family per call, or all at once?** The baseline asks once per family. Separate calls make each family's criteria easier to control, at four times the calls and context cost, and the cross-family boundary rules (clipped vs. fully outside) become yours to stitch together.
- **Where does the evidence come from?** The trajectory, input files, and figure answer different questions. The docstring at the top of `prediction.py` maps the four families to where their evidence lives: the trajectory, the numbers a figure records, the structure it records, and the rendered image. Which family should lean on which evidence is the core of the design.
- **Over-report or under-report?** MCC treats false positives and false negatives symmetrically, but the families' positive rates differ widely, so the same decision threshold has different consequences for `wrong_chart` and `execution_failure`.
- **How far can a weak judge be trusted?** The judge is a fixed 30B-class MoE vision model. Which calls to hand it, and which are better answered by reading the code and error messages in the trajectory, is what Part 1's error analysis is for.
- **Which part goes to deterministic checks and which to the model judge?** The Harbor part shows you firsthand: whether the data is right can be checked precisely with program assertions, while whether it is readable almost has to be judged by looking. It is not a choice of one or the other.

## Evaluation is the future reward: tying back to L9, L10, L11

There is no lecture called Evaluation, but the three lectures around this assignment each cover a different side of the same thing.

**[L9 (RL Basics)](/en/posts/ai/2026-09-29-cmu-11768-lecture-09-rl-basics-en)**: the RL objective is to maximize expected reward. L9's toy number-guessing task has a clean reward — 1 for the right number, 0 otherwise — and expert iteration uses reward to filter trajectories, doing SFT only on high-reward ones. Both assume you already have a trustworthy scoring function. A2 makes you build one, so you learn it does not appear on its own.

**[L10 (Deep Research Agents)](/en/posts/ai/2026-09-29-cmu-11768-lecture-10-deep-research-agents-en)**: the evaluation half of Akari Asai's lecture is practically a preview of A2: there is more than one valid answer, similarity to a reference does not mean correct, an LM judge's agreement with experts has to be measured first (the slide shows Expert–LM 79% vs. Expert–expert 80%), and rubrics themselves need auditing. Its modeling half, with DR Tulu, shows the next step: once a grader is good enough, it becomes the RL reward, and reward quality directly decides how much the model learns: the slides compare RL curves for random rewards, initial rubrics only, and evolving rubrics, and the [paper](https://arxiv.org/abs/2511.19399)'s ablation reports up to a 2-point average drop without evolving rubrics, with both rubric variants beating random rewards.

**[L11 (Advanced RL Algorithms)](/en/posts/ai/2026-09-29-cmu-11768-lecture-11-advanced-rl-en)**: L11's slides lay out a verifier's two failure modes. A false negative rejects a valid solution; the result is reward noise and early benchmark saturation. The slides cite SWE-bench Verified plateauing near 81%, sourced to OpenAI's February 2026 [audit post](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/): state of the art rose only from 74.9% to 80.9% over six months, and of 138 problems o3 did not consistently solve across 64 runs, 59.4% had material issues in test design or problem description that reject functionally correct submissions. That post also names training-data contamination as a second cause; the slide takes only the flawed-tests half. A false positive accepts an invalid solution; the result is reward hacking. The slides' example is a constructed toy: a `retry_count` function must handle four input cases, the training verifier tests only `retries=0`, so an "always return 0" solution earns reward 1 while passing only one of the four cases. A2's Harbor part touches both errors. `hardcoded` and `illegible` are both false positives: the first gets past every layer except S4, the second past the whole deterministic verifier. False negatives hide in over-strict assertions; the example README warns that an assertion for something the instruction did not ask for is a trap rather than a test. L11's remedy is independent checks that the progress is real — the role A2's private set plays.

Put differently, A2's macro-MCC measures how much noise your validator would inject if it were a reward. A3 trains agents, and at that point you will be glad you chased down both kinds of error now.

## Things you can do tonight

- **Run the baseline and score it first.** Deploy the judge model per the README, run `validator.runner --solution validator.baseline`, then `workflow score` against `seed_labels.json`, and write down the four family MCCs. That is the first step of Part 1 and the control for every later change.
- **Pick five runs the baseline gets wrong and read each trajectory.** Write one line per run: what the human label says, what the validator said, and whether the evidence actually lives in the trajectory, the numbers, the structure, or the image. After five lines, the "two common error types" Part 1 asks for usually show themselves.
- **Run the Harbor example's `illegible` mutant.** Swap it in following `harbor/example/README.md`, run it, and open `pytest.log` to watch all fifteen assertions pass. Seeing it once shows the boundary of a deterministic verifier more clearly than any explanation.

## Further reading

For the series overview, see [the course overview post](/en/posts/ai/2026-09-29-cmu-11768-course-overview-en).

- [Reading Stanford CS329Z Week 7: Score Honestly, Scale Data — Midterm Checkpoint](/en/posts/ai/2026-09-15-stanford-cs329z-week7-eval-benchmarks-en)
- [Reading Stanford CS329Z Week 8: Let a Model Judge, Then Guardrail the Agent](/en/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety-en)
- [How to Rigorously Compare Before and After Agent Changes: From Golden Sets to Statistical Testing](/en/posts/ai/2026-06-04-agent-change-rigorous-evaluation-en)
- [Self-Reflection + LLM-as-Judge: Having AI Evaluate Its Own Answers](/en/posts/ai/2026-03-12-self-reflection-llm-as-judge-en)
- [CS336 Lecture 16: RLVR Scales Reasoning with Verifiable Rewards, but GRPO Is Not Free PPO](/en/posts/ai/2026-08-22-cs336-rlvr-en)

## References

- [CMU 11-768 AI Agents course site](https://www.cmu-agents.com/)
- [cmu-agents/assignment-2 (assignment repo, including ASSIGNMENT.md)](https://github.com/cmu-agents/assignment-2)
- [Harbor (harbor-framework/harbor)](https://github.com/harbor-framework/harbor)
- [Lecture 9 slides: RL Basics](https://www.cmu-agents.com/slides/lecture-09-rl-basics.pdf)
- [Lecture 10 slides: Deep Research Agents](https://www.cmu-agents.com/slides/lecture-10-deep-research-agents.pdf)
- [Lecture 11 slides: Advanced RL Algorithms](https://www.cmu-agents.com/slides/lecture-11-rl-advanced.pdf)
- [Why SWE-bench Verified no longer measures frontier coding capabilities (OpenAI, Feb 2026)](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)
- [DR Tulu: Reinforcement Learning with Evolving Rubrics for Deep Research (arXiv:2511.19399)](https://arxiv.org/abs/2511.19399)
- [Phi coefficient / Matthews correlation coefficient (Wikipedia)](https://en.wikipedia.org/wiki/Phi_coefficient)
