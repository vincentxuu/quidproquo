---
title: "Reading Stanford CS329Z Week 7: Score Honestly, Scale Data — Midterm Checkpoint"
date: 2026-09-15
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, rag]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 8
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 23
tldr: "Week 7 is midterm checkpoint week: data selection on Monday, evaluation and benchmark design on Wednesday. Zhu et al. teach you not to be fooled by your own scores, SWE-smith scales software-engineering tasks to 50,000 instances, and you close by drafting a first 4-tuple for HW2."
description: "A guided reading of the Stanford CS329Z Week 7 anchors: the agentic benchmark best-practices checklist, human alignment of LLM judges, the SWE-smith data-scaling pipeline, and the course's 4-tuple evaluation frame."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-15-stanford-cs329z-week7-eval-benchmarks)

Week 7 is midterm checkpoint week. Monday (Nov 2) covers data selection and quality, Wednesday (Nov 4) covers evaluation fundamentals and benchmark design. That same week holds the midpoint demo on Wednesday and the midway report due Friday. Data and scores sharing one week is no coincidence: the demo argues with numbers, the report accounts for where the data came from.

A framework first, for newcomers. The course defines an agent evaluation as a 4-tuple: the request states the task, the environment is the world the agent can act in, the stopping criteria say when it is done, and the scorer decides the grade. Drop any one of the four and the number means nothing.

Take bug-fixing as the running example. The request is "fix this issue," the environment is the repo plus a terminal, the stopping criterion is submitting a patch, and the scorer runs the tests. The three anchor readings divide the labor: [Zhu et al.'s best practices](https://arxiv.org/abs/2507.02825) show how easily scorers go wrong, [Shankar et al.'s validators study](https://arxiv.org/abs/2404.12272) shows how to align LLM-assisted grading with humans, and [Yang et al.'s SWE-smith](https://arxiv.org/abs/2504.21798) shows how to scale up task data.

## Scoring is more fragile than it looks

The Zhu et al. paper is blunt: many agentic benchmarks carry flaws in task setup or reward design. Two named cases: [SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/) ships too few test cases, and [TAU-bench](https://arxiv.org/abs/2406.12045) counts empty responses as successes — a trivial no-op agent scores 38% on the airline subset. Flaws like these can under- or over-estimate agents by up to a factor of two.

## Designing benchmarks: start from a checklist

The authors' answer is the [Agentic Benchmark Checklist (ABC)](https://arxiv.org/abs/2507.02825). It distills building experience, a literature survey, and previously reported failures into one checklist. Run it over an existing benchmark and the numbers really move: one pass over the intricate [CVE-Bench](https://arxiv.org/abs/2503.17332) cut performance overestimation by 33 percentage points.

## Scaling data: the SWE-smith move

Now the data side. [SWE-smith](https://arxiv.org/abs/2504.21798) starts from a concrete pain: past software-engineering training sets were small and expensive, covering at most 11 repositories, with curation pipelines demanding heavy human labor. The inversion: given any Python codebase, build its execution environment, then automatically synthesize task instances that break its existing tests.

The dataset built this way spans 128 GitHub repositories. It totals 50,000 instances. SWE-agent-LM-32B, trained on it, reached 40.2% Pass@1 on SWE-bench Verified, the best among open models at the time.

## Who validates the validators

Monday's third anchor changes the protagonist: [Shankar et al. ask how LLM-assisted grading aligns with humans](https://arxiv.org/abs/2404.12272) (UIST 2024). Human grading is expensive and code-based grading is narrow, so everyone uses LLMs as judges — but judge models inherit every flaw of the models they grade and need validating in turn. Their answer is EvalGen, mixed-initiative: the system drafts criteria and implementations (Python functions or grader prompts) while asking humans to grade a small sample of outputs, then picks the implementation that best matches human grades.

The finding worth remembering is criteria drift: you need criteria to grade outputs, but grading outputs is how you discover what the criteria should be. Some criteria even depend on the outputs observed rather than existing a priori — a direct hit on the assumption that evaluation stands independent of observation. Read this before writing any LLM-as-judge for HW2.

## What to do: write your 4-tuple for HW2

**What to do**: warm up for HW2 by writing the 4-tuple for your own agent. State the request in one sentence, list the tools and data the environment exposes, spell out what counts as done, and draft the simplest scorer you can defend. Then interrogate it with Zhu et al.'s cases: would your scorer pass an empty response? That page drafts the evaluation section of your midway report.

## Where it sits in the course

After Week 7 comes judgment: Wednesday's demo argues with scores, Friday's report accounts for data and method. [Week 6](/en/posts/ai/2026-09-14-stanford-cs329z-week6-data-flywheel-en) covered the data flywheel; Week 7 supplies the other half — scores that don't fool you. Write the 4-tuple now and half of HW2's task definition is done.

## This week's course materials

- Monday Nov 2, Data Selection & Quality: anchors SWE-smith and Who Validates the Validators? (covered above). Further reading: [Zhou et al., LIMA](https://arxiv.org/abs/2305.11206) fine-tunes on only 1,000 carefully curated prompts and responses with the standard supervised loss, no reinforcement learning. In a controlled human study, 43% of its responses match or beat GPT-4. The moral: pretraining supplies the knowledge, alignment wants a few excellent demonstrations.
- Wednesday Nov 4, Evaluation Fundamentals & Benchmark Design: anchor Zhu et al.'s best practices (covered above). Further reading: [Press on building good LM benchmarks](https://ofir.io/How-to-Build-Good-Language-Modeling-Benchmarks/) asks for natural, automatically evaluable, and challenging tasks, and warns against letting one LM be both solver and judge. His closing defines a task as a request–environment–stopping-criteria–scorer 4-tuple — the source of this week's frame. Further reading: [Polo et al., tinyBenchmarks](https://arxiv.org/abs/2402.14992) shows MMLU's 14,000 examples need not all run. A 100-example curated subset reproduces the ranking reliably. Evaluation buys representativeness, not volume.

## References

- On this site: [Week 6: the data flywheel](/en/posts/ai/2026-09-14-stanford-cs329z-week6-data-flywheel-en), [Stanford CS329Z course guide](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Yang et al., SWE-smith](https://arxiv.org/abs/2504.21798), [Shankar et al., Who Validates the Validators?](https://arxiv.org/abs/2404.12272), [Zhu et al., Establishing Best Practices for Building Rigorous Agentic Benchmarks](https://arxiv.org/abs/2507.02825)
