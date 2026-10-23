---
title: "Spin Up the Data Flywheel — Submission Week | Stanford CS329Z Week 6"
date: 2026-09-10
updated: 2026-10-23
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, compound-ai-systems]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 7
tldr: "Week 6 connects Terminal-Bench outcome verification with Shankar’s data flywheel: check what the agent actually changed, turn reviewed failures into development examples, and keep independent test tasks separate. HW1 is due October 30."
description: "Read the Terminal-Bench task formulation alongside Shankar’s data flywheel for CS329Z Week 6, with a CSV verification example, a trace-to-improvement diagram, and checks against evaluation leakage."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-week6-data-flywheel)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Week 6 is submission week. Monday (Oct 26) has the scheduled Terminal-Bench guest lecture with Ryan Marten and Alex Shaw, and [HW2](https://cs329z.stanford.edu/) drops the same day. Wednesday (Oct 28, Data for Agentic Systems) assigns [Shreya Shankar](https://www.sh-reya.com/)'s [Data Flywheels for LLM Applications](https://www.sh-reya.com/blog/ai-engineering-flywheel/) (2024). HW1 is due Friday (Oct 30). Then the recorded midpoint demo video is due Nov 4 at 11:59 p.m., and the midway report follows on Nov 6.

The data flywheel is one sentence: every production output is training material for the next round. Each answer an agent gives leaves a trace — what the user asked, which steps the system took, where it went wrong. Save the traces, score them, put the good ones back into the prompt as demonstrations, and put the fixed bad ones back too. One full turn means better demonstrations and higher scores, and the next turn produces even better data.

Shankar splits the loop into three stations: evaluation, monitoring, and continual improvement. Evaluation defines what success looks like; monitoring keeps the metrics honest against reality; improvement feeds what was learned back into the system. All three eat the same production data, for different purposes. The post ships no new model and no new algorithm. It is engineering discipline: how to squeeze every drop out of production data.

## Trace backward from the final state: evidence for a data flywheel

In a customer-support or internal assistant, a plausible answer and a completed task are different outcomes. The [official schedule](https://cs329z.stanford.edu/) places the Terminal-Bench guest lecture on October 26 and agent data on October 28. As of October 23, 2026, these classes are still upcoming and no slide links have been released. This is a preparation guide based on assigned materials, rather than a transcript or page-by-page lecture account.

### Step 1: specify the required change in the environment

Imagine aggregating paid orders by city into a CSV. Verification reads the artifact, checks its columns, excludes canceled orders, and compares each city's totals. A completion message, a successful command, and the existence of a file are each insufficient evidence. Terminal-Bench places tasks in an executable environment and checks outcomes with tests; see the [paper's task definition](https://arxiv.org/html/2601.11868). The order example is original teaching material, not a benchmark task.

### Step 2: turn failure into inspectable data

A missing city could mean missing input or an incorrect filter. A single failure score cannot distinguish them. Preserve input versions, tool arguments, observations, artifacts, and grader versions so the run can be replayed. Record the reason for a human correction, such as excluding canceled orders. The [flywheel article](https://www.sh-reya.com/blog/ai-engineering-flywheel/) connects evaluation, monitoring, and continual improvement; this record design is an implementation recommendation derived from that framing.

### Step 3: separate improvement examples from acceptance examples

A failed case can become development material for changing a prompt, or remain unseen acceptance material. Once used to select versions, it no longer provides independent acceptance evidence. Record provenance, correction rationale, and purpose beside each example; evaluate the changed system on frozen tests.

**Check your understanding:** the CSV is well formed but includes canceled orders. Should you add a model judge? **Answer criteria:** first add an executable business-rule check and inspect the filtering step. A model judge for open-ended quality does not replace this deterministic rule.



## Reading 1 | Terminal-Bench

Source: [Terminal-Bench](https://arxiv.org/html/2601.11868)

### TL;DR

Tasks combine instructions, Docker environments, time limits, tests, and reference solutions and score resulting state.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | How can a terminal agent's completion claim be verified? |
| Evidence and scope | This guide follows the paper's task definition and version, rather than treating a current leaderboard as course performance. |

### Domain background

A terminal can modify extensive state; a successful exit can still leave wrong artifacts or incomplete configuration.

### Intermediate guide

**Method.** The harness starts an isolated environment, supplies instructions and a terminal, and checks resulting state after execution.

The [official schedule](https://cs329z.stanford.edu/) now lists the October 26 guest session as Terminal-Bench with Ryan Marten and Alex Shaw. The session is still upcoming. This section reads the assigned [Terminal-Bench paper](https://arxiv.org/html/2601.11868), rather than reconstructing a talk that has not happened. You need to understand tool calls and terminal output; the goal is to write a success condition your agent cannot satisfy merely by saying it is done.

The paper defines tasks through instructions, an isolated Docker environment, tests, a reference solution, and a time limit. The agent chooses its commands. Tests check whether the **final container state satisfies the requested outcomes**; they do not require the reference command sequence or grade the final chat reply. Bring that distinction back to HW1: using a terminal is an action capability; checking whether the action met the request is an evaluation capability.

Here is an original teaching example, not an official benchmark task or homework solution. Suppose a team asks you to summarize event registrations from this CSV:

```csv
city,status
Taipei,confirmed
Taipei,cancelled
Taichung,confirmed
Taipei,confirmed
```

The request is to count only `confirmed` registrations by city in `summary.csv`, without changing the input. Walk through the rows: exclude the cancelled Taipei entry, leaving two Taipei entries and one Taichung entry. The expected output is therefore Taipei 2 and Taichung 1, regardless of row order.

| State after the run | Verdict | Reason |
|---|---|---|
| Says “done,” but creates no output file | Fail | A reply cannot substitute for a file |
| Creates a file, but counts Taipei as 3 | Fail | Cancelled registrations were included |
| Counts Taipei 2 and Taichung 1, but alters the input | Fail | Correct output still violates the input-preservation constraint |
| Correct columns, cities, counts, and unchanged input | Passes this example's conditions | Both the outcome and constraint hold |

A verifier could read the CSV back, compare the city-to-count mapping, and compare the input file's hash before and after execution. This describes a verifier design; it is not a claim that the official harness has been run, or that these checks ensure safety for arbitrary tasks.

**Check your understanding**: one agent uses Python and another uses shell commands to reach the same valid state. Which should pass? Both: the request did not prescribe a language. What if the verifier only checks that the output file exists? It catches the missing-file case but misses wrong counts and input corruption. Add outcome and constraint checks.

**Evidence and result.** The paper packages complex command-line work as tasks with environments and tests, enabling outcome scoring beyond agent self-report.

### Deeper points

- A reference solution establishes solvability without requiring the agent to follow identical commands.
- Reset state and time limits belong to the task; reusing previous artifacts changes the problem.

### Reviewer’s one-line verdict

Outcome verification is closer to task capability than completion claims.

### Your take-away

Write a test that inspects the actual artifact and does not accept the final message as proof.

## Reading 2 | Data Flywheels for LLM Applications

Source: [Data Flywheels for LLM Applications](https://www.sh-reya.com/blog/ai-engineering-flywheel/)

### TL;DR

The article links evaluation, monitoring, and improvement, using human labels and corrections to align metrics and reusable examples.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | How can production failures become useful improvement data? |
| Evidence and scope | This is a practice framework; some automation ideas are explicitly exploratory rather than validated product capabilities. |

### Domain background

Production LLM applications encounter unanticipated inputs; an error rate alone does not tell a team how to improve.

### Intermediate guide

**Method.** Inspect outputs to define metrics, periodically align implementations with human labels, and use failures to revise prompts or pipelines.

Metrics cannot come from armchair theorizing. The advice is to read a batch of real outputs first, then decide what to validate. The example is vivid: filler words like "delve" and "crucial" reek of model authorship, and you only think to ban them after seeing them in the wild. There is no shortcut here — reading data is the job.

Metrics come in two flavors. Simple ones get hardcoded — character counts for conciseness, say. Subjective ones go to a model acting as judge ([LLM-as-a-judge](https://arxiv.org/abs/2403.02839)), with good and bad examples in the judge prompt, which can significantly improve alignment. And the author urges starting with boolean questions. Likert scales look precise but are harder to align; true-or-false is where human labelers and machine judges most easily agree.

For more evaluation craft, see [Hamel Husain](https://hamel.dev/)'s [evaluation guide](https://hamel.dev/blog/posts/evals/), recommended by the author herself.

Single calls are easy to validate; graphs of calls are not. Errors from an early step get amplified downstream, so validation should work like probes in software observability — inserted at every node. Nodes come in three types, a taxonomy credited to [Han Lee](https://leehanchung.github.io/): classifiers (diamonds, handling state transitions), writers (rectangles, generating content), and compilers (hexagons, generating code). A customer-support chatbot shows how the three divide the labor.

Each type gets validated differently. Classifiers take the classic metrics — accuracy, precision, recall. Writers are the hardest, with bespoke standards per task and custom validators to match. Code-generating nodes have it best: linters, test suites, and executing the SQL to inspect the result — the full software-engineering toolkit applies.

With many probes in place, the next question is what to fix first. The answer: label every validator output and compute per-step accuracy, so the compounding becomes visible. The author concedes that full validation of multi-step pipelines remains an open research question — an appetizer for next week's evaluation theme.

The field mostly validates outputs; the author insists on inputs as well. Rejecting queries the pipeline was never built for is robustness in itself. The motto is borrowed from [Brendan Dolan-Gavitt](https://moyix.net/): be strict in what you send to the model, liberal in what you accept back.

The checks are concrete: does the query touch only the requester's own data, is the topic in scope, does semantic similarity clear a threshold (0.7 is the worked example), is the language supported, is there smuggled personal data or an injection attempt. Each check is small. Skip any of them and it becomes a section in a future incident review.

A metric set never stays done. Model vendors ship silent updates, user tastes drift, and production always surfaces failures nobody anticipated. The fix is a model agent that periodically reads labeled production data and proposes adding, editing, or retiring metrics. [Alta](https://www.altadaily.com/), a startup working with the author, already does this — a dedicated metric set per end user.

Metric implementations have to grow up too. Sample regularly, label by hand, store everything with timestamps — the most labor-hungry step of the whole flywheel. Once the label store exists, validator prompts stop being static: retrieve relevant examples by semantic similarity on each call, prefer cases where humans and models once disagreed, and weight by recency. Favoring fresh data is the author's instinct, and she admits nobody she knows does it yet.

Labeling labor cannot be eliminated, but it can get smarter. [LangChain](https://www.langchain.com/)'s approach is model-labels-first, human-edits-second: every item ships with a default label, and people override only when they care. The failure mode is stated honestly: if people get lazy and stop checking, alignment silently drifts. That is exactly the problem next week's [Who Validates the Validators](https://arxiv.org/abs/2404.12272) (UIST 2024) takes on.

The first two stations exist for this one: a system that gets stronger as it runs. The prerequisite is complete logs — what the output was, what each metric scored — which is what tools like [LangSmith](https://www.langchain.com/langsmith) are for. Then walk on two legs, human and automatic.

The human leg is fundamentals: review score distributions regularly, find the low-scoring clusters, analyze input drift, A/B test prompt variants. The automatic leg is the flywheel's essence: fix a batch of low-scoring outputs daily or weekly, store the fixed versions with their scores, and at inference time retrieve the most similar fixed cases as few-shot demonstrations. At least 5 practitioners do this already, the author reports, and [Dosu](https://blog.langchain.dev/dosu-langsmith-no-prompt-eng/)'s bot runs on exactly this architecture.

The architecture has a lovely side effect: prompt engineering turns into a retrieval problem. The question shifts from how to write the prompt to how to fetch the right examples — the most instructive for the model, the closest to what the user wants. One more tip from the author: scoring quality along separate dimensions beats one holistic grade. Labels get more consistent, validators align more easily, and the weak spot shows itself.

The lecture title names three data kinds — traces, demonstrations, and feedback — and the flywheel post divides their labor. Fixed traces are demonstrations, for optimization; scored traces are test items, for evaluation. Both uses may originate in one label store, but assign cases to development or held-out evaluation before tuning; a case used in demonstrations cannot also provide independent test evidence.

That also explains why HW2 follows HW1 so closely. HW2 (released Oct 26) asks you to build a full evaluation suite for a ready-made agent: hardcoded graders, at least one model judge, test tasks built on the 4-tuple (request, environment, stopping criteria, scorer), plus error analysis. Week 5 taught optimization, this week teaches production data, and evaluation completes the triangle — the course's deliberate sequencing.

Whether the flywheel spins ultimately depends on humans willing to label. The author's first observation says it plainly: people must stay in the loop regularly, because human preferences over outputs shift over time. Model-first, human-edits-second saves effort, but legal teams wanting prompt sign-off and adversarial queries poisoning the demonstration pool are real-world friction. In the post's footnotes, Han names both risks.

For students this lands close to home: you are your own cheapest labeler. Every question you run through your HW1 email assistant and every answer you fix is the flywheel's first batch of fuel.

**Evidence and result.** The article proposes a path from outputs and labels through monitoring to improvement and identifies graph-level validation as an open problem.

### Deeper points

- Changing metric definitions and drifting implementations are different: one changes the objective and the other mismeasures it.
- Corrected traces can supply few-shot examples, but should retain correction reasons rather than only polished answers.

### Reviewer’s one-line verdict

A working flywheel depends on turning failures into reliable labels.

### Your take-away

Keep reasons and corrections for each failure and isolate acceptance data from development.

## Reading 3 | LLMs for Data Annotation and Synthesis: A Survey

Source: [LLMs for Data Annotation and Synthesis: A Survey](https://aclanthology.org/2024.emnlp-main.54/)

### TL;DR

The survey organizes LLM annotation and generation methods, applications, and challenges; scale still needs quality and bias checks.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | When are model-generated labels and synthetic data useful? |
| Evidence and scope | A survey combines different setups; their best numbers cannot be added or treated as one experiment. |

### Domain background

Generation can reduce some collection costs while reproducing model blind spots; labels and synthetic examples both need validation.

### Intermediate guide

**Method.** Organize methods by annotation and generation purpose, application tasks, evaluation, and open challenges.

The main post barely discusses purely synthetic data, and that silence is itself the answer. The flywheel burns fixed real outputs, not model-dreamed ones. Whether model rewrites and model labels are usable depends on how well validators align with humans — which the author flags as an open problem. Next-token probabilities from instruction-tuned models are poorly calibrated, and asking models for confidence scores does not work well either.

To fill the gap, read this week's additional reading, [Tan et al.'s survey](https://arxiv.org/abs/2402.13446) (EMNLP 2024): how models serve as annotators, how synthetic labels get accepted, and what to watch when training on synthetic data. It covers exactly the pages the flywheel leaves blank.

**Evidence and result.** The survey maps annotation and synthesis methods and highlights tradeoffs among cost, quality, and bias.

### Deeper points

- Agreement between generators and validators with shared blind spots does not establish correctness.
- Synthetic data should retain provenance and generation conditions so recurring learned errors can be traced.

### Reviewer’s one-line verdict

Data volume and trustworthiness require separate judgments.

### Your take-away

Check synthetic data against a small human-labeled sample before scaling selected failure categories.


## What to do: make traces exist before the deadline

**What to do**: give your HW1 agent minimal trace logging — store the query, the retrieved emails, and the final answer for each question, plus one good-or-bad tag graded by your own hand. Reserve half an hour each week for review: file fixed bad cases into a demonstration pool, and turn recurring failure types into next-version metrics. Finish one full round before HW1 is due, and the midway report's Environment & Data and Summary of Progress sections will practically write themselves: where your evaluation data comes from, and which failures you are still stuck on.

## Where it sits in the course

This week is the watershed. HW1 (due Oct 30) wraps up a full harness written from scratch with no frameworks; HW2 (released Oct 26) moves the battle to evaluation. Next week (Week 7) doubles down: Monday reads [SWE-smith](https://arxiv.org/abs/2504.21798) (NeurIPS 2025) on mass-producing task data for software-engineering agents, plus Who Validates the Validators on validator alignment, and Wednesday is all evaluation design. The midpoint demo is now a recorded video rather than an in-class presentation, due Nov 4 at 11:59 p.m.; the midway report lands on Nov 6 — you need a running prototype before there is anything to record.

## This week's course material

The [official schedule](https://cs329z.stanford.edu/) assigns these materials; both classes are upcoming as of October23,2026.

| Scheduled class | Required readings | Additional reading |
| --- | --- | --- |
| Oct26: Terminal-Bench guest lecture | [Terminal-Bench project](https://www.tbench.ai/) and [paper](https://arxiv.org/html/2601.11868) | No additional assigned item listed |
| Oct28: Data for Agentic Systems | [Data Flywheels for LLM Applications](https://www.sh-reya.com/blog/ai-engineering-flywheel/) | [LLMs for Data Annotation and Synthesis: A Survey](https://aclanthology.org/2024.emnlp-main.54/) |


## Update log

- 2026-10-23: Rebuilt the guide around source status, mechanisms, a worked scenario, and answer criteria; separated detailed assigned readings from lecture preparation.

- 2026-10-23: Added the announced Terminal-Bench guest readings, an original outcome-verification example, a bilingual diagram, and development/test separation. The guest session is upcoming; this is a reading guide, not a talk transcript.


- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-09-29: HW1 was restructured (no more from-scratch / framework split, the corpus is now a corporate email archive) and the midpoint demo became a recorded video due Nov 4 at 11:59 p.m.; rewrote the timeline, trace-logging, and course-position passages to match
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## Course video sources

The [official recording policy](https://cs329z.stanford.edu/logistics.html) provides lecture recordings through the course Canvas site. Access requires sign-in. The new sections here use the public paper and readings, not a recording or transcript.

Course and recording entries:

- [Official course / lecture source](https://cs329z.stanford.edu/)
- [Official Logistics page (Lecture Recordings section)](https://cs329z.stanford.edu/logistics.html)

Checked: 2026-10-23.

## References

- On this site: [Week 5: multi-agent systems and optimization](/posts/ai/2026-09-10-stanford-cs329z-week5-multiagent-optimization-en), [CS329Z course guide](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Course material (Mon Oct 26): Terminal-Bench guest session; assigned project site and paper are covered in the new sections above.
- Course material (Wed Oct 28, What Data Do Agents Need?): the anchor reading is Shankar's flywheel, guided above. The additional reading is [Tan et al.'s survey](https://aclanthology.org/2024.emnlp-main.54/) (EMNLP 2024), which splits model-as-annotator work into annotation generation, annotation assessment, and training on synthetic annotations, with a data-type taxonomy and a learning-strategy review. The synthetic-data section above follows that three-part map.
- Sources: [Shankar, Data Flywheels for LLM Applications (2024)](https://www.sh-reya.com/blog/ai-engineering-flywheel/), [Tan et al., Large Language Models for Data Annotation and Synthesis, EMNLP 2024](https://arxiv.org/abs/2402.13446), [Shankar et al., Who Validates the Validators, UIST 2024](https://arxiv.org/abs/2404.12272)
- Further: [Hamel's evaluation guide](https://hamel.dev/blog/posts/evals/), [LangChain: aligning model judges with human preferences](https://blog.langchain.dev/aligning-llm-as-a-judge-with-human-preferences/), [Dosu: turning prompt engineering into retrieval](https://blog.langchain.dev/dosu-langsmith-no-prompt-eng/), [SWE-smith: mass-producing data for software-engineering agents](https://arxiv.org/abs/2504.21798)

- [Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces](https://arxiv.org/html/2601.11868) — task formulation; the paper describes Terminal-Bench 2.0, not a live leaderboard snapshot.
- [Terminal-Bench — ICLR 2026 proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/hash/444a3737adaee10d86ad2ef5f74468e6-Abstract-Conference.html)
- [Terminal-Bench project site](https://www.tbench.ai/)
