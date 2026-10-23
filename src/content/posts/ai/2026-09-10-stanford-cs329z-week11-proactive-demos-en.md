---
title: "(Finale): From Waiting for Orders to Acting First — Proactive Agents and Demo Day | Stanford CS329Z Week 11"
date: 2026-09-10
updated: 2026-10-23
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag, compound-ai-systems]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 11
tldr: "The finale reads Week 11: Monday upgrades instruction-waiting reactive assistants into proactive agents that observe, infer, and act first via the GUM paper, while Wednesday folds multimodal systems, long-running agents, and production observability into three open problems. Ends with a pre-Demo-Day checklist and a one-line map of all 11 posts."
description: "A guided reading of Stanford CS329Z Week 11 headliner General User Models by Shaikh et al.: the proposition architecture, the Gumbo assistant, the privacy-trust dilemma, plus the December 2 open-problems framing and Demo Day preparation."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-week11-proactive-demos)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Picture two assistants. The first waits for your orders and never moves until told. The second watches: you receive a wedding invitation from a friend, and it already has suit-rental options and a budget waiting for you. The first is reactive, the second is a [proactive agent](https://arxiv.org/abs/2505.10831), and Week 11 Monday is about the second kind.

The difference is not model size but who moves first. A reactive agent's loop starts with your instruction; a proactive agent's loop starts with its observations of you. Observation takes a pair of eyes, inference takes a user model, and acting takes rules for when to interrupt. Those three are exactly the three protagonists of this week's main reading.

| Comparison | Reactive | Proactive |
|---|---|---|
| Starting point | User instruction | Observation of the user |
| Context | Request; may include a user model | User model for candidate suggestions |
| When assistance appears | Response to a request | Usefulness weighed against interruption cost |
| Question in this guide | Can it complete the task? | Are observation, memory and interruption appropriate? |

Week 11 is arranged like a closing act. Monday (Proactive Agents) assigns Shaikh et al.'s [General User Models](https://arxiv.org/abs/2505.10831), with a follow-up paper on Next Action Prediction plus privacy-and-trust discussion. Wednesday (Open Problems & Final Demos) has no single assigned reading: the course lays out multimodal agents, web and computer use, science agents, long-running architectures, and production observability, converging on three open directions. My Wednesday write-up below is framed as the course's view, not any one paper's claim. Paper-video peer reviews are also due Monday, and Demo Day lands in finals week; the current project guide permits student-selected topics connected to course themes.

## Before proactive assistance: observation, inference, and intervention

The [official schedule](https://cs329z.stanford.edu/) places Proactive Agents on November 30 and Frontiers & Open Problems on December 2. Final demonstrations belong to the December 7–11 examination period, with exact time and location still TBA. As of October 23, 2026, these classes have no public slide links. This guide separates GUM, next-action prediction, and open questions without treating future lectures or research demonstrations as validated products.

### Observations do not establish intent

Repeatedly opening an English contract could mean translating, comparing versions, or waiting for a colleague. The [GUM paper](https://arxiv.org/html/2505.10831) turns unstructured observations into revisable natural-language propositions. Such propositions are uncertain user models, rather than explicit authorization. Preserve evidence and correction paths so one mistaken inference does not influence assistance indefinitely.

### Predicting the next action does not decide whether to help

[Next Action Prediction](https://arxiv.org/html/2603.05923) studies subsequent actions in human-computer interaction. Predicting that a user may send an email and deciding to send it are separate layers. The first requires predictive evaluation; the second requires value, interruption, and authorization checks. In this original contract example, start with a dismissible summary suggestion. Sending messages, modifying documents, and making commitments require their own action boundaries.

### Final evaluation must allow non-intervention

Create cases for useful and timely help, useful but excessive help, incorrect inference, and suggestions repeated after rejection. Check quality, trigger timing, and suppression separately. Treat waiting as a legitimate output so “proactive” does not become constant interruption. The [Gumbo research demonstration](https://generalusermodels.github.io/) offers a design example, rather than proof that every deployment is mature.

**Check:** next-action prediction is accurate, yet users disable the assistant. Why? **Answer criteria:** predictive accuracy covers behavior estimation. Interventions may still be excessive, low-value, or based on unacceptable observation and retention. Evaluate those dimensions separately.



## Reading 1 | General User Models

Source: [General User Models](https://arxiv.org/abs/2505.10831)

### TL;DR

GUM uses Propose, Retrieve, Revise, and Audit to maintain natural-language propositions and confidence for assistance such as Gumbo.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | How can ongoing observations become revisable, contestable user models? |
| Evidence and scope | The 76.15% and fully correctconfidence10 sample are specific results; a five-person,five-day deployment is small and computer use was disabled in evaluation. |

### Domain background

Personal assistants need history without treating observations as permanent facts; propositions need uncertainty and revision.

### Intermediate guide

**Method.** Propose propositions from observations, retrieve related memory, revise conflicts, audit storage, and let assistance query the resulting model.

[GUM](https://arxiv.org/abs/2505.10831) takes any unstructured observation, such as screenshots, as input. Its output is a set of natural-language propositions, each carrying a confidence score. Seeing a wedding invite, it writes down that the user is invited to a friend's wedding; seeing repeated draft edits followed by related-work reading, it writes down that the user is stuck on collaborator feedback. High confidence for the former, low for the latter, all labeled honestly.

The architecture is four modules. Propose turns observations into propositions, Retrieve pulls related old propositions in as context, Revise updates them as new evidence arrives, and Audit blocks anything the user would not want recorded. Screen understanding runs on [Qwen 2.5 VL](https://github.com/QwenLM/Qwen2.5-VL), proposition reasoning on [Llama 3.3 70B](https://www.llama.com/), both on the open route. The paper deliberately picks open models so data never has to travel to a third-party platform. In the implementation Llama runs on private servers, and only the user can access the propositions.

The examples persuade. The first author's GUM found him a suit-rental spot for a wedding, automatically constrained by his budget. GUM can also complete a prompt's missing context — which section you are writing, which papers you have read — so a bare "help me with this section" just works. That is the same grounding [Week 2](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en)'s RAG chases, only the source changes from a retrieval index to traces of your computer use.

The [GUM paper](https://arxiv.org/html/2505.10831) reports 76.15% mean proposition accuracy in its email-based evaluation. Propositions with confidence 10 were rated completely accurate within the evaluated sample; this does not guarantee future high-confidence propositions. A separate deployment with five participants over five days provides small-scale evidence about calibration and experience, rather than a universal effect.

[Gumbo](https://generalusermodels.github.io/) is the demo application built on GUM. It watches the screen, grows a GUM, and mines it for suggestions. Before interrupting you, it computes an expected utility: the probability the suggestion helps times its benefit, weighed against the cost of a wrong interruption. The math comes from [Horvitz's mixed-initiative framework](https://dl.acm.org/doi/10.1145/302979.303030), and GUM supplies the off-the-shelf cost-benefit estimates it always lacked.

To stop suggestion floods, a rate limiter caps interruptions at one per minute. Suggestions that pass the bar get executed as far as possible — searching, running code, organizing files — before anything is shown. Thumbs up or down feed straight back into the GUM as new observations. The paper is honest about boundaries too: computer use stayed disabled during evaluation because it was too slow and buggy.

Next Action Prediction on the schedule points at something concrete. A follow-up by Shaikh et al. formalizes predicting the next action from multimodal computer-use traces — exactly the capability Gumbo's pipeline points at. See the Course Material box at the end for the full mini-review.

```diagram
title: Proactivity needs an interruption gate
desc: Observations and a user model produce suggestions, whose expected usefulness and interruption cost determine presentation.
caption: Simplified from the Gumbo discussion; GUM internals and rate limiting are omitted.
---
<svg viewBox="0 0 440 544"><path class="dg-line" d="M220 88V128" marker-end="url(#arrow)"/><path class="dg-line" d="M220 192V232" marker-end="url(#arrow)"/><path class="dg-line" d="M220 328V372Q220 380 212 380H120Q112 380 112 388V448" marker-end="url(#arrow)"/><path class="dg-line" d="M380 280H400Q408 280 408 288V404Q408 412 400 412H340Q332 412 332 420V448" marker-end="url(#arrow)"/><rect class="dg-box" x="20" y="16" width="400" height="72" rx="6"/><text class="dg-label" x="220.0" y="52.0" text-anchor="middle" dominant-baseline="central">Observation + user model</text><rect class="dg-box" x="40" y="128" width="360" height="64" rx="6"/><text class="dg-label" x="220.0" y="160.0" text-anchor="middle" dominant-baseline="central">Generate a suggestion</text><path class="dg-box" d="M220 232L380 280L220 328L60 280Z"/><text class="dg-label" x="220" y="280" text-anchor="middle" dominant-baseline="central">Worth interrupting?</text><rect class="dg-box dg-box--accent" x="16" y="452" width="192" height="72" rx="6"/><text class="dg-label" x="112.0" y="488.0" text-anchor="middle" dominant-baseline="central">Present assistance</text><rect class="dg-box" x="240" y="452" width="184" height="72" rx="6"/><text class="dg-label" x="332.0" y="488.0" text-anchor="middle" dominant-baseline="central">Do not interrupt</text><text class="dg-edge" x="164" y="356" text-anchor="middle" dominant-baseline="central">Yes</text><text class="dg-edge" x="376" y="352" text-anchor="middle" dominant-baseline="central">No</text></svg>
```

The Audit module filters observations by [contextual integrity](https://arxiv.org/abs/2505.10831). Plainly put: would recording this information fit the setting it appeared in? The evaluation's verdict is honest: mostly compliant, but violations are bad when they happen. That is why Week 11 pairs privacy and trust with proactivity. When a reactive agent errs, you are at least present; when a proactive agent errs, you are often away.

The paper gives the privacy paradox its own section. The same participants wanted an assistant that remembers enough, yet flinched at seeing their habits written out as propositions. There is no technical fix here, only a tradeoff: the more it remembers, the more it helps — and the more it can get wrong.

This also echoes [Week 1](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems-en)'s systems view. None of GUM's four modules is the model itself; all are engineering around it: observing, auditing, retrieving, revising. Good results are still stacked up by systems — except this time the system is about you.

**Evidence and result.** The study demonstrates calibrated propositions and a proactive prototype while documenting privacy concerns and small-deployment limitations.

### Deeper points

- Audit governs proposition inclusion while Revise updates existing propositions; privacy and consistency are separate responsibilities.
- Gumbo estimates suggestion utility before rate limiting; inferring a need and deciding to interrupt are distinct judgments.

### Reviewer’s one-line verdict

Remembering more and helping better are separate claims to test.

### Your take-away

Expose inferences for correction and deletion and configure intervention separately from retention.

## Reading 2 | Learning Next Action Predictors

Source: [Learning Next Action Predictors](https://arxiv.org/abs/2603.05923)

### TL;DR

LongNAP combines parametric learning and contextual history to predict actions from longitudinal smartphone traces with semantic evaluation.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | Can longitudinal interaction history improve next-action prediction? |
| Evidence and scope | The 20-user,360k-plus-action dataset is specific; an LLM-judge similarity score establishes neither authorization nor intervention value. |

### Domain background

Longitudinal traces contain habits and current context; prediction must distinguish enduring preferences from the present screen.

### Intermediate guide

**Method.** Convert traces into action sequences, predict from longitudinal and current context, and compare with observed subsequent actions.

**Evidence and result.** LongNAP outperforms the listed fine-tuning and prompt baselines on semantic next-action prediction, measuring prediction rather than task completion.

### Deeper points

- Vision-language models produce many action labels, so labeling errors can affect training and evaluation.
- Parametric memory and contextual history retain different information; user splits affect generalization claims.

### Reviewer’s one-line verdict

Accurate prediction does not create permission to intervene.

### Your take-away

Evaluate prediction, usefulness, and interruption cost separately instead of replacing all three with similarity.

## Reading 3 | OpenClaw

Source: [OpenClaw](https://github.com/openclaw/openclaw)

### TL;DR

The project uses a local Gateway to connect models and channels; this guide treats it as an implementation comparison.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | How can a proactive assistant connect models and everyday communication channels? |
| Evidence and scope | Project functionality is not GUM research evidence, nor proof that every channel and permission default is safe. |

### Domain background

Connecting an assistant to communication channels adds both information and externally consequential actions.

### Intermediate guide

**Method.** A Gateway manages the assistant and enabled channels, connects configured models, and receives or presents assistance through those channels.

**Evidence and result.** Public code illustrates a multi-channel personal-assistant architecture; this guide cites no benchmark or privacy certification for it.

### Deeper points

- A local Gateway and remote models have different data boundaries; local execution does not imply all data stays on-device.
- Channels add external input and outbound actions, requiring source-trust and sending-permission checks separately.

### Reviewer’s one-line verdict

Understand channels and permissions before increasing proactivity.

### Your take-away

List enabled channels, data, and actions and check permissions and disable controls individually.

## Reading 4 | OSWorld

Source: [OSWorld](https://arxiv.org/abs/2404.07972)

### TL;DR

OSWorld supplies reproducible computer tasks and execution-based checking of environmental outcomes rather than only textual answers.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | How can computer-use agents be evaluated in real operating systems? |
| Evidence and scope | The 12.24% result concerns the original paper's best tested model, not today's computer-use ceiling. |

### Domain background

Computer tasks span application state; final text cannot establish completed files, settings, or workflows.

### Intermediate guide

**Method.** Supply natural-language tasks in resettable OS environments, allow model actions, and check outcomes using executable tests.

**Evidence and result.** The original study identifies GUI grounding and operational knowledge as bottlenecks; its12.24% result retains model and environment conditions.

### Deeper points

- Intermediate screens in cross-application tasks do not establish a correct final state; inspect actual outcomes.
- Initialization must be reproducible or previous windows and files alter task difficulty.

### Reviewer’s one-line verdict

Verify computer actions against the environment.

### Your take-away

Verify GUI tasks from actual files or application state and record the initial environment.

## Reading 5 | WebShop

Source: [WebShop](https://arxiv.org/abs/2207.01206)

### TL;DR

WebShop evaluates search and choice from natural-language shopping requests in a simulated store, connecting language to web actions.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Central question | Can conditions in shopping requests be grounded in product selection? |
| Evidence and scope | The 29% is the original study's best-model task success; a simulated store is not live commerce or current capability. |

### Domain background

Shopping requires mapping language constraints to web choices; similar products need not satisfy all constraints.

### Intermediate guide

**Method.** Models search, inspect attributes, and choose products from instructions; the environment checks products against user constraints.

**Evidence and result.** The original best model's29% success versus 59% for human experts shows a gap in grounding shopping constraints through sequential actions.

### Deeper points

- Search and choice can be learned separately, but final acceptance must check product conditions rather than keywords alone.
- Simulation fixes some real-web variability, so success does not establish live-transaction reliability.

### Reviewer’s one-line verdict

Choosing correctly requires checking each constraint.

### Your take-away

Verify product attributes and user constraints instead of equating clicks or fluent text with choosing correctly.


## What to do: the Demo Day checklist

**What to do**: turn tracing fully on and keep one replayable trace per rehearsal. Watch three things in monitoring: error rate, latency, and token spend. Put a hard cap on cost with automatic cutoff past the limit. Keep high-risk tools off by default and enable them by hand only for the live demo. Finally, prepare one failure case — a failure mode from your midway report, told well, persuades better than successes alone.

## Series retrospective: 11 posts and one recess week

1. [Course guide](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en): build from scratch before frameworks, both homeworks and the syllabus git history in full.
2. [Week 1](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems-en): stop tuning only the model; good scores are stacked up by compound systems.
3. [Week 2](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en): separate workflows from agents first, then hand-build a first RAG.
4. [Week 3](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy-en): MCP standardizes the tool plug, DSPy turns prompts into compilable programs.
5. [Week 4](/posts/ai/2026-09-10-stanford-cs329z-week4-react-memory-en): ReAct fixes the loop as think–act–observe, while [MemGPT](https://arxiv.org/abs/2310.08560) turns memory into OS-style layered structure.
6. [Week 5](/posts/ai/2026-09-10-stanford-cs329z-week5-multiagent-optimization-en): multi-agent collaboration and the three optimization axes — prompts, weights, or inference compute.
7. [Week 6](/posts/ai/2026-09-10-stanford-cs329z-week6-data-flywheel-en): the data flywheel spins up as HW2 drops and HW1 comes due.
8. [Week 7](/posts/ai/2026-09-10-stanford-cs329z-week7-eval-benchmarks-en): data selection and benchmark design, with evaluation converging on the 4-tuple.
9. [Week 8](/posts/ai/2026-09-10-stanford-cs329z-week8-judge-safety-en): LLM-as-judge and safety guardrails, where the graders themselves get graded.
10. [Week 9](/posts/ai/2026-09-10-stanford-cs329z-week9-coding-agents-en): interface is performance — SWE-agent proves editor design decides scores, while OpenHands turns sandbox and evaluation into a shared base.
11. Week 10: Thanksgiving Recess; both meetings are canceled with no required or additional readings, so the series does not manufacture an empty guide.
12. Week 11 (this post): from waiting for orders to acting first, closing with proactive agents and open problems.

## Course Material box

- Monday 11/30 Proactive Agents: main reading GUM (covered above); further reading [Shaikh et al., Learning Next Action Predictors from Human-Computer Interaction](https://arxiv.org/abs/2603.05923). It formalizes predicting the next action from multimodal computer-use traces and introduces LongNAP, a model combining parametric and in-context learning. The data comes from continuous phone use by 20 users. Vision-language models labeled over 360K actions. An LLM-as-judge scores predicted versus actual next actions for similarity, and LongNAP clearly beats supervised-finetuning and prompted baselines.
- Wednesday 12/2 Open Problems & Final Demos: no single main reading; further reading [OSWorld](https://arxiv.org/abs/2404.07972) (open-ended computer tasks in real operating systems) and [WebShop](https://arxiv.org/abs/2207.01206) (language grounding in a simulated store) — concrete numbers in the Wednesday section above.
- Week 10 (Nov 23 and Nov 25): the official schedule marks both meetings `No Class — Thanksgiving Recess`, with empty required and additional reading lists.
- Schedule source: [CS329Z schedule, Week 11](https://cs329z.stanford.edu/)

## Update log

- 2026-10-23: Rebuilt the guide around source status, mechanisms, a worked scenario, and answer criteria; separated detailed assigned readings from lecture preparation.

- 2026-10-23: Added diagrams and comparison tables where useful for the existing explanation; this visual update does not reverify numerical results, schedules or research claims.


- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-09-12: Made the Week 10 Thanksgiving recess explicit in the series map and course-material checklist so the Week 9-to-11 jump no longer looks like a missing post.
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## Course video sources

The Lecture Recordings section of the official Logistics page (read live on 2026-10-10) says recordings are available only by logging into the course Canvas site. I opened the course Canvas entry (canvas.stanford.edu/courses/233286) and was redirected to the Stanford login page, confirming the sign-in wall. Neither the course site nor a web search turned up a public YouTube or OCW recording, so there is nothing to embed.

Course and recording entries:

- [Official course / lecture source](https://cs329z.stanford.edu/)
- [Official Logistics page (Lecture Recordings section)](https://cs329z.stanford.edu/logistics.html)

Checked: 2026-10-10.

## References

- On this site: [Stanford CS329Z course guide](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en), [Week 1: stop tuning only the model](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems-en), [Week 2: workflows versus agents](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en), [Week 3: plug tools in, swap frameworks up](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Shaikh et al., Creating General User Models from Computer Use, UIST 2025](https://arxiv.org/abs/2505.10831), [Shaikh et al., Learning Next Action Predictors from Human-Computer Interaction](https://arxiv.org/abs/2603.05923), [GUM project page and open-source package](https://generalusermodels.github.io/), [Horvitz, Principles of Mixed-Initiative User Interfaces, CHI 1999](https://dl.acm.org/doi/10.1145/302979.303030)
- Venue: [UIST 2025](https://uist.acm.org/2025/)
