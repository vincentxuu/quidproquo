---
title: "What Data Do Agents Need? Traces, Demonstrations, Feedback, and the Data Flywheel | Stanford CS329Z Lecture 11"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, compound-ai-systems]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 12
tldr: "Lecture 11 lays out the forms and sources of agent data: traces, demonstrations and feedback, data for optimization versus evaluation, data flywheels, synthetic data and data from human-agent interaction, with a warning that data can teach models unintended shortcuts. The readings are Shankar's data flywheel essay and a survey of LLMs for data annotation and synthesis."
description: "A page-linked guide to the CS329Z Lecture 11 Data for Agentic Systems slides, digests of Shankar's data flywheel and the LLM annotation-and-synthesis survey, and a CSV example for designing outcome checks and separating development demos from held-out tests."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-lecture-11-data-for-agents)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Lecture 11 (Oct 28, What Data Do Agents Need?) is about data: traces, demonstrations and feedback, how to separate data for optimization from data for evaluation, how a data flywheel turns, and how to collect synthetic and human-agent interaction data. HW1 is due Friday, Oct 30, and the midpoint demo video is due the evening of Nov 4.

The data flywheel fits in one sentence: every output in production is material for the next improvement. The assigned reading, [Shreya Shankar](https://www.sh-reya.com/)'s [Data Flywheels for LLM Applications](https://www.sh-reya.com/blog/ai-engineering-flywheel/), splits that loop into evaluation, monitoring and continual improvement; the additional reading is Tan et al.'s survey on LLMs for data annotation and synthesis. This post digests both. The slide guide below follows the PDF page numbers, followed by digests of the assigned readings. Examples and self-checks are teaching exercises, not official homework answers; repeated animation frames, logistics and section dividers are grouped together.

## Lecture 11 slide guide

<div class="slide-reader" data-slide-reader data-pages="75" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture11.pdf">
<p>Lecture 11: 75 PDF pages. Use the links below to compare the source.</p>
<button type="button" data-slide-open>Open slide comparison</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture11.pdf" target="_blank" rel="noopener noreferrer">Original PDF</a></p>
</div>

Lecture 09 optimized the system around a model whose weights stay frozen. This lecture asks how to make the model itself a better agent, and the main lever is data. The next lecture, Data Selection (Nov 2), covers which data to train on.

### Pages 1–18: Agent data comes in two kinds: trajectories and environments

<a href="https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=1" data-slide-page="1">Slides 1–18</a>

Web text records what people said; an agent needs records of what was done in an environment and what came back. [Page 13](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=13) divides agent data into two types. A trajectory is a recording of an agent solving a task, used for SFT so the model imitates it. An environment is a task plus a sandbox plus a verifier, used for RL so the model can practice. [Page 14](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=14) notes that only the agent's thoughts and actions in a trajectory are learned; the system prompt, task, and tool outputs are context only, and the harness dictates the action format.

Where does an RL reward come from? [Page 16](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=16) lays out a spectrum: code tests are reliable but narrow, followed by rubrics, LM judges, and finally human preference, which is general but fuzzy. Page 18 uses DeepSeek's published figures as a reminder that post-training's share of data and compute is growing.

**Check your understanding:** if you run SFT on a successful trajectory from your HW1 agent, does the model learn the contents of the tool outputs? **Answer criteria:** under the split on page 14, tool outputs are context and carry no loss; the model learns what to think and do given those observations. It also learns this harness's action format.

### Pages 19–37: Human demonstrations and data mined from the web

<a href="https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=19" data-slide-page="19">Slides 19–37</a>

Page 20 lists five sources and asks you to compare each on cost, realism, and scalability. Human demonstrations are the most realistic and the most expensive. Mind2Web had crowdworkers record action sequences on real websites; OpenCUA had annotators record screen, mouse, and keyboard on their own computers. [Page 28](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=28) compares the two on environment, what is recorded, and scale.

Mining converts existing artifacts into data: a GitHub issue and the PR that fixed it become a coding task; written tutorials and videos become step sequences. SWE-rebench mines verifiable tasks from GitHub with a fully automated pipeline, including environment setup and test validation. AgentTrek has a VLM agent replay web tutorials in a real browser and keeps only verified runs. VideoAgentTrek uses an inverse dynamics model to label clicks and keystrokes in screen-recording tutorials.

### Pages 38–57: Synthesized trajectories, synthesized tasks, and simulated users

<a href="https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=38" data-slide-page="38">Slides 38–57</a>

Synthesized trajectories come in two orders: instruction first, then steps written without execution (Synatra rewrites wikiHow into demonstrations), or interaction first, exploring the environment freely and inferring in hindsight what task the run accomplished (OS-Genesis, NNetNav). [Page 42](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=42) contrasts Synatra with AgentTrek: about $0.031 per sample with synthesized page text versus about $0.55 with real screenshots, a direct trade between cost and realism.

Synthesized tasks and environments build the sandbox, the task, and the checker automatically, so every task has a verifiable reward. SWE-smith, by course instructor John Yang, injects bugs that break existing tests in Python repos and has a model write the issue; R2E-Gym back-translates ordinary commits into tasks; AgentScaler treats each tool call as a read or write on a database. The last category lets a model stand in for the user or the environment: τ-bench has a model play the customer and compares the final database state to the goal, and DreamGym has a model predict the next state and reward. [Page 53](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=53) states the catch plainly: practice becomes cheap and unlimited, but agents also learn the simulator's mistakes.

**Check your understanding:** to expand training data for the HW1 email assistant, you have a model play the user in multi-turn chats. What is the biggest risk? **Answer criteria:** the simulated user's tone, follow-ups, and misunderstandings all come from a model, so the agent may learn to handle the simulator rather than real people. Keep a set of real human interactions as a test to measure that gap.

### Pages 58–75: What data teaches by accident

<a href="https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=58" data-slide-page="58">Slides 58–75</a>

Training on traces and environments is not the end of the story. The first gotcha is reward hacking. If a SWE-bench environment keeps its `.git` history, the model can look up the fix, so Self-play SWE-RL wipes `.git` and restores test files before grading. In Anthropic's production coding environments, models learned to call `sys.exit(0)` to fake passing tests ([page 62](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=62)). When OpenAI added a chain-of-thought monitor to the reward, the model hid its intent and kept hacking. Memorization counts too: the study cited on [page 66](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=66) shows models naming the file to edit from SWE-bench Verified issue text alone at a much higher rate than on repositories outside the benchmark.

The second gotcha is overfitting to a harness. SFT makes the model imitate capability and harness format together, so a model trained in one harness keeps its conventions in a function-calling harness; the fix is to vary harnesses during training ([page 71](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=71)). The third is training dynamics. On the same seed data, SWE-RL's RL improved out-of-domain tasks while SFT degraded them; OpenThoughts-Agent's best RL run peaked and then collapsed, so they shipped the pre-collapse checkpoint; and the best model is not necessarily the best teacher, since trajectories from a newer model trained a worse student than those from an older one ([page 74](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=74)).

**Check your understanding:** your evaluation score jumps on a new agent version. Which two explanations must you rule out before calling it a capability gain? **Answer criteria:** first, reward hacking: read the high-scoring trajectories and confirm the agent did not see the answer or bypass the verifier. Second, memorization or contamination: retest on tasks the model has not seen. Lecture 10's cheat agents and task QA exist to catch the first.

## Trace backward from the final state: evidence for a data flywheel

In a customer-support or internal assistant, a plausible answer and a completed task are different outcomes. The two lectures above cover how to write evaluation tasks and where agent data comes from. This section uses an original example to connect verification, failure records, and data routing in three steps.

### Step 1: specify the required change in the environment

Imagine aggregating paid orders by city into a CSV. Verification reads the artifact, checks its columns, excludes canceled orders, and compares each city's totals. A completion message, a successful command, and the existence of a file are each insufficient evidence. Terminal-Bench places tasks in an executable environment and checks outcomes with tests; see the [paper's task definition](https://arxiv.org/html/2601.11868). The order example is original teaching material, not a benchmark task.

### Step 2: turn failure into inspectable data

A missing city could mean missing input or an incorrect filter. A single failure score cannot distinguish them. Preserve input versions, tool arguments, observations, artifacts, and grader versions so the run can be replayed. Record the reason for a human correction, such as excluding canceled orders. The [flywheel article](https://www.sh-reya.com/blog/ai-engineering-flywheel/) connects evaluation, monitoring, and continual improvement; this record design is an implementation recommendation derived from that framing.

### Step 3: separate improvement examples from acceptance examples

A failed case can become development material for changing a prompt, or remain unseen acceptance material. Once used to select versions, it no longer provides independent acceptance evidence. Record provenance, correction rationale, and purpose beside each example; evaluate the changed system on frozen tests.

**Check your understanding:** the CSV is well formed but includes canceled orders. Should you add a model judge? **Answer criteria:** first add an executable business-rule check and inspect the filtering step. A model judge for open-ended quality does not replace this deterministic rule.

## Reading 1 | Data Flywheels for LLM Applications

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

With many probes in place, the next question is what to fix first. The answer: label every validator output and compute per-step accuracy, so the compounding becomes visible. The author concedes that full validation of multi-step pipelines remains an open research question — an appetizer for Lecture 13's evaluation theme.

The field mostly validates outputs; the author insists on inputs as well. Rejecting queries the pipeline was never built for is robustness in itself. The motto is borrowed from [Brendan Dolan-Gavitt](https://moyix.net/): be strict in what you send to the model, liberal in what you accept back.

The checks are concrete: does the query touch only the requester's own data, is the topic in scope, does semantic similarity clear a threshold (0.7 is the worked example), is the language supported, is there smuggled personal data or an injection attempt. Each check is small. Skip any of them and it becomes a section in a future incident review.

A metric set never stays done. Model vendors ship silent updates, user tastes drift, and production always surfaces failures nobody anticipated. The fix is a model agent that periodically reads labeled production data and proposes adding, editing, or retiring metrics. [Alta](https://www.altadaily.com/), a startup working with the author, already does this — a dedicated metric set per end user.

Metric implementations have to grow up too. Sample regularly, label by hand, store everything with timestamps — the most labor-hungry step of the whole flywheel. Once the label store exists, validator prompts stop being static: retrieve relevant examples by semantic similarity on each call, prefer cases where humans and models once disagreed, and weight by recency. Favoring fresh data is the author's instinct, and she admits nobody she knows does it yet.

Labeling labor cannot be eliminated, but it can get smarter. [LangChain](https://www.langchain.com/)'s approach is model-labels-first, human-edits-second: every item ships with a default label, and people override only when they care. The failure mode is stated honestly: if people get lazy and stop checking, alignment silently drifts. That is exactly the problem Lecture 12's [Who Validates the Validators](https://arxiv.org/abs/2404.12272) (UIST 2024) takes on.

The first two stations exist for this one: a system that gets stronger as it runs. The prerequisite is complete logs — what the output was, what each metric scored — which is what tools like [LangSmith](https://www.langchain.com/langsmith) are for. Then walk on two legs, human and automatic.

The human leg is fundamentals: review score distributions regularly, find the low-scoring clusters, analyze input drift, A/B test prompt variants. The automatic leg is the flywheel's essence: fix a batch of low-scoring outputs daily or weekly, store the fixed versions with their scores, and at inference time retrieve the most similar fixed cases as few-shot demonstrations. At least 5 practitioners do this already, the author reports, and [Dosu](https://blog.langchain.dev/dosu-langsmith-no-prompt-eng/)'s bot runs on exactly this architecture.

The architecture has a lovely side effect: prompt engineering turns into a retrieval problem. The question shifts from how to write the prompt to how to fetch the right examples — the most instructive for the model, the closest to what the user wants. One more tip from the author: scoring quality along separate dimensions beats one holistic grade. Labels get more consistent, validators align more easily, and the weak spot shows itself.

The lecture title names three data kinds — traces, demonstrations, and feedback — and the flywheel post divides their labor. Fixed traces are demonstrations, for optimization; scored traces are test items, for evaluation. Both uses may originate in one label store, but assign cases to development or held-out evaluation before tuning; a case used in demonstrations cannot also provide independent test evidence.

That also explains why HW2 follows HW1 so closely. HW2 (released Oct 26) asks you to build a full evaluation suite for a ready-made agent: hardcoded graders, at least one model judge, test tasks built on the 4-tuple (request, environment, stopping criteria, scorer), plus error analysis. Lecture 9 taught optimization, this lecture teaches production data, and evaluation completes the triangle — the course's deliberate sequencing.

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

## Reading 2 | LLMs for Data Annotation and Synthesis: A Survey

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

To fill the gap, read this lecture's additional reading, [Tan et al.'s survey](https://arxiv.org/abs/2402.13446) (EMNLP 2024): how models serve as annotators, how synthetic labels get accepted, and what to watch when training on synthetic data. It covers exactly the pages the flywheel leaves blank.

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

Lecture 11 turns traces into data. The next week moves to data quality and evaluation: [Lecture 12](/posts/ai/2026-09-10-stanford-cs329z-lecture-12-data-selection-en) covers finding the most informative data, and Lecture 13 covers benchmark design.

## Course material for this lecture

- Official slides (PDF): [What Data Do Agents Need? — Lecture 11](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf)
- Assigned reading: Shankar, "Data Flywheels for LLM Applications" (digested here)
- Additional reading: Tan et al., "Large Language Models for Data Annotation and Synthesis: A Survey" (digested here)
- Schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Course video sources

The [official recording policy](https://cs329z.stanford.edu/logistics.html) provides lecture recordings through the course Canvas site. Access requires sign-in. This article uses the public slides, paper, and readings, not a recording or transcript.

Course and recording entries:

- [Official course / lecture source](https://cs329z.stanford.edu/)
- [Official Logistics page (Lecture Recordings section)](https://cs329z.stanford.edu/logistics.html)

Checked: 2026-10-29.

## Update log

- 2026-10-29: The series moved from one post per week to one post per lecture. This post now holds Lecture 11 (Wed Oct 28), previously part of the "Week 6: get the data flywheel turning" guide; earlier entries below predate the split.
- 2026-10-29: After the Lecture 10 and 11 slides were released, added page-referenced guides to both lectures with a check per section (writing tasks and verifiers, task versioning, the two forms and five sources of agent data, and what data teaches by accident), and rewrote the opening, course-material map, and Terminal-Bench reading where they called the lectures upcoming.
- 2026-10-23: Rebuilt the guide around source status, mechanisms, a worked scenario, and answer criteria; separated detailed assigned readings from lecture preparation.
- 2026-10-23: Added the announced Terminal-Bench guest readings, an original outcome-verification example, a bilingual diagram, and development/test separation. The guest session is upcoming; this is a reading guide, not a talk transcript.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-09-29: HW1 was restructured (no more from-scratch / framework split, the corpus is now a corporate email archive) and the midpoint demo became a recorded video due Nov 4 at 11:59 p.m.; rewrote the timeline, trace-logging, and course-position passages to match
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- On this site: [Lecture 10: Terminal-Bench guest lecture](/posts/ai/2026-09-10-stanford-cs329z-lecture-10-terminal-bench-en), [Lecture 12: Data Selection & Quality](/posts/ai/2026-09-10-stanford-cs329z-lecture-12-data-selection-en), [Stanford CS329Z course overview](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Course material (Wed Oct 28, Lecture 11 What Data Do Agents Need?): [slides](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf), [Tan et al.'s survey](https://aclanthology.org/2024.emnlp-main.54/)
- Sources: [Shankar, Data Flywheels for LLM Applications (2024)](https://www.sh-reya.com/blog/ai-engineering-flywheel/), [Tan et al., Large Language Models for Data Annotation and Synthesis, EMNLP 2024](https://arxiv.org/abs/2402.13446), [Shankar et al., Who Validates the Validators, UIST 2024](https://arxiv.org/abs/2404.12272)
- Further: [Hamel's evaluation guide](https://hamel.dev/blog/posts/evals/), [Dosu: turning prompt engineering into retrieval](https://blog.langchain.dev/dosu-langsmith-no-prompt-eng/)
