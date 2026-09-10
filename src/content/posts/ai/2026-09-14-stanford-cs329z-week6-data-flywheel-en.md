---
title: "Reading Stanford CS329Z Week 6: Spin Up the Data Flywheel — Submission Week"
date: 2026-09-14
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, compound-ai-systems]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 7
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 25
tldr: "Week 6 assigns Shankar's data flywheel on Wednesday — evaluation, monitoring, and continual improvement feeding on the same production data — while HW1 comes due, HW2 drops, and the midpoint demo and report loom in early November."
description: "A guided reading of the Stanford CS329Z Week 6 anchor, Shankar's Data Flywheels: traces, demonstrations, and feedback, data for optimization versus evaluation, plus a minimal trace-logging move for HW1 submission week."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-14-stanford-cs329z-week6-data-flywheel)

Week 6 is submission week. Monday (Oct 26) holds a guest lecture, topic still TBA, and [HW2](https://cs329z.stanford.edu/) drops the same day. Wednesday (Oct 28, Data for Agentic Systems) assigns [Shreya Shankar](https://www.sh-reya.com/)'s [Data Flywheels for LLM Applications](https://www.sh-reya.com/blog/ai-engineering-flywheel/) (2024). HW1 is due Friday (Oct 30). Then comes the in-class midpoint demo (Nov 4). The midway report follows on Nov 6.

The data flywheel is one sentence: every production output is training material for the next round. Each answer an agent gives leaves a trace — what the user asked, which steps the system took, where it went wrong. Save the traces, score them, put the good ones back into the prompt as demonstrations, and put the fixed bad ones back too. One full turn means better demonstrations and higher scores, and the next turn produces even better data.

Shankar splits the loop into three stations: evaluation, monitoring, and continual improvement. Evaluation defines what success looks like; monitoring keeps the metrics honest against reality; improvement feeds what was learned back into the system. All three eat the same production data, for different purposes. The post ships no new model and no new algorithm. It is engineering discipline: how to squeeze every drop out of production data.

## Evaluation: read real outputs before setting metrics

Metrics cannot come from armchair theorizing. The advice is to read a batch of real outputs first, then decide what to validate. The example is vivid: filler words like "delve" and "crucial" reek of model authorship, and you only think to ban them after seeing them in the wild. There is no shortcut here — reading data is the job.

Metrics come in two flavors. Simple ones get hardcoded — character counts for conciseness, say. Subjective ones go to a model acting as judge ([LLM-as-a-judge](https://arxiv.org/abs/2403.02839)), with good and bad examples in the judge prompt, which can significantly improve alignment. And the author urges starting with boolean questions. Likert scales look precise but are harder to align; true-or-false is where human labelers and machine judges most easily agree.

For more evaluation craft, see [Hamel Husain](https://hamel.dev/)'s [evaluation guide](https://hamel.dev/blog/posts/evals/), recommended by the author herself.

## Multi-step pipelines: place probes on the graph

Single calls are easy to validate; graphs of calls are not. Errors from an early step get amplified downstream, so validation should work like probes in software observability — inserted at every node. Nodes come in three types, a taxonomy credited to [Han Lee](https://leehanchung.github.io/): classifiers (diamonds, handling state transitions), writers (rectangles, generating content), and compilers (hexagons, generating code). A customer-support chatbot shows how the three divide the labor.

Each type gets validated differently. Classifiers take the classic metrics — accuracy, precision, recall. Writers are the hardest, with bespoke standards per task and custom validators to match. Code-generating nodes have it best: linters, test suites, and executing the SQL to inspect the result — the full software-engineering toolkit applies.

With many probes in place, the next question is what to fix first. The answer: label every validator output and compute per-step accuracy, so the compounding becomes visible. The author concedes that full validation of multi-step pipelines remains an open research question — an appetizer for next week's evaluation theme.

## Validate inputs too: strict in, liberal out

The field mostly validates outputs; the author insists on inputs as well. Rejecting queries the pipeline was never built for is robustness in itself. The motto is borrowed from [Brendan Dolan-Gavitt](https://moyix.net/): be strict in what you send to the model, liberal in what you accept back.

The checks are concrete: does the query touch only the requester's own data, is the topic in scope, does semantic similarity clear a threshold (0.7 is the worked example), is the language supported, is there smuggled personal data or an injection attempt. Each check is small. Skip any of them and it becomes a section in a future incident review.

## Monitoring: the metric set is not carved in stone

A metric set never stays done. Model vendors ship silent updates, user tastes drift, and production always surfaces failures nobody anticipated. The fix is a model agent that periodically reads labeled production data and proposes adding, editing, or retiring metrics. [Alta](https://www.altadaily.com/), a startup working with the author, already does this — a dedicated metric set per end user.

Metric implementations have to grow up too. Sample regularly, label by hand, store everything with timestamps — the most labor-hungry step of the whole flywheel. Once the label store exists, validator prompts stop being static: retrieve relevant examples by semantic similarity on each call, prefer cases where humans and models once disagreed, and weight by recency. Favoring fresh data is the author's instinct, and she admits nobody she knows does it yet.

Labeling labor cannot be eliminated, but it can get smarter. [LangChain](https://www.langchain.com/)'s approach is model-labels-first, human-edits-second: every item ships with a default label, and people override only when they care. The failure mode is stated honestly: if people get lazy and stop checking, alignment silently drifts. That is exactly the problem next week's [Who Validates the Validators](https://arxiv.org/abs/2404.12272) (UIST 2024) takes on.

## Continual improvement: put the fixed outputs back

The first two stations exist for this one: a system that gets stronger as it runs. The prerequisite is complete logs — what the output was, what each metric scored — which is what tools like [LangSmith](https://www.langchain.com/langsmith) are for. Then walk on two legs, human and automatic.

The human leg is fundamentals: review score distributions regularly, find the low-scoring clusters, analyze input drift, A/B test prompt variants. The automatic leg is the flywheel's essence: fix a batch of low-scoring outputs daily or weekly, store the fixed versions with their scores, and at inference time retrieve the most similar fixed cases as few-shot demonstrations. At least 5 practitioners do this already, the author reports, and [Dosu](https://blog.langchain.dev/dosu-langsmith-no-prompt-eng/)'s bot runs on exactly this architecture.

The architecture has a lovely side effect: prompt engineering turns into a retrieval problem. The question shifts from how to write the prompt to how to fetch the right examples — the most instructive for the model, the closest to what the user wants. One more tip from the author: scoring quality along separate dimensions beats one holistic grade. Labels get more consistent, validators align more easily, and the weak spot shows itself.

## Same data, two jobs

The lecture title names three data kinds — traces, demonstrations, and feedback — and the flywheel post divides their labor. Fixed traces are demonstrations, for optimization; scored traces are test items, for evaluation. Both sides read from the same label store and ask different questions.

That also explains why HW2 follows HW1 so closely. HW2 (released Oct 26) asks you to build a full evaluation suite for a ready-made agent: hardcoded graders, at least one model judge, test tasks built on the 4-tuple (request, environment, stopping criteria, scorer), plus error analysis. Week 5 taught optimization, this week teaches production data, and evaluation completes the triangle — the course's deliberate sequencing.

## Synthetic data: without aligned validators, synthesis is photocopying hallucinations

The main post barely discusses purely synthetic data, and that silence is itself the answer. The flywheel burns fixed real outputs, not model-dreamed ones. Whether model rewrites and model labels are usable depends on how well validators align with humans — which the author flags as an open problem. Next-token probabilities from instruction-tuned models are poorly calibrated, and asking models for confidence scores does not work well either.

To fill the gap, read this week's additional reading, [Tan et al.'s survey](https://arxiv.org/abs/2402.13446) (EMNLP 2024): how models serve as annotators, how synthetic labels get accepted, and what to watch when training on synthetic data. It covers exactly the pages the flywheel leaves blank.

## Collecting data from human-agent interaction: labels come from people

Whether the flywheel spins ultimately depends on humans willing to label. The author's first observation says it plainly: people must stay in the loop regularly, because human preferences over outputs shift over time. Model-first, human-edits-second saves effort, but legal teams wanting prompt sign-off and adversarial queries poisoning the demonstration pool are real-world friction. In the post's footnotes, Han names both risks.

For students this lands close to home: you are your own cheapest labeler. Every question you run through your HW1 agent and every answer you fix is the flywheel's first batch of fuel.

## What to do: make traces exist before the deadline

**What to do**: give your HW1 agent minimal trace logging — store the query, the retrieved papers, and the final answer for each question, plus one good-or-bad tag graded by your own hand. Reserve half an hour each week for review: file fixed bad cases into a demonstration pool, and turn recurring failure types into next-version metrics. Finish one full round before HW1 is due, and the failure-mode appendix the midway report requires will practically write itself.

## Where it sits in the course

This week is the watershed. HW1 (due Oct 30) closes the from-scratch versus framework contest; HW2 (released Oct 26) moves the battle to evaluation. Next week (Week 7) doubles down: Monday reads [SWE-smith](https://arxiv.org/abs/2504.21798) (NeurIPS 2025) on mass-producing task data for software-engineering agents, plus Who Validates the Validators on validator alignment, and Wednesday is all evaluation design. The midpoint demo takes the stage on Nov 4. The midway report lands on Nov 6 — have a running prototype by then.

## References

- On this site: [Week 5: multi-agent systems and optimization](/en/posts/ai/2026-09-13-stanford-cs329z-week5-multiagent-optimization-en), [CS329Z course guide](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Course material (Wed Oct 28, What Data Do Agents Need?): the anchor reading is Shankar's flywheel, guided above. The additional reading is [Tan et al.'s survey](https://aclanthology.org/2024.emnlp-main.54/) (EMNLP 2024), which splits model-as-annotator work into annotation generation, annotation assessment, and training on synthetic annotations, with a data-type taxonomy and a learning-strategy review. The synthetic-data section above follows that three-part map.
- Sources: [Shankar, Data Flywheels for LLM Applications (2024)](https://www.sh-reya.com/blog/ai-engineering-flywheel/), [Tan et al., Large Language Models for Data Annotation and Synthesis, EMNLP 2024](https://arxiv.org/abs/2402.13446), [Shankar et al., Who Validates the Validators, UIST 2024](https://arxiv.org/abs/2404.12272)
- Further: [Hamel's evaluation guide](https://hamel.dev/blog/posts/evals/), [LangChain: aligning model judges with human preferences](https://blog.langchain.dev/aligning-llm-as-a-judge-with-human-preferences/), [Dosu: turning prompt engineering into retrieval](https://blog.langchain.dev/dosu-langsmith-no-prompt-eng/), [SWE-smith: mass-producing data for software-engineering agents](https://arxiv.org/abs/2504.21798)
