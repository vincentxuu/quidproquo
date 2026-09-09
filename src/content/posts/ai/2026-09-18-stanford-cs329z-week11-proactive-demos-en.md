---
title: "Reading Stanford CS329Z Week 11 (Finale): From Waiting for Orders to Acting First — Proactive Agents and Demo Day"
date: 2026-09-18
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag, compound-ai-systems]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 11
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 26
tldr: "The finale reads Week 11: Monday upgrades instruction-waiting reactive assistants into proactive agents that observe, infer, and act first via the GUM paper, while Wednesday folds multimodal systems, long-running agents, and production observability into three open problems. Ends with a pre-Demo-Day checklist and a one-line map of all 11 posts."
description: "A guided reading of Stanford CS329Z Week 11 headliner General User Models by Shaikh et al.: the proposition architecture, the Gumbo assistant, the privacy-trust dilemma, plus the December 2 open-problems framing and Demo Day preparation."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-18-stanford-cs329z-week11-proactive-demos)

Picture two assistants. The first waits for your orders and never moves until told. The second watches: you receive a wedding invitation from a friend, and it already has suit-rental options and a budget waiting for you. The first is reactive, the second is a [proactive agent](https://arxiv.org/abs/2505.10831), and Week 11 Monday is about the second kind.

The difference is not model size but who moves first. A reactive agent's loop starts with your instruction; a proactive agent's loop starts with its observations of you. Observation takes a pair of eyes, inference takes a user model, and acting takes rules for when to interrupt. Those three are exactly the three protagonists of this week's main reading.

Week 11 is arranged like a closing act. Monday (Proactive Agents) assigns Shaikh et al.'s [General User Models](https://arxiv.org/abs/2505.10831), with a follow-up paper on Next Action Prediction plus privacy-and-trust discussion. Wednesday (Open Problems & Final Demos) has no single assigned reading: the course lays out multimodal agents, web and computer use, science agents, long-running architectures, and production observability, converging on three open directions. My Wednesday write-up below is framed as the course's view, not any one paper's claim. Paper-video peer reviews are also due Monday, and Demo Day lands in finals week under the theme Making Life at Stanford Better with Agents.

## GUM: turning screen traces into a user model

[GUM](https://arxiv.org/abs/2505.10831) takes any unstructured observation, such as screenshots, as input. Its output is a set of natural-language propositions, each carrying a confidence score. Seeing a wedding invite, it writes down that the user is invited to a friend's wedding; seeing repeated draft edits followed by related-work reading, it writes down that the user is stuck on collaborator feedback. High confidence for the former, low for the latter, all labeled honestly.

The architecture is four modules. Propose turns observations into propositions, Retrieve pulls related old propositions in as context, Revise updates them as new evidence arrives, and Audit blocks anything the user would not want recorded. Screen understanding runs on [Qwen 2.5 VL](https://github.com/QwenLM/Qwen2.5-VL), proposition reasoning on [Llama 3.3 70B](https://www.llama.com/), both on the open route. The paper deliberately picks open models so data never has to travel to a third-party platform. In the implementation Llama runs on private servers, and only the user can access the propositions.

The examples persuade. The first author's GUM found him a suit-rental spot for a wedding, automatically constrained by his budget. GUM can also complete a prompt's missing context — which section you are writing, which papers you have read — so a bare "help me with this section" just works. That is the same grounding [Week 2](/en/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en)'s RAG chases, only the source changes from a retrieval index to traces of your computer use.

One set of numbers is worth remembering. In an email-based evaluation, propositions averaged about 76% accuracy, and the most confident ones were all correct. A separate multi-day screen deployment replicated the calibration, and some participants asked to keep running the system afterward.

## Gumbo: the assistant that acts before asking

[Gumbo](https://generalusermodels.github.io/) is the demo application built on GUM. It watches the screen, grows a GUM, and mines it for suggestions. Before interrupting you, it computes an expected utility: the probability the suggestion helps times its benefit, weighed against the cost of a wrong interruption. The math comes from [Horvitz's mixed-initiative framework](https://dl.acm.org/doi/10.1145/302979.303030), and GUM supplies the off-the-shelf cost-benefit estimates it always lacked.

To stop suggestion floods, a rate limiter caps interruptions at one per minute. Suggestions that pass the bar get executed as far as possible — searching, running code, organizing files — before anything is shown. Thumbs up or down feed straight back into the GUM as new observations. The paper is honest about boundaries too: computer use stayed disabled during evaluation because it was too slow and buggy.

Next Action Prediction on the schedule points at something concrete. A follow-up by Shaikh et al. formalizes predicting the next action from multimodal computer-use traces — exactly the capability Gumbo's pipeline points at. See the Course Material box at the end for the full mini-review.

## Privacy and trust: stronger powers, costlier mistakes

The Audit module filters observations by [contextual integrity](https://arxiv.org/abs/2505.10831). Plainly put: would recording this information fit the setting it appeared in? The evaluation's verdict is honest: mostly compliant, but violations are bad when they happen. That is why Week 11 pairs privacy and trust with proactivity. When a reactive agent errs, you are at least present; when a proactive agent errs, you are often away.

The paper gives the privacy paradox its own section. The same participants wanted an assistant that remembers enough, yet flinched at seeing their habits written out as propositions. There is no technical fix here, only a tradeoff: the more it remembers, the more it helps — and the more it can get wrong.

This also echoes [Week 1](/en/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems-en)'s systems view. None of GUM's four modules is the model itself; all are engineering around it: observing, auditing, retrieving, revising. Good results are still stacked up by systems — except this time the system is about you.

## Wednesday: three open directions and production reality

Restating the caveat: this section is the course's synthesis, since Wednesday assigns no main reading. The course converges the frontier on reliability, scalability, and interpretability. Mapping earlier topics onto them, roughly: how long-running agents avoid drift and deadlock, what happens when web and computer use scale up, and whether behavior can be traced and explained. Scale has concrete yardsticks. [OSWorld](https://arxiv.org/abs/2404.07972) moves real computer tasks into a reproducible OS environment and scores execution results instead of text matches. The best model at the time succeeded on only about 12% of tasks, bottlenecked on GUI grounding and operational knowledge. On the web side, [WebShop](https://arxiv.org/abs/2207.01206) tests language grounding with crowd-sourced shopping instructions in a simulated store, where the best model succeeded on under 30% — even "buying the right thing" is still shaky.

Production observability is Wednesday's other half. Tracing, monitoring, and cost management form the trio; HW2 trained half of it through evaluation, and the rest must be in place before Demo Day. Research questions decide how far a project can go; observability decides whether the live demo survives. To push a Gumbo-style prototype toward an operable system, compare open-source [OpenClaw](https://github.com/openclaw/openclaw): a personal assistant running on a local Gateway, with models and chat channels as swappable plugins.

## What to do: the Demo Day checklist

**What to do**: turn tracing fully on and keep one replayable trace per rehearsal. Watch three things in monitoring: error rate, latency, and token spend. Put a hard cap on cost with automatic cutoff past the limit. Keep high-risk tools off by default and enable them by hand only for the live demo. Finally, prepare one failure case — a failure mode from your midway report, told well, persuades better than successes alone.

## Series retrospective: all 11 posts in one line each

1. [Course guide](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en): build from scratch before frameworks, both homeworks and the syllabus git history in full.
2. [Week 1](/en/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems-en): stop tuning only the model; good scores are stacked up by compound systems.
3. [Week 2](/en/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en): separate workflows from agents first, then hand-build a first RAG.
4. [Week 3](/en/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy-en): MCP standardizes the tool plug, DSPy turns prompts into compilable programs.
5. [Week 4](/en/posts/ai/2026-09-12-stanford-cs329z-week4-react-memory-en): ReAct fixes the loop as think–act–observe, while [MemGPT](https://arxiv.org/abs/2310.08560) turns memory into OS-style layered structure.
6. [Week 5](/en/posts/ai/2026-09-13-stanford-cs329z-week5-multiagent-optimization-en): multi-agent collaboration and the three optimization axes — prompts, weights, or inference compute.
7. [Week 6](/en/posts/ai/2026-09-14-stanford-cs329z-week6-data-flywheel-en): the data flywheel spins up as HW2 drops and HW1 comes due.
8. [Week 7](/en/posts/ai/2026-09-15-stanford-cs329z-week7-eval-benchmarks-en): data selection and benchmark design, with evaluation converging on the 4-tuple.
9. [Week 8](/en/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety-en): LLM-as-judge and safety guardrails, where the graders themselves get graded.
10. [Week 9](/en/posts/ai/2026-09-17-stanford-cs329z-week9-coding-agents-en): interface is performance — SWE-agent proves editor design decides scores, while OpenHands turns sandbox and evaluation into a shared base.
11. Week 11 (this post): from waiting for orders to acting first, closing with proactive agents and open problems.

## Course Material box

- Monday 11/30 Proactive Agents: main reading GUM (covered above); further reading [Shaikh et al., Learning Next Action Predictors from Human-Computer Interaction](https://arxiv.org/abs/2603.05923). It formalizes predicting the next action from multimodal computer-use traces and introduces LongNAP, a model combining parametric and in-context learning. The data comes from continuous phone use by 20 users. Vision-language models labeled over 360K actions. An LLM-as-judge scores predicted versus actual next actions for similarity, and LongNAP clearly beats supervised-finetuning and prompted baselines.
- Wednesday 12/2 Open Problems & Final Demos: no single main reading; further reading [OSWorld](https://arxiv.org/abs/2404.07972) (open-ended computer tasks in real operating systems) and [WebShop](https://arxiv.org/abs/2207.01206) (language grounding in a simulated store) — concrete numbers in the Wednesday section above.
- Schedule source: [CS329Z schedule, Week 11](https://cs329z.stanford.edu/)

## References

- On this site: [Stanford CS329Z course guide](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en), [Week 1: stop tuning only the model](/en/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems-en), [Week 2: workflows versus agents](/en/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en), [Week 3: plug tools in, swap frameworks up](/en/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Shaikh et al., Creating General User Models from Computer Use, UIST 2025](https://arxiv.org/abs/2505.10831), [Shaikh et al., Learning Next Action Predictors from Human-Computer Interaction](https://arxiv.org/abs/2603.05923), [GUM project page and open-source package](https://generalusermodels.github.io/), [Horvitz, Principles of Mixed-Initiative User Interfaces, CHI 1999](https://dl.acm.org/doi/10.1145/302979.303030)
- Venue: [UIST 2025](https://uist.acm.org/2025/)
